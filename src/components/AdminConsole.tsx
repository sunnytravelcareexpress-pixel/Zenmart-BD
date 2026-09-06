import React, { useState, useEffect } from 'react';
import {
  Store,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowLeft,
  Plus,
  Check,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Truck,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Send,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Shield,
  LogIn,
  LogOut,
  CheckCircle2,
  KeyRound,
  UserX,
  Upload,
  Image as ImageIcon,
  Star,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Phone,
  User,
  X
} from 'lucide-react';
import { ZenmartLogo } from './ZenmartLogo';
import {
  Product,
  Order,
  OrderStatus,
  ChatMessage,
  AppUser,
  isAuthorizedAdmin
} from '../types';
import {
  sendChatMessageToFirestore,
  subscribeToAllChatSessions,
  clearChatHistory,
  ChatSessionItem
} from '../firebase';

interface AdminConsoleProps {
  products: Product[];
  orders: Order[];
  onClose: () => void;
  onUpdateProductStock: (productId: string, inStock: boolean) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  onSetFeaturedProduct?: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  currentUser: AppUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  products,
  orders,
  onClose,
  onUpdateProductStock,
  onUpdateProductPrice,
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onSetFeaturedProduct,
  onDeleteProduct,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'metrics' | 'chats'>('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Live Firebase Chat Sessions state
  const [chatSessions, setChatSessions] = useState<ChatSessionItem[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<'selected' | 'all' | null>(null);
  const adminChatScrollRef = React.useRef<HTMLDivElement | null>(null);

  // Edit Product Modal & Featured Picker Modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showSelectFeaturedModal, setShowSelectFeaturedModal] = useState(false);

  // Check admin authorization
  const isAdminAuthorized = isAuthorizedAdmin(currentUser?.email);

  useEffect(() => {
    // Only subscribe to live Firebase chat if the user is an authorized admin
    if (!isAdminAuthorized) return;

    const unsubscribe = subscribeToAllChatSessions((sessions) => {
      setChatSessions(sessions);
      if (sessions.length > 0) {
        setSelectedSessionId((prev) => {
          if (prev && sessions.some((s) => s.sessionId === prev)) {
            return prev;
          }
          return sessions[0].sessionId;
        });
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAdminAuthorized]);

  useEffect(() => {
    if (activeTab === 'chats') {
      adminChatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, selectedSessionId, chatSessions]);

  // If the user is NOT an authorized administrator, render the strict Security Lock Gate
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between font-['Inter',_'Hind_Siliguri',_sans-serif] relative overflow-hidden">
        {/* Glow ambient decorations */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand header */}
        <header className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between z-10 backdrop-blur-md">
          <ZenmartLogo variant="light" size="sm" />
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান (Back to Store)</span>
          </button>
        </header>

        {/* Center security lock card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
          <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
            {/* Lock Icon badge */}
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
              <Lock className="w-10 h-10 animate-pulse" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30">
                <Shield className="w-3 h-3 text-rose-400" />
                <span>RESTRICTED ADMIN PORTAL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                অ্যাডমিন প্যানেল সুরক্ষিত ও লক করা
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                নিরাপত্তার স্বার্থে Zenmart BD অ্যাডমিন প্যানেলটি সম্পূর্ণ লক করা। শুধুমাত্র অনুমোদিত অ্যাডমিন ইমেইল দিয়ে লগ ইন করলেই এই প্যানেল এক্সেস করা যাবে।
              </p>
            </div>

            {/* Security Notice Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-left space-y-2.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  অ্যাডমিন প্রটেকশন সিকিউরিটি
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                এই কন্ট্রোল প্যানেল শুধুমাত্র জেনমার্ট বিডি-র ভেরিফাইড অ্যাডমিনিস্ট্রেটর অ্যাকাউন্টের জন্য এক্সেসযোগ্য। সাধারণ ভিজিটর বা কাস্টমার এই প্যানেল পরিচালনা করতে পারবেন না।
              </p>
            </div>

            {/* Current user status box */}
            <div className="text-xs pt-1">
              {currentUser ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-left space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <UserX className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>বর্তমান লগইন একাউন্ট:</span>
                  </div>
                  <p className="font-mono text-xs text-white font-semibold break-all pl-6">
                    {currentUser.email || currentUser.phoneNumber || 'গেস্ট ব্যবহারকারী'}
                  </p>
                  <p className="text-[11px] text-rose-300 pl-6">
                    ⛔ এই ইমেইলটি অ্যাডমিন হিসেবে অনুমোদিত নয়। অনুগ্রহ করে অনুমোদিত অ্যাডমিন ইমেইল দিয়ে লগ ইন করুন।
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>আপনি বর্তমানে লগ ইন নেই। অ্যাডমিন প্যানেল খুলতে অনুমোদিত ইমেইল দিয়ে লগ ইন করুন।</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              {currentUser ? (
                <button
                  onClick={async () => {
                    await onLogout();
                    onOpenLogin();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগ আউট করে অ্যাডমিন ইমেইল দিয়ে লগ ইন করুন</span>
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>অনুমোদিত অ্যাডমিন হিসেবে লগ ইন করুন (Admin Login)</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors border border-white/10"
              >
                মূল ওয়েবসাইটে ফিরে যান
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500 z-10">
          Zenmart BD Enterprise Security Shield • Role-Based Access Control Enforced
        </footer>
      </div>
    );
  }

  // Active chat session
  const activeSession = chatSessions.find((s) => s.sessionId === selectedSessionId) || chatSessions[0] || null;

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const reply = adminReplyText.trim();
    if (!reply || !activeSession) return;

    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localId = `admin-reply-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: localId,
      sessionId: activeSession.sessionId,
      sender: 'support',
      senderName: 'Admin Support (Dhaka Hub)',
      text: reply,
      timestamp: replyTime,
      createdAt: Date.now(),
    };

    // 1. Optimistically update local session messages so Admin sees it immediately!
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.sessionId === activeSession.sessionId) {
          return {
            ...s,
            lastMessage: reply,
            lastTimestamp: replyTime,
            updatedAt: Date.now(),
            lastSender: 'support',
            messages: [...s.messages, newMsg],
          };
        }
        return s;
      })
    );
    setAdminReplyText('');
    setIsSendingReply(true);

    try {
      await sendChatMessageToFirestore({
        sessionId: activeSession.sessionId,
        sender: 'support',
        senderName: 'Admin Support (Dhaka Hub)',
        text: reply,
      });
    } catch (err) {
      console.warn('[Admin Reply] Error sending reply to Firebase:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleCreateTestChatSession = async () => {
    const testSessionId = `visitor_test_${Date.now().toString().slice(-4)}`;
    try {
      await sendChatMessageToFirestore({
        sessionId: testSessionId,
        sender: 'user',
        senderName: 'Tanvir Ahmed (Customer)',
        senderPhone: '01711223344',
        text: 'আসসালামু আলাইকুম, এই গ্যাজেটের ডেলিভারি কি ঢাকা সিটিতে ২৪ ঘণ্টার মধ্যে সম্ভব?',
      });
      setSelectedSessionId(testSessionId);
    } catch (e) {
      console.warn('Failed to create test session:', e);
    }
  };

  const handleClearSelectedSession = async () => {
    if (!selectedSessionId) return;
    setIsClearingChat(true);
    await clearChatHistory(selectedSessionId);
    setShowClearConfirmModal(null);
    setIsClearingChat(false);
    const remaining = chatSessions.filter((s) => s.sessionId !== selectedSessionId);
    setSelectedSessionId(remaining[0]?.sessionId || null);
  };

  const handleClearAllHistory = async () => {
    setIsClearingChat(true);
    await clearChatHistory();
    setShowClearConfirmModal(null);
    setIsClearingChat(false);
    setSelectedSessionId(null);
  };

  // Image file upload handler (converts device photo to base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('ছবির আকার ৮ মেগাবাইটের বেশি হতে পারবে না। অনুগ্রহ করে ছোট ছবি দিন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        if (target === 'add') {
          setNewProdImage(result);
        } else if (editingProduct) {
          setEditingProduct({ ...editingProduct, image: result });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'gadgets' | 'home-decor' | 'desk-setup' | 'ambient-lighting'>('gadgets');
  const [newProdPrice, setNewProdPrice] = useState(2500);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(3000);
  const [newProdBrand, setNewProdBrand] = useState('PRO WORKSPACE');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80');
  const [newProdIsFeatured, setNewProdIsFeatured] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  // Computed metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const inStockProductsCount = products.filter((p) => p.inStock).length;
  const currentFeaturedProduct = products.find((p) => p.featured) || products[0];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSavePrice = (productId: string) => {
    if (tempPrice > 0) {
      onUpdateProductPrice(productId, tempPrice);
    }
    setEditingPriceId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const discount = Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100);
    const categoryLabels: { [key: string]: string } = {
      gadgets: 'Gadgets',
      'home-decor': 'Home Decor',
      'desk-setup': 'Desk Setup',
      'ambient-lighting': 'Ambient Lighting',
    };

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: `ZM-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: newProdName,
      subtitle: newProdSubtitle || 'Curated premium addition for modern interiors',
      tagline: 'Authentic Minimalist Craftsmanship',
      category: newProdCategory,
      categoryLabel: categoryLabels[newProdCategory] || 'Gadgets',
      brandSeries: newProdBrand,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      discountPercent: Math.max(0, discount),
      badge: discount > 0 ? `-${discount}%` : 'NEW ARRIVAL',
      image: newProdImage,
      stockCount: 20,
      inStock: true,
      featured: newProdIsFeatured,
      rating: 5.0,
      reviewCount: 1,
      specs: { 'Material': 'Alloy & Polycarbonate', 'Origin': 'Dhaka Stock' },
      features: ['Genuine verified warranty', 'Fast Cash on Delivery support'],
      description: 'Official stock from Zenmart BD fulfillment hub.',
    };

    onAddProduct(newProduct);
    if (newProdIsFeatured && onSetFeaturedProduct) {
      onSetFeaturedProduct(newProduct.id);
    }

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdSubtitle('');
    setNewProdIsFeatured(false);
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    const discount = Math.round(
      ((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100
    );
    const updated: Product = {
      ...editingProduct,
      discountPercent: Math.max(0, discount),
      badge: discount > 0 ? `-${discount}%` : editingProduct.badge,
    };

    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    if (updated.featured && onSetFeaturedProduct) {
      onSetFeaturedProduct(updated.id);
    }
    setEditingProduct(null);
  };

  const handleMakeFeatured = (productId: string) => {
    if (onSetFeaturedProduct) {
      onSetFeaturedProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col md:flex-row text-[#191c1e] font-['Inter',_sans-serif]">
      {/* Fixed Left-Hand Utility Navigation (260px) as mandated by design spec */}
      <aside className="w-full md:w-[260px] bg-[#111827] text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <ZenmartLogo variant="light" size="sm" />
          </div>

          <div className="p-3">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Fulfillment Console
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="flex-1 text-left">Orders & COD</span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'inventory'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="flex-1 text-left">Product Inventory</span>
                <span className="text-[11px] text-slate-400">{products.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('metrics')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'metrics'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="flex-1 text-left">Store Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('chats')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'chats'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="flex-1 text-left">Customer Chats (Firebase)</span>
                {chatSessions.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-900">
                    {chatSessions.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Back to Store action */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Connected</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">zenmart-bd (Firestore)</p>
          </div>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Full-Bleed Content Canvas */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#e5e7eb] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#111827]">
              {activeTab === 'orders' && 'Order Management & Dispatch (COD)'}
              {activeTab === 'inventory' && 'Inventory Catalog & Pricing'}
              {activeTab === 'metrics' && 'Performance & Financial Overview'}
              {activeTab === 'chats' && 'Customer Inquiries & Live Chat (Firebase)'}
            </h1>
            <p className="text-xs text-[#76777d]">
              Live sync with Firebase Firestore database (Project: zenmart-bd)
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Admin identity badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block leading-none">
                  Verified Admin
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-900 block truncate max-w-[200px]">
                  {currentUser?.email}
                </span>
              </div>
            </div>

            {activeTab === 'inventory' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111827] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Exit Console
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="লগ আউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-6 space-y-6">
          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#e5e7eb] shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Orders Value
              </span>
              <span className="text-xl font-extrabold text-[#059669] font-mono tabular-nums mt-1 block">
                ৳{totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">{orders.length} total shipments</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#e5e7eb] shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Pending Verification
              </span>
              <span className="text-xl font-extrabold text-amber-600 font-mono tabular-nums mt-1 block">
                {pendingCount}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Requires phone call</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#e5e7eb] shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                In Courier Transit
              </span>
              <span className="text-xl font-extrabold text-blue-600 font-mono tabular-nums mt-1 block">
                {shippedCount}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">With Steadfast & Paperfly</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#e5e7eb] shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Live SKUs in Hub
              </span>
              <span className="text-xl font-extrabold text-[#111827] font-mono tabular-nums mt-1 block">
                {inStockProductsCount} / {products.length}
              </span>
              <span className="text-[10px] text-emerald-600 mt-1 block font-medium">Ready for 24h dispatch</span>
            </div>
          </div>

          {/* TAB 1: ORDERS TABLE */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden">
              {/* Filter controls */}
              <div className="p-4 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 bg-[#fafafa]">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Customer, Phone..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Data Table adhering strictly to design guidelines:
                  Header: #F9FAFB background, uppercase label-sm text with subtle #E5E7EB bottom separation border.
                  Rows: Background #FFFFFF, cell height 56px, hovering row background #F9FAFB.
                  Numbers and BDT prices: Right-aligned, utilizing tabular font features.
              */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Address / City</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4 text-right">Amount (BDT)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-[#FFFFFF]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No orders match the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="h-14 hover:bg-[#F9FAFB] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {order.id}
                            <span className="block text-[10px] text-slate-400 font-sans font-normal">{order.createdAt}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">{order.customerName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{order.phone}</span>
                          </td>
                          <td className="py-3 px-4 max-w-[200px]">
                            <span className="text-slate-700 truncate block" title={order.address}>{order.address}</span>
                            <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              {order.city} (৳{order.deliveryFee})
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-700 font-medium">
                              {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm tabular-nums">
                            ৳{order.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'processing'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 font-semibold focus:outline-none focus:border-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY CATALOG TABLE & FEATURED SPECIAL MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* FEATURED DAILY SPECIAL MANAGEMENT BANNER */}
              <div className="bg-gradient-to-r from-[#111827] via-[#1a2234] to-[#111827] rounded-2xl p-5 sm:p-6 border border-amber-500/30 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-900 flex-shrink-0 shadow-md">
                      <img
                        src={currentFeaturedProduct.image}
                        alt={currentFeaturedProduct.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] flex items-center gap-1 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        SPECIAL
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          FEATURED DAILY SPECIAL (হোমপেজ স্পেশাল অফার)
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">({currentFeaturedProduct.sku})</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                        {currentFeaturedProduct.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-1 max-w-xl">
                        {currentFeaturedProduct.subtitle}
                      </p>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-base font-extrabold text-emerald-400 font-mono">
                          ৳{currentFeaturedProduct.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ৳{currentFeaturedProduct.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-amber-400">
                          (-{currentFeaturedProduct.discountPercent}%)
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          currentFeaturedProduct.inStock ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {currentFeaturedProduct.inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowSelectFeaturedModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>অন্য প্রোডাক্ট স্পেশাল বানান</span>
                    </button>
                    <button
                      onClick={() => setEditingProduct(currentFeaturedProduct)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                      <span>এডিট ও ছবি পরিবর্তন</span>
                    </button>
                    <button
                      onClick={() => {
                        setNewProdIsFeatured(true);
                        setShowAddProductModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন স্পেশাল পণ্য যোগ করুন</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Inventory Table */}
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fafafa]">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Product Master Catalog ({products.length} Products)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Click prices to edit directly; toggle stock status to update storefront availability.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Daily Special</th>
                        <th className="py-3 px-4 text-right">Selling Price (BDT)</th>
                        <th className="py-3 px-4 text-right">Stock Units</th>
                        <th className="py-3 px-4">Storefront Status</th>
                        <th className="py-3 px-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] bg-[#FFFFFF]">
                      {products.map((prod) => (
                        <tr key={prod.id} className="h-14 hover:bg-[#F9FAFB] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <span className="font-semibold text-slate-900 line-clamp-1">{prod.name}</span>
                                <span className="text-[10px] text-slate-400 block">{prod.brandSeries}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                            {prod.sku}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded">
                              {prod.categoryLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {prod.featured ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                Active Special
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMakeFeatured(prod.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-600 hover:text-amber-800 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-colors"
                                title="Set this product as Featured Daily Special"
                              >
                                <Star className="w-3 h-3 text-slate-400 hover:text-amber-500" />
                                Make Special
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {editingPriceId === prod.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(Number(e.target.value))}
                                  className="w-20 px-1.5 py-1 text-xs border border-blue-500 rounded font-mono text-right"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSavePrice(prod.id)}
                                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingPriceId(prod.id);
                                  setTempPrice(prod.price);
                                }}
                                className="font-mono font-bold text-emerald-700 text-sm hover:underline tabular-nums"
                                title="Click to edit price"
                              >
                                ৳{prod.price.toLocaleString()}
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">
                            {prod.stockCount}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onUpdateProductStock(prod.id, !prod.inStock)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                prod.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {prod.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingProduct(prod)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                                title="Edit Product Details & Photo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(prod)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                title="Delete / Remove Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORE METRICS */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Dhaka Fulfillment Performance
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Same-Day Dhaka Express Orders:</span>
                    <span className="font-bold text-slate-800">84%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Cash on Delivery Collection Rate:</span>
                    <span className="font-bold text-emerald-600">98.2%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Return / Replacement Rate:</span>
                    <span className="font-bold text-slate-800">1.8% (Target &lt; 3%)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Courier Partner:</span>
                    <span className="font-bold text-slate-800">Steadfast & Paperfly API</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Regional Customer Breakdown
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Dhaka Metropolitan Area:</span>
                    <span className="font-mono font-bold text-slate-800">65% of orders (৳60 delivery)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Chattogram & Sylhet Hubs:</span>
                    <span className="font-mono font-bold text-slate-800">22% of orders (৳120 delivery)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Rajshahi & Other Divisions:</span>
                    <span className="font-mono font-bold text-slate-800">13% of orders</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">WhatsApp Commerce Conversion:</span>
                    <span className="font-bold text-emerald-600">42% via Direct WhatsApp CTA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE CUSTOMER CHATS & INQUIRIES (FIREBASE - ISOLATED SESSIONS) */}
          {activeTab === 'chats' && (
            <div className="space-y-6">
              {/* Header card with Firebase status & Clear All option */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      Live Customer Chats & Inquiries (কাস্টমার লাইভ সাপোর্ট)
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Session-Isolated Realtime Chat
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    প্রতিটি গ্রাহকের মেসেজ সম্পূর্ণ আলাদা এবং সুরক্ষিত সেশনে সংরক্ষিত থাকে। একজন গ্রাহকের মেসেজ অন্য কেউ দেখতে পায় না।
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] text-slate-400">Total Conversations</p>
                    <p className="text-base font-bold font-mono text-slate-900">{chatSessions.length} Visitors</p>
                  </div>
                  {chatSessions.length > 0 && (
                    <button
                      onClick={() => setShowClearConfirmModal('all')}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center gap-1.5 transition-colors"
                      title="সকল চ্যাট হিস্ট্রি মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>সকল চ্যাট মুছুন (Clear All)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Split Layout: Left Sessions List, Right Conversation Stream */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
                {/* Left: Customer Conversations List */}
                <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
                  <div className="p-3.5 border-b border-slate-200 bg-white">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        placeholder="গ্রাহকের নাম বা ফোন দিয়ে খুঁজুন..."
                        className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {chatSessions.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 space-y-3">
                        <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">কোন সক্রিয় চ্যাট নেই</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          ওয়েবসাইটে ভিজিটররা লাইভ চ্যাট উইজেটে মেসেজ করলে এখানে আলাদা সেশন হিসেবে আসবে।
                        </p>
                        <button
                          type="button"
                          onClick={handleCreateTestChatSession}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>টেস্ট চ্যাট সেশন তৈরি করুন</span>
                        </button>
                      </div>
                    ) : (
                      chatSessions
                        .filter((session) => {
                          const query = (chatSearch || '').toLowerCase().trim();
                          if (!query) return true;
                          const name = (session.userName || session.senderName || '').toLowerCase();
                          const phone = (session.userPhone || session.senderPhone || '').toLowerCase();
                          const sid = (session.sessionId || '').toLowerCase();
                          const last = (session.lastMessage || '').toLowerCase();
                          return name.includes(query) || phone.includes(query) || sid.includes(query) || last.includes(query);
                        })
                        .map((session) => {
                          const isSelected = activeSession?.sessionId === session.sessionId;
                          const displayName = session.userName || session.senderName || 'Visitor';
                          const displayPhone = session.userPhone || session.senderPhone || '';
                          return (
                            <button
                              key={session.sessionId}
                              onClick={() => setSelectedSessionId(session.sessionId)}
                              className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                                isSelected
                                  ? 'bg-blue-50/80 border-l-4 border-blue-600'
                                  : 'hover:bg-slate-100/70'
                              }`}
                            >
                              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                <User className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {displayName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                                    {session.lastTimestamp}
                                  </span>
                                </div>
                                {displayPhone && (
                                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                                    <Phone className="w-3 h-3" />
                                    <span>{displayPhone}</span>
                                  </div>
                                )}
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                  {session.lastMessage || 'No messages'}
                                </p>
                              </div>
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 flex-shrink-0">
                                {session.messages?.length || 0}
                              </span>
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Right: Active Conversation Thread */}
                <div className="lg:col-span-8 flex flex-col h-[560px] bg-white">
                  {activeSession ? (
                    <>
                      {/* Active Session Header */}
                      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {activeSession.userName || activeSession.senderName || 'Customer'}
                              </span>
                              {(activeSession.userPhone || activeSession.senderPhone) && (
                                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  📞 {activeSession.userPhone || activeSession.senderPhone}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Session: {activeSession.sessionId}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowClearConfirmModal('selected')}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5 transition-colors"
                            title="এই ইউজারের চ্যাট হিস্ট্রি মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>এই চ্যাট মুছুন (Clear History)</span>
                          </button>
                        </div>
                      </div>

                      {/* Messages Feed */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbfcfd]">
                        {!activeSession.messages || activeSession.messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                            <MessageSquare className="w-8 h-8 mb-2 text-slate-300" />
                            <p className="text-xs font-semibold text-slate-600">কোন মেসেজ রেকর্ড পাওয়া যায়নি</p>
                          </div>
                        ) : (
                          activeSession.messages.map((msg) => {
                            const isSupport = msg.sender === 'support' || msg.sender === 'bot';
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}
                              >
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1 px-1">
                                  <span className="font-bold text-slate-700">
                                    {msg.senderName}
                                  </span>
                                  {msg.senderPhone && (
                                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                                      📞 {msg.senderPhone}
                                    </span>
                                  )}
                                  <span>• {msg.timestamp}</span>
                                </div>
                                <div
                                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                    isSupport
                                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={adminChatScrollRef} />
                      </div>

                      {/* Admin reply form */}
                      <form
                        onSubmit={handleSendAdminReply}
                        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          placeholder={`${activeSession.userName || activeSession.senderName || 'গ্রাহক'}-কে উত্তর দিন...`}
                          className="flex-1 h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                        />
                        <button
                          type="submit"
                          disabled={!adminReplyText.trim() || isSendingReply}
                          className="h-10 px-4 bg-[#111827] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSendingReply ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>{isSendingReply ? 'পাঠানো হচ্ছে...' : 'উত্তর পাঠান (Send)'}</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-700">কোন কথোপকথন নির্বাচন করা হয়নি</p>
                      <p className="text-xs text-slate-400 mt-1">বাম পাশের তালিকা থেকে একটি গ্রাহকের চ্যাট সিলেক্ট করুন।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: Add Product Modal (With Device File Upload & Featured Special Option) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Product to Catalog</h3>
                  <p className="text-[11px] text-slate-500">নতুন পণ্য ক্যাটালগে যুক্ত করুন</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setNewProdIsFeatured(false);
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title (পণ্যের নাম) *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Minimalist Aluminum MagSafe Charging Dock"
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category (ক্যাটেগরি)</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full h-9 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="gadgets">Gadgets</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="desk-setup">Desk Setup</option>
                    <option value="ambient-lighting">Ambient Lighting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Series (ব্র্যান্ড/সিরিজ)</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. PRO WORKSPACE"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (বিক্রয় মূল্য ৳) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original / MRP (পূর্বের মূল্য ৳)</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Feature Summary (সংক্ষিপ্ত বিবরণ)</label>
                <input
                  type="text"
                  value={newProdSubtitle}
                  onChange={(e) => setNewProdSubtitle(e.target.value)}
                  placeholder="e.g. High precision aerospace alloy with anti-slip silicone feet"
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg"
                />
              </div>

              {/* DEVICE FILE UPLOAD ZONE */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Image (ডিভাইস থেকে ছবি আপলোড করুন) *
                </label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors">
                    {newProdImage ? (
                      <img
                        src={newProdImage}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 shadow-xs flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস থেকে ছবি বাছুন (Upload File)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'add')}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1">
                        JPG, PNG, WebP ফরম্যাট সমর্থিত (সর্বোচ্চ ৮ মেগাবাইট)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <button
                      type="button"
                      onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {showImageUrlInput ? 'ওয়েব লিংক ইনপুট লুকান' : 'অথবা ছবির ওয়েব URL লিংক ব্যবহার করুন'}
                    </button>
                  </div>

                  {showImageUrlInput && (
                    <input
                      type="url"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono text-[11px]"
                    />
                  )}
                </div>
              </div>

              {/* Set as Featured Daily Special Checkbox */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="add-as-featured"
                  checked={newProdIsFeatured}
                  onChange={(e) => setNewProdIsFeatured(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="add-as-featured" className="cursor-pointer select-none">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    Set as Featured Daily Special (হোমপেজ স্পেশাল অফার বানান)
                  </span>
                  <span className="text-[11px] text-amber-800/80 block mt-0.5">
                    এই পণ্যটিকে সাথে সাথে ওয়েবসাইটের মূল হিরো সেকশনে প্রধান স্পেশাল ডিল হিসেবে প্রদর্শন করা হবে।
                  </span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductModal(false);
                    setNewProdIsFeatured(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111827] text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  পণ্য সংরক্ষণ করুন (Save Product)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Product Modal (With Device File Upload & Featured Special Option) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Product: {editingProduct.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">পণ্যের বিবরণ ও ছবি পরিবর্তন করুন</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title (পণ্যের নাম) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category (ক্যাটেগরি)</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      const labels: Record<string, string> = {
                        gadgets: 'Gadgets',
                        'home-decor': 'Home Decor',
                        'desk-setup': 'Desk Setup',
                        'ambient-lighting': 'Ambient Lighting',
                      };
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        categoryLabel: labels[cat] || 'Gadgets',
                      });
                    }}
                    className="w-full h-9 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="gadgets">Gadgets</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="desk-setup">Desk Setup</option>
                    <option value="ambient-lighting">Ambient Lighting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Series (ব্র্যান্ড/সিরিজ)</label>
                  <input
                    type="text"
                    value={editingProduct.brandSeries}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brandSeries: e.target.value })}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (বিক্রয় মূল্য ৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original / MRP (পূর্বের মূল্য ৳)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Feature Summary (সংক্ষিপ্ত বিবরণ)</label>
                <input
                  type="text"
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg"
                />
              </div>

              {/* DEVICE FILE UPLOAD ZONE FOR EDIT */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Image (ডিভাইস থেকে নতুন ছবি আপলোড করুন) *
                </label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors">
                    <img
                      src={editingProduct.image}
                      alt={editingProduct.name}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shadow-xs flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস থেকে নতুন ছবি দিন (Change Image)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'edit')}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1">
                        গ্যালারি বা কম্পিউটার থেকে সরাসরি ছবি আপলোড করুন
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <button
                      type="button"
                      onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {showImageUrlInput ? 'ওয়েব লিংক ইনপুট লুকান' : 'অথবা ছবির ওয়েব URL লিংক পরিবর্তন করুন'}
                    </button>
                  </div>

                  {showImageUrlInput && (
                    <input
                      type="url"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg font-mono text-[11px]"
                    />
                  )}
                </div>
              </div>

              {/* Set as Featured Daily Special Checkbox in Edit Modal */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="edit-is-featured"
                  checked={!!editingProduct.featured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="edit-is-featured" className="cursor-pointer select-none">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    Set as Featured Daily Special (হোমপেজ ফিচার্ড স্পেশাল অফার)
                  </span>
                  <span className="text-[11px] text-amber-800/80 block mt-0.5">
                    এই পণ্যটিকে হোমপেজের প্রধান স্পেশাল কার্ডে প্রদর্শন করার জন্য টিক দিন।
                  </span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  আপডেট সংরক্ষণ করুন (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Select Featured Special Product Modal */}
      {showSelectFeaturedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Select Featured Daily Special Product
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    যেকোনো প্রোডাক্টকে হোমপেজ ফিচার্ড ডেইলি স্পেশাল হিসেবে নির্বাচন করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSelectFeaturedModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-[480px] overflow-y-auto divide-y divide-slate-100">
              {products.map((p) => {
                const isCurrent = p.id === currentFeaturedProduct.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 flex items-center justify-between gap-4 rounded-xl transition-colors ${
                      isCurrent ? 'bg-amber-50/70 border border-amber-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> CURRENT SPECIAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{p.subtitle}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <span className="font-bold text-emerald-600 font-mono">৳{p.price.toLocaleString()}</span>
                          <span className="text-slate-400 line-through text-[11px] font-mono">৳{p.originalPrice.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isCurrent ? (
                        <span className="text-xs font-bold text-amber-700 px-3 py-1.5 bg-amber-100 rounded-lg">
                          ইতিমধ্যে স্পেশাল
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            handleMakeFeatured(p.id);
                            setShowSelectFeaturedModal(false);
                          }}
                          className="px-3.5 py-1.5 bg-[#111827] hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>স্পেশাল বানান</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSelectFeaturedModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Clear Chat Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-2.5 rounded-full bg-rose-100">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {showClearConfirmModal === 'all'
                    ? 'সকল চ্যাট হিস্ট্রি মুছে ফেলার নিশ্চিতকরণ'
                    : 'এই গ্রাহকের চ্যাট হিস্ট্রি মুছে ফেলার নিশ্চিতকরণ'}
                </h3>
                <p className="text-xs text-slate-500">
                  {showClearConfirmModal === 'all'
                    ? 'Clear All Support Chat History'
                    : 'Clear Selected Customer Chat History'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {showClearConfirmModal === 'all'
                ? 'আপনি কি নিশ্চিত যে আপনি সকল গ্রাহকের পূর্ববর্তী চ্যাট হিস্ট্রি Firebase থেকে স্থায়ীভাবে মুছে ফেলতে চান? এটি মুছে ফেললে আর উদ্ধার করা সম্ভব হবে না।'
                : `আপনি কি নিশ্চিত যে আপনি ${activeSession?.senderName || 'এই গ্রাহকের'} সকল চ্যাট হিস্ট্রি Firebase থেকে স্থায়ীভাবে মুছে ফেলতে চান?`}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isClearingChat}
                onClick={() => setShowClearConfirmModal(null)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                বাতিল করুন (Cancel)
              </button>
              <button
                type="button"
                disabled={isClearingChat}
                onClick={() => {
                  if (showClearConfirmModal === 'all') {
                    handleClearAllHistory();
                  } else {
                    handleClearSelectedSession();
                  }
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                {isClearingChat ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>হ্যাঁ, মুছে ফেলুন (Delete)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-2.5 rounded-full bg-rose-100">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  প্রোডাক্ট রিমুভ নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-slate-500">
                  Confirm Product Deletion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <img
                src={productToDelete.image}
                alt={productToDelete.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {productToDelete.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                  <span className="font-mono">{productToDelete.sku}</span>
                  <span>•</span>
                  <span className="font-bold text-emerald-700">৳{productToDelete.price.toLocaleString()}</span>
                  <span>•</span>
                  <span className={productToDelete.inStock ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                    {productToDelete.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              আপনি কি নিশ্চিত যে আপনি এই পণ্যটি ইনভেন্টরি থেকে মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট থেকে পণ্যটি স্থায়ীভাবে রিমুভ হয়ে যাবে।
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                বাতিল করুন (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
              >
                হ্যাঁ, রিমুভ করুন (Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
