import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Refund() {
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
          Refund & Cancellation Policy
        </h1>
        <p className="text-gray-400 mb-8">Last Updated: May 17, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">1. Digital Nature of Service</h2>
            <p>
              BhagyaRekha provides highly customized, personalized digital drawings and birth chart reading reports. Because these files are generated custom for you based on the personal birth details (name, date, time, and place) you provide, we incur design labor immediately upon order processing. 
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">2. Cancellation Policy</h2>
            <p>
              You may request order cancellation within **30 minutes** of order placement, provided the designer has not started meditating or drawing your sketch. 
            </p>
            <p className="mt-4">
              Once drawing has begun or delivery is initiated, cancellations cannot be processed because the customized service has already been rendered.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">3. Delivery SLA & Delay Refunds</h2>
            <p>
              We guarantee delivery of your high-resolution digital soulmate sketch and report via email within **4 working hours** under standard conditions. 
            </p>
            <p className="mt-4">
              If we experience technical downtime, system outages, or surge delays and are unable to deliver your drawing within **48 hours** of your order, we will automatically issue a **100% full refund** to your original payment source.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">4. Refund Processing Time</h2>
            <p>
              Approved refunds are processed instantly on our system. Since all payments are handled securely through Razorpay, the refunded amount will be credited back to your original payment instrument (Bank Account, Credit/Debit Card, or UPI Wallet) within **5 to 7 working days**, depending on your bank's processing cycles.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Support for Refunds</h2>
            <p>
              For refund status, cancellation requests, or any delivery issues, write to us directly with your Order ID:
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
