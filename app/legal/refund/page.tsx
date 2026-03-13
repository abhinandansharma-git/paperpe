export const metadata = {
  title: 'Refund Policy | PaperPe',
  description: 'Refund and Cancellation Policy for PaperPe',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Refund & Cancellation Policy</h1>
        <p className="text-gray-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Digital Products Policy</h2>
            <p>PaperPe sells digital products including Pine Script indicators, trading tools, and educational resources. Because these are digital goods that are delivered instantly upon purchase, <strong>all sales are final by default</strong>.</p>
            <p className="mt-2">Once a digital product has been downloaded or accessed, we are unable to offer a refund as the product cannot be "returned."</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Eligible Refund Cases</h2>
            <p>We will issue a full refund in the following cases:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li><strong>Duplicate Payment:</strong> If you were charged more than once for the same product</li>
              <li><strong>Payment Failed but Amount Deducted:</strong> If your payment failed but money was debited from your account</li>
              <li><strong>Product Not Delivered:</strong> If you completed payment but did not receive access to the product within 24 hours</li>
              <li><strong>Technical Issues:</strong> If the product does not work as described due to a defect on our end</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How to Request a Refund</h2>
            <p>To request a refund, email us at <a href="mailto:hello@paperpe.in" className="text-blue-400 hover:underline">hello@paperpe.in</a> with:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Your registered email address</li>
              <li>Order ID / Payment ID</li>
              <li>Reason for refund request</li>
              <li>Screenshot of payment (if applicable)</li>
            </ul>
            <p className="mt-3">Refund requests must be submitted within <strong>7 days</strong> of the purchase date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Refund Processing</h2>
            <p>Upon approval, refunds will be processed within <strong>5-7 business days</strong> to your original payment method:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>UPI / Net Banking: 2-3 business days</li>
              <li>Credit / Debit Card: 5-7 business days</li>
              <li>Wallet: 1-2 business days</li>
            </ul>
            <p className="mt-2">Razorpay payment gateway charges are non-refundable (typically 2% of transaction value).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Subscription Cancellations</h2>
            <p>If PaperPe offers subscription plans in the future, you may cancel your subscription at any time. Cancellation will take effect at the end of the current billing period. No partial refunds will be issued for unused subscription days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Contact Us</h2>
            <p>For refund queries or payment issues, reach out to us:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Email: <a href="mailto:hello@paperpe.in" className="text-blue-400 hover:underline">hello@paperpe.in</a></li>
              <li>Response time: Within 24-48 business hours</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
