import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, CheckCircle2, Zap } from 'lucide-react';

interface PriceOption {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  recommended?: boolean;
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
    description: "Learn their traits, habits, and mindset.",
    recommended: true
  },
  {
    id: 'timeline',
    title: "Love Timeline (12 Months)",
    price: 149,
    originalPrice: 299,
    description: "When and where you will meet them."
  }
];

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // Addon state moved here
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

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const totalPrice = 99 + selectedAddons.length * 149 - (selectedAddons.length >= 2 ? 100 : 0);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentMethod,
          addons: selectedAddons,
          totalPrice 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Payment successful! Your order is now confirmed.');
        navigate('/'); // Or redirect to a dedicated Success page
      } else {
        alert(data.message || 'Payment failed.');
      }
    } catch (err) {
      console.error('Payment error', err);
      alert('An error occurred during payment.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0718] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#0F0718] bg-mandala text-white font-sans flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">Customize & Complete</h1>
          <p className="text-gray-400">Add any extras you want before completing your payment.</p>
        </div>

        {/* Pricing & Addons */}
        <div className="space-y-8 mb-8">
          <div className="p-8 glass-card rounded-3xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Order Summary
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-md">Save ₹300+</span>
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                <div>
                  <div className="font-bold">Soulmate Sketch</div>
                  <div className="text-xs text-orange-400 font-bold">Limited Offer Applied</div>
                </div>
                <div className="text-right">
                  <div className="text-sm line-through text-gray-500">₹299</div>
                  <div className="font-bold text-lg">₹99</div>
                </div>
              </div>

              {PRICE_OPTIONS.slice(1).map(option => (
                <label 
                  key={option.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedAddons.includes(option.id) 
                      ? 'bg-purple-500/10 border-purple-500/50' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-purple-500"
                      checked={selectedAddons.includes(option.id)}
                      onChange={() => toggleAddon(option.id)}
                    />
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {option.title}
                        {option.recommended && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-purple-500 text-white rounded uppercase font-black">Best</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{option.description}</div>
                    </div>
                  </div>
                  <div className="font-bold text-purple-400">+₹149</div>
                </label>
              ))}
            </div>

            {selectedAddons.length >= 2 && (
              <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between text-green-400 text-sm font-bold">
                <span>Special Combo Discount:</span>
                <span>- ₹100</span>
              </div>
            )}

            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 uppercase tracking-widest text-xs font-bold">Total Amount</span>
                <span className="text-3xl font-black">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-8 glass-card rounded-3xl border border-white/10 bg-white/[0.02]">
          <div className="space-y-4 mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Select Payment Method
            </h3>
            
            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 accent-orange-500" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="font-bold">UPI / QR Code</div>
                  <div className="text-xs text-gray-400">GPay, PhonePe, Paytm</div>
                </div>
              </div>
            </label>

            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-orange-500" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold">Credit / Debit Card</div>
                  <div className="text-xs text-gray-400">Visa, Mastercard, RuPay</div>
                </div>
              </div>
            </label>
          </div>

          <button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-xl shadow-lg shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {processing ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Pay ₹{totalPrice} Now
              </>
            )}
          </button>
          
          <div className="text-center mt-6 text-xs text-gray-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            256-bit Secure SSL Processing (Demo Mode)
          </div>
        </div>
      </div>
    </div>
  );
}
