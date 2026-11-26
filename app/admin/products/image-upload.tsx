"use client";

import { useState } from "react";

export default function ProductImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) return;
    setBusy(true); setMessage(""); setUrl("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/admin/product-images", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setUrl(result.url); setMessage("Image uploaded. Copy the URL into the product form below.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally { setBusy(false); }
  }

  return <section className="admin-product-form">
    <h2>Upload product image</h2>
    <p>Upload an original product photograph to ADICo Global’s public image storage. Supported: JPG, PNG, WebP and AVIF, up to 10 MB.</p>
    <label>Choose image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>{setFile(e.target.files?.[0]??null);setUrl("");setMessage("");}} /></label>
    <button type="button" disabled={!file || busy} onClick={upload}>{busy ? "Uploading…" : "Upload image"}</button>
    {message && <p role="status">{message}</p>}
    {url && <><label>Public image URL<input readOnly value={url}/></label><button type="button" onClick={()=>navigator.clipboard.writeText(url)}>Copy image URL</button><img src={url} alt="Uploaded product" style={{maxWidth:180,height:"auto",display:"block",marginTop:12}}/></>}
  </section>;
}
