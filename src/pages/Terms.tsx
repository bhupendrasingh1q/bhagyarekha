import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0F0718] bg-mandala text-white font-sans selection:bg-orange-500/30">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#0F0718]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
            BhagyaRekha
          </span>
        </Link>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        <p className="text-gray-400 mb-8">Last Updated: May 17, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              Welcome to BhagyaRekha. By accessing or using our website, services, or psychic drawings, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, please do not use our services.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
            <p>
              BhagyaRekha offers personalized digital psychic drawings, visualization charts, and birth chart personality reports based on user-supplied details (such as name, date, time, and place of birth). 
            </p>
            <p className="mt-4">
              All sketches and readings are delivered digitally via the email address provided during checkout. Since our services are spiritual and artistic in nature, results represent psychic interpretations and artistic impressions.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">3. Delivery Timeline</h2>
            <p>
              We strive to deliver all ordered sketches and digital reports directly to your email inbox within <strong>4 working hours</strong> from the time the order is successfully placed and paid. If there are exceptional surges in demand or technical issues, we will notify you immediately regarding any minor delays.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">4. Accuracy & Entertainment Disclaimer</h2>
            <p>
              Our psychic drawings and reading reports are intended for self-reflection, personal guidance, and entertainment purposes. We do not guarantee absolute future matches or specific biological look-alikes. The service should not be used as a substitute for professional legal, financial, or medical advice.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
            <p>
              All digital sketches, drawings, templates, and textual reports delivered to you remain copyrighted by BhagyaRekha. You are granted a personal, non-transferable license to use, print, and share your individual digital sketch for personal purposes only. Commercial redistribution of BhagyaRekha art assets is strictly prohibited.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
            <p>
              If you have any questions or feedback regarding these terms, please contact us directly:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-orange-400">
              <li>Email: <a href="mailto:bhagyarekhateam@gmail.com" className="hover:underline">bhagyarekhateam@gmail.com</a></li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6 text-center text-gray-500 text-sm">
        © 2026 BhagyaRekha. All Rights Reserved.
      </footer>
    </div>
  );
}
