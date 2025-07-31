import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-slate-300 text-center">
              Last updated: January 31, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as when you create an account, submit truth capsules,
                  or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Account information (username, email address)</li>
                  <li>Profile information you choose to provide</li>
                  <li>Content you submit to the platform</li>
                  <li>Transaction and wallet information for Web3 interactions</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Analyze usage patterns to improve user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers who assist our operations</li>
                  <li>In connection with business transfers or mergers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Blockchain and Cryptocurrency</h2>
                <p>
                  Our platform integrates with blockchain networks. Please note that transactions on blockchain networks
                  are generally public and immutable. We cannot control or modify blockchain transactions once they are confirmed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to provide our services, comply with legal
                  obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Portability of your data</li>
                  <li>Objection to processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">8. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to collect and use personal information about you.
                  You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">9. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and maintained on computers located outside of your jurisdiction
                  where privacy laws may differ. We ensure appropriate safeguards are in place.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                  <br />
                  Email: privacy@guardianchain.org
                  <br />
                  Website: https://guardianchain.org/contact
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}