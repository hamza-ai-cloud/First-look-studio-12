'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/sections/page-header';
import { products } from '@/lib/data';
import { productImages } from '@/lib/pexels-data';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, Star, X, ShoppingCart, Trash2, Tag, Check } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['All', 'Frames', 'Albums', 'Mugs', 'T-Shirts', 'Canvas', 'Gifts'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const cartItems = cart.map((c) => {
    const product = products.find((p) => p.id === c.id)!;
    return { ...product, qty: c.qty };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const addToCart = (id: string) => {
    setCart((c) => {
      const existing = c.find((item) => item.id === id);
      if (existing) return c.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      return [...c, { id, qty: 1 }];
    });
    toast.success('Added to cart');
  };

  const removeFromCart = (id: string) => setCart((c) => c.filter((item) => item.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart((c) => c.map((item) => item.id === id ? { ...item, qty } : item));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((w) => w.includes(id) ? w.filter((i) => i !== id) : [...w, id]);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST10') {
      setCouponApplied(true);
      toast.success('Coupon applied! 10% discount');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const checkout = () => {
    toast.success('Redirecting to secure checkout...');
    setCartOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Online Shop"
        title="Premium Print Products"
        subtitle="Shop our collection of frames, albums, mugs, t-shirts, canvas prints, and personalized photo gifts."
      />

      {/* Shop bar */}
      <section className="pb-6">
        <div className="container-luxury">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black'
                      : 'glass text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                {wishlist.length}
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full glass gold-border text-foreground hover:bg-gold-400/10 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="pb-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => {
              const img = productImages[i % productImages.length];
              const inWishlist = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                  className="group glass-card rounded-2xl overflow-hidden hover:gold-border transition-all"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={img.src.large}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-black text-xs font-semibold">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-gold-400/20 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-gold-400 text-gold-400' : 'text-white'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${idx < product.rating ? 'text-gold-400 fill-gold-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <h3 className="font-medium text-foreground text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-lg font-bold gold-text">${product.price}</span>
                        {product.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through">${product.oldPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-9 h-9 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-black flex items-center justify-center hover:from-gold-400 hover:to-gold-300 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex justify-end"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md glass-dark border-l border-white/10 h-full flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gold-400" />
                  Shopping Cart ({cart.length})
                </h3>
                <button onClick={() => setCartOpen(false)} className="w-9 h-9 rounded-full glass flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const img = productImages[products.indexOf(item) % productImages.length];
                    return (
                      <div key={item.id} className="flex gap-3 glass-card p-3 rounded-xl">
                        <img src={img.src.small} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                          <div className="text-sm gold-text font-semibold">${item.price}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-sm">-</button>
                            <span className="text-sm w-8 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-sm">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="ml-auto w-7 h-7 rounded-lg glass flex items-center justify-center text-red-400 hover:text-red-300">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  {/* Coupon */}
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl glass">
                      <Tag className="w-4 h-4 text-gold-400" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="px-4 py-2 rounded-xl glass gold-border text-sm text-gold-400 hover:bg-gold-400/10 disabled:opacity-50"
                    >
                      {couponApplied ? <Check className="w-4 h-4" /> : 'Apply'}
                    </button>
                  </div>
                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-sm text-gold-400">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-display text-lg font-bold text-foreground pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="gold-text">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button onClick={checkout} className="w-full h-12 bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:from-gold-400 hover:to-gold-300 font-semibold">
                    Secure Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
