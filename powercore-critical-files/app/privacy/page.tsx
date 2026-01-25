import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PowerCore",
  description: "PowerCore privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              Welcome to PowerCore (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your 
              privacy and ensuring the security of your personal information. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-gray-300">
              By using PowerCore, you agree to the collection and use of information in accordance with 
              this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-violet-400">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Name, email address, password, and profile details when you create an account.</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through Stripe).</li>
              <li><strong>Content:</strong> Agents, skills, and other content you create, upload, or publish on our platform.</li>
              <li><strong>Communications:</strong> Messages you send to us or other users through our platform.</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-violet-400">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, and interaction patterns.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
              <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience. See our Cookie Policy for details.</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-violet-400">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>OAuth Providers:</strong> If you sign in with Google, GitHub, or other providers, we receive basic profile information.</li>
              <li><strong>Payment Processors:</strong> Transaction confirmations and fraud prevention data from Stripe.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
              <li>Personalize and improve your experience</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-300 mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment processing, analytics, email delivery).</li>
              <li><strong>Other Users:</strong> Your public profile, agents, and skills are visible to other users.</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect our rights and safety.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information.</li>
            </ul>
            <p className="text-gray-300 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-300 mt-4">
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information for as long as your account is active or as needed to provide you services. 
              We may retain certain information for longer periods as required by law or for legitimate business purposes. 
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where 
              retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights (GDPR & CCPA)</h2>
            <p className="text-gray-300 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:privacy@powercore.app" className="text-violet-400 hover:text-violet-300">
                privacy@powercore.app
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have different data protection laws. We ensure appropriate safeguards are in place, 
              including Standard Contractual Clauses approved by the European Commission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-gray-300">
              Our services are not intended for individuals under 16 years of age. We do not knowingly collect 
              personal information from children under 16. If we learn we have collected such information, 
              we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. For significant changes, 
              we will provide additional notice, such as via email or a prominent notice on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@powercore.app" className="text-violet-400 hover:text-violet-300">
                  privacy@powercore.app
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
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
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
