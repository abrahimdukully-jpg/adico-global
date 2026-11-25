const pillars = [
  ["Retailer network", "Apply to become an approved ADICo product retailer."],
  ["Consignment supply", "Eligible retailers receive ADICo stock under a documented consignment agreement."],
  ["Transparent commissions", "10% commission on eligible completed sales, subject to verification and settlement."],
  ["Customer marketplace", "Customers can browse and buy without joining the retailer network."]
];

export default function Home() {
  return <main>
    <header className="topbar"><div className="brand"><span className="brand-mark">A</span><span>ADICo <b>GLOBAL</b></span></div><span className="tagline">Connecting People. Creating Opportunities.</span></header>
    <section className="hero">
      <p className="eyebrow">A connected commerce network</p>
      <h1>Opportunity moves<br/><em>when people connect.</em></h1>
      <p className="intro">A marketplace owned and operated by ADICo, bringing customers and approved retailers together across markets.</p>
      <div className="actions"><a className="primary" href="mailto:retailers@adico.global?subject=Retailer%20application%20enquiry">Retailer enquiries</a><a className="secondary" href="#how-it-works">Explore the model</a></div>
      <div className="launch-note"><span className="dot"/> Initial markets planned: Liberia and Norway</div>
    </section>
    <section id="how-it-works" className="section"><p className="eyebrow">How ADICo Global works</p><h2>One network. Clear responsibilities.</h2><div className="grid">{pillars.map(([title,desc],i)=><article className="tile" key={title}><span className="number">0{i+1}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
    <footer><span>ADICo GLOBAL</span><span>Connecting People. Creating Opportunities.</span><small>Country availability is subject to local readiness and approval.</small></footer>
  </main>;
}
