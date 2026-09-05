import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  remove,
  get,
  child,
  Database
} from 'firebase/database';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Firestore
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  Auth,
  User as FirebaseUser
} from 'firebase/auth';
import { Product, Order, ChatMessage, CustomerInquiry, OrderStatus, AppUser } from './types';

// The user's exact Firebase configuration with Realtime Database URL
export const firebaseConfig = {
  apiKey: "AIzaSyB_1_7kxNob5lOqapQ5leOnmOEP-a847eM",
  authDomain: "zenmart-bd.firebaseapp.com",
  databaseURL: "https://zenmart-bd-default-rtdb.firebaseio.com",
  projectId: "zenmart-bd",
  storageBucket: "zenmart-bd.firebasestorage.app",
  messagingSenderId: "582478980752",
  appId: "1:582478980752:web:a76aa4bf11904aae049a15",
  measurementId: "G-M8LFKC56CX"
};

// Initialize Firebase App safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
export const rtdb: Database = getDatabase(app);

// Initialize Cloud Firestore (as dual-support)
export const db: Firestore = getFirestore(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Analytics if supported in browser environment
if (typeof window !== 'undefined') {
  isSupported()
    .then((yes) => {
      if (yes) getAnalytics(app);
    })
    .catch(() => {});
}

// ----------------------------------------------------
// 1. ORDERS SERVICES (Firebase Realtime Database + Firestore)
// ----------------------------------------------------

/**
 * Save customer order to Firebase Realtime Database and Firestore
 */
export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  let rtdbSuccess = false;

  // 1. Save to Firebase Realtime Database (/orders/{orderId})
  try {
    const orderRef = ref(rtdb, `orders/${order.id}`);
    await set(orderRef, {
      ...order,
      updatedAt: Date.now(),
    });
    console.log(`[Firebase RTDB] Order ${order.id} saved successfully to Realtime Database.`);
    rtdbSuccess = true;
  } catch (err) {
    console.warn('[Firebase RTDB] Error saving order to Realtime Database:', err);
  }

  // 2. Also save to Firestore as fallback/mirror
  try {
    const firestoreRef = doc(db, 'orders', order.id);
    await setDoc(firestoreRef, {
      ...order,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log(`[Firebase Firestore] Order ${order.id} saved to Firestore.`);
  } catch (err) {
    // Quietly log
    console.warn('[Firebase Firestore] Firestore sync note:', err);
  }

  return rtdbSuccess;
}

/**
 * Real-time listener for orders from Firebase Realtime Database
 */
export function subscribeToOrders(onData: (orders: Order[]) => void) {
  try {
    const ordersRef = ref(rtdb, 'orders');
    const unsubscribeRtdb = onValue(
      ordersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: Order[] = Object.keys(val).map((key) => {
            const item = val[key];
            return {
              id: item.id || key,
              customerName: item.customerName || '',
              phone: item.phone || '',
              address: item.address || '',
              city: item.city || 'Dhaka',
              items: item.items || [],
              subtotal: Number(item.subtotal) || 0,
              deliveryFee: Number(item.deliveryFee) || 0,
              total: Number(item.total) || 0,
              paymentMethod: item.paymentMethod || 'Cash on Delivery',
              status: (item.status as OrderStatus) || 'pending',
              createdAt: item.createdAt || new Date().toISOString().substring(0, 16),
              trackingNumber: item.trackingNumber || `TRK-${key}`,
              notes: item.notes || '',
            };
          });

          // Sort latest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          onData(list);
        }
      },
      (error) => {
        console.warn('[Firebase RTDB] Orders listener warning:', error);
      }
    );

    return () => {
      unsubscribeRtdb();
    };
  } catch (e) {
    console.warn('[Firebase RTDB] Error establishing orders listener:', e);
    return () => {};
  }
}

/**
 * Update order status in Firebase Realtime Database
 */
export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const orderRef = ref(rtdb, `orders/${orderId}`);
    await update(orderRef, {
      status,
      updatedAt: Date.now(),
    });

    // Mirror to Firestore
    try {
      const fsRef = doc(db, 'orders', orderId);
      await setDoc(fsRef, { status, updatedAt: new Date().toISOString() }, { merge: true });
    } catch {}

    return true;
  } catch (e) {
    console.warn('[Firebase] Error updating order status:', e);
    return false;
  }
}

// ----------------------------------------------------
// 2. CHAT & MESSAGING SERVICES (Firebase Realtime Database)
// ----------------------------------------------------

/**
 * Send a chat message and save to Firebase Realtime Database (/chats)
 */
