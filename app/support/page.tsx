import Link from 'next/link';

export const metadata = {
  title: 'Support | PaperPe',
  description: 'Account and purchase support for PaperPe users.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Support</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Need help with your account or purchase?</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          The fastest way to get help is to email your order ID and registered email address to our support inbox. If your order is still being delivered manually, mention your WhatsApp number too.
        </p>

        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-4">
          <p className="text-sm text-gray-400 mb-2">Contact support</p>
          <a href="mailto:hello@paperpe.in" className="text-xl font-semibold text-white hover:text-[#00C076]">
            hello@paperpe.in
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Include your order ID, payment ID, and a short description of the issue so we can resolve it faster.
          </p>
        </div>

        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-400 mb-2">WhatsApp support</p>
          <p className="text-xl font-semibold text-white">+91 99303 24251</p>
          <p className="text-gray-500 text-sm mt-4">
            Use the same phone number you entered during checkout so we can find your order faster.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Back to Dashboard
          </Link>
          <Link href="/contact" className="border border-[#21262D] hover:border-[#00C076]/40 text-gray-300 hover:text-white px-5 py-3 rounded-xl transition-colors">
            Contact Page
          </Link>
        </div>
      </div>
    </div>
  );
}
