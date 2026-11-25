import Link from "next/link";

export const metadata = {
  title: "Privacy notice | ADICo Global",
  description: "How ADICo Global handles retailer enquiry information."
};

export default function PrivacyPage() {
  return <main className="form-page">
    <Link href="/" className="back">← ADICo Global</Link>
    <article className="form-card">
      <p className="eyebrow">Privacy</p>
      <h1>Retailer enquiry privacy notice</h1>
      <p className="form-intro">This notice describes the limited information collected through the retailer enquiry form. It is an initial website notice, not a substitute for a jurisdiction-specific privacy policy reviewed before launch.</p>
      <h2>Information collected</h2>
      <p>When you submit a retailer enquiry, we collect your name, email address, selected country, business type, optional business name, optional message and your consent to be contacted.</p>
      <h2>Why we use it</h2>
      <p>We use this information to review your enquiry, contact you about potential retailer participation and maintain a record of the enquiry. Submission does not approve you as a retailer or guarantee a supply arrangement.</p>
      <h2>Access and sharing</h2>
      <p>Enquiry information is intended for authorised ADICo personnel involved in reviewing retailer enquiries. We do not display enquiry records publicly. Technical service providers used to operate the website and database may process information on ADICo's behalf.</p>
      <h2>Retention and requests</h2>
      <p>Enquiry information should be retained only as long as needed for the stated purpose and applicable legal obligations. To request access, correction or deletion, contact ADICo through its official contact channel before submitting personal information.</p>
      <h2>Before launch</h2>
      <p>ADICo must publish verified contact details, retention periods, lawful-basis information, applicable rights and any international-transfer details for the countries where the service operates. Do not submit sensitive personal information through this form.</p>
      <p><Link href="/retailer-interest">Return to retailer enquiry</Link></p>
    </article>
  </main>;
}
