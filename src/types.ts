export type CategoryId = 'all' | 'gadgets' | 'home-decor' | 'desk-setup' | 'ambient-lighting';

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  tagline: string;
  category: CategoryId;
  categoryLabel: string;
  brandSeries: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  badge?: string;
  image: string;
  stockCount: number;
  inStock: boolean;
  featured?: boolean;
  specs: { [key: string]: string };
  features: string[];
  description: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: 'Dhaka' | 'Outside Dhaka';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  status: OrderStatus;
  createdAt: string;
  trackingNumber: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  senderName: string;
  senderPhone?: string;
  text: string;
  timestamp: string;
  createdAt?: number;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied' | 'archived';
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  isAnonymous?: boolean;
}

/**
 * Strict list of authorized Admin Emails allowed to access the Admin Panel
 */
export const AUTHORIZED_ADMIN_EMAILS: readonly string[] = [
  'sunny.travelcareexpress@gmail.com',
  'official.sunny.ext@gmail.com',
];

/**
 * Check whether a given user or email belongs to the authorized admin group
 */
export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.includes(normalized);
}

