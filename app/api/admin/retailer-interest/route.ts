import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
const allowed=["received","under_review","contacted","declined"];
export async function POST(request:Request){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
 const {data:role,error:roleError}=await supabase.rpc("current_role");
 if(roleError||role!=="admin")return NextResponse.json({error:"Administrator access required."},{status:403});
 const form=await request.formData(); const id=String(form.get("id")??""); const status=String(form.get("status")??"");
 if(!/^[0-9a-f-]{36}$/i.test(id)||!allowed.includes(status))return NextResponse.json({error:"Invalid review update."},{status:400});
 const {error}=await supabase.from("retailer_interest_requests").update({status}).eq("id",id);
 if(error)return NextResponse.json({error:"Could not update the enquiry."},{status:500});
 return NextResponse.redirect(new URL("/admin/retailer-interest",request.url),303);
}