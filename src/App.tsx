import React, { useState, useEffect, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CollectionHeader } from './components/CollectionHeader';
import { ProductCard } from './components/ProductCard';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminConsole } from './components/AdminConsole';
import { LiveChatWidget } from './components/LiveChatWidget';
import { AuthModal } from './components/AuthModal';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/products';
import { Product, CartItem, Order, CategoryId, OrderStatus, AppUser, isAuthorizedAdmin } from './types';
import {
  saveOrderToFirestore,
  subscribeToOrders,
  updateOrderStatusInFirestore,
  subscribeToProducts,
  seedProductsIfEmpty,
  updateProductStockInFirestore,
  updateProductPriceInFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  subscribeToAuth,
  logoutUser
} from './firebase';

export default function App() {
  // Products state (persisted)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zenmart_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state (persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zenmart_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Cart state (persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zenmart_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Pre-populate with 3 items as indicated by the "3" badge in the design screenshot
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 },
      { product: INITIAL_PRODUCTS[6], quantity: 1 },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('zenmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zenmart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zenmart_cart', JSON.stringify(cart));
  }, [cart]);

  // Real-time Firebase Firestore Sync
  useEffect(() => {
    // Seed catalog if not already in Firestore
    seedProductsIfEmpty(INITIAL_PRODUCTS);

    // Listen to real-time products
    const unsubscribeProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    // Listen to real-time orders
    const unsubscribeOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginMode, setIsAdminLoginMode] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setIsAdminView(false);
  };

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // UI Modals & Views
  const [isAdminView, setIsAdminView] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [whatsAppModalProduct, setWhatsAppModalProduct] = useState<Product | null>(null);

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) {
      alert('দুঃখিত, এই পণ্যটি বর্তমানে স্টক শেষ। অর্ডার গ্রহণ সম্ভব নয়।');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderCreated = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Save to Firebase Firestore database
    await saveOrderToFirestore(newOrder);
  };

  // Admin Actions with Firebase sync
  const handleUpdateProductStock = async (productId: string, inStock: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock } : p))
    );
    // Update modal if open
    setDetailProduct((prev) => (prev && prev.id === productId ? { ...prev, inStock } : prev));
    setWhatsAppModalProduct((prev) => (prev && prev.id === productId ? { ...prev, inStock } : prev));
    // Keep cart items in sync
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, inStock } }
          : item
      )
    );
    await updateProductStockInFirestore(productId, inStock);
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (detailProduct?.id === productId) {
      setDetailProduct(null);
    }
    if (whatsAppModalProduct?.id === productId) {
      setWhatsAppModalProduct(null);
    }
    await deleteProductFromFirestore(productId);
  };

  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const discount = Math.round(((p.originalPrice - newPrice) / p.originalPrice) * 100);
          return {
            ...p,
            price: newPrice,
            discountPercent: Math.max(0, discount),
          };
        }
        return p;
      })
    );
    await updateProductPriceInFirestore(productId, newPrice);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await updateOrderStatusInFirestore(orderId, status);
  };

  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    await saveProductToFirestore(newProduct);
  };

  // Open Direct WhatsApp hotline
  const handleOpenWhatsAppHelp = () => {
    const text = encodeURIComponent('Hello Zenmart BD! I would like to inquire about products & delivery.');
    window.open(`https://wa.me/8801831446111?text=${text}`, '_blank');
  };

  // Scroll to products section
  const handleScrollToCollection = () => {
    const el = document.getElementById('collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      gadgets: products.filter((p) => p.category === 'gadgets').length,
      'home-decor': products.filter((p) => p.category === 'home-decor').length,
      'desk-setup': products.filter((p) => p.category === 'desk-setup').length,
      'ambient-lighting': products.filter((p) => p.category === 'ambient-lighting').length,
    };
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandSeries.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const featuredProduct = products.find((p) => p.featured) || products[0];

  // If in Admin Console mode, display the full-bleed administrative workspace
  if (isAdminView) {
    return (
      <AdminConsole
        products={products}
        orders={orders}
        onClose={() => setIsAdminView(false)}
        onUpdateProductStock={handleUpdateProductStock}
        onUpdateProductPrice={handleUpdateProductPrice}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        currentUser={currentUser}
        onOpenLogin={() => {
          setIsAdminLoginMode(true);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] flex flex-col font-['Inter',_'Hind_Siliguri',_sans-serif]">
      {/* 1. Top Announcement Bar */}
      <TopBar
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenWhatsAppHelp={handleOpenWhatsAppHelp}
      />

      {/* 2. Main Sticky Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleScrollToCollection();
        }}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => setIsTrackOpen(true)}
        onOpenWhatsAppHelp={handleOpenWhatsAppHelp}
        user={currentUser}
        onOpenAuth={() => {
          setIsAdminLoginMode(false);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminView(true)}
      />

      {/* 3. Hero Section (matching Image 3) */}
      <HeroSection
        featuredProduct={featuredProduct}
        onExploreClick={handleScrollToCollection}
        onOpenAdmin={() => setIsAdminView(true)}
        isAdmin={isAuthorizedAdmin(currentUser?.email)}
        onBuyFeatured={(prod) => {
          if (!prod.inStock) {
            alert('দুঃখিত, এই পণ্যটির স্টক শেষ। অর্ডার গ্রহণ করা সম্ভব নয়।');
            return;
          }
          setWhatsAppModalProduct(prod);
        }}
        onOpenWhatsAppHelp={handleOpenWhatsAppHelp}
      />

      {/* 4. Main Product Catalog Section */}
      <main id="collection-section" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
        {/* Collection Filter, Status & Sort Bar */}
        <CollectionHeader
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showingCount={filteredProducts.length}
          totalCount={products.length}
        />

        {/* Product Cards Grid (4 columns on desktop, 2 on mobile) */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base font-semibold text-slate-700">
              No products found matching your search.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another term or view All categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 bg-[#111827] text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onWhatsAppOrder={(prod) => {
                  if (!prod.inStock) {
                    alert('দুঃখিত, এই পণ্যটির স্টক শেষ। অর্ডার গ্রহণ করা সম্ভব নয়।');
                    return;
                  }
                  setWhatsAppModalProduct(prod);
                }}
                onAddToCart={(prod) => {
                  handleAddToCart(prod, 1);
                  setIsCartOpen(true);
                }}
                onQuickView={(prod) => setDetailProduct(prod)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Trust & Assurance Section (3 Cards) */}
      <TrustSection onOpenWhatsApp={handleOpenWhatsAppHelp} />

      {/* 6. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleScrollToCollection();
        }}
        onOpenTrackOrder={() => setIsTrackOpen(true)}
        onOpenAdmin={() => setIsAdminView(true)}
        onOpenWhatsApp={handleOpenWhatsAppHelp}
        isAdmin={isAuthorizedAdmin(currentUser?.email)}
      />

      {/* Modals & Overlays */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
        onWhatsAppOrder={(prod) => setWhatsAppModalProduct(prod)}
      />

      {/* WhatsApp Quick Order Modal */}
      <WhatsAppOrderModal
        product={whatsAppModalProduct}
        isOpen={!!whatsAppModalProduct}
        onClose={() => setWhatsAppModalProduct(null)}
        onOrderCreated={handleOrderCreated}
        currentUser={currentUser}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
        currentUser={currentUser}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        orders={orders}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setIsAdminLoginMode(false);
        }}
        isAdminLogin={isAdminLoginMode}
        onUserLoggedIn={(u) => {
          setCurrentUser(u);
          setIsAuthModalOpen(false);
          if (isAdminLoginMode && isAuthorizedAdmin(u.email)) {
            setIsAdminView(true);
          }
          setIsAdminLoginMode(false);
        }}
      />

      {/* Real-time Firebase Support Chat Widget */}
      <LiveChatWidget
        onOpenOrderTrack={() => setIsTrackOpen(true)}
        currentUser={currentUser}
      />
    </div>
  );
}
