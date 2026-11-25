import Link from "next/link";
import UpdatePasswordForm from "./update-password-form";

export default function UpdatePasswordPage() {
  return <main className="admin-page">
    <Link href="/">← ADICo Global</Link>
    <p className="eyebrow">Secure account setup</p>
    <h1>Create your password</h1>
    <p>Choose a strong password for your ADICo Global account. This page is available after opening a valid invitation or password-recovery link.</p>
    <UpdatePasswordForm />
  </main>;
}
