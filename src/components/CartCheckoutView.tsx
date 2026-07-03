import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Trash2, MapPin, CreditCard, ShieldCheck, Check, Calendar, ArrowRight, ArrowLeft, Star, Map, Info, ShoppingBag } from 'lucide-react';
import { CartItem, Installer, Tire } from '../types';
import { INSTALLERS } from '../data';

interface CartCheckoutViewProps {
  page: string;
  setPage: (p: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  zipCode: string;
  selectedInstaller: Installer | null;
  setSelectedInstaller: (inst: Installer | null) => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  page,
  setPage,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
  zipCode,
  selectedInstaller,
  setSelectedInstaller
}) => {
  const [checkoutStep, setCheckoutStep] = useState<number>(1); // 1: Review, 2: Installer, 3: Payment, 4: Success
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');
  
  // Billing info states
  const [custEmail, setCustEmail] = useState<string>('');
  const [custName, setCustName] = useState<string>('');
  const [custPhone, setCustPhone] = useState<string>('');
  const [cardNo, setCardNo] = useState<string>('');
  const [cardExp, setCardExp] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');

  // Map drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cart Calculations
  const itemSubtotal = cart.reduce((sum, item) => sum + (item.tire.price * item.quantity), 0);
  const installationSubtotal = selectedInstaller 
    ? cart.reduce((sum, item) => sum + (selectedInstaller.pricePerTire * item.quantity), 0)
    : cart.reduce((sum, item) => sum + (item.tire.installPrice * item.quantity), 0);
  
  const salesTax = Math.round(itemSubtotal * 0.0825);
  const orderTotal = itemSubtotal + installationSubtotal + salesTax - appliedDiscount;

  // Handle quantity adjustments
  const updateQty = (id: string, size: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.tire.id === id && item.selectedSize === size) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    }));
  };

  const removeItem = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.tire.id === id && item.selectedSize === size)));
  };

  // Promo application
  const applyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'TIREMAX20') {
      setAppliedDiscount(20);
      setPromoSuccess('Promo TIREMAX20 Applied: Save $20 off tires!');
    } else if (code === 'ALIGN89') {
      setPromoSuccess('Promo ALIGN89 Registered! Alignment set to $89.');
    } else {
      setPromoError('Invalid coupon code. Try TIREMAX20.');
    }
  };

  // Draw local vector map in step 2
  useEffect(() => {
    if (checkoutStep !== 2 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Base coordinates
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid background (mock cartography lines)
    ctx.strokeStyle = '#F1F3F5';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j < h; j += 30) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Draw Mock Roads & Highway curves
    ctx.strokeStyle = '#E9ECEF';
    ctx.lineWidth = 8;
    
    // Road 1: diagonal Highway
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.7, h * 0.8, w, h - 40);
    ctx.stroke();

    // Road 2: cross-cut street
    ctx.beginPath();
    ctx.moveTo(w * 0.2, 0);
    ctx.lineTo(w * 0.2, h);
    ctx.stroke();

    // Road 3: boulevard
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.stroke();

    // Draw central client ZIP pointer (Orange circle beacon)
    const userX = w / 2;
    const userY = h / 2;
    
    // Soft radiating orange radar ring
    const time = Date.now() * 0.003;
    const pulseRadius = 15 + Math.abs(Math.sin(time)) * 8;
    ctx.fillStyle = 'rgba(255, 90, 31, 0.12)';
    ctx.beginPath();
    ctx.arc(userX, userY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF5A1F';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(userX, userY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add text label "YOU"
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(`My ZIP: ${zipCode}`, userX - 25, userY - 12);

    // Draw Installer Pins
    INSTALLERS.forEach((inst, idx) => {
      // Map coordinates to relative coordinates inside our 250x300 container
      // Using arbitrary spreads based on installer rating decimal
      const pinX = w * (0.15 + (idx * 0.22) + (inst.rating - 4.5) * 0.2);
      const pinY = h * (0.2 + (idx % 2 === 0 ? 0.35 : 0.5) - (inst.distance * 0.03));

      const isSelected = selectedInstaller?.id === inst.id;

      // Radian pulse for selected pin
      if (isSelected) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.arc(pinX, pinY, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw map marker teardrop
      ctx.fillStyle = isSelected ? '#FF5A1F' : '#0D0D0D';
      ctx.beginPath();
      ctx.arc(pinX, pinY - 10, 6, 0, Math.PI * 2);
      ctx.moveTo(pinX - 6, pinY - 10);
      ctx.lineTo(pinX, pinY);
      ctx.lineTo(pinX + 6, pinY - 10);
      ctx.closePath();
      ctx.fill();

      // Inside dot on teardrop
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(pinX, pinY - 10, 2, 0, Math.PI * 2);
      ctx.fill();

      // Mini text label above pin
      ctx.fillStyle = isSelected ? '#FF5A1F' : '#666';
      ctx.font = isSelected ? 'bold 8px sans-serif' : '8px sans-serif';
      ctx.fillText(`${inst.name.split(' ')[0]} (${inst.distance}mi)`, pinX - 18, pinY - 18);
    });

  }, [checkoutStep, selectedInstaller, zipCode]);

  // Handle Checkout success click
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custEmail || !custName) {
      alert("Please enter a guest checkout email address and contact name.");
      return;
    }
    setCheckoutStep(4); // Trigger success screen
  };

  return (
    <>
      {/* 1. SLIDE-IN CART DRAWER (Global overlay) */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden animate-fade-in"
          id="cart-drawer-overlay"
        >
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full rounded-l-xl border-l border-[#E5E5E5]" id="cart-drawer-panel">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-950 font-black uppercase tracking-wider text-xs">
                  <ShoppingCart size={18} className="text-[#FF5A1F]" />
                  <span>My Active Shopping Cart</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-950 hover:bg-gray-50 transition-all cursor-pointer"
                  id="close-cart-drawer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer List body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-4 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-gray-300">
                      <ShoppingBag size={28} className="stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-black text-[#0D0D0D] uppercase tracking-widest">Your Shopping Cart is Empty</p>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto px-4">Browse our catalog to configure premium tires for your vehicle fitments.</p>
                    </div>
                    <button 
                      onClick={() => { setIsCartOpen(false); setPage('plp'); }}
                      className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-3.5 px-6 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer mx-auto"
                    >
                      Shop Tires Now
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div 
                      key={`${item.tire.id}-${item.selectedSize}`}
                      className="flex gap-4 p-4 bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl relative"
                      id={`drawer-item-${item.tire.id}`}
                    >
                      {/* Image */}
                      <div className="w-20 bg-white border border-[#E5E5E5] rounded-xl p-2.5 flex items-center justify-center">
                        <img src={item.tire.image1} alt={item.tire.name} className="max-h-12 object-contain" referrerPolicy="no-referrer" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 space-y-1 text-xs">
                        <h4 className="font-extrabold text-[#0D0D0D]">{item.tire.name}</h4>
                        <p className="text-gray-400">Size: <span className="font-bold text-gray-700">{item.selectedSize}</span></p>
                        
                        {/* Qty modifiers */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#E5E5E5] bg-white rounded-md h-7 w-20 text-center text-xs overflow-hidden">
                            <button onClick={() => updateQty(item.tire.id, item.selectedSize, -1)} className="flex-1 hover:bg-gray-50 font-black text-gray-500 cursor-pointer">-</button>
                            <span className="flex-1 font-black text-[#0D0D0D]">{item.quantity}</span>
                            <button onClick={() => updateQty(item.tire.id, item.selectedSize, 1)} className="flex-1 hover:bg-gray-50 font-black text-gray-500 cursor-pointer">+</button>
                          </div>
                          <span className="font-mono font-bold text-[#0D0D0D]">${item.tire.price * item.quantity}</span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button 
                        onClick={() => removeItem(item.tire.id, item.selectedSize)}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        id={`delete-item-btn-${idx}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer summary checkout */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#E5E5E5] space-y-4 bg-[#F5F5F3] rounded-t-xl">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Items Subtotal:</span>
                      <span className="font-mono">${itemSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Installer Shipping:</span>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-950 font-black border-t border-[#E5E5E5] pt-2.5 text-sm">
                      <span>Grand Total:</span>
                      <span className="font-mono text-[#FF5A1F]">${itemSubtotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setIsCartOpen(false); setPage('cart-checkout'); setCheckoutStep(1); }}
                    className="w-full bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                    id="drawer-checkout-btn"
                  >
                    Proceed to Guest Checkout
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN CHECKOUT SCREEN (active on page === 'cart-checkout') */}
      {page === 'cart-checkout' && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8" id="checkout-view-screen">
          
          {/* Top Progress bar stepper */}
          {checkoutStep < 4 && (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex justify-between items-center text-xs overflow-x-auto gap-4" id="checkout-stepper-row">
              {[
                { step: 1, title: "1. Cart Review" },
                { step: 2, title: "2. Select Installer" },
                { step: 3, title: "3. Secure Payment" }
              ].map((s) => (
                <div 
                  key={s.step} 
                  className={`flex items-center gap-1.5 font-bold whitespace-nowrap uppercase tracking-wider text-[10px] ${
                    checkoutStep === s.step 
                      ? 'text-[#FF5A1F]' 
                      : checkoutStep > s.step ? 'text-emerald-700' : 'text-gray-400'
                  }`}
                >
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                    checkoutStep === s.step 
                      ? 'bg-[#FF5A1F] text-white' 
                      : checkoutStep > s.step ? 'bg-emerald-600' : 'bg-[#F5F5F3] text-gray-400'
                  }`}>
                    {checkoutStep > s.step ? '✓' : s.step}
                  </span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          )}

          {cart.length === 0 && checkoutStep < 4 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm flex flex-col items-center justify-center" id="checkout-empty">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-gray-300">
                <ShoppingCart size={28} className="stroke-[1.5]" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#0D0D0D]">Your Checkout is Empty</h3>
              <p className="text-xs text-gray-500 font-medium">Add tires to your cart to begin the checkout process.</p>
              <button 
                onClick={() => setPage('plp')}
                className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Go to Catalog
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: CART REVIEW LIST */}
              {checkoutStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="checkout-step-1">
                  
                  {/* Left review items block */}
                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Review configured items:</h3>
                    {cart.map((item) => (
                      <div key={`${item.tire.id}-${item.selectedSize}`} className="bg-white border border-[#E5E5E5] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 relative shadow-sm">
                        <div className="flex gap-4 items-center">
                          <div className="w-16 bg-[#F5F5F3] p-2 rounded-xl flex items-center justify-center border border-[#E5E5E5]">
                            <img src={item.tire.image1} alt={item.tire.name} className="max-h-12 object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="space-y-1 text-xs">
                            <h4 className="font-extrabold text-[#0D0D0D] text-sm uppercase font-display">{item.tire.name}</h4>
                            <p className="text-gray-400 font-medium">Selected Size Fitting: <span className="font-bold text-gray-700">{item.selectedSize}</span></p>
                            <p className="text-gray-400 font-medium">Installation Fee: <span className="font-semibold text-gray-700 font-mono">${item.tire.installPrice}/tire</span></p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Qty modifiers */}
                          <div className="flex items-center border border-[#E5E5E5] bg-[#F5F5F3] rounded-md h-8.5 w-24 text-center text-xs overflow-hidden">
                            <button onClick={() => updateQty(item.tire.id, item.selectedSize, -1)} className="flex-1 hover:bg-gray-200 font-black text-gray-500 cursor-pointer">-</button>
                            <span className="flex-1 font-black text-[#0D0D0D] bg-white h-full flex items-center justify-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.tire.id, item.selectedSize, 1)} className="flex-1 hover:bg-gray-200 font-black text-gray-500 cursor-pointer">+</button>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block uppercase font-bold">Total</span>
                            <span className="font-mono font-black text-sm text-[#0D0D0D]">${item.tire.price * item.quantity}</span>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.tire.id, item.selectedSize)}
                            className="text-gray-300 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right subtotal summaries side */}
                  <div className="lg:col-span-4 bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-6 h-max space-y-6">
                    <div className="border-b border-[#E5E5E5] pb-4">
                      <h4 className="font-black text-xs text-[#0D0D0D] uppercase tracking-widest font-display">Summary Statement</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Free delivery to partner local installer.</p>
                    </div>

                    {/* Promo coupon form */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Have a promo code?</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="e.g. TIREMAX20"
                          className="flex-1 bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF5A1F]"
                        />
                        <button 
                          onClick={applyPromo}
                          className="bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white font-extrabold px-4 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[10px] text-red-500 font-bold">{promoError}</p>}
                      {promoSuccess && <p className="text-[10px] text-emerald-600 font-bold">{promoSuccess}</p>}
                    </div>

                    <div className="space-y-2.5 text-xs border-t border-[#E5E5E5] pt-4">
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Tire Subtotal:</span>
                        <span className="font-mono">${itemSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Shipping Cost:</span>
                        <span className="text-emerald-700 font-bold font-mono">FREE</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Promo Discount:</span>
                          <span className="font-mono">-${appliedDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-950 font-black border-t border-[#E5E5E5] pt-3 text-sm">
                        <span>Total Due Today:</span>
                        <span className="font-mono text-[#FF5A1F]">${itemSubtotal - appliedDiscount}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Note: local installation fees of <strong className="text-gray-700 font-mono">${installationSubtotal}</strong> will be paid directly to selected shop after service.</p>
                    </div>

                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF5A1F]/10"
                      id="next-step-2-btn"
                    >
                      Find Local Installer & Schedule <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: INSTALLER SELECTION MAP + LIST HYBRID */}
              {checkoutStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="checkout-step-2">
                  
                  {/* Left Column: Interactive Map + List */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <h3 className="text-base font-black text-[#0D0D0D] uppercase tracking-wider font-display">Select Partner Installer Workshop</h3>
                      <p className="text-xs text-gray-500 font-medium">Tires are shipped free to selected workshop. Pay mounting & balance fees on-site after installation.</p>
                    </div>

                    {/* Map + List panel wrapper */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Map Drawing canvas (Column 5) */}
                      <div className="md:col-span-5 bg-white border border-[#E5E5E5] rounded-xl overflow-hidden p-3 shadow-sm space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Map size={12} className="text-[#FF5A1F]" /> Interactive Installer Map
                        </span>
                        <canvas 
                          ref={canvasRef} 
                          width={280} 
                          height={280} 
                          className="block w-full border border-[#E5E5E5] rounded-xl bg-[#F5F5F3]"
                        />
                      </div>

                      {/* List of installers (Column 7) */}
                      <div className="md:col-span-7 flex flex-col gap-3 max-h-[310px] overflow-y-auto pr-1">
                        {INSTALLERS.map((inst) => {
                          const isSelected = selectedInstaller?.id === inst.id;
                          return (
                            <div 
                              key={inst.id}
                              onClick={() => setSelectedInstaller(inst)}
                              className={`p-3.5 rounded-xl border text-left text-xs cursor-pointer transition-all flex justify-between items-center ${
                                isSelected 
                                  ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 shadow-sm' 
                                  : 'border-[#E5E5E5] hover:border-gray-400 bg-white'
                              }`}
                              id={`inst-picker-${inst.id}`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-gray-950 text-xs uppercase">{inst.name}</span>
                                  <span className="text-gray-400 text-[10px] font-mono">({inst.distance} miles)</span>
                                </div>
                                <p className="text-gray-400 text-[10px] line-clamp-1 font-medium">{inst.address}</p>
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-0.5">
                                  <span className="flex items-center gap-0.5"><Star size={10} fill="#FF5A1F" className="text-[#FF5A1F]" /> {inst.rating}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-emerald-700">Available {inst.nextAvailable}</span>
                                </div>
                              </div>
                              <div className="text-right pl-4">
                                <span className="text-[9px] text-gray-400 block uppercase font-bold">Fitting cost:</span>
                                <span className="font-mono font-black text-gray-900">${inst.pricePerTire} <span className="text-[10px] font-normal text-gray-400">/tire</span></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>

                  {/* Right panel summary */}
                  <div className="lg:col-span-4 bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-6 h-max space-y-6">
                    <div className="border-b border-[#E5E5E5] pb-4">
                      <h4 className="font-black text-xs text-[#0D0D0D] uppercase tracking-widest font-display">Selected Installer Details</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Confirm selected shipping point.</p>
                    </div>

                    {selectedInstaller ? (
                      <div className="space-y-3.5 text-xs text-gray-700 bg-white p-4 border border-[#E5E5E5] rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 text-[#FF5A1F] font-extrabold">
                          <MapPin size={16} /> 
                          <span className="text-gray-950 font-black uppercase text-xs">{selectedInstaller.name}</span>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed pl-6 font-medium">{selectedInstaller.address}</p>
                        
                        <div className="space-y-1.5 border-t border-[#E5E5E5] pt-3 text-[11px]">
                          <p className="flex justify-between font-medium">
                            <span>Mounting & Balance Fee:</span>
                            <span className="font-bold text-gray-900 font-mono">${selectedInstaller.pricePerTire * cart.reduce((sum, item) => sum + item.quantity, 0)} due locally</span>
                          </p>
                          <p className="flex justify-between text-emerald-700 font-medium">
                            <span>Warehouse Shipping Cost:</span>
                            <span className="font-bold font-mono">FREE</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-400 font-medium">
                        Please click on a partner shop to select as your installation point.
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="flex-1 py-3 text-sm font-bold text-gray-700 bg-white border border-[#E5E5E5] hover:bg-[#F5F5F3] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                      >
                        <ArrowLeft size={13} /> Back
                      </button>
                      <button
                        onClick={() => {
                          if (!selectedInstaller) {
                            alert("Please select a local installer to proceed!");
                            return;
                          }
                          setCheckoutStep(3);
                        }}
                        disabled={!selectedInstaller}
                        className="flex-1 py-3 text-sm font-extrabold text-white bg-[#FF5A1F] hover:bg-brand-orange-hover disabled:bg-gray-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                        id="next-step-3-btn"
                      >
                        Proceed to Payment <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: SECURE PAYMENT & GUEST DETAILS */}
              {checkoutStep === 3 && (
                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="checkout-step-3">
                  
                  {/* Left Column secure card fields */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <h3 className="text-base font-black text-[#0D0D0D] uppercase tracking-wider font-display">Secure Customer Checkout</h3>
                      <p className="text-xs text-gray-500 font-medium">Provide contact email and credit card credentials. We use standard 256-bit SSL encryption to protect billing info.</p>
                    </div>

                    <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 space-y-6 shadow-sm">
                      
                      {/* Contact form */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">1. Guest Contact Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Full Name</label>
                            <input
                              type="text"
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#FF5A1F]"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                            <input
                              type="email"
                              value={custEmail}
                              onChange={(e) => setCustEmail(e.target.value)}
                              placeholder="e.g. johndoe@gmail.com"
                              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#FF5A1F]"
                              required
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Telephone (For Installer scheduled reminder SMS)</label>
                            <input
                              type="tel"
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              placeholder="e.g. (213) 555-0199"
                              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#FF5A1F]"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Details form */}
                      <div className="space-y-4 pt-6 border-t border-[#E5E5E5]">
                        <h4 className="text-[10px] font-black uppercase text-[#0D0D0D] tracking-widest flex items-center gap-1.5">
                          <CreditCard size={14} className="text-[#FF5A1F]" /> 2. Credit Card Credentials
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5 sm:col-span-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number</label>
                            <input
                              type="text"
                              maxLength={16}
                              value={cardNo}
                              onChange={(e) => setCardNo(e.target.value.replace(/\D/g, ''))}
                              placeholder="4111 2222 3333 4444"
                              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#FF5A1F] font-mono tracking-widest"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiration (MM/YY)</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                              placeholder="09/28"
                              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#FF5A1F] text-center font-mono"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Code CVC</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              placeholder="123"
                              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#FF5A1F] text-center font-mono"
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-4 sm:col-span-3">
                            <div className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                              <ShieldCheck size={12} /> SECURE
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium leading-relaxed">All data is tokenized via secure connections. No card data saved on company servers.</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right side summary totals */}
                  <div className="lg:col-span-4 bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-6 h-max space-y-6">
                    <div className="border-b border-[#E5E5E5] pb-4">
                      <h4 className="font-black text-xs text-[#0D0D0D] uppercase tracking-widest font-display">Grand Summary Statement</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Complete transaction securely.</p>
                    </div>

                    <div className="space-y-3.5 text-xs text-gray-600">
                      <div className="flex justify-between font-medium">
                        <span>Tire Package:</span>
                        <span className="font-mono text-gray-900 font-bold">${itemSubtotal}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Shipping to Installer:</span>
                        <span className="font-bold text-emerald-700 font-mono">FREE</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Sales Tax (8.25%):</span>
                        <span className="font-mono text-gray-900">${salesTax}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Promo Coupon:</span>
                          <span className="font-mono">-${appliedDiscount}</span>
                        </div>
                      )}
                      
                      {/* Installer review card info */}
                      {selectedInstaller && (
                        <div className="bg-white border border-[#E5E5E5] rounded-xl p-3 text-[10px] space-y-1.5 shadow-sm">
                          <p className="font-bold text-gray-950 flex items-center gap-1 uppercase tracking-wider text-[9px]"><MapPin size={10} className="text-[#FF5A1F]" /> Shipping Destination:</p>
                          <p className="text-gray-500 font-bold uppercase line-clamp-1">{selectedInstaller.name}</p>
                          <p className="text-gray-400 font-medium">Scheduled for fitting: <span className="font-bold text-emerald-700">{selectedInstaller.nextAvailable}</span></p>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-950 font-black border-t border-[#E5E5E5] pt-3 text-sm">
                        <span>Total Paid Today:</span>
                        <span className="font-mono text-[#FF5A1F] text-lg">${itemSubtotal + salesTax - appliedDiscount}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium border-t border-[#E5E5E5] pt-2 leading-relaxed">Local mounting fees of <strong className="text-gray-700 font-mono">${installationSubtotal}</strong> will be paid after service locally.</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(2)}
                        className="flex-1 py-3 text-sm font-bold text-gray-700 bg-white border border-[#E5E5E5] hover:bg-[#F5F5F3] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                      >
                        <ArrowLeft size={13} /> Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 text-sm font-extrabold text-white bg-[#FF5A1F] hover:bg-brand-orange-hover rounded-xl shadow-lg shadow-[#FF5A1F]/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                        id="place-order-submit-btn"
                      >
                        Place Order <ShieldCheck size={14} />
                      </button>
                    </div>
                  </div>

                </form>
              )}

              {/* STEP 4: ORDER CONFIRMED SUCCESS STATE */}
              {checkoutStep === 4 && (
                <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-md animate-fade-in" id="checkout-step-4-success">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mx-auto text-3xl font-black border border-[#E5E5E5]">
                    ✓
                  </div>

                  <div className="space-y-2">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest border border-[#E5E5E5]/40">
                      ORDER SUCCESSFULLY PLACED
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#0D0D0D] uppercase tracking-wider font-display">Your Tires are En Route!</h2>
                    <p className="text-xs text-gray-500 max-w-md mx-auto font-medium">
                      Thank you for choosing TireMax. We have sent a copy of your receipt and order details to <strong className="text-[#0D0D0D] font-bold">{custEmail || "your email address"}</strong>.
                    </p>
                  </div>

                  {/* Summary card receipt */}
                  <div className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-5 text-left text-xs text-gray-700 space-y-3 max-w-md mx-auto shadow-sm">
                    <div className="flex justify-between pb-2 border-b border-[#E5E5E5]">
                      <span className="font-mono text-gray-400 font-bold uppercase text-[9px] tracking-wider">Order ID</span>
                      <span className="font-mono font-black text-gray-900">#TMX-8942-02</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <p className="font-bold text-gray-900 text-[10px] uppercase tracking-wider flex items-center gap-1"><MapPin size={12} className="text-[#FF5A1F]" /> Shipping Destination:</p>
                      <p className="font-extrabold text-gray-800 pl-4 uppercase text-xs">{selectedInstaller?.name || "Apex Auto & Tire"}</p>
                      <p className="text-gray-500 pl-4 font-medium leading-relaxed">{selectedInstaller?.address || "1420 Olympic Blvd, Los Angeles, CA 90021"}</p>
                    </div>

                    <div className="space-y-1.5 border-t border-[#E5E5E5] pt-3">
                      <p className="font-bold text-gray-900 text-[10px] uppercase tracking-wider flex items-center gap-1"><Calendar size={12} className="text-[#FF5A1F]" /> Appointment Fitting Time:</p>
                      <p className="font-black text-emerald-700 pl-4 text-xs font-mono">{selectedInstaller?.nextAvailable || "Tomorrow, 9:00 AM"}</p>
                    </div>

                    <p className="text-[10px] text-gray-400 border-t border-[#E5E5E5] pt-2.5 leading-relaxed font-medium">
                      ★ Simply drive in at your scheduled time. The technician will install, balance, and configure your tires. Pay local alignment or mounting fees directly on-site.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button 
                      onClick={() => {
                        setCart([]); // Clear cart
                        setCheckoutStep(1);
                        setPage('home');
                      }}
                      className="bg-[#0D0D0D] hover:bg-gray-900 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      id="success-home-btn"
                    >
                      Return to Homepage
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}
    </>
  );
};
