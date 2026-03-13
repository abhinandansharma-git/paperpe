export const metadata = {
  title: 'Terms of Service | PaperPe',
  description: 'Terms of Service for PaperPe - Indian Stock Market Tools',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using PaperPe ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. PaperPe is operated by PaperPe Technologies and is intended for users in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Services</h2>
            <p>PaperPe provides educational tools, indicators, and resources for Indian stock market participants including but not limited to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Technical analysis indicators (Pine Script files)</li>
              <li>Paper trading simulators</li>
              <li>Market learning resources</li>
              <li>Portfolio tracking tools</li>
            </ul>
            <p className="mt-3">All content is for <strong>educational and informational purposes only</strong>. Nothing on PaperPe constitutes financial advice, investment advice, or a recommendation to buy or sell any security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You agree not to share your account with others or use another person's account without permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Purchases and Payments</h2>
            <p>All purchases on PaperPe are processed securely via Razorpay. Prices are in Indian Rupees (INR) and inclusive of applicable taxes. Upon successful payment, you will receive access to the purchased digital product immediately.</p>
            <p className="mt-2">Digital products (Pine Script indicators, tools) are delivered electronically and are non-transferable.</p>
          </section>

          <section className="border border-red-800 bg-red-950/30 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-red-400 mb-3">⚠️ 5. Intellectual Property & Strict Anti-Sharing Policy</h2>
            <p className="text-red-300 font-semibold mb-3">READ THIS CAREFULLY — VIOLATION WILL RESULT IN LEGAL ACTION.</p>
            <p>All Pine Script indicators, tools, scripts, and materials purchased from PaperPe are the exclusive intellectual property of PaperPe Technologies, protected under the Copyright Act, 1957 (India) and applicable international copyright laws.</p>
            <div className="mt-4 space-y-2">
              <p className="font-semibold text-white">The following are strictly prohibited:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-red-200">
                <li>Sharing, distributing, or forwarding purchased Pine Scripts to any third party</li>
                <li>Uploading scripts to public repositories (GitHub, TradingView public library, etc.)</li>
                <li>Reselling or sublicensing scripts under any arrangement</li>
                <li>Sharing your account credentials to give others access</li>
                <li>Screenshots or screen recordings of script source code shared publicly</li>
              </ul>
            </div>
            <p className="mt-4 text-red-300 font-semibold">Legal Consequences: Violation of this clause will result in:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-red-200">
              <li>Immediate permanent account termination without refund</li>
              <li>Civil lawsuit for damages under the Indian Copyright Act, 1957</li>
              <li>Claim for actual damages plus statutory damages up to ₹10,00,000 per infringement</li>
              <li>Recovery of legal fees and court costs from the infringing party</li>
            </ul>
            <p className="mt-4 text-gray-300">Each script purchase is tied to your account and email address. Our scripts contain embedded identifiers that allow us to trace unauthorized sharing back to the original purchaser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Disclaimer of Liability</h2>
            <p>PaperPe provides tools for educational purposes only. We are not registered with SEBI as an investment advisor. Trading in stocks and securities involves substantial risk of loss. Past performance of any indicator or tool does not guarantee future results. PaperPe shall not be liable for any trading losses incurred by users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Prohibited Activities</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Using the platform for illegal purposes</li>
              <li>Attempting to reverse engineer or copy our proprietary tools</li>
              <li>Sharing purchased content with non-purchasers</li>
              <li>Creating multiple accounts to circumvent restrictions</li>
              <li>Posting false or misleading information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
            <p>PaperPe reserves the right to suspend or terminate accounts that violate these terms. Upon termination, your access to purchased products may be revoked without refund.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>For any questions regarding these terms, contact us at: <a href="mailto:hello@paperpe.in" className="text-blue-400 hover:underline">hello@paperpe.in</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
