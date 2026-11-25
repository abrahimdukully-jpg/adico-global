"use client";
import { useState } from "react";
const categories=["Household goods & kitchenware","Cleaning & hygiene","Solar & backup power","Agricultural tools & equipment","Personal care","Building materials & hardware","Consumer electronics","Other"];
const models=["Consignment supply","Wholesale credit","Deferred payment","Conventional wholesale","Strategic distribution","Exclusive distribution discussion"];
export default function SupplierPartnershipPage(){
 const [busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();const el=event.currentTarget;setBusy(true);setNotice("");
  const fd=new FormData(el);const payload:Record<string,unknown>=Object.fromEntries(fd.entries());
  payload.product_categories=fd.getAll("product_categories");payload.partnership_models=fd.getAll("partnership_models");
  try{const r=await fetch("/api/supplier-partnership",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.error||"Unable to submit.");setNotice("Thank you. Your supplier proposal has been received. Our team will review it.");el.reset();}
  catch(e){setNotice(e instanceof Error?e.message:"Something went wrong.");}finally{setBusy(false);}
 }
 return <main className="form-page"><a className="back" href="/">← ADICo Global</a><section className="form-card supplier-form"><p className="eyebrow">Manufacturer & supplier network</p><h1>Partner with ADICo Global</h1><p className="form-intro">Tell us about your company and products. We welcome manufacturers, wholesalers, distributors and established suppliers interested in supplying Liberia, Norway and other approved markets. Consignment is preferred; wholesale credit and other supply arrangements are also considered. Submission is an expression of interest, not a partnership approval or purchase commitment.</p>
 <form onSubmit={submit}>
 <h2>Company and contact</h2>
 <label>Registered company name<input name="company_name" required minLength={2} maxLength={180}/></label>
 <div className="supplier-two"><label>Country of registration<select name="country_code" required defaultValue=""><option value="" disabled>Select country</option><option value="LR">Liberia</option><option value="NO">Norway</option><option value="OTHER">Other</option></select></label><label>Supplier type<select name="supplier_type" required defaultValue=""><option value="" disabled>Select type</option><option value="manufacturer">Manufacturer</option><option value="wholesaler">Wholesaler</option><option value="distributor">Distributor</option><option value="trading_company">Trading company</option><option value="other">Other</option></select></label></div>
 <div className="supplier-two"><label>Contact person's name<input name="contact_name" required minLength={2} maxLength={120}/></label><label>Position / title<input name="position" maxLength={120}/></label></div>
 <div className="supplier-two"><label>Business email<input name="email" type="email" required maxLength={254}/></label><label>Telephone / WhatsApp<input name="phone" maxLength={60}/></label></div>
 <label>Company website<input name="website" type="url" placeholder="https://" maxLength={300}/></label>
 <h2>Products and supply</h2>
 <fieldset><legend>Product categories (select all that apply)</legend><div className="supplier-checks">{categories.map(x=><label key={x}><input type="checkbox" name="product_categories" value={x}/>{x}</label>)}</div></fieldset>
 <label>Products, brands and specifications<textarea name="product_details" rows={4} maxLength={3000} placeholder="Describe your products, brands, certifications, warranties and available catalogue."/></label>
 <h2>Commercial arrangements</h2>
 <fieldset><legend>Partnership models you are willing to discuss</legend><div className="supplier-checks">{models.map(x=><label key={x}><input type="checkbox" name="partnership_models" value={x}/>{x}</label>)}</div></fieldset>
 <label>Minimum order quantity / capacity<input name="minimum_order_quantity" maxLength={300}/></label>
 <label>Markets currently served and export capability<textarea name="export_markets" rows={3} maxLength={1500}/></label>
 <label>Additional message<textarea name="additional_message" rows={4} maxLength={2000}/></label>
 <label className="consent"><input type="checkbox" name="consent_to_contact" value="true" required/> I confirm that I am authorised to submit this enquiry and agree that ADICo Global may contact my company about potential supply and distribution arrangements.</label>
 <button disabled={busy}>{busy?"Submitting…":"Submit supplier proposal"}</button>{notice&&<p role="status" className="notice">{notice}</p>}
 </form></section></main>;
}