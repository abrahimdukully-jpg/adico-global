import Link from "next/link";

const collections = [
  { title: "Rice, pasta & pantry staples", items: ["Golden Indian Parboiled Rice", "FBC Star Indian Parboiled Rice", "Besler Spaghetti", "Besler Macaroni & Cheese Dinner — 24 × 206 g per box", "Cream of Wheat", "Nutrib cereal"] },
  { title: "Cooking essentials", items: ["Star Oil pure vegetable cooking oil — selected pack sizes", "Champion bagged onions", "Vego tomato paste", "Golden tomato paste"] },
  { title: "Canned fish & protein", items: ["Royal Sardines — 125 g", "FBC Sardines", "Lafish Sardines", "Princesse Sardines", "Canned mackerel"] },
  { title: "Tea, drinks & refreshments", items: ["Sun Island Gold Label Tea — 100 tea bags / 200 g", "Achoura Green Tea", "ROX Energy Drink — selected can sizes"] },
  { title: "Milk, dairy & nutrition", items: ["Yoghi Yoghi yoghurt powder", "Powdered milk", "Sweetened creamer", "Nutribom infant cereal", "Hero Baby infant formula"] },
  { title: "Biscuits, snacks & confectionery", items: ["Golden Cream Delight — selected flavours", "Golden Puffy cheese snacks", "Golden Rodeo Vanilla", "Biscuits and wafers — selected varieties"] },
  { title: "Household & personal care", items: ["Vi-John Aloe Vera toothpaste", "So Klin detergent", "Star beauty soap", "Fruit-scented and medicated soaps", "Bleach, antiseptic disinfectant and rubbing alcohol"] },
  { title: "Home, safety & utility", items: ["JOVIS D-size batteries", "FBC mosquito coils", "FBC safety matches", "Arrow and Fantôme insecticide sprays", "Shovels and selected tools"] }
];

export default function CataloguePage() {
  return <main className="catalogue-page">
    <header className="catalogue-header"><Link href="/">← ADICo Global</Link><span>LIBERIA PRODUCT CATALOGUE</span></header>
    <section className="catalogue-intro">
      <p className="eyebrow">ADICo Global · Initial Liberia collection</p>
      <h1>Everyday products.<br/>A connected marketplace.</h1>
      <p>Explore the product ranges being prepared for ADICo Global in Liberia. This preliminary catalogue is based on product photographs shared with ADICo and the initial supplier collection.</p>
      <p className="catalogue-status">Prices are being confirmed with our wholesale supplier. Product availability, exact pack sizes and final specifications will be updated before orders open.</p>
    </section>
    <section className="catalogue-featured"><div><p className="eyebrow">Featured product</p><h2>Besler Macaroni &amp; Cheese Dinner</h2><p>Pack: 24 × 206 g per box</p><strong>US$10.00 per box</strong><p className="catalogue-status">Price shown from the product information supplied. Final stock confirmation required.</p></div></section>
    <section className="catalogue-grid" aria-label="Product categories">
      {collections.map((group,index)=><article className="catalogue-category" key={group.title}>
        <span className="catalogue-number">{String(index+1).padStart(2,"0")}</span>
        <h2>{group.title}</h2>
        <ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul>
        <p className="catalogue-price">Price to be confirmed</p>
      </article>)}
    </section>
    <section className="catalogue-note"><h2>Before ordering</h2><p>This is a preview catalogue, not a live inventory or order list. Final brand variants, pack sizes, product compliance, stock and retail prices will be confirmed before products become orderable. No payment is being collected for these preview listings.</p><Link href="/retailer-interest">Interested in becoming an ADICo retailer? Enquire here →</Link></section>
    <footer><span>ADICo GLOBAL</span><span>Connecting People. Creating Opportunities.</span><small>Initial market: Liberia · Product range subject to supplier confirmation.</small></footer>
  </main>;
}
