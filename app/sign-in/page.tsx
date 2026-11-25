import Link from "next/link";
import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return <main className="admin-page">
    <Link href="/">← ADICo Global</Link>
    <p className="eyebrow">Secure account access</p>
    <h1>Sign in</h1>
    <p>Sign in with your ADICo Global administrator email and password. Administrator tools are available only to authorised admin accounts.</p>
    <SignInForm />
    <p><Link href="/forgot-password">Set up or reset your password</Link></p>
  </main>;
}
