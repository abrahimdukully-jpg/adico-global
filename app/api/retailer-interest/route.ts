import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTypes=["individual","retail_shop","online_retailer","wholesaler","distributor"];

export async function POST(request: Request) {
  try {
    const body=await request.json();
    const full_name=String(body.full_name??"").trim();
    const email=String(body.email??"").trim().toLowerCase();
    const country_code=String(body.country_code??"");
    const business_type=String(body.business_type??"");
    const business_name=String(body.business_name??"").trim();
    const message=String(body.message??"").trim();
    if(full_name.length<2||full_name.length>120) return NextResponse.json({error:"Enter a valid full name."},{status:400});
    if(email.length>254||!emailPattern.test(email)) return NextResponse.json({error:"Enter a valid email address."},{status:400});
    if(!["LR","NO"].includes(country_code)) return NextResponse.json({error:"Select Liberia or Norway."},{status:400});
    if(!allowedTypes.includes(business_type)) return NextResponse.json({error:"Select a valid business type."},{status:400});
    if(business_name.length>160||message.length>1500) return NextResponse.json({error:"One of the fields is too long."},{status:400});
    if(body.consent_to_contact!=="true") return NextResponse.json({error:"Consent is required to submit."},{status:400});

    const supabase=await createClient();
    const {error}=await supabase.from("retailer_interest_requests").insert({
      full_name,email,country_code,business_type,
      business_name:business_name||null,message:message||null,
      consent_to_contact:true,status:"received"
    });
    if(error) {
      console.error("Retailer interest insert failed",error.code);
      return NextResponse.json({error:"We could not save your enquiry. Please try again later."},{status:503});
    }
    return NextResponse.json({ok:true},{status:201});
  } catch {
    return NextResponse.json({error:"Invalid request."},{status:400});
  }
}
