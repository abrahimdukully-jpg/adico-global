import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const positiveInt=(v:FormDataEntryValue|null)=>{const n=Number(v);return Number.isSafeInteger(n)&&n>0?n:null;};
export async function POST(request:Request){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
 const {data:role,error:roleError}=await supabase.rpc("current_role");
 if(roleError||role!=="admin")return NextResponse.json({error:"Administrator access required."},{status:403});
 const form=await request.formData(); const action=String(form.get("action")??"");
 let error:any=null;
 if(action==="location"){
  const name=String(form.get("name")??"").trim(),country=String(form.get("country")??"");
  if(name.length<2||name.length>120||!["LR","NO"].includes(country))return NextResponse.json({error:"Enter a valid location and country."},{status:400});
  const result=await supabase.from("inventory_locations").insert({name,country}); error=result.error;
 }else if(action==="receive"){
  const product_id=String(form.get("product_id")??""),location_id=String(form.get("location_id")??""),quantity=positiveInt(form.get("quantity"));
  if(!uuid.test(product_id)||!uuid.test(location_id)||!quantity)return NextResponse.json({error:"Check the product, location and quantity."},{status:400});
  const result=await supabase.rpc("admin_receive_stock",{p_product_id:product_id,p_location_id:location_id,p_quantity:quantity,p_reference:String(form.get("reference")??""),p_notes:String(form.get("notes")??"")});error=result.error;
 }else if(action==="allocate"){
  const retailer=String(form.get("retailer_user_id")??""),product=String(form.get("product_id")??""),location=String(form.get("location_id")??""),quantity=positiveInt(form.get("quantity"));
  if(!uuid.test(retailer)||!uuid.test(product)||!uuid.test(location)||!quantity)return NextResponse.json({error:"Check the retailer, product, location and quantity."},{status:400});
  const result=await supabase.rpc("admin_allocate_stock",{p_retailer_user_id:retailer,p_product_id:product,p_location_id:location,p_quantity:quantity});error=result.error;
 }else if(action==="dispatch"||action==="confirm"){
  const allocation=String(form.get("allocation_id")??""),quantity=positiveInt(form.get("quantity"));
  if(!uuid.test(allocation)||!quantity)return NextResponse.json({error:"Check the allocation and quantity."},{status:400});
  const result=action==="dispatch"
   ?await supabase.rpc("admin_dispatch_allocation",{p_allocation_id:allocation,p_quantity:quantity,p_dispatch_reference:String(form.get("reference")??"")})
   :await supabase.rpc("admin_confirm_retailer_receipt",{p_allocation_id:allocation,p_quantity:quantity});
  error=result.error;
 }else return NextResponse.json({error:"Unknown inventory action."},{status:400});
 if(error){console.error("Inventory action failed",action,error.code??"unknown");return NextResponse.json({error:"The inventory action could not be completed. Check the quantities, stock balance and approval status."},{status:400});}
 return NextResponse.redirect(new URL("/admin/inventory",request.url),303);
}