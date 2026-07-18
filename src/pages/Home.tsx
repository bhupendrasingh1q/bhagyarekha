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

// Indian States list
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

// Customer Reviews matching the screenshot exactly
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
    text: "The timeline prediction actually matched the month I met someone special. Totally worth it.",
    rating: 5
  },
  {
    name: "Karan B.",
    location: "Delhi NCR",
    text: "Timeline reading me 3 months bola tha... aur exactly 3 months me koi special mila. I don't know how, but amazing!",
    rating: 5
  },
  {
    name: "Pooja Singh",
    location: "Varanasi",
    text: "यह देखकर दिल खुश हो गया। ऐसा लग रहा था कि यह कोई साधारण चित्र नहीं बल्कि एक जीवित चेहरा है।",
    rating: 5
  },
  {
    name: "Simon L.",
    location: "Chandigarh",
    text: "My soulmate sketch was so cute! Looks like an actual person, not a random drawing. Loved it. ❤️",
    rating: 5
  },
  {
    name: "Raghav M.",
    location: "Jaipur",
    text: "Very detailed and personal. Didn't feel generic at all. Sketch felt meaningful.",
    rating: 5
  },
  {
    name: "Neha Mishra",
    location: "Bhopal",
    text: "बहुत ही सटीक चित्र। मुझे ऐसा लगा जैसे मैं अपने होने वाले साथी को सच में देख रही हूँ।",
    rating: 5
  },
  {
    name: "Manish R.",
    location: "Indore",
    text: "Personality reading is very accurate. Aisa laga ki aap mujhe achhe se jante ho.",
    rating: 5
  },
  {
    name: "Amit P.",
    location: "Bangalore",
    text: "The reading described qualities I always wanted in a partner. Felt very connected.",
    rating: 5
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '', // Merged value: YYYY-MM-DD
    gender: 'female',
    tob: '', // Merged value: HH:MM
    pobCity: '',
    pobState: ''
  });

  // Separate states for UI dropdowns matching screenshot
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const [tobHour, setTobHour] = useState('');
  const [tobMinute, setTobMinute] = useState('');
  const [tobAmPm, setTobAmPm] = useState('AM');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic automatic merging of Day, Month, Year into formData.dob YYYY-MM-DD
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      setFormData(prev => ({
        ...prev,
        dob: `${dobYear}-${dobMonth}-${dobDay}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dob: ''
      }));
    }
  }, [dobDay, dobMonth, dobYear]);

  // Dynamic automatic merging of Hour, Minute, AM/PM into formData.tob HH:MM
  useEffect(() => {
    if (tobHour && tobMinute && tobAmPm) {
      let hr = parseInt(tobHour);
      if (tobAmPm === 'PM' && hr < 12) hr += 12;
      if (tobAmPm === 'AM' && hr === 12) hr = 0;
      const hrStr = hr.toString().padStart(2, '0');
      setFormData(prev => ({
        ...prev,
        tob: `${hrStr}:${tobMinute}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tob: ''
      }));
    }
  }, [tobHour, tobMinute, tobAmPm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dob) {
      alert("Please select a complete Date of Birth (Day, Month, Year).");
      return;
    }
    if ((tobHour || tobMinute) && !(tobHour && tobMinute)) {
      alert("Please select a complete Time of Birth (Hour and Minute), or leave it empty.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = { ...formData };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (result.errors ? result.errors.join(', ') : 'Something went wrong. Please try again.'));
      }

      // Track Lead / Form Submission in Meta Pixel
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Soulmate Sketch Form Submission',
          status: 'success'
        });
      }

      navigate(`/payment/${result.orderId}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper arrays for date / time loops
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const years = Array.from({ length: 87 }, (_, i) => String(2026 - i)); // 1940 to 2026
  
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <div className="min-h-screen bg-astro-light text-[#3C1642] font-sans selection:bg-purple-200">
      
      {/* Header Container */}
      <header className="py-6 px-6 max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/10">
            <Sparkles className="text-white w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 font-sans">
            BhagyaRekha
          </span>
        </div>
        <button 
          onClick={scrollToForm}
          className="px-5 py-2 bg-purple-100 hover:bg-purple-200/70 border border-purple-200/50 rounded-full transition-all text-xs font-semibold text-purple-800"
        >
          Get My Sketch
        </button>
      </header>

      {/* Main Container mimicking mobilish preview centered on desktop */}
      <main className="max-w-xl mx-auto px-4 md:px-0 pb-32">
        
        {/* Intro Hero Section */}
        <section className="text-center pt-8 pb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#5C1A60] leading-tight font-serif mb-4">
            See Your Soulmate's Face
          </h1>
          <p className="text-base text-purple-950/80 leading-relaxed font-sans max-w-lg mx-auto mb-8 px-2">
            Your soulmate already exists — our intuitive artist connects with your birth energy to reveal how they look and when they'll appear in your life.
          </p>

          <div className="flex justify-center mb-5">
            <button 
              onClick={scrollToForm}
              className="w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg shadow-pink-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Reveal My Soulmate Now
            </button>
          </div>
          
          <div className="text-xs font-semibold text-purple-600/70 uppercase tracking-wider">
            Over 1,00,000+ sketches delivered
          </div>
        </section>

        {/* Hero Sketch Collage */}
        <section className="flex justify-center mb-16">
          <div className="relative w-full aspect-[1/1.05] sm:aspect-[4/5] bg-white rounded-3xl p-3 shadow-xl border border-purple-100/50 max-w-md">
            <div className="w-full h-full rounded-2xl overflow-hidden relative flex flex-col">
              
              {/* Top Half - Male Sketch */}
              <div className="h-[49.5%] w-full overflow-hidden border-b-2 border-[#FAF2F0]">
                <img 
                  src="/samples/1.jpg" 
                  alt="Male Soulmate Sketch" 
                  className="w-full h-full object-cover object-[center_15%] filter contrast-[1.05] brightness-[0.98]" 
                />
              </div>
              
              {/* Bottom Half - Female Sketch */}
              <div className="h-[50.5%] w-full overflow-hidden">
                <img 
                  src="/samples/2.jpg" 
                  alt="Female Soulmate Sketch" 
                  className="w-full h-full object-cover object-[center_35%] filter contrast-[1.05] brightness-[0.98]" 
                />
              </div>

              {/* Astrological circular details/seal overlay for premium aesthetic */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg border border-purple-100">
                <Sparkles className="w-5 h-5 text-purple-500 animate-spin-slow" />
              </div>
            </div>
          </div>
        </section>

        {/* "How It Works" Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-center text-[#5C1A60] font-serif mb-8">
            How It Works
          </h2>
          
          <div className="space-y-4 mb-8">
            {[
              {
                number: "1",
                title: "Share Your Details",
                desc: "Enter your name, birth details and energy vibes."
              },
              {
                number: "2",
                title: "Artist Connects",
                desc: "Our intuitive artist meditates using your birth energy to visualize your soulmate's features."
              },
              {
                number: "3",
                title: "Receive Your Sketch",
                desc: "Within 6–12 hours, receive your portrait and personality reading."
              }
            ].map((s, i) => (
              <div key={i} className="astro-card p-6 flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm border border-purple-200/50">
                  {s.number}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#5C1A60] mb-1 font-sans">{s.title}</h3>
                  <p className="text-sm text-purple-950/70 leading-relaxed font-sans">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Validation Indian Couple Card */}
          <div className="astro-card p-4 overflow-hidden">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative mb-4">
              <img 
                src="/reviews/3.jpg" 
                alt="Happy couple with soulmate sketch" 
                className="w-full h-full object-cover object-center" 
              />
            </div>
            <div className="px-2 text-center">
              <h4 className="text-base font-bold text-[#5C1A60] mb-1">Join 50,000+ Happy Hearts</h4>
              <p className="text-xs text-purple-950/60 leading-relaxed">
                Connect with the universal alignment that guides your spiritual connection.
              </p>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-center text-[#5C1A60] font-serif mb-8">
            Customer Reviews
          </h2>

          <div className="space-y-4">
            {REVIEWS.map((review, i) => (
              <div key={i} className="astro-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1.5 mb-3 text-pink-500">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-pink-500 text-pink-500" />
                    ))}
                  </div>
                  <p className="text-sm text-purple-950/80 leading-relaxed italic mb-4">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-purple-50/80 pt-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xs flex items-center justify-center">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#5C1A60]">{review.name}</div>
                    <div className="text-[10px] text-purple-600/60">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Form Section */}
        <section id="order-form" className="astro-card bg-astro-form p-6 sm:p-8 border border-purple-200/40 relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#5C1A60] font-serif mb-3">
              Your Soulmate Is Waiting To Be Revealed
            </h2>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-purple-700/80 bg-purple-100/50 py-1 px-3.5 rounded-full border border-purple-200/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>100% Confidential & Secure Order Details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Full Name (English Only)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  required
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm shadow-purple-950/[0.01]"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Date of Birth Dropdowns */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Date of Birth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <select 
                  required
                  className="bg-white border border-purple-100 rounded-2xl py-3 px-3 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                  value={dobDay}
                  onChange={e => setDobDay(e.target.value)}
                >
                  <option value="">Day</option>
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Month */}
                <select 
                  required
                  className="bg-white border border-purple-100 rounded-2xl py-3 px-3 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                  value={dobMonth}
                  onChange={e => setDobMonth(e.target.value)}
                >
                  <option value="">Month</option>
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>

                {/* Year */}
                <select 
                  required
                  className="bg-white border border-purple-100 rounded-2xl py-3 px-3 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                  value={dobYear}
                  onChange={e => setDobYear(e.target.value)}
                >
                  <option value="">Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time of Birth Dropdowns */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Time of Birth (Optional)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Hour */}
                <select 
                  className="bg-white border border-purple-100 rounded-2xl py-3 px-3 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                  value={tobHour}
                  onChange={e => setTobHour(e.target.value)}
                >
                  <option value="">HH</option>
                  {hours.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>

                {/* Minute */}
                <select 
                  className="bg-white border border-purple-100 rounded-2xl py-3 px-3 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                  value={tobMinute}
                  onChange={e => setTobMinute(e.target.value)}
                >
                  <option value="">MM</option>
                  {minutes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                {/* AM/PM */}
                <select 
                  className="bg-white border border-purple-100 rounded-2xl py-3 px-3 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                  value={tobAmPm}
                  onChange={e => setTobAmPm(e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Place of Birth City */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Place of Birth (City/Town)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  required
                  type="text" 
                  placeholder="Enter place of birth"
                  className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm"
                  value={formData.pobCity}
                  onChange={e => setFormData({...formData, pobCity: e.target.value})}
                />
              </div>
            </div>

            {/* State of Birth */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                State of Birth
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                <select 
                  required
                  className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm appearance-none text-purple-900"
                  value={formData.pobState}
                  onChange={e => setFormData({...formData, pobState: e.target.value})}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-400 w-0 h-0" />
              </div>
            </div>

            {/* Your Gender */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Your Gender
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                <select 
                  required
                  className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm appearance-none text-purple-900"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-400 w-0 h-0" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  required
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-purple-900/80 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                  required
                  type="tel" 
                  placeholder="10 digit mobile number"
                  className="w-full bg-white border border-purple-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Refund Banner */}
            <div className="p-4 bg-purple-100/40 border border-purple-200/20 rounded-2xl flex items-center gap-3 text-purple-800 text-xs font-semibold">
              <span className="text-base flex-shrink-0">🤝</span>
              <span>100% Risk-Free Guarantee: If not satisfied by the sketch, get a full refund!</span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg shadow-lg shadow-pink-500/10 hover:scale-[1.01] active:scale-95 transition-all text-white flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Get My Soulmate Sketch
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-purple-200/30 px-6 max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <Sparkles className="text-purple-600 w-5 h-5" />
          <span className="text-lg font-bold text-purple-900">BhagyaRekha</span>
        </div>
        <div className="flex gap-6 text-xs text-purple-600/70 justify-center flex-wrap mb-6">
          <Link to="/privacy" className="hover:text-purple-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-purple-900 transition-colors">Terms of Service</Link>
          <Link to="/refund" className="hover:text-purple-900 transition-colors">Refund Policy</Link>
          <a href="mailto:bhagyarekhateam@gmail.com" className="hover:text-purple-900 transition-colors">Contact Us</a>
        </div>
        <div className="text-purple-600/50 text-xs">
          © 2026 BhagyaRekha. Spiritual & Creative Services.
        </div>
      </footer>

      {/* Sticky Bottom Call-to-Action Bar for Mobile Screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4.5 bg-[#FAF2F0]/90 backdrop-blur-md border-t border-purple-200/20 z-[60] flex justify-center">
        <button 
          onClick={scrollToForm}
          className="w-full max-w-md py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-white text-base shadow-lg shadow-pink-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          💖 Get My Soulmate Sketch Now
        </button>
      </div>
    </div>
  );
}
