import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Order, AppUser } from '../types';
import { saveOrderToFirestore } from '../firebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
  currentUser?: AppUser | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  currentUser,
}) => {
  const [city, setCity] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Checkout modal within cart
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [orderDone, setOrderDone] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  // Update fields if currentUser logs in
  React.useEffect(() => {
    if (currentUser?.displayName && !customerName) {
      setCustomerName(currentUser.displayName);
    }
    if (currentUser?.phoneNumber && !phone) {
      setPhone(currentUser.phoneNumber);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? (city === 'Dhaka' ? 60 : 120) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const hasOutOfStock = items.some((item) => !item.product.inStock);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ZENMART100') {
      setDiscount(100);
      setPromoMessage('৳100 discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'EID2025') {
      setDiscount(200);
      setPromoMessage('৳200 Eid Festival discount applied!');
    } else {
      setDiscount(0);
      setPromoMessage('Invalid coupon code.');
    }
  };

  const handleCheckout = (isWhatsApp: boolean) => {
    if (hasOutOfStock) {
      alert('আপনার কার্টে কিছু স্টক শেষ পণ্য রয়েছে। অনুগ্রহ করে সেগুলো রিমুভ করে অর্ডার সম্পন্ন করুন।');
      return;
    }
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, phone, and delivery address.');
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
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'Cash on Delivery',
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      trackingNumber: trackingNo,
    };

    onOrderCreated(newOrder);
    saveOrderToFirestore(newOrder);
    setLastOrderId(orderId);
    setOrderDone(true);
    onClearCart();

    if (isWhatsApp) {
      const itemSummaries = items
        .map((i) => `• ${i.product.name} (x${i.quantity}) - ৳${(i.product.price * i.quantity).toLocaleString()}`)
        .join('\n');

      const message = `Hello Zenmart BD! I want to order from my cart:
${itemSummaries}

💰 *Subtotal:* ৳${subtotal.toLocaleString()}
🚚 *Delivery:* ৳${deliveryFee} (${city})
🏷️ *Discount:* ৳${discount}
💵 *Grand Total:* ৳${total.toLocaleString()}

👤 *Name:* ${customerName}
📞 *Phone:* ${phone}
📍 *Address:* ${address}, ${city}
Payment: Cash on Delivery (Inspect upon arrival)`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/8801831446111?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#111827]" />
              <h3 className="font-bold text-base text-[#111827]">
                Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderDone ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  Cart Order Confirmed!
                </h4>
                <p className="text-xs text-slate-600">
                  Order ID: <span className="font-mono font-bold text-emerald-700">{lastOrderId}</span>
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your package is now being prepped at our Dhaka fulfillment center for Cash on Delivery.
                </p>
                <button
                  onClick={() => {
                    setOrderDone(false);
                    setShowCheckoutForm(false);
                    onClose();
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#111827] text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Continue Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Your cart is empty</p>
                <p className="text-xs text-slate-400">Discover premium tech gadgets and aesthetic decor above</p>
                <button
                  onClick={onClose}
                  className="mt-3 px-5 py-2 bg-[#111827] text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                >
                  Explore Catalog
                </button>
              </div>
            ) : showCheckoutForm ? (
              /* Fast Checkout Form inside Cart */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Delivery & Contact Information
                  </h4>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    ← Back to items
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sunny Rahman"
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (For courier delivery call) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01712-384910"
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Region
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCity('Dhaka')}
                        className={`p-2 rounded-lg border text-xs font-bold text-left flex justify-between ${
                          city === 'Dhaka'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>Dhaka</span>
                        <span>৳60</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCity('Outside Dhaka')}
                        className={`p-2 rounded-lg border text-xs font-bold text-left flex justify-between ${
                          city === 'Outside Dhaka'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>Outside</span>
                        <span>৳120</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Complete Shipping Address *
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, House, Sector/Thana, City..."
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Final Total Summary */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery ({city}):</span>
                    <span className="font-mono">৳{deliveryFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Voucher Discount:</span>
                      <span className="font-mono">-৳{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total (Pay on Delivery):</span>
                    <span className="text-emerald-700 font-mono text-base">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {hasOutOfStock ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold text-center">
                      কার্টের স্টক শেষ পণ্যগুলো রিমুভ করে পুনরায় চেষ্টা করুন।
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCheckout(true)}
                        className="w-full h-11 bg-[#25D366] text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                        <span>Order via WhatsApp (+880 1831-446111)</span>
                      </button>

                      <button
                        onClick={() => handleCheckout(false)}
                        className="w-full h-10 bg-[#111827] text-white rounded-full font-semibold text-xs hover:bg-slate-800 transition-colors"
                      >
                        Confirm Cash on Delivery Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Item List */
              <>
                {hasOutOfStock && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>কার্টের কিছু পণ্য স্টক শেষ হয়ে গেছে। অর্ডার সম্পন্ন করতে সেগুলো রিমুভ করুন।</span>
                  </div>
                )}

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className={`flex gap-3 p-2.5 rounded-xl border transition-colors ${
                        !item.product.inStock
                          ? 'border-rose-300 bg-rose-50/40'
                          : 'border-slate-100 bg-[#fbfcfd] hover:border-slate-200'
                      }`}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className={`w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200 ${
                          !item.product.inStock ? 'opacity-60 grayscale-[30%]' : ''
                        }`}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="text-xs font-bold text-[#111827] truncate">
                              {item.product.name}
                            </h4>
                            {!item.product.inStock && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                                স্টক শেষ (Out of Stock)
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#76777d] truncate">
                          {item.product.brandSeries}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-emerald-600 font-mono">
                            ৳{(item.product.price * item.quantity).toLocaleString()}
                          </span>

                          {/* Stepper */}
                          <div className={`flex items-center border border-slate-200 rounded-md ${item.product.inStock ? 'bg-white' : 'bg-slate-100 opacity-60'}`}>
                            <button
                              disabled={!item.product.inStock}
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="p-1 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              disabled={!item.product.inStock}
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="p-1 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Location Selector */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">Delivery Region</span>
                    <span className="text-[11px] text-emerald-700 font-medium">Cash on Delivery</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setCity('Dhaka')}
                      className={`p-2 rounded-lg border font-semibold flex justify-between ${
                        city === 'Dhaka'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>Inside Dhaka</span>
                      <span className="font-mono">৳60</span>
                    </button>
                    <button
                      onClick={() => setCity('Outside Dhaka')}
                      className={`p-2 rounded-lg border font-semibold flex justify-between ${
                        city === 'Outside Dhaka'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>Outside Dhaka</span>
                      <span className="font-mono">৳120</span>
                    </button>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-1">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Coupon (e.g. ZENMART100)"
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs uppercase placeholder:normal-case focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-3 h-9 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-[11px] mt-1 ${discount > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Checkout CTA */}
          {items.length > 0 && !showCheckoutForm && !orderDone && (
            <div className="p-5 border-t border-slate-100 bg-[#f8f9fb] space-y-3">
              <div className="space-y-1.5 text-xs text-[#45464c]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({city}):</span>
                  <span className="font-mono font-medium">৳{deliveryFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span className="font-mono">-৳{discount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-[#111827]">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600 font-mono text-base">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-1">
                {hasOutOfStock ? (
                  <button
                    disabled
                    className="w-full h-11 bg-slate-100 text-slate-400 rounded-full font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed select-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>স্টক শেষ পণ্য রিমুভ করুন</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="w-full h-11 bg-[#111827] text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
