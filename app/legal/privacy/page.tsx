export const metadata = {
  title: 'Privacy Policy | PaperPe',
  description: 'Privacy Policy for PaperPe - Indian Stock Market Tools',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>When you use PaperPe, we collect the following information:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Account Information:</strong> Name, email address (via Google OAuth)</li>
              <li><strong>Payment Information:</strong> Order ID, payment status (processed by Razorpay — we do not store card details)</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To provide and maintain our services</li>
              <li>To process payments and deliver purchased products</li>
              <li>To send transactional emails (purchase confirmations, welcome emails)</li>
              <li>To improve our platform and user experience</li>
              <li>To send occasional product updates (you can unsubscribe anytime)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage and Security</h2>
            <p>Your data is stored securely on Supabase (hosted in the EU). We implement industry-standard security measures including encryption in transit (HTTPS) and at rest. We do not store payment card information — all payment processing is handled by Razorpay, a PCI-DSS compliant payment gateway.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Google OAuth</strong> — for authentication</li>
              <li><strong>Razorpay</strong> — for payment processing</li>
              <li><strong>Resend</strong> — for transactional emails</li>
              <li><strong>Vercel</strong> — for hosting</li>
              <li><strong>Supabase</strong> — for database</li>
            </ul>
            <p className="mt-2">Each third-party service has its own privacy policy governing their use of your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>We use essential cookies for authentication sessions. We do not use advertising or tracking cookies. You can control cookie settings through your browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Unsubscribe from marketing emails at any time</li>
            </ul>
            <p className="mt-2">To exercise these rights, email us at <a href="mailto:hello@paperpe.in" className="text-blue-400 hover:underline">hello@paperpe.in</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Purchase records are retained for 7 years as required by Indian tax law. You may request account deletion at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h2>
            <p>PaperPe is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>For privacy-related queries: <a href="mailto:hello@paperpe.in" className="text-blue-400 hover:underline">hello@paperpe.in</a></p>
          </section>

        </div>
      </div>
    </div>
  )
}
