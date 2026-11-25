create or replace function public.admin_receive_stock(p_product_id uuid,p_location_id uuid,p_quantity integer,p_reference text default null,p_notes text default null) returns uuid
language plpgsql security definer set search_path=public,auth as $$
declare v_id uuid;
begin
 if auth.uid() is null or public.current_role()<>'admin' then raise exception 'Administrator access required'; end if;
 if p_quantity is null or p_quantity<=0 then raise exception 'Quantity must be greater than zero'; end if;
 perform 1 from public.products where id=p_product_id and active=true for update;
 if not found then raise exception 'Active product not found'; end if;
 perform 1 from public.inventory_locations where id=p_location_id for update;
 if not found then raise exception 'Inventory location not found'; end if;
 insert into public.stock_movements(product_id,location_id,movement_type,quantity,reference,notes,created_by)
 values(p_product_id,p_location_id,'receipt',p_quantity,nullif(left(trim(coalesce(p_reference,'')),120),''),nullif(left(trim(coalesce(p_notes,'')),1000),''),auth.uid()) returning id into v_id;
 return v_id;
end $$;

create or replace function public.admin_allocate_stock(p_retailer_user_id uuid,p_product_id uuid,p_location_id uuid,p_quantity integer) returns uuid
language plpgsql security definer set search_path=public,auth as $$
declare v_on_hand bigint; v_reserved bigint; v_id uuid;
begin
 if auth.uid() is null or public.current_role()<>'admin' then raise exception 'Administrator access required'; end if;
 if p_quantity is null or p_quantity<=0 then raise exception 'Quantity must be greater than zero'; end if;
 perform 1 from public.products where id=p_product_id and active=true for update;
 if not found then raise exception 'Active product not found'; end if;
 perform 1 from public.inventory_locations where id=p_location_id for update;
 if not found then raise exception 'Inventory location not found'; end if;
 if not exists(select 1 from public.retailer_applications a join public.profiles p on p.id=a.user_id where a.user_id=p_retailer_user_id and a.status='approved' and p.role='retailer') then raise exception 'Retailer must have an approved application and retailer account'; end if;
 select coalesce(sum(case when movement_type in ('receipt','return') then quantity when movement_type in ('dispatch','sale','damage') then -quantity when movement_type='adjustment' then quantity else 0 end),0) into v_on_hand from public.stock_movements where product_id=p_product_id and location_id=p_location_id;
 select coalesce(sum(quantity_allocated-quantity_dispatched),0) into v_reserved from public.consignment_allocations where product_id=p_product_id and location_id=p_location_id and status<>'cancelled';
 if p_quantity>v_on_hand-v_reserved then raise exception 'Insufficient available stock. Available: %',greatest(v_on_hand-v_reserved,0); end if;
 insert into public.consignment_allocations(retailer_user_id,product_id,location_id,quantity_allocated,created_by,status) values(p_retailer_user_id,p_product_id,p_location_id,p_quantity,auth.uid(),'created') returning id into v_id;
 insert into public.stock_movements(product_id,location_id,movement_type,quantity,reference,created_by) values(p_product_id,p_location_id,'allocation',p_quantity,'Consignment allocation '||v_id::text,auth.uid());
 return v_id;
end $$;

create or replace function public.admin_dispatch_allocation(p_allocation_id uuid,p_quantity integer,p_dispatch_reference text default null) returns uuid
language plpgsql security definer set search_path=public,auth as $$
declare a public.consignment_allocations%rowtype; v_id uuid;
begin
 if auth.uid() is null or public.current_role()<>'admin' then raise exception 'Administrator access required'; end if;
 if p_quantity is null or p_quantity<=0 then raise exception 'Quantity must be greater than zero'; end if;
 select * into a from public.consignment_allocations where id=p_allocation_id for update;
 if not found or a.status='cancelled' then raise exception 'Active allocation not found'; end if;
 if a.quantity_dispatched+p_quantity>a.quantity_allocated then raise exception 'Dispatch exceeds remaining allocation'; end if;
 update public.consignment_allocations set quantity_dispatched=quantity_dispatched+p_quantity,dispatch_reference=coalesce(nullif(left(trim(coalesce(p_dispatch_reference,'')),120),''),dispatch_reference),status=case when quantity_dispatched+p_quantity=quantity_allocated then 'dispatched'::public.allocation_status else 'created'::public.allocation_status end where id=p_allocation_id;
 insert into public.stock_movements(product_id,location_id,movement_type,quantity,reference,created_by) values(a.product_id,a.location_id,'dispatch',p_quantity,'Consignment dispatch '||p_allocation_id::text,auth.uid()) returning id into v_id;
 return v_id;
end $$;

create or replace function public.admin_confirm_retailer_receipt(p_allocation_id uuid,p_quantity integer) returns uuid
language plpgsql security definer set search_path=public,auth as $$
declare a public.consignment_allocations%rowtype; v_id uuid;
begin
 if auth.uid() is null or public.current_role()<>'admin' then raise exception 'Administrator access required'; end if;
 if p_quantity is null or p_quantity<=0 then raise exception 'Quantity must be greater than zero'; end if;
 select * into a from public.consignment_allocations where id=p_allocation_id for update;
 if not found or a.status='cancelled' then raise exception 'Active allocation not found'; end if;
 if a.quantity_received+p_quantity>a.quantity_dispatched then raise exception 'Receipt exceeds dispatched quantity'; end if;
 update public.consignment_allocations set quantity_received=quantity_received+p_quantity,status=case when quantity_received+p_quantity=quantity_allocated then 'received'::public.allocation_status when quantity_received+p_quantity>0 then 'partially_received'::public.allocation_status when quantity_dispatched=quantity_allocated then 'dispatched'::public.allocation_status else 'created'::public.allocation_status end where id=p_allocation_id;
 insert into public.stock_movements(product_id,location_id,movement_type,quantity,reference,created_by) values(a.product_id,a.location_id,'retailer_receipt',p_quantity,'Retailer receipt '||p_allocation_id::text,auth.uid()) returning id into v_id;
 return v_id;
end $$;

revoke all on function public.admin_receive_stock(uuid,uuid,integer,text,text) from public,anon;
revoke all on function public.admin_allocate_stock(uuid,uuid,uuid,integer) from public,anon;
revoke all on function public.admin_dispatch_allocation(uuid,integer,text) from public,anon;
revoke all on function public.admin_confirm_retailer_receipt(uuid,integer) from public,anon;
grant execute on function public.admin_receive_stock(uuid,uuid,integer,text,text) to authenticated;
grant execute on function public.admin_allocate_stock(uuid,uuid,uuid,integer) to authenticated;
grant execute on function public.admin_dispatch_allocation(uuid,integer,text) to authenticated;
grant execute on function public.admin_confirm_retailer_receipt(uuid,integer) to authenticated;
notify pgrst,'reload schema';