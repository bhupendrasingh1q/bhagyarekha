import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Flame, Sparkles } from 'lucide-react';

interface PriceOption {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  badge?: string;
  badgeStyle?: string;
}

const PRICE_OPTIONS: PriceOption[] = [
  {
    id: 'basic',
    title: "Soulmate Sketch",
    price: 99,
    originalPrice: 299,
    description: "Digital hand-drawn portrait of your soulmate."
  },
  {
    id: 'personality',
    title: "Detailed Name & Personality Report",
    price: 149,
    originalPrice: 299,
    description: "Name, emotional traits, mindset, habits, and compatibility patterns.",
    badge: "Recommended",
    badgeStyle: "bg-purple-100 text-purple-700 border-purple-200/50"
  },
  {
    id: 'timeline',
    title: "Love Timeline Reading (12 Months)",
    price: 149,
    originalPrice: 299,
    description: "When you may meet, key months, and future romantic energy shifts.",
    badge: "Most customers add this",
    badgeStyle: "bg-pink-100 text-pink-700 border-pink-200/50"
  }
];

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Set default addons
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['personality']);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          alert('Order not found');
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  // Keep exact original pricing logic
  const basePrice = 99;
  const addonPrice = 149;
  const comboDiscount = selectedAddons.length >= 2 ? 100 : 0;
  const totalPrice = basePrice + selectedAddons.length * addonPrice - comboDiscount;

  // Track InitiateCheckout in Meta Pixel once when order is successfully loaded
  useEffect(() => {
    if (order && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: totalPrice,
        currency: 'INR',
        content_name: 'Soulmate Sketch & Reading',
        content_ids: [orderId],
        content_type: 'product'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setProcessing(false);
        return;
      }

      // 1. Create order on backend
      const orderResponse = await fetch(`/api/orders/${orderId}/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalPrice })
      });
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        alert("Failed to create order: " + orderData.message);
        setProcessing(false);
        return;
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // Amount in paise
        currency: "INR",
        name: "BhagyaRekha",
        description: "Soulmate Sketch & Reading",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            const verifyResponse = await fetch(`/api/orders/${orderId}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: 'razorpay',
                addons: selectedAddons,
                totalPrice
              })
            });
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              // Track Purchase in Meta Pixel
              if (typeof (window as any).fbq === 'function') {
                (window as any).fbq('track', 'Purchase', {
                  value: totalPrice,
                  currency: 'INR',
                  content_name: 'Soulmate Sketch & Reading',
                  content_ids: [orderId],
                  content_type: 'product'
                });
              }

              alert('Payment successful! Your order is now confirmed.');
              navigate('/'); // Or navigate to a success page
            } else {
              alert(verifyData.message || 'Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error', err);
            alert('An error occurred during payment verification.');
          }
        },
        prefill: {
          name: order.name || '',
          email: order.email || '',
          contact: order.phone || ''
        },
        method: {
          netbanking: false,
          card: true,
          wallet: true,
          upi: true,
          emi: false,
          paylater: false
        },
        theme: {
          color: "#A855F7"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      console.error('Payment error', err);
      alert('An error occurred during payment.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-astro-light flex items-center justify-center text-[#5C1A60]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-astro-light text-[#3C1642] font-sans flex flex-col items-center py-8 px-4 sm:px-6">
      
      {/* Top Secure Banner */}
      <div className="w-full max-w-md mb-6 bg-purple-100/50 border border-purple-200/30 py-2.5 px-4 rounded-full text-center text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center justify-center gap-1.5 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-purple-600" />
        <span>100% Fully Secure Checkout & Approved Safe Website</span>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        {/* Basic Purchase Header Card */}
        <div className="astro-card p-5 flex items-center justify-between border-purple-200/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-inner border border-purple-200/40 relative">
              <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#5C1A60] font-sans">
                Soulmate Sketch For {order.name}
              </h2>
              <p className="text-[11px] text-purple-600/70 font-semibold flex items-center gap-1 mt-0.5">
                Delivery in 6 to 12 hours
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs line-through text-purple-600/40">₹{PRICE_OPTIONS[0].originalPrice}</div>
            <div className="font-black text-xl text-purple-700">₹{PRICE_OPTIONS[0].price}</div>
            <div className="text-[9px] font-bold text-pink-600 flex items-center justify-end gap-0.5 mt-0.5">
              <Flame className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
              <span>Limited Offer</span>
            </div>
          </div>
        </div>

        {/* Combo Discount Banner Card */}
        <div className="astro-card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 p-4 text-center">
          <span className="text-xs font-bold text-purple-800">
            Add both reports below and Get <span className="text-pink-600">₹100 Combo discount</span>.
          </span>
        </div>

        {/* Customized Checklist */}
        <div className="space-y-3">
          {PRICE_OPTIONS.slice(1).map(option => (
            <label 
              key={option.id}
              className={`astro-card p-5 flex items-start gap-4 transition-all cursor-pointer select-none relative ${
                selectedAddons.includes(option.id) 
                  ? 'border-purple-300 ring-1 ring-purple-300/30' 
                  : 'hover:border-purple-200'
              }`}
            >
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  className="w-4.5 h-4.5 accent-purple-600 cursor-pointer rounded-md"
                  checked={selectedAddons.includes(option.id)}
                  onChange={() => toggleAddon(option.id)}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-[#5C1A60]">{option.title}</span>
                  {option.badge && (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${option.badgeStyle}`}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-purple-950/60 leading-relaxed">{option.description}</p>
              </div>
              <div className="text-right font-black text-sm text-purple-600">
                + ₹{option.price}
              </div>
            </label>
          ))}
        </div>

        {/* Live Order Summary Grid */}
        <div className="astro-card p-5 border-purple-200/20">
          <h3 className="text-sm font-black text-[#5C1A60] font-sans border-b border-purple-50 pb-3 mb-3">
            Order Summary
          </h3>
          
          <div className="space-y-2 text-xs text-purple-950/70">
            <div className="flex justify-between items-center">
              <span>Soulmate Sketch</span>
              <span className="font-semibold">₹{basePrice}</span>
            </div>
            
            {selectedAddons.includes('personality') && (
              <div className="flex justify-between items-center">
                <span>Soulmate Personality Report</span>
                <span className="font-semibold">+ ₹{addonPrice}</span>
              </div>
            )}
            
            {selectedAddons.includes('timeline') && (
              <div className="flex justify-between items-center">
                <span>When Will You Meet Report</span>
                <span className="font-semibold">+ ₹{addonPrice}</span>
              </div>
            )}

            {comboDiscount > 0 && (
              <div className="flex justify-between items-center text-pink-600 font-bold border-t border-purple-50/50 pt-2">
                <span>Special Combo Discount:</span>
                <span>- ₹{comboDiscount}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-[#5C1A60] font-black text-base border-t border-purple-100 pt-3 mt-3">
              <span>Total</span>
              <span className="text-lg">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button & Security info */}
        <div className="astro-card p-6 border-purple-200/20 text-center">
          
          {/* Refund Notice */}
          <div className="mb-4 p-3 bg-purple-100/40 border border-purple-200/20 rounded-xl flex items-center justify-center gap-2 text-[#5C1A60] text-xs font-semibold">
            <span>🤝</span>
            <span>If not satisfied by the sketch, get a full refund!</span>
          </div>

          <button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-white text-base shadow-lg shadow-pink-500/10 hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {processing ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Proceed to Secure Payment
              </>
            )}
          </button>
          
          <div className="text-[10px] text-purple-600/40 mt-4 flex items-center justify-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Secure Payments via Razorpay</span>
          </div>

          {/* Support Email */}
          <div className="text-[11px] text-purple-950/60 mt-5 border-t border-purple-50 pt-4">
            For support, please email us at <a href="mailto:Astrojyoti9599@gmail.com" className="font-bold text-purple-700 hover:underline">Astrojyoti9599@gmail.com</a>
          </div>

          {/* Custom Footer Links */}
          <div className="flex gap-4 justify-center text-[9px] text-purple-600/40 mt-3">
            <Link to="/privacy" className="hover:text-purple-900 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-purple-900 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/refund" className="hover:text-purple-900 transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
