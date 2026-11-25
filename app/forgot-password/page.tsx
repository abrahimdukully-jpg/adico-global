import Link from "next/link";
import ForgotPasswordForm from "./forgot-password-form";
export default function ForgotPasswordPage(){return <main className="admin-page"><Link href="/sign-in">← Back to sign in</Link><p className="eyebrow">Account recovery</p><h1>Set or reset your password</h1><p>Request a secure password setup link for your ADICo Global account.</p><ForgotPasswordForm /></main>}
