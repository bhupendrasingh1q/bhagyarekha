/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Users, 
  Star, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  ChevronRight,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Review {
  name: string;
  location: string;
  text: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    name: "Aditi K.",
    location: "Lucknow",
    text: "Yaar, sach bolu toh maine timepass mein order kiya tha... par sketch dekhkar literally goosebumps aa gaye. It felt so real!",
    rating: 5
  },
  {
    name: "Riya Sharma",
    location: "Mumbai",
    text: "The sketch looked like someone I recently started talking to. It was strangely accurate! Every detail resonated with my birth chart.",
    rating: 5
  },
  {
    name: "Aditya Mishra",
    location: "Patna",
    text: "पर्सनालिटी रीडिंग ने मेरे भविष्य के साथी के स्वभाव को बहुत सही बताया। उम्मीद से ज़्यादा अच्छा अनुभव। Highly recommended for anyone looking for clarity.",
    rating: 5
  },
  {
    name: "Sanjana S.",
    location: "Pune",
    text: "I was skeptical at first, but the artist really captured a certain energy that I felt. The delivery was fast too!",
    rating: 4
  }
];

const SAMPLE_IMAGES = [
  '/samples/1.jpg',
  '/samples/2.jpg',
  '/samples/3.jpg',
  '/samples/4.jpg'
];
export default function Home() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(7993); // Approx 2h 13m
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'female',
    tob: '',
    pobCity: '',
    pobState: ''
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    const imageTimer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % SAMPLE_IMAGES.length);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(imageTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // If there are specific validation errors, we could show them, but for now a generic alert is fine
        throw new Error(result.message || (result.errors ? result.errors.join(', ') : 'Something went wrong. Please try again.'));
      }

      navigate(`/payment/${result.orderId}`);
      // Optionally reset form: setFormData({ name: '', email: '', phone: '', dob: '', gender: 'female' });
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F0718] bg-mandala text-white font-sans selection:bg-orange-500/30">
      {/* Promo Bar */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FF4500] text-white py-2 text-center text-sm font-semibold tracking-wide">
        <span className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 fill-white animate-pulse" />
          LIMITED TIME OFFER: 75% OFF ENDS IN {formatTime(timeLeft)}
        </span>
      </div>

      {/* Trust & Security Bar */}
      <div className="bg-[#150C24] border-b border-white/5 py-1.5 px-4 text-center text-xs font-medium tracking-wider text-gray-300 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
          <span className="text-emerald-400 font-bold uppercase">Fully Secure & Approved Safe</span>
        </span>
        <span className="hidden md:inline text-white/10">•</span>
        <span className="flex items-center gap-1">
          <span>🔒 256-Bit SSL Encrypted Connection</span>
        </span>
        <span className="hidden md:inline text-white/10">•</span>
        <span className="flex items-center gap-1">
          <span>🎯 Satisfaction Guaranteed</span>
        </span>
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#0F0718]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
            BhagyaRekha
          </span>
        </div>
        <button 
          onClick={scrollToForm}
          className="hidden md:block px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium"
        >
          My Review
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-orange-600 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="flex flex-wrap gap-2.5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest">
                <Star className="w-3 h-3 fill-orange-400" />
                Trusted by 50,000+ Seekers
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500/20 text-emerald-400" />
                Fully Secure & Approved Safe
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Reveal the Face of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Your Soulmate</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              Have you ever wondered what your true soulmate actually looks like? 
              Our talented spiritual artists blend psychic insight with artistic skill 
              to create a drawing that goes beyond imagination.
            </p>

            {/* Cyan Refund Guarantee */}
            <div className="mb-8 p-4 bg-cyan-950/45 border border-cyan-400/30 rounded-2xl flex items-center gap-3 text-cyan-300 text-sm font-semibold shadow-lg shadow-cyan-950/20 max-w-xl backdrop-blur-sm">
              <span className="flex-shrink-0 text-xl">🤝</span>
              <span>
                <strong className="text-white block mb-0.5">100% Risk-Free Guarantee:</strong>
                If not satisfied by the sketch, get a full refund!
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToForm}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Get My Sketch Now
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex -space-x-3 items-center ml-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F0718] bg-gray-600 overflow-hidden">
                    <img src={`/reviews/${i}.jpg`} alt="Reviewer" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="ml-6 text-sm text-gray-400 font-medium">
                  <span className="text-white block">Excellent 4.9/5</span>
                  from latest reviews
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent rounded-3xl rotate-3 blur-2xl" />
            <div className="relative w-full max-w-md aspect-[3/4] bg-neutral-900/40 rounded-3xl border border-white/10 p-4 backdrop-blur-sm shadow-2xl overflow-hidden group">
              <AnimatePresence>
                <motion.div 
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.5 }}
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                  style={{ backgroundImage: `url(${SAMPLE_IMAGES[currentImageIndex]})` }}
                />
              </AnimatePresence>
              <div className="relative h-full border border-white/5 rounded-2xl flex flex-col items-center justify-end p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                <div className="text-center">
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Sample Result</div>
                  <h3 className="text-2xl font-bold mb-2">Soulmate Portrait</h3>
                  <p className="text-sm text-gray-300">Created through meditative visualization of birth energy.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Power of Clarity</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our personalized soulmate portrait is designed to give you more than just a picture; it's a bridge to your destiny.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: "Deep Connection", 
                desc: "Feel an immediate sense of recognition and emotional surge when you see their features." 
              },
              { 
                icon: ShieldCheck, 
                title: "Emotional Insight", 
                desc: "Gain clarity on the spiritual bond and soul-level compatibility you share with them." 
              },
              { 
                icon: Clock, 
                title: "Future Glimpse", 
                desc: "See the person destined to play the most significant role in your life's journey." 
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 glass-card rounded-3xl group">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="text-orange-500 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: "01", title: "Share Your Details", desc: "Enter your name, birth details, and current energy status." },
              { step: "02", title: "Artist Connects", desc: "Our intuitive artist meditates using your birth energy to visualize your soulmate's features." },
              { step: "03", title: "Receive Your Sketch", desc: "Within 4 working hours, receive your portrait and personality reading via email." }
            ].map((s, i) => (
              <div key={i} className="flex gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-2xl font-black text-orange-500/20">{s.step}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="py-24 px-6 bg-gradient-to-b from-[#0F0718] to-[#1A0B2E]">
        <div className="max-w-3xl mx-auto">
          
          {/* Form */}
          <div className="p-8 glass-card rounded-3xl">
            <h2 className="text-3xl font-bold mb-4 text-center">Get Your Divine Sketch</h2>
            <div className="mb-8 flex justify-center items-center gap-2 text-xs text-gray-400 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
              <span>100% Secure Checkout | SSL Encrypted & Verified Safe</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">FULL NAME *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">EMAIL ADDRESS *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required
                    type="email" 
                    placeholder="Where should we send the sketch?"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">PHONE NUMBER *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      required
                      type="tel" 
                      placeholder="+91 Phone"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">GENDER *</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">DATE OF BIRTH (FOR ACCURACY)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required
                    type="date"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">TIME OF BIRTH *</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required
                    type="time"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                    value={formData.tob}
                    onChange={e => setFormData({...formData, tob: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">PLACE OF BIRTH (CITY) *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="City or Town"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                      value={formData.pobCity}
                      onChange={e => setFormData({...formData, pobCity: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">STATE *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="State"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                      value={formData.pobState}
                      onChange={e => setFormData({...formData, pobState: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Cyan Refund Guarantee */}
              <div className="p-4 bg-cyan-950/45 border border-cyan-400/30 rounded-2xl flex items-center gap-3 text-cyan-300 text-sm font-semibold shadow-lg shadow-cyan-950/20 backdrop-blur-sm">
                <span className="text-xl">🤝</span>
                <span>If not satisfied by the sketch, get a full refund!</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl font-bold text-xl shadow-xl shadow-orange-600/30 hover:scale-[1.01] active:scale-95 transition-all text-white flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Proceed to Get Sketch
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 glass-card rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-orange-500 w-5 h-5" />
            <span className="text-xl font-bold">BhagyaRekha</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500 flex-wrap justify-center">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <a href="mailto:Astrojyoti9599@gmail.com" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 BhagyaRekha. Spiritual & Creative Services.
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0F0718]/80 backdrop-blur-lg border-t border-white/10 z-[60]">
        <button 
          onClick={scrollToForm}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-lg shadow-lg shadow-orange-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5 fill-white" />
          Get My Soulmate Sketch
        </button>
      </div>
    </div>
  );
}
