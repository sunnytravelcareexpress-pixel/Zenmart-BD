import React, { useState } from 'react';
import { X, MessageCircle, Truck, CheckCircle, ShieldCheck } from 'lucide-react';
import { Product, Order, AppUser } from '../types';
import { saveOrderToFirestore } from '../firebase';

interface WhatsAppOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  currentUser?: AppUser | null;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderCreated,
  currentUser,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  React.useEffect(() => {
    if (currentUser?.displayName && !customerName) {
      setCustomerName(currentUser.displayName);
    }
    if (currentUser?.phoneNumber && !phone) {
      setPhone(currentUser.phoneNumber);
    }
  }, [currentUser]);

  if (!isOpen || !product) return null;

  const deliveryFee = city === 'Dhaka' ? 60 : 120;
  const subtotal = product.price * quantity;
  const total = subtotal + deliveryFee;

  const handleCreateOrder = (sendWhatsApp: boolean) => {
    if (!product.inStock) {
      alert('দুঃখিত, এই পণ্যটির স্টক শেষ। নতুন অর্ডার গ্রহণ বন্ধ রয়েছে।');
      return;
    }
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    const orderId = `ZB-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNo = `STDF-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName,
      phone,
      address,
      city,
      items: [{ product, quantity }],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'Cash on Delivery',
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      trackingNumber: trackingNo,
      notes: notes || undefined,
    };

    onOrderCreated(newOrder);
    saveOrderToFirestore(newOrder);
    setConfirmedOrderId(orderId);
    setIsSuccess(true);

    if (sendWhatsApp) {
      const message = `Hello Zenmart BD! I would like to order:
📦 *Product:* ${product.name}
🔢 *SKU:* ${product.sku}
📊 *Quantity:* ${quantity}
💰 *Total Amount:* ৳${total.toLocaleString()} (incl. ৳${deliveryFee} ${city} delivery)
👤 *Name:* ${customerName}
📞 *Phone:* ${phone}
📍 *Address:* ${address}, ${city}
📝 *Note:* ${notes || 'None'}
Payment: Cash on Delivery (Inspection upon delivery)`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/8801831446111?text=${encoded}`, '_blank');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setQuantity(1);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Instant WhatsApp Order
              </h3>
              <p className="text-xs text-[#76777d]">
                Fast delivery with Cash on Delivery all over Bangladesh
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-[#111827]">
                  Order Placed Successfully!
                </h4>
                <p className="text-xs text-slate-600">
                  Order Reference: <strong className="font-mono text-emerald-700">{confirmedOrderId}</strong>
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto pt-2">
                  Our Dhaka dispatch team has received your order. We will call you at <strong>{phone}</strong> to confirm dispatch.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Item:</span>
                  <span className="font-semibold text-slate-800">{product.name} (x{quantity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Payable:</span>
                  <span className="font-bold text-emerald-700 font-mono">৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="text-slate-800 font-medium">Cash on Delivery</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#111827] text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Done & Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product Preview Card */}
              <div className="flex gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0 ${!product.inStock ? 'opacity-70 grayscale-[20%]' : ''}`}
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      {!product.inStock && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded">
                          স্টক শেষ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {product.brandSeries}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-extrabold text-[#059669] font-mono">
                      ৳{product.price.toLocaleString()}
                    </span>

                    {/* Quantity Selector */}
                    <div className={`flex items-center border border-slate-300 rounded-lg overflow-hidden text-xs ${product.inStock ? 'bg-white' : 'bg-slate-100 opacity-60'}`}>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-0.5 hover:bg-slate-100 text-slate-700 font-bold disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold tabular-nums min-w-[24px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-0.5 hover:bg-slate-100 text-slate-700 font-bold disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Out of stock alert message */}
              {!product.inStock && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>দুঃখিত, এই পণ্যটির স্টক বর্তমানে শেষ। নতুন স্টক আসার পূর্বে অর্ডার গ্রহণ বন্ধ রাখা হয়েছে।</span>
                </div>
              )}

              {/* Delivery Details Form */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number (Active for courier call) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712-345678"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Region
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCity('Dhaka')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        city === 'Dhaka'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Inside Dhaka (24h)</span>
                      <span className="font-mono text-[11px] font-bold">৳60</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCity('Outside Dhaka')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        city === 'Outside Dhaka'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Outside Dhaka</span>
                      <span className="font-mono text-[11px] font-bold">৳120</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, Road, Area, District/Thana..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Order Total Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Product Subtotal ({quantity} item):</span>
                  <span className="font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Courier Delivery ({city}):</span>
                  <span className="font-mono">৳{deliveryFee}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-[#111827]">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600 font-mono text-base">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Cash on Delivery
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  Fast Express Dispatch
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {product.inStock ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCreateOrder(true)}
                      className="w-full h-11 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] hover:shadow-[0_4px_14px_rgba(37,211,102,0.35)] transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                      <span>Send Order to WhatsApp (+880 1831-446111)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCreateOrder(false)}
                      className="w-full h-10 rounded-full bg-[#111827] text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                    >
                      Place Order Directly with Cash on Delivery
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full h-11 rounded-full bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200 cursor-not-allowed select-none flex items-center justify-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>স্টক শেষ — অর্ডার সম্পন্ন করা সম্ভব নয়</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
