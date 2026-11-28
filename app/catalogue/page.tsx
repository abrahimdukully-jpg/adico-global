import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  retail_price: number | string | null;
  currency_code: string | null;
};

function formatPrice(product: Product) {
  const price = Number(product.retail_price ?? 0);
  if (!Number.isFinite(price) || price <= 0) return "Price coming soon";
  const currency = product.currency_code || "USD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export default async function CataloguePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,category,image_url,retail_price,currency_code")
    .eq("is_active", true)
    .not("image_url", "is", null)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  const products = (data ?? []) as Product[];
  const categories = Array.from(new Set(products.map((product) => product.category || "Other products")));

  return (
    <main className="catalogue-page">
      <header className="catalogue-header">
        <Link href="/">← ADICo Global</Link>
        <span>LIBERIA PRODUCT CATALOGUE</span>
      </header>

      <section className="catalogue-intro">
        <p className="eyebrow">ADICo Global · Liberia collection</p>
        <h1>Everyday products.<br />A connected marketplace.</h1>
        <p>Explore products currently presented in the ADICo Global catalogue. Product details and prices are being confirmed before ordering is enabled.</p>
        <p className="catalogue-status">Prices shown as “Price coming soon” are not yet available for purchase.</p>
      </section>

      {error ? (
        <section className="catalogue-note" role="status">
          <h2>Catalogue temporarily unavailable</h2>
          <p>We are refreshing the product catalogue. Please check again shortly.</p>
        </section>
      ) : products.length === 0 ? (
        <section className="catalogue-note">
          <h2>Product listings are being prepared</h2>
          <p>ADICo is confirming product images, specifications and retail prices before displaying listings.</p>
        </section>
      ) : (
        <section className="catalogue-products" aria-label="Available catalogue products">
          {categories.map((category) => (
            <section className="catalogue-product-group" key={category}>
              <h2>{category}</h2>
              <div className="catalogue-product-grid">
                {products.filter((product) => (product.category || "Other products") === category).map((product) => (
                  <article className="catalogue-product-card" key={product.id}>
                    <div className="catalogue-product-image">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw" unoptimized style={{ objectFit: "contain" }} />
                      ) : null}
                    </div>
                    <div className="catalogue-product-copy">
                      <h3>{product.name}</h3>
                      {product.description ? <p>{product.description}</p> : null}
                      <strong className="catalogue-product-price">{formatPrice(product)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>
      )}

      <section className="catalogue-note">
        <h2>Ordering information</h2>
        <p>This catalogue is for product discovery. Checkout and payment are not enabled for listings awaiting final retail prices, verified pack details, stock confirmation or applicable regulatory checks. Product images are illustrative of the listed item and final variants are subject to supplier confirmation.</p>
        <Link href="/retailer-interest">Interested in becoming an ADICo retailer? Enquire here →</Link>
      </section>

      <footer>
        <span>ADICo GLOBAL</span>
        <span>Connecting People. Creating Opportunities.</span>
        <small>Initial market: Liberia · Product availability subject to confirmation.</small>
      </footer>
    </main>
  );
}
