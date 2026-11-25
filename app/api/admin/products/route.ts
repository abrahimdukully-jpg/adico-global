import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const slugify=(value:string)=>value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,120);
export async function POST(request:Request) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Sign in required."},{status:401});
  const {data:role,error:roleError}=await supabase.rpc("current_role");
  if(roleError||role!=="admin") return NextResponse.json({error:"Administrator access required."},{status:403});
  const form=await request.formData();
  const sku=String(form.get("sku")??"").trim();
  const name=String(form.get("name")??"").trim();
  const category=String(form.get("category")??"").trim();
  const currency=String(form.get("currency_code")??"USD");
  const price=Number(form.get("retail_price"));
  const image=String(form.get("image_url")??"").trim();
  const description=String(form.get("description")??"").trim();
  const active=form.get("is_active")==="true";
  if(!sku||sku.length>64||!name||name.length>160||!category||category.length>80||!["USD","LRD","NOK"].includes(currency)||!Number.isFinite(price)||price<0||image.length>1000||description.length>2000) {
    return NextResponse.json({error:"Please check the product details."},{status:400});
  }
  const categorySlug=slugify(category);
  const {data:categoryRow,error:categoryError}=await supabase.from("product_categories").upsert({name:category,slug:categorySlug,is_active:true},{onConflict:"name"}).select("id").single();
  if(categoryError||!categoryRow) return NextResponse.json({error:"Could not save the product category."},{status:500});
  const baseSlug=slugify(name)||"product";
  const slug=baseSlug+"-"+crypto.randomUUID().slice(0,8);
  const {error}=await supabase.from("products").insert({
    sku,name,category,category_id:categoryRow.id,slug,description:description||null,image_url:image||null,
    currency,currency_code:currency,retail_price:price,active,is_active:active
  });
  if(error) {
    console.error("Admin product insert failed",error.code);
    return NextResponse.json({error:"Could not save the product. Check that the SKU is unique."},{status:500});
  }
  return NextResponse.redirect(new URL("/admin/products",request.url),303);
}
