import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">
              Terms of Service
            </CardTitle>
            <p className="text-slate-300 text-center">
              Last updated: January 31, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using GUARDIANCHAIN, you accept and agree to
                  be bound by the terms and provision of this agreement. If you
                  do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  2. Description of Service
                </h2>
                <p>
                  GUARDIANCHAIN is a Web3 truth verification platform that
                  enables users to create, verify, and monetize truth capsules
                  through blockchain technology and community governance.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  3. User Accounts and Responsibilities
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Users must provide accurate information when creating
                    accounts
                  </li>
                  <li>
                    Users are responsible for maintaining the security of their
                    accounts
                  </li>
                  <li>
                    Users must not engage in fraudulent or malicious activities
                  </li>
                  <li>
                    Content submitted must be truthful and not violate
                    intellectual property rights
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  4. GTT Token Terms
                </h2>
                <p>
                  GTT tokens are utility tokens used within the GUARDIANCHAIN
                  ecosystem. Token rewards are subject to platform rules and may
                  be modified based on network conditions and governance
                  decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  5. Privacy and Data Protection
                </h2>
                <p>
                  We respect your privacy and protect your personal data in
                  accordance with applicable data protection laws. Please refer
                  to our Privacy Policy for detailed information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  6. Limitation of Liability
                </h2>
                <p>
                  GUARDIANCHAIN shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  7. Termination
                </h2>
                <p>
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  8. Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these terms at any time. We
                  will notify users of any changes by updating the "last
                  updated" date at the top of this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">
                  9. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at:
                  <br />
                  Email: legal@guardianchain.org
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
