import Link from 'next/link';

export const metadata = {
  title: 'Reset Password | PaperPe',
  description: 'Password reset guidance for PaperPe accounts.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Password help</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Need to reset your password?</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          PaperPe sign-in works best with Google. If you created an email-password account and cannot access it, email support from your registered address and we will help you recover access.
        </p>

        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-2">Recovery email</p>
          <a href="mailto:hello@paperpe.in?subject=PaperPe%20password%20reset" className="text-xl font-semibold text-white hover:text-[#00C076]">
            hello@paperpe.in
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Back to Login
          </Link>
          <Link href="/contact" className="border border-[#21262D] hover:border-[#00C076]/40 text-gray-300 hover:text-white px-5 py-3 rounded-xl transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
