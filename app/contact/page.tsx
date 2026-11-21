import Link from 'next/link';

export const metadata = {
  title: 'Contact | PaperPe',
  description: 'Get in touch with the PaperPe team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Contact</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">We are here to help.</h1>
        <p className="text-neutral-500 text-lg leading-relaxed mb-8">
          For purchase issues, account questions, delivery support, or partnerships, reach out and we will get back to you.
        </p>

        <div className="space-y-4 mb-10">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <p className="text-sm text-neutral-500 mb-1">Email</p>
            <a href="mailto:hello@paperpe.in" className="text-lg font-semibold text-neutral-900 hover:text-[#00C076]">
              hello@paperpe.in
            </a>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <p className="text-sm text-neutral-500 mb-1">Support hours</p>
            <p className="text-lg font-semibold text-neutral-900">Monday to Saturday, 10:00 AM to 7:00 PM IST</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Go to Dashboard
          </Link>
          <Link href="/indicators" className="border border-neutral-200 hover:border-[#00C076]/40 text-neutral-600 hover:text-neutral-900 px-5 py-3 rounded-xl transition-colors">
            Browse Indicators
          </Link>
        </div>
      </div>
    </div>
  );
}
