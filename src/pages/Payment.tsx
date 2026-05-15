import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, CheckCircle2, Zap } from 'lucide-react';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

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

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod })
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Payment successful! Your order is now confirmed.');
        navigate('/'); // Or you could redirect to a dedicated Success page
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">Complete Your Payment</h1>
          <p className="text-gray-400">You are one step away from receiving your Soulmate Sketch.</p>
        </div>

        <div className="p-8 glass-card rounded-3xl mb-8 border border-white/10 bg-white/[0.02]">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
            <div>
              <div className="text-sm text-gray-400 mb-1">Order For</div>
              <div className="font-bold text-lg">{order.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Total Amount</div>
              <div className="font-bold text-2xl text-orange-400">₹{order.totalPrice}</div>
            </div>
          </div>

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
                Pay ₹{order.totalPrice} Now
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
