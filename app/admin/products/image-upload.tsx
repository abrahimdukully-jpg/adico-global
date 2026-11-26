"use client";

import { useCallback, useEffect, useState } from "react";

type BlobImage = { url:string; pathname:string; size:number; uploadedAt:string; contentType?:string };

export default function ProductImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<BlobImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadImages = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/product-images", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load images.");
      setImages(result.blobs || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load images."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  async function upload() {
    if (!file) return;
    setBusy(true); setMessage(""); setUrl("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/admin/product-images", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setUrl(result.url); setMessage("Image uploaded successfully.");
      await loadImages();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally { setBusy(false); }
  }

  return <section className="admin-product-form">
    <h2>Product image library ({images.length})</h2>
    <p>Original product photographs stored in ADICo Global. Select an image to copy its public URL into a product listing.</p>
    <label>Choose image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>{setFile(e.target.files?.[0]??null);setUrl("");setMessage("");}} /></label>
    <button type="button" disabled={!file || busy} onClick={upload}>{busy ? "Uploading…" : "Upload image"}</button>
    {message && <p role="status">{message}</p>}
    {url && <p><a href={url} target="_blank" rel="noreferrer">View uploaded image</a></p>}
    <div style={{display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",marginTop:18}}>
      <h3 style={{margin:0}}>Stored photographs</h3>
      <button type="button" onClick={loadImages} disabled={loading}>{loading?"Loading…":"Refresh"}</button>
    </div>
    {error && <p role="alert">{error}</p>}
    {loading ? <p>Loading image library…</p> : images.length===0 ? <p>No images found in the product image folder.</p> :
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:12,marginTop:12}}>
        {images.map(image=><article key={image.url} style={{border:"1px solid var(--wp--preset--color--contrast-3,#ddd)",borderRadius:8,padding:8,minWidth:0}}>
          <a href={image.url} target="_blank" rel="noreferrer"><img src={image.url} alt={image.pathname.split("/").pop()?.replace(/[-_]/g," ") || "ADICo product photograph"} loading="lazy" style={{width:"100%",height:125,objectFit:"contain",background:"#fff",borderRadius:5}}/></a>
          <p style={{fontSize:12,overflowWrap:"anywhere",margin:"8px 0"}}>{image.pathname.split("/").pop()}</p>
          <button type="button" style={{width:"100%"}} onClick={()=>{navigator.clipboard.writeText(image.url);setMessage("Image URL copied. Paste it into the product form.");}}>Copy image URL</button>
        </article>)}
      </div>}
  </section>;
}
