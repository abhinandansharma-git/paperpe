import Link from 'next/link';

export const metadata = {
  title: 'Reset Password | PaperPe',
  description: 'Password reset guidance for PaperPe accounts.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Password help</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Need to reset your password?</h1>
        <p className="text-neutral-500 text-lg leading-relaxed mb-8">
          PaperPe sign-in works best with Google. If you created an email-password account and cannot access it, email support from your registered address and we will help you recover access.
        </p>

        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8">
          <p className="text-sm text-neutral-500 mb-2">Recovery email</p>
          <a href="mailto:hello@paperpe.in?subject=PaperPe%20password%20reset" className="text-xl font-semibold text-neutral-900 hover:text-[#00C076]">
            hello@paperpe.in
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Back to Login
          </Link>
          <Link href="/contact" className="border border-neutral-200 hover:border-[#00C076]/40 text-neutral-600 hover:text-neutral-900 px-5 py-3 rounded-xl transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
