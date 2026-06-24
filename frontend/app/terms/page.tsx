"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 selection:bg-blue-500/30 pb-20">
      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          {/* <div className="flex items-center gap-2 text-blue-500">
            <BookOpen className="w-5 h-5" />
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
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-zinc-500 mb-12">Last Updated: June 2026</p>

          <div className="prose prose-invert prose-blue max-w-none space-y-8">
            <section id="acceptance" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using FundBridge AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section id="description" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">2. Platform Description</h2>
              <p className="leading-relaxed">
                FundBridge AI is a lending marketplace and matching platform connecting businesses with financial institutions. 
                <strong> FundBridge AI is not a bank, lender, financial advisor, or guarantor of funding approval.</strong>
              </p>
              <p className="leading-relaxed">
                Compatibility scores and AI recommendations are provided for informational purposes only and do not constitute financial advice or a guarantee of funding.
              </p>
            </section>

            <section id="user-responsibilities" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">3. User Responsibilities</h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process.
              </p>
            </section>

            <section id="business-responsibilities" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">4. Business Responsibilities</h2>
              <p className="leading-relaxed">
                Businesses seeking funding must ensure all financial data, documents, and disclosures provided are accurate and truthful. Providing false financial information may result in immediate account termination and potential legal action from financial institutions.
              </p>
            </section>

            <section id="bank-responsibilities" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">5. Bank Responsibilities</h2>
              <p className="leading-relaxed">
                Financial institutions ("Banks") agree to review applications in good faith and handle all business data in compliance with applicable financial regulations and data privacy laws.
              </p>
            </section>

            <section id="matching" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">6. Matching Disclaimer</h2>
              <p className="leading-relaxed">
                Our AI-driven matching algorithm suggests potential connections based on data provided by both parties. FundBridge AI does not guarantee that a match will result in a successful loan origination.
              </p>
            </section>

            <section id="documents" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">7. Document Upload Policy</h2>
              <p className="leading-relaxed">
                Users may upload financial documents for verification. You retain ownership of your documents, but grant FundBridge AI a limited license to process, store, and share these documents with your matched financial institutions. Do not upload documents containing sensitive personal information not required for business lending.
              </p>
            </section>

            <section id="suspension" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">8. Account Suspension</h2>
              <p className="leading-relaxed">
                FundBridge AI reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activities, or misuse the platform's features, without prior notice.
              </p>
            </section>

            <section id="liability" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">9. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, FundBridge AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-semibold text-white tracking-tight">10. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us at <a href="mailto:legal@fundbridge.ai" className="text-blue-500 hover:underline">legal@fundbridge.ai</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
