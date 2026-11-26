import ProductImageUpload from "./image-upload";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Product = { id:string; sku:string; name:string; category:string|null; currency_code:string; retail_price:number; is_active:boolean; slug:string };
export default async function AdminProductsPage() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return <main className="admin-page"><Link href="/">← ADICo Global</Link><h1>Administrator sign-in required</h1></main>;
  const {data:role}=await supabase.rpc("current_role");
  if(role!=="admin") return <main className="admin-page"><Link href="/">← ADICo Global</Link><h1>Access restricted</h1><p>This workspace is limited to authorised administrators.</p></main>;
  const {data,error}=await supabase.from("products").select("id,sku,name,category,currency_code,retail_price,is_active,slug").order("created_at",{ascending:false});
  const products=(data??[]) as Product[];
  return <main className="admin-page"><Link href="/">← ADICo Global</Link><p className="eyebrow">Central administration</p><h1>Product catalogue</h1><nav className="admin-nav"><Link href="/admin/inventory">Inventory & consignments</Link><Link href="/admin/retailer-interest">Retailer enquiries</Link></nav><p>Create and maintain ADICo products. New products remain hidden from customers until explicitly activated.</p>
  <ProductImageUpload />
  <section className="admin-product-form"><h2>Add a product</h2><form action="/api/admin/products" method="post">
    <label>SKU<input name="sku" required maxLength={64}/></label>
    <label>Product name<input name="name" required maxLength={160}/></label>
    <label>Category<input name="category" required maxLength={80}/></label>
    <label>Currency<select name="currency_code" defaultValue="USD"><option>USD</option><option>LRD</option><option>NOK</option></select></label>
    <label>Retail price<input name="retail_price" type="number" min="0" step="0.01" required/></label>
    <label>Image URL (optional)<input name="image_url" type="url" maxLength={1000}/></label>
    <label>Description (optional)<textarea name="description" rows={3} maxLength={2000}/></label>
    <label className="admin-inline"><input name="is_active" type="checkbox" value="true"/> Publish in public catalogue</label>
    <button type="submit">Save product</button>
  </form></section>
  <h2>Products ({products.length})</h2>{error?<p role="alert">Unable to load products. Check administrator database permissions.</p>:products.length===0?<p>No products have been added yet.</p>:<div className="enquiry-list">{products.map(p=><article className="enquiry-card" key={p.id}><div className="enquiry-top"><h2>{p.name}</h2><span>{p.is_active?"Published":"Hidden"}</span></div><p>{p.sku} · {p.category??"Uncategorised"} · {p.currency_code} {Number(p.retail_price).toFixed(2)}</p><small>/{p.slug}</small></article>)}</div>}
  </main>;
}
