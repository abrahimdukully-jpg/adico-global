"use client";

import { useCallback, useEffect, useState } from "react";

type BlobImage = { url:string; pathname:string; size:number; uploadedAt:string; contentType?:string };

export default function ProductImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<BlobImage[]>([]);
  const [selected, setSelected] = useState("");
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
    setBusy(true); setMessage("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/admin/product-images", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setSelected(result.url);
      setMessage("Image uploaded and selected for this product.");
      await loadImages();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally { setBusy(false); }
  }

  return <div className="admin-product-form" style={{margin:"14px 0"}}>
    <h3>Choose product photograph</h3>
    <input type="hidden" name="image_url" value={selected} />
    <p>Select one of the photographs already stored in ADICo Global. The selected image will be attached when you save this product.</p>
    <label>Upload another photograph<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>setFile(e.target.files?.[0]??null)} /></label>
    <button type="button" disabled={!file || busy} onClick={upload}>{busy ? "Uploading…" : "Upload and select"}</button>
    <div style={{display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",marginTop:18}}>
      <h3 style={{margin:0}}>Stored photographs ({images.length})</h3>
      <button type="button" onClick={loadImages} disabled={loading}>{loading?"Loading…":"Refresh"}</button>
    </div>
    {message && <p role="status">{message}</p>}
    {error && <p role="alert">{error}</p>}
    {selected && <p><strong>Selected:</strong> {images.find(image=>image.url===selected)?.pathname.split("/").pop() || "Newly uploaded photograph"}</p>}
    {loading ? <p>Loading image library…</p> : images.length===0 ? <p>No images found in the product image folder.</p> :
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:12,marginTop:12}}>
        {images.map(image=><article key={image.url} style={{border:selected===image.url?"2px solid #b38a35":"1px solid var(--wp--preset--color--contrast-3,#ddd)",borderRadius:8,padding:8,minWidth:0}}>
          <img src={image.url} alt={image.pathname.split("/").pop()?.replace(/[-_]/g," ") || "ADICo product photograph"} loading="lazy" style={{width:"100%",height:125,objectFit:"contain",background:"#fff",borderRadius:5}}/>
          <p style={{fontSize:12,overflowWrap:"anywhere",margin:"8px 0"}}>{image.pathname.split("/").pop()}</p>
          <button type="button" style={{width:"100%"}} aria-pressed={selected===image.url} onClick={()=>setSelected(image.url)}>{selected===image.url?"Selected":"Use this photograph"}</button>
        </article>)}
      </div>}
  </div>;
}
