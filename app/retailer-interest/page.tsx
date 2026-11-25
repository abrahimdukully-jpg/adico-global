"use client";
import { useState } from "react";

export default function RetailerInterestPage() {
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true); setNotice("");
    const form=new FormData(formElement);
    const payload=Object.fromEntries(form.entries());
    try {
      const response=await fetch("/api/retailer-interest",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error || "Unable to submit your enquiry.");
      setNotice("Thank you. Your retailer enquiry has been received for review.");
      formElement.reset();
    } catch(error) { setNotice(error instanceof Error ? error.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <main className="form-page"><a href="/" className="back">← ADICo Global</a><section className="form-card"><p className="eyebrow">Retailer network</p><h1>Start a retailer enquiry</h1><p className="form-intro">Tell us a little about your business. Submitting this form is an expression of interest, not approval to receive stock or sell ADICo products.</p>
  <form onSubmit={submit}>
    <label>Full name<input name="full_name" required minLength={2} maxLength={120}/></label>
    <label>Email address<input name="email" type="email" required maxLength={254}/></label>
    <label>Country<select name="country_code" required defaultValue=""><option value="" disabled>Select country</option><option value="LR">Liberia</option><option value="NO">Norway</option></select></label>
    <label>Business type<select name="business_type" required defaultValue=""><option value="" disabled>Select business type</option><option value="individual">Individual seller</option><option value="retail_shop">Retail shop</option><option value="online_retailer">Online retailer</option><option value="wholesaler">Wholesaler</option><option value="distributor">Distributor</option></select></label>
    <label>Business name (optional)<input name="business_name" maxLength={160}/></label>
    <label>Tell us about your sales channels (optional)<textarea name="message" rows={4} maxLength={1500}/></label>
    <label className="consent"><input type="checkbox" name="consent_to_contact" value="true" required/> I agree that ADICo may contact me about this retailer enquiry.</label>
    <p className="privacy-link">Please read our <a href="/privacy">retailer enquiry privacy notice</a> before submitting.</p>
    <button disabled={busy}>{busy?"Submitting…":"Submit enquiry"}</button>
    {notice&&<p role="status" className="notice">{notice}</p>}
  </form></section></main>;
}
