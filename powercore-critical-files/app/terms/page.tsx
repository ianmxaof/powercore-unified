import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PowerCore",
  description: "PowerCore terms of service - rules and guidelines for using our platform.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "January 24, 2026";
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PowerCore</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              Welcome to PowerCore. By accessing or using our platform, you agree to be bound by these 
              Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use our services.
            </p>
            <p className="text-gray-300">
              We may modify these Terms at any time. Continued use of the platform after changes constitutes 
              acceptance of the modified Terms. We will notify you of significant changes via email or platform notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              PowerCore is an AI agent marketplace and development platform that allows users to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Browse, purchase, and deploy AI agents created by our community</li>
              <li>Discover and equip modular skills to enhance agent capabilities</li>
              <li>Create, configure, and publish their own AI agents using our no-code workshop</li>
              <li>Sell agents and skills to other users and earn revenue</li>
              <li>Manage their collection of agents and skills in their personal hangar</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-gray-300 mb-4">To use certain features of PowerCore, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any information that becomes inaccurate</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Not share your account with others or allow unauthorized access</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You must be at least 16 years old to create an account. By creating an account, you represent 
              that you meet this age requirement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Content and Conduct</h2>
            
            <h3 className="text-xl font-medium mb-3 text-violet-400">4.1 Your Content</h3>
            <p className="text-gray-300 mb-4">
              You retain ownership of content you create on PowerCore (agents, skills, descriptions, etc.). 
              By publishing content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
              display, and distribute your content as necessary to operate the platform.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">4.2 Prohibited Content</h3>
            <p className="text-gray-300 mb-4">You may not create, upload, or publish content that:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Is illegal, harmful, threatening, abusive, harassing, or discriminatory</li>
              <li>Contains malware, viruses, or malicious code</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Attempts to exploit, harm, or deceive other users</li>
              <li>Violates the privacy or data protection rights of others</li>
              <li>Contains false or misleading information about its capabilities</li>
              <li>Is designed to circumvent platform safety measures</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-violet-400">4.3 Prohibited Conduct</h3>
            <p className="text-gray-300 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the platform&apos;s operation</li>
              <li>Scrape or collect data from the platform without permission</li>
              <li>Use automated systems to access the platform (except approved APIs)</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Engage in fraud, including payment fraud or fake reviews</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Purchases and Payments</h2>
            
            <h3 className="text-xl font-medium mb-3 text-violet-400">5.1 Pricing and Payment</h3>
            <p className="text-gray-300 mb-4">
              All prices are displayed in USD unless otherwise indicated. Payment is processed through 
              our third-party payment processor (Stripe). By making a purchase, you agree to provide 
              accurate payment information and authorize us to charge your payment method.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">5.2 Refunds</h3>
            <p className="text-gray-300 mb-4">
              Due to the digital nature of our products, all sales are generally final. However, we may 
              offer refunds in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>The purchased item does not function as described</li>
              <li>Duplicate charges due to technical errors</li>
              <li>Unauthorized purchases (with verification)</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Refund requests must be submitted within 14 days of purchase to{" "}
              <a href="mailto:support@powercore.app" className="text-violet-400 hover:text-violet-300">
                support@powercore.app
              </a>.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">5.3 Subscriptions</h3>
            <p className="text-gray-300">
              Subscription plans renew automatically at the end of each billing period. You may cancel 
              your subscription at any time, and it will remain active until the end of the current 
              billing period. No refunds are provided for partial billing periods.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Creator Terms</h2>
            
            <h3 className="text-xl font-medium mb-3 text-violet-400">6.1 Becoming a Creator</h3>
            <p className="text-gray-300 mb-4">
              To sell agents or skills on PowerCore, you must complete our creator verification process, 
              including connecting a Stripe account for payouts.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">6.2 Revenue Share</h3>
            <p className="text-gray-300 mb-4">
              Creators receive 70% of the sale price for their agents and skills. PowerCore retains 30% 
              as a platform fee. This fee covers payment processing, hosting, and platform maintenance.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">6.3 Payouts</h3>
            <p className="text-gray-300 mb-4">
              Payouts are processed monthly for earnings exceeding $50. Earnings below this threshold 
              roll over to the next month. Payouts are made via Stripe Connect to your connected bank account.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">6.4 Creator Responsibilities</h3>
            <p className="text-gray-300">
              As a creator, you are responsible for ensuring your content complies with these Terms, 
              providing accurate descriptions of your agents/skills, and responding to buyer inquiries 
              in a timely manner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-medium mb-3 text-violet-400">7.1 Platform IP</h3>
            <p className="text-gray-300 mb-4">
              PowerCore, including its logos, design, and underlying technology, is protected by copyright, 
              trademark, and other intellectual property laws. You may not copy, modify, or distribute 
              our platform or its components without permission.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">7.2 User IP</h3>
            <p className="text-gray-300">
              You retain ownership of original content you create. By using purchased agents/skills, 
              you receive a license to use them as intended, but you do not own the underlying intellectual 
              property unless explicitly stated by the creator.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Content Moderation</h2>
            <p className="text-gray-300 mb-4">
              We review content submitted to our marketplace to ensure compliance with these Terms. 
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Remove or refuse to publish content that violates these Terms</li>
              <li>Suspend or terminate accounts that repeatedly violate our policies</li>
              <li>Report illegal content to appropriate authorities</li>
              <li>Modify content to comply with platform requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations</h2>
            
            <h3 className="text-xl font-medium mb-3 text-violet-400">9.1 Service Availability</h3>
            <p className="text-gray-300 mb-4">
              We strive for high availability but do not guarantee uninterrupted access to our platform. 
              We may suspend or modify the service for maintenance, updates, or other reasons without notice.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">9.2 Third-Party Content</h3>
            <p className="text-gray-300 mb-4">
              PowerCore hosts content created by users. We are not responsible for the accuracy, quality, 
              or safety of third-party agents and skills. Use of third-party content is at your own risk.
            </p>

            <h3 className="text-xl font-medium mb-3 text-violet-400">9.3 Limitation of Liability</h3>
            <p className="text-gray-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, POWERCORE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, 
              OR USE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE USE OF OUR SERVICES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify and hold harmless PowerCore and its officers, directors, employees, 
              and agents from any claims, damages, losses, or expenses (including attorney&apos;s fees) arising 
              from your use of the platform, your content, or your violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Dispute Resolution</h2>
            <p className="text-gray-300 mb-4">
              Any disputes arising from these Terms or your use of PowerCore shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 text-gray-300 space-y-2">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation if negotiation fails</li>
              <li>Binding arbitration in accordance with the rules of [Arbitration Association]</li>
            </ol>
            <p className="text-gray-300 mt-4">
              You agree to waive any right to participate in class action lawsuits or class-wide arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-gray-300 mb-4">
              You may terminate your account at any time by contacting support or using the account 
              deletion feature. We may suspend or terminate your account if you violate these Terms.
            </p>
            <p className="text-gray-300">
              Upon termination, your right to use the platform ceases immediately. Provisions that by 
              their nature should survive termination will remain in effect, including ownership, 
              indemnification, and limitation of liability provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of the State 
              of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300">
                <strong>Email:</strong>{" "}
                <a href="mailto:legal@powercore.app" className="text-violet-400 hover:text-violet-300">
                  legal@powercore.app
                </a>
              </p>
              <p className="text-gray-300 mt-2">
                <strong>Support:</strong>{" "}
                <a href="mailto:support@powercore.app" className="text-violet-400 hover:text-violet-300">
                  support@powercore.app
                </a>
              </p>
              <p className="text-gray-300 mt-2">
                <strong>Address:</strong> PowerCore Inc., [Your Address Here]
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookies" className="hover:text-white transition-colors">
            Cookie Policy
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