export async function sendChatMessageToFirestore(
  message: {
    sender: 'user' | 'support' | 'bot';
    senderName: string;
    senderPhone?: string;
    text: string;
  }
): Promise<string | null> {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestamp = Date.now();

  try {
    // Save to Firebase Realtime Database
    const chatsRef = ref(rtdb, 'chats');
    const newChatRef = push(chatsRef);
    const generatedKey = newChatRef.key;

    const payload = {
      id: generatedKey,
      ...message,
      timestamp: formattedTime,
      createdAt: timestamp,
    };

    await set(newChatRef, payload);
    console.log(`[Firebase RTDB] Chat message saved with key: ${generatedKey}`);

    // Mirror to Firestore collection if accessible
    try {
      await addDoc(collection(db, 'chats'), payload);
    } catch {}

    return generatedKey;
  } catch (err) {
    console.warn('[Firebase RTDB] Error saving chat message:', err);
    return null;
  }
}

/**
 * Real-time listener for live chat messages from Firebase Realtime Database
 */
export function subscribeToChatMessages(onData: (messages: ChatMessage[]) => void) {
  try {
    const chatsRef = ref(rtdb, 'chats');
    const unsubscribe = onValue(
      chatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const messages: ChatMessage[] = Object.keys(val).map((key) => {
            const d = val[key];
            return {
              id: key,
              sender: d.sender || 'user',
              senderName: d.senderName || 'Anonymous',
              senderPhone: d.senderPhone || '',
              text: d.text || '',
              timestamp: d.timestamp || 'Just now',
              createdAt: d.createdAt || 0,
            };
          });

          // Sort chronological
          messages.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
          onData(messages);
        } else {
          onData([]);
        }
      },
      (err) => {
        console.warn('[Firebase RTDB] Chat subscription warning:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  } catch (e) {
    console.warn('[Firebase RTDB] Failed to listen to chats:', e);
    return () => {};
  }
}

// ----------------------------------------------------
// 3. PRODUCT CATALOG SERVICES
// ----------------------------------------------------

/**
 * Save product to Firebase Realtime Database
 */
export async function saveProductToFirestore(product: Product): Promise<boolean> {
  try {
    const prodRef = ref(rtdb, `products/${product.id}`);
    await set(prodRef, {
      ...product,
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.warn('[Firebase RTDB] Error saving product:', e);
    return false;
  }
}

/**
 * Seed initial products to Realtime Database if node is empty
 */
export async function seedProductsIfEmpty(initialProducts: Product[]): Promise<void> {
  try {
    const snapshot = await get(ref(rtdb, 'products'));
    if (!snapshot.exists()) {
      console.log('[Firebase RTDB] Seeding initial catalog to Realtime Database...');
      const updates: { [key: string]: any } = {};
      for (const p of initialProducts) {
        updates[`products/${p.id}`] = p;
      }
      await update(ref(rtdb), updates);
    }
  } catch (e) {
    console.warn('[Firebase RTDB] Error checking/seeding products:', e);
  }
}

/**
 * Real-time listener for products from Realtime Database
 */
export function subscribeToProducts(onData: (products: Product[]) => void) {
  try {
    const prodsRef = ref(rtdb, 'products');
    const unsubscribe = onValue(
      prodsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: Product[] = Object.keys(val).map((k) => ({
            ...val[k],
            id: k,
          }));
          onData(list);
        }
      },
      (err) => {
        console.warn('[Firebase RTDB] Products subscription warning:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  } catch (e) {
    console.warn('[Firebase RTDB] Failed to listen to products:', e);
    return () => {};
  }
}

export async function updateProductStockInFirestore(productId: string, inStock: boolean): Promise<boolean> {
  try {
    const prodRef = ref(rtdb, `products/${productId}`);
    await update(prodRef, {
      inStock,
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.warn('[Firebase RTDB] Error updating product stock:', e);
    return false;
  }
}

export async function updateProductPriceInFirestore(productId: string, price: number): Promise<boolean> {
  try {
    const prodRef = ref(rtdb, `products/${productId}`);
    await update(prodRef, {
      price,
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.warn('[Firebase RTDB] Error updating product price:', e);
    return false;
  }
}

/**
 * Delete product from Firebase Realtime Database
 */
export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  try {
    const prodRef = ref(rtdb, `products/${productId}`);
    await remove(prodRef);
    return true;
  } catch (e) {
    console.warn('[Firebase RTDB] Error removing product from database:', e);
    return false;
  }
}

// ----------------------------------------------------
// 4. CUSTOMER INQUIRIES & CONTACT FORM SERVICES
// ----------------------------------------------------

export async function saveCustomerInquiryToFirestore(
  inquiry: Omit<CustomerInquiry, 'id' | 'createdAt' | 'status'>
): Promise<boolean> {
  try {
    const now = new Date().toISOString().substring(0, 16);
    const inqRef = push(ref(rtdb, 'inquiries'));
    await set(inqRef, {
      id: inqRef.key,
      ...inquiry,
      createdAt: now,
      status: 'new',
      serverCreated: Date.now(),
    });
    return true;
  } catch (e) {
    console.warn('[Firebase RTDB] Error saving inquiry:', e);
    return false;
  }
}

// ----------------------------------------------------
// 5. FIREBASE AUTHENTICATION SERVICES (Login / Logout)
// ----------------------------------------------------

/**
 * Sign in user with email and password
 */
export async function loginWithEmail(email: string, pass: string): Promise<{ success: boolean; user?: AppUser; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const u = cred.user;
    const appUser: AppUser = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || u.email?.split('@')[0] || 'User',
      phoneNumber: u.phoneNumber,
      isAnonymous: u.isAnonymous,
    };
    return { success: true, user: appUser };
  } catch (err: any) {
    console.warn('[Firebase Auth] Login error:', err);
    let message = 'লগ ইন করতে সমস্যা হয়েছে। ইমেইল এবং পাসওয়ার্ড চেক করুন।';
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      message = 'ভুল পাসওয়ার্ড বা ইমেইল! অনুগ্রহ করে সঠিক তথ্য দিন।';
    } else if (err.code === 'auth/user-not-found') {
      message = 'এই ইমেইলে কোনো একাউন্ট নেই। নতুন একাউন্ট তৈরি করুন।';
    } else if (err.code === 'auth/invalid-email') {
      message = 'সঠিক ইমেইল এড্রেস প্রদান করুন।';
    }
    return { success: false, error: message };
  }
}

/**
 * Register new user with email, password, name and phone
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string,
  phone?: string
): Promise<{ success: boolean; user?: AppUser; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const u = cred.user;

    // Update profile display name
    await updateProfile(u, {
      displayName: displayName.trim(),
    });

    const appUser: AppUser = {
      uid: u.uid,
      email: u.email,
      displayName: displayName.trim(),
      phoneNumber: phone || null,
      isAnonymous: false,
    };

    // Save profile to Realtime Database
    try {
      await set(ref(rtdb, `users/${u.uid}`), {
        uid: u.uid,
        displayName: displayName.trim(),
        email: u.email,
        phone: phone || '',
        createdAt: Date.now(),
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Failed to save user profile in DB:', e);
    }

    return { success: true, user: appUser };
  } catch (err: any) {
    console.warn('[Firebase Auth] Registration error:', err);
    let message = 'একাউন্ট তৈরি করতে সমস্যা হয়েছে।';
    if (err.code === 'auth/email-already-in-use') {
      message = 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত! অনুগ্রহ করে লগ ইন করুন।';
    } else if (err.code === 'auth/weak-password') {
      message = 'পাসওয়ার্ডটি অত্যন্ত দুর্বল, অন্তত ৬টি অক্ষর দিন।';
    }
    return { success: false, error: message };
  }
}

/**
 * Quick Guest / Demo login with name & phone
 */
export async function loginQuickGuest(name: string, phone: string): Promise<{ success: boolean; user?: AppUser; error?: string }> {
  try {
    let u: FirebaseUser;
    try {
      const cred = await signInAnonymously(auth);
      u = cred.user;
    } catch {
      // If anonymous auth is disabled in Firebase console, simulate clean local user
      const guestUid = `guest-${Date.now()}`;
      const guestUser: AppUser = {
        uid: guestUid,
        email: `${phone.replace(/[^0-9]/g, '') || 'guest'}@zenmart.bd`,
        displayName: name || 'Zenmart Guest',
        phoneNumber: phone || null,
        isAnonymous: true,
      };
      localStorage.setItem('zenmart_user', JSON.stringify(guestUser));
      return { success: true, user: guestUser };
    }

    await updateProfile(u, { displayName: name });
    const appUser: AppUser = {
      uid: u.uid,
      email: null,
      displayName: name,
      phoneNumber: phone,
      isAnonymous: true,
    };

    try {
      await set(ref(rtdb, `users/${u.uid}`), {
        uid: u.uid,
        displayName: name,
        phone: phone,
        isGuest: true,
        createdAt: Date.now(),
      });
    } catch {}

    return { success: true, user: appUser };
  } catch (err: any) {
    console.warn('[Firebase Auth] Guest login note:', err);
    // Fallback gracefully so user is never stuck
    const guestUser: AppUser = {
      uid: `local-${Date.now()}`,
      email: null,
      displayName: name || 'Customer',
      phoneNumber: phone,
      isAnonymous: true,
    };
    localStorage.setItem('zenmart_user', JSON.stringify(guestUser));
    return { success: true, user: guestUser };
  }
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<boolean> {
  try {
    await signOut(auth);
    localStorage.removeItem('zenmart_user');
    console.log('[Firebase Auth] User successfully logged out.');
    return true;
  } catch (err) {
    console.warn('[Firebase Auth] Logout error:', err);
    localStorage.removeItem('zenmart_user');
    return true;
  }
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuth(onUser: (user: AppUser | null) => void) {
  return onAuthStateChanged(auth, async (u) => {
    if (u) {
      const appUser: AppUser = {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || u.email?.split('@')[0] || 'User',
        phoneNumber: u.phoneNumber,
        isAnonymous: u.isAnonymous,
      };
      localStorage.setItem('zenmart_user', JSON.stringify(appUser));
      onUser(appUser);
    } else {
      // Check if local guest user exists
      const saved = localStorage.getItem('zenmart_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          onUser(parsed);
          return;
        } catch {}
      }
      onUser(null);
    }
  });
}
