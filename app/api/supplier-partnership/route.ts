import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
const emailPattern=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const types=["manufacturer","wholesaler","distributor","trading_company","other"];
const countries=["LR","NO","OTHER"];
const allowedCategories=["Household goods & kitchenware","Cleaning & hygiene","Solar & backup power","Agricultural tools & equipment","Personal care","Building materials & hardware","Consumer electronics","Other"];
const allowedModels=["Consignment supply","Wholesale credit","Deferred payment","Conventional wholesale","Strategic distribution","Exclusive distribution discussion"];
const clean=(v:unknown,max:number)=>String(v??"").trim().slice(0,max);
export async function POST(request:Request){
 try{
  const b=await request.json();const company_name=clean(b.company_name,180),contact_name=clean(b.contact_name,120),email=clean(b.email,254).toLowerCase(),country_code=clean(b.country_code,10),supplier_type=clean(b.supplier_type,40);
  if(company_name.length<2||contact_name.length<2||!emailPattern.test(email)||!countries.includes(country_code)||!types.includes(supplier_type))return NextResponse.json({error:"Please complete the required company and contact fields."},{status:400});
  if(b.consent_to_contact!=="true")return NextResponse.json({error:"Consent is required to submit."},{status:400});
  const list=(v:unknown,allowed:string[])=>Array.isArray(v)?v.filter((x):x is string=>typeof x==="string"&&allowed.includes(x)).slice(0,allowed.length):[];
  const website=clean(b.website,300);
  if(website&&!/^https?:\\/\\//i.test(website))return NextResponse.json({error:"Enter a website beginning with https:// or http://."},{status:400});
  const supabase=await createClient();
  const {error}=await supabase.from("supplier_interest_requests").insert({company_name,contact_name,email,country_code,supplier_type,position:clean(b.position,120)||null,phone:clean(b.phone,60)||null,website:website||null,product_categories:list(b.product_categories,allowedCategories),product_details:clean(b.product_details,3000)||null,partnership_models:list(b.partnership_models,allowedModels),minimum_order_quantity:clean(b.minimum_order_quantity,300)||null,export_markets:clean(b.export_markets,1500)||null,additional_message:clean(b.additional_message,2000)||null,consent_to_contact:true});
  if(error){console.error("Supplier enquiry insert failed",error.code);return NextResponse.json({error:"We could not save your proposal. Please try again later."},{status:503});}
  return NextResponse.json({ok:true},{status:201});
 }catch{return NextResponse.json({error:"Invalid request."},{status:400});}
}