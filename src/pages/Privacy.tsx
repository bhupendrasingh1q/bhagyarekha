import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-8">Last Updated: May 17, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you directly provide to us to process your psychic drawing. This includes:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Contact Info:</strong> Name, Email Address, and Phone Number.</li>
              <li><strong>Birth Chart Details:</strong> Date of Birth, Time of Birth, and Place of Birth (City/State/Country).</li>
              <li><strong>Payment Data:</strong> Payment processing is handled securely via Razorpay. We do not store credit card or bank login information on our servers.</li>
            </ul>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>
              The information we collect is strictly used to deliver high-quality, customized digital visualization sketches and to process transactions:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To visualize features and traits matching your astronomical birth chart profile.</li>
              <li>To email you the completed high-resolution soulmate sketch and report.</li>
              <li>To send order confirmation and transaction status emails via Nodemailer.</li>
              <li>To reply to your support queries or feedback.</li>
            </ul>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security & Storage</h2>
            <p>
              Your personal order data is secured using SSL/TLS encryption and stored on secure cloud database servers managed by Supabase. Access is strictly limited to authorized designers and readers who prepare your digital portraits. 
            </p>
            <p className="mt-4">
              We never rent, sell, or trade your personal details or birth chart profiles to any third-party marketing networks.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
            <p>
              We use minor browser storage or session cookies to retain your order custom configuration and ensure a smooth secure transaction flow during the Razorpay payment checkout process. You can block cookies in your browser settings, but some steps of the checkout process might not load properly.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Privacy Team</h2>
            <p>
              If you wish to request the deletion of your personal birth details after receiving your digital sketch, please write to us at:
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
