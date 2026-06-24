"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 selection:bg-blue-500/30 pb-20">
      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          {/* <div className="flex items-center gap-2 text-emerald-500">
            <Shield className="w-5 h-5" />
            <span className="font-semibold tracking-tight">FundBridge AI</span>
          </div> */}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-500 mb-12">Last Updated: June 2026</p>

          <div className="prose prose-invert prose-emerald max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">1. Information We Collect</h2>
              <p className="leading-relaxed">
                We collect information to provide better services to all our users. This includes basic account information such as your name, email address, and password, as well as specific profile data based on your account type.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">2. Business Information</h2>
              <p className="leading-relaxed">
                If you register as a Business, we collect data regarding your company, including industry, revenue, incorporation details, and existing financial obligations. This data is strictly used to match you with suitable lending partners.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">3. Bank Information</h2>
              <p className="leading-relaxed">
                If you register as a Bank, we collect information about your institution, your lending criteria, risk tolerance, and preferred business profiles to optimize our matching algorithm.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">4. Uploaded Documents</h2>
              <p className="leading-relaxed">
                Documents uploaded to the platform are securely stored using industry-standard encryption. We process these documents to extract relevant financial metrics necessary for the matching process and application review.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">5. How Data Is Used</h2>
              <p className="leading-relaxed">
                We use your information to operate, maintain, and improve our platform, including to process transactions, develop new features, and provide customer support.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">6. Data Sharing</h2>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="leading-relaxed text-emerald-400 font-medium">
                  Important: Business information, including uploaded financial documents, may be shared with matched lenders and authorized platform administrators when you explicitly forward an application to a bank.
                </p>
              </div>
              <p className="leading-relaxed">
                We do not sell your personal data to third-party marketers. Data is only shared as necessary to facilitate the core lending marketplace functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">7. Security Practices</h2>
              <p className="leading-relaxed">
                We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">8. User Rights</h2>
              <p className="leading-relaxed">
                You have the right to access, correct, or delete your personal data. You may also object to processing or request data portability by contacting our support team.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">9. Data Retention</h2>
              <p className="leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">10. Contact Information</h2>
              <p className="leading-relaxed">
                For any privacy-related questions or requests, please contact us at <a href="mailto:privacy@fundbridge.ai" className="text-emerald-500 hover:underline">privacy@fundbridge.ai</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
