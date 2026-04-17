import { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import ProductCard from './ProductCard';

export default function ChatPanel({ onProductsFiltered, isFullPage = false }) {
  const { recordAIInteraction } = useGamification();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm your SmartCart AI assistant. Tell me what you're looking for — your budget, preferred category, or occasion — and I'll find the perfect products for you!",
      products: [],
      isQuestion: false
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({ budget: '', category: 'All', occasion: '' });
  const [showPrefs, setShowPrefs] = useState(false);
  const [conversationContext, setConversationContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, products: [], isQuestion: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const prefs = {
        budget: preferences.budget ? parseFloat(preferences.budget) : null,
        category: preferences.category !== 'All' ? preferences.category : null,
        occasion: preferences.occasion || null
      };

      // Pass conversation context to AI
      const data = await chatWithAI(text, prefs, history, conversationContext);

      const aiMsg = {
        role: 'assistant',
        content: data.reply || "I couldn't process that. Could you try rephrasing?",
        products: data.products || [],
        isQuestion: data.isFollowUpQuestion || false
      };

      setMessages(prev => [...prev, aiMsg]);

      // Update conversation context
      if (data.context) {
        setConversationContext(prev => ({ ...prev, ...data.context }));
      }

      // Notify parent about filtered products
      if (data.products?.length > 0 && onProductsFiltered) {
        const metadata = {
          isOutfit: data.isOutfit || false,
          title: data.outfitTitle || ''
        };
        onProductsFiltered(data.products, metadata);
      }

      // Record AI interaction for gamification
      recordAIInteraction();
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please make sure the backend server is running on port 5000.",
        products: [],
        isQuestion: false
      }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  const quickPrompts = [
    "Show me headphones under $200",
    "Best fitness gear for home workouts",
    "I need a wedding outfit",
    "Affordable skincare products",
    "Trending gadgets this season"
  ];

  return (
    <div className={`flex flex-col ${isFullPage
      ? 'h-[calc(100vh-5rem)]'
      : 'h-[600px]'
    } glass rounded-2xl overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center
            shadow-lg shadow-primary-500/30">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-surface-100">SmartCart AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-surface-500">Online • Ready to help</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowPrefs(!showPrefs)}
          className={`p-2 rounded-lg transition-colors ${showPrefs ? 'bg-primary-500/20 text-primary-300' : 'text-surface-500 hover:bg-surface-800'}`}
          id="chat-prefs-toggle"
          title="Set preferences"
        >
          ⚙️
        </button>
      </div>

      {/* Preferences Panel */}
      {showPrefs && (
        <div className="px-5 py-3 border-b border-surface-700/50 bg-surface-800/50 animate-slide-down">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-surface-500 mb-1 block">Budget ($)</label>
              <input
                type="number"
                placeholder="Max"
                value={preferences.budget}
                onChange={e => setPreferences(p => ({ ...p, budget: e.target.value }))}
                className="input-field !text-sm !py-2"
                id="pref-budget"
              />
            </div>
            <div>
              <label className="text-xs text-surface-500 mb-1 block">Category</label>
              <select
                value={preferences.category}
                onChange={e => setPreferences(p => ({ ...p, category: e.target.value }))}
                className="input-field !text-sm !py-2 cursor-pointer"
                id="pref-category"
              >
                <option>All</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home</option>
                <option>Beauty</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-surface-500 mb-1 block">Occasion</label>
              <input
                type="text"
                placeholder="e.g. Birthday"
                value={preferences.occasion}
                onChange={e => setPreferences(p => ({ ...p, occasion: e.target.value }))}
                className="input-field !text-sm !py-2"
                id="pref-occasion"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user'
                  ? 'bg-primary-600/80 text-white rounded-br-md'
                  : 'bg-surface-800 text-surface-200 rounded-bl-md border border-surface-700/50'
                }`}
              >
                {msg.content}
              </div>

              {/* Inline product recommendations */}
              {msg.products?.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-surface-500 px-1">Recommended products:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.products.slice(0, 3).map(product => (
                      <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl bg-surface-800/50
                        border border-surface-700/30 hover:border-primary-500/30 transition-colors cursor-pointer group">
                        <img src={product.image} alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-200 truncate group-hover:text-primary-300 transition-colors">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-primary-400">${product.price}</span>
                            <span className="text-xs text-amber-400">★ {product.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start animate-scale-in">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-surface-800 border border-surface-700/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        {/* Quick prompts (show only if no user messages yet) */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-surface-500">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); }}
                  className="chip text-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-surface-700/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything about products..."
            className="input-field !rounded-full !py-3"
            disabled={loading}
            id="chat-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center
              shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
            id="chat-send-btn"
          >
            <span className="text-white">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
