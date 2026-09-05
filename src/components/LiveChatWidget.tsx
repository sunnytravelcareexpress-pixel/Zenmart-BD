import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Phone,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  Minimize2,
  Maximize2,
  Flame,
  CloudCheck
} from 'lucide-react';
import { ChatMessage, AppUser } from '../types';
import { sendChatMessageToFirestore, subscribeToChatMessages } from '../firebase';

interface LiveChatWidgetProps {
  onOpenOrderTrack?: () => void;
  currentUser?: AppUser | null;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onOpenOrderTrack, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [customerName, setCustomerName] = useState(() => currentUser?.displayName || localStorage.getItem('zenmart_chat_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => currentUser?.phoneNumber || localStorage.getItem('zenmart_chat_phone') || '');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFirebaseSynced, setIsFirebaseSynced] = useState(true);

  React.useEffect(() => {
    if (currentUser?.displayName && !customerName) {
      setCustomerName(currentUser.displayName);
    }
    if (currentUser?.phoneNumber && !customerPhone) {
      setCustomerPhone(currentUser.phoneNumber);
    }
  }, [currentUser]);

  // Messages list state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'support',
      senderName: 'Zenmart BD Support',
      text: 'আসসালামু আলাইকুম! Zenmart BD-তে স্বাগতম। আপনি কি কোনো গ্যাজেট বা ডেলিভারি সম্পর্কে জানতে চান? আপনার যেকোনো প্রশ্ন লিখুন।',
      timestamp: 'Just now',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Subscribe to real-time chat messages from Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToChatMessages((firestoreMsgs) => {
      if (firestoreMsgs && firestoreMsgs.length > 0) {
        setIsFirebaseSynced(true);
        // Combine welcome message with firestore messages
        setMessages((prev) => {
          const welcome = prev.filter((m) => m.id === 'welcome-msg');
          const existingIds = new Set(welcome.map((m) => m.id));
          const newOnes = firestoreMsgs.filter((m) => !existingIds.has(m.id));
          return [...welcome, ...newOnes];
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const name = customerName.trim() || 'Guest Customer';
    const phone = customerPhone.trim() || '';

    // Persist profile
    if (customerName.trim()) localStorage.setItem('zenmart_chat_name', customerName);
    if (customerPhone.trim()) localStorage.setItem('zenmart_chat_phone', customerPhone);

    const tempId = `local-${Date.now()}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLocalMsg: ChatMessage = {
      id: tempId,
      sender: 'user',
      senderName: name,
      senderPhone: phone,
      text: text,
      timestamp: timeString,
      createdAt: Date.now(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newLocalMsg]);
    setInputMessage('');
    setIsSending(true);

    // Save to Firebase Firestore
    try {
      const savedId = await sendChatMessageToFirestore({
        sender: 'user',
        senderName: name,
        senderPhone: phone,
        text: text,
      });

      if (savedId) {
        setIsFirebaseSynced(true);
      }

      // Automated helpful instant response for common customer queries
      const lower = text.toLowerCase();
      let autoReplyText = '';

      if (lower.includes('delivery') || lower.includes('ডেলিভারি') || lower.includes('চার্জ') || lower.includes('fee')) {
        autoReplyText = '🚚 ডেলিভারি চার্জ: ঢাকা সিটির ভেতরে ৬০ টাকা (২৪-৪৮ ঘন্টায় হোম ডেলিভারি) এবং ঢাকার বাইরে ১২০ টাকা (২-৩ দিনে)। পুরো বাংলাদেশেই ক্যাশ অন ডেলিভারি সুবিধা রয়েছে!';
      } else if (lower.includes('cash') || lower.includes('cod') || lower.includes('ক্যাশ') || lower.includes('টাকা')) {
        autoReplyText = '🛡️ হ্যাঁ! Zenmart BD-তে ১০০% ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা আছে। পার্সেল ডেলিভারিম্যানের সামনে চেক করে দেখে তারপর মূল্য পরিশোধ করবেন।';
      } else if (lower.includes('warranty') || lower.includes('ওয়ারেন্টি') || lower.includes('গ্যারান্টি') || lower.includes('return')) {
        autoReplyText = '✨ আমাদের সকল গ্যাজেটে ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি এবং ১ বছরের অফিসিয়াল সার্ভিস ওয়ারেন্টি থাকে।';
      } else if (lower.includes('track') || lower.includes('ট্র্যাক') || lower.includes('কোথায়')) {
        autoReplyText = '📦 আপনার অর্ডার ট্র্যাক করতে উপরের "Track Order" বাটনে ক্লিক করে Order ID (যেমন: ZB-9241) বা ফোন নাম্বার দিয়ে সরাসরি লাইভ স্ট্যাটাস দেখতে পারেন।';
      }

      if (autoReplyText) {
        setTimeout(async () => {
          const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const replyMsg: ChatMessage = {
            id: `reply-${Date.now()}`,
            sender: 'support',
            senderName: 'Zenmart BD Assistant',
            text: autoReplyText,
            timestamp: replyTime,
            createdAt: Date.now(),
          };
          setMessages((prev) => [...prev, replyMsg]);
          // Also save automated response to Firestore
          await sendChatMessageToFirestore({
            sender: 'bot',
            senderName: 'Zenmart BD Assistant',
            text: autoReplyText,
          });
        }, 800);
      }
    } catch (e) {
      console.warn('Firebase chat error:', e);
    } finally {
      setIsSending(false);
    }
  };

  const quickQuestions = [
    'ঢাকার বাইরে ডেলিভারি কত?',
    'ক্যাশ অন ডেলিভারি আছে?',
    'ওয়ারেন্টি পলিসি কি?',
    'অর্ডার কিভাবে ট্র্যাক করব?'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 font-['Inter',_'Hind_Siliguri',_sans-serif]">
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#111827] text-white rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 border border-slate-700"
          aria-label="Open Live Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#111827] animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight">Live Support</p>
            <p className="text-[10px] text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Firebase Synced
            </p>
          </div>
          <span className="text-xs font-bold sm:hidden">Chat</span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized
              ? 'w-80 h-14'
              : 'w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh]'
          }`}
        >
          {/* Chat Window Header */}
          <div className="px-4 py-3 bg-[#111827] text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#111827]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Zenmart Live Support</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Firebase
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300">
                  Dhaka Hub • Instant Replies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Optional User Info Mini Bar */}
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-[11px]">
                <div className="flex-1 flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">
                  <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার নাম (ঐচ্ছিক)"
                    className="w-full text-[11px] bg-transparent focus:outline-none text-slate-700"
                  />
                </div>
                <div className="flex-1 flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">
                  <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="ফোন নাম্বার"
                    className="w-full text-[11px] bg-transparent focus:outline-none text-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#fbfcfd]">
                <div className="text-center my-1">
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Real-time Cloud Database Connected (zenmart-bd)
                  </span>
                </div>

                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#111827] text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Chips */}
              <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[10px] whitespace-nowrap bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 px-2 py-1 rounded-full transition-colors flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="একটি মেসেজ লিখুন..."
                  className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    inputMessage.trim() && !isSending
                      ? 'bg-[#111827] text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
