import Link from 'next/link';

export const metadata = {
  title: 'Support | PaperPe',
  description: 'Account and purchase support for PaperPe users.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Support</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Need help with your account or purchase?</h1>
        <p className="text-neutral-500 text-lg leading-relaxed mb-8">
          The fastest way to get help is to email your order ID and registered email address to our support inbox. If your order is still being delivered manually, include the phone number you used at checkout.
        </p>

        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-4">
          <p className="text-sm text-neutral-500 mb-2">Contact support</p>
          <a href="mailto:hello@paperpe.in" className="text-xl font-semibold text-neutral-900 hover:text-[#00C076]">
            hello@paperpe.in
          </a>
          <p className="text-neutral-500 text-sm mt-4">
            Include your order ID, payment ID, and a short description of the issue so we can resolve it faster.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Back to Dashboard
          </Link>
          <Link href="/contact" className="border border-neutral-200 hover:border-[#00C076]/40 text-neutral-600 hover:text-neutral-900 px-5 py-3 rounded-xl transition-colors">
            Contact Page
          </Link>
        </div>
      </div>
    </div>
  );
}
