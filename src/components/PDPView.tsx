import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, Check, Info, ArrowLeft, Truck, ShieldAlert, Heart, Calendar, Plus, MessageSquare } from 'lucide-react';
import { Tire, SavedVehicle, Review } from '../types';

interface PDPViewProps {
  setPage: (p: string) => void;
  tire: Tire;
  activeVehicle: SavedVehicle | null;
  addToCart: (tire: Tire, size: string, qty: number) => void;
}

export const PDPView: React.FC<PDPViewProps> = ({
  setPage,
  tire,
  activeVehicle,
  addToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(tire.sizes[0]);
  const [quantity, setQuantity] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'warranty' | 'shipping'>('overview');
  
  // Media view mode (3d, image1, image2) & 3D compatibility state
  const [mediaMode, setMediaMode] = useState<'image1' | 'image2'>('image1');
  
  // Cross sell options
  const [addTpms, setAddTpms] = useState<boolean>(false);
  const [addAllignment, setAddAllignment] = useState<boolean>(false);
  const [addHazardWarranty, setAddHazardWarranty] = useState<boolean>(false);

  // Review states
  const [reviewsList, setReviewsList] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Marcus Vance',
      rating: 5,
      date: 'Jun 12, 2026',
      vehicle: '2024 Tesla Model 3',
      text: 'Exceptional highway acoustics. My standard sport tire screamed on concrete pavement, but these have a deep, quiet rumble. Wet braking grip feels incredibly solid on steep hills.',
      verified: true,
      helpfulCount: 24
    },
    {
      id: 'rev-2',
      author: 'Dianne K.',
      rating: 4,
      date: 'May 28, 2026',
      vehicle: '2023 Honda Accord',
      text: 'Good value and robust tread wear so far. Have driven about 5,000 miles and the tread blocks look near brand new. Handles corners nicely at speed. Installers did a fast, clean job.',
      verified: true,
      helpfulCount: 15
    },
    {
      id: 'rev-3',
      author: 'Jason G.',
      rating: 5,
      date: 'Apr 19, 2026',
      vehicle: '2022 BMW 3 Series',
      text: 'Aggressive turn-in feel. If you like to take winding mountain passes with confidence, this performance rubber is unmatched for the price tag.',
      verified: true,
      helpfulCount: 42
    }
  ]);
  const [selectedReviewRatingFilter, setSelectedReviewRatingFilter] = useState<number | null>(null);

  // Write new review states
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newText, setNewText] = useState<string>('');
  const [newVehicle, setNewVehicle] = useState<string>('');

  // Handle write review
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newText) {
      alert("Please enter a name and review text.");
      return;
    }
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: 'Today',
      vehicle: newVehicle || 'Verified Buyer',
      text: newText,
      verified: true,
      helpfulCount: 0
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewAuthor('');
    setNewText('');
    setNewVehicle('');
    setShowReviewForm(false);
  };

  // Check if active garage vehicle fits
  const fitmentStatus = useMemo(() => {
    if (!activeVehicle) return null;
    const matchesSize = tire.sizes.includes(activeVehicle.tireSize);
    return {
      fits: matchesSize,
      message: matchesSize 
        ? `Guaranteed Fitment for your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.tireSize})!`
        : `Does not match stock dimension ${activeVehicle.tireSize} for your ${activeVehicle.make} ${activeVehicle.model}. Check other sizes or contact support.`
    };
  }, [activeVehicle, tire]);

  // Pricing calculations
  const baseTireTotal = tire.price * quantity;
  const installationTotal = tire.installPrice * quantity;
  const tpmsCost = addTpms ? 10 * quantity : 0;
  const alignmentCost = addAllignment ? 89 : 0;
  const warrantyCost = addHazardWarranty ? 15 * quantity : 0;
  
  const grandTotal = baseTireTotal + installationTotal + tpmsCost + alignmentCost + warrantyCost;

  const handleAddToCartSubmit = () => {
    // Add tire itself
    addToCart(tire, selectedSize, quantity);
    
    // Add accessories as custom mock cart additions if needed
    if (addTpms) {
      // simulate adding TPMS as separate cart accessory or custom attribute
    }
    
    setPage('cart-checkout');
  };

  const filteredReviews = useMemo(() => {
    if (selectedReviewRatingFilter === null) return reviewsList;
    return reviewsList.filter(r => r.rating === selectedReviewRatingFilter);
  }, [reviewsList, selectedReviewRatingFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-10" id="pdp-view-container">
      
      {/* Back button */}
      <button 
        onClick={() => setPage('plp')} 
        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-gray-950 transition-colors bg-[#F5F5F3] hover:bg-gray-100 py-2.5 px-4 rounded-xl border border-[#E5E5E5] cursor-pointer"
        id="pdp-back-btn"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Image display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-6 h-[320px] md:h-[440px] relative flex flex-col justify-center items-center overflow-hidden group/frame" id="pdp-photo-frame">
            
            {/* STATIC IMAGE CAROUSEL (Real High-Res Photos) */}
            <div className="relative w-full h-full flex items-center justify-center bg-white rounded-lg p-4 animate-fade-in">
              <span className="absolute top-4 left-4 bg-[#0D0D0D] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded shadow-sm z-20 flex items-center gap-1.5">
                Real High-Res Photo • {mediaMode === 'image2' ? 'Tread Close-up' : 'Front Angle'}
              </span>
              
              <img 
                src={mediaMode === 'image2' ? tire.image2 : tire.image1} 
                alt={tire.name} 
                className="max-h-[85%] object-contain transition-all duration-300" 
                referrerPolicy="no-referrer"
              />

              {/* Left/Right Carousel Nav Arrows */}
              <button 
                onClick={() => setMediaMode(mediaMode === 'image2' ? 'image1' : 'image2')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#FF5A1F] text-[#0D0D0D] hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md z-20 font-bold border border-[#E5E5E5]"
              >
                ◀
              </button>
              <button 
                onClick={() => setMediaMode(mediaMode === 'image1' ? 'image2' : 'image1')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#FF5A1F] text-[#0D0D0D] hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md z-20 font-bold border border-[#E5E5E5]"
              >
                ▶
              </button>

              <div className="absolute bottom-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                Showing Photo {mediaMode === 'image2' ? '2 / 2' : '1 / 2'}
              </div>
            </div>
          </div>

          {/* Alternate angle small gallery */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setMediaMode('image1')}
              className={`aspect-video bg-gray-50 border rounded-xl p-2 flex flex-col justify-center items-center cursor-pointer transition-all ${mediaMode === 'image1' ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20' : 'border-[#E5E5E5] hover:bg-gray-100'}`}
            >
              <img src={tire.image1} alt="Front View" className="max-h-16 object-contain mb-1" referrerPolicy="no-referrer" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Front Angle</span>
            </button>
            <button 
              onClick={() => setMediaMode('image2')}
              className={`aspect-video bg-gray-50 border rounded-xl p-2 flex flex-col justify-center items-center cursor-pointer transition-all ${mediaMode === 'image2' ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20' : 'border-[#E5E5E5] hover:bg-gray-100'}`}
            >
              <img src={tire.image2} alt="Tread Close-up" className="max-h-16 object-contain mb-1" referrerPolicy="no-referrer" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Tread Close-up</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Buying configurations */}
        <div className="lg:col-span-6 space-y-6" id="pdp-buying-controls-aside">
          
          {/* Header titles */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="text-[9px] font-black uppercase bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">{tire.brand}</span>
              <span>Premium Performance</span>
              <span className="text-gray-200">•</span>
              <span className="bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 text-[#FF5A1F] text-[9px] font-black px-2 py-0.5 rounded uppercase">{tire.type}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tight leading-tight uppercase font-display">{tire.name}</h1>
            
            {/* Reviews rating */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex text-[#FF5A1F]">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
              </div>
              <span className="text-xs font-bold text-gray-900">{tire.rating} Stars</span>
              <span className="text-gray-200">|</span>
              <span className="text-xs text-gray-500 font-semibold">{tire.reviewsCount} Verified reviews</span>
            </div>
          </div>

          {/* ACTIVE VEHICLE FITMENT WIDGET */}
          {fitmentStatus && (
            <div className={`p-4 rounded-xl border text-xs flex gap-3 items-center ${
              fitmentStatus.fits 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-950' 
                : 'bg-rose-50 border-rose-100 text-rose-950'
            }`} id="fitment-checker-alert">
              <span className="font-bold text-sm bg-white w-6 h-6 rounded-full flex items-center justify-center border shadow-sm">{fitmentStatus.fits ? "✓" : "!"}</span>
              <div>
                <p className="font-black uppercase tracking-wider text-[10px] text-gray-400">Garage Fitment Checker</p>
                <p className="font-semibold mt-0.5">{fitmentStatus.message}</p>
              </div>
            </div>
          )}

          {/* Pricing & Deals card */}
          <div className="p-5 bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Single Tire Price</span>
                <span className="text-3xl font-black text-gray-950">${tire.price}</span>
                <span className="text-xs text-gray-400 font-mono"> /ea</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Pre-paid Installation</span>
                <span className="text-base font-extrabold text-[#FF5A1F] font-mono">+${tire.installPrice} <span className="text-xs text-gray-400 font-normal">/tire</span></span>
              </div>
            </div>
            
            <div className="flex gap-2 text-[10px] text-emerald-700 font-bold bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <Truck size={14} /> Shipping to local warehouse installer is 100% FREE.
            </div>
          </div>

          {/* Size & Quantity configuration selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Size Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Tire Size:</label>
              <select 
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl py-3 px-4 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
                id="pdp-size-select"
              >
                {tire.sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Qty Stepper */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity:</label>
              <div className="flex items-center border border-[#E5E5E5] rounded-xl bg-white overflow-hidden h-11.5">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="flex-1 text-center py-2 hover:bg-gray-50 text-gray-600 font-black cursor-pointer"
                  id="pdp-qty-minus"
                >
                  -
                </button>
                <span className="flex-1 text-center font-black text-sm text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="flex-1 text-center py-2 hover:bg-gray-50 text-gray-600 font-black cursor-pointer"
                  id="pdp-qty-plus"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* CROSS SELL PANEL ("Complete your order") */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complete Your Professional Installation:</h4>
            <div className="flex flex-col gap-2.5">
              
              <label className="flex items-center gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl hover:border-gray-300 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addTpms}
                  onChange={(e) => setAddTpms(e.target.checked)}
                  className="rounded border-gray-300 text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer h-4 w-4"
                />
                <div className="flex-1 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-gray-900">Premium TPMS Air Sensors</p>
                    <p className="text-[10px] text-gray-400 font-medium">Monitors pressure digitally, prevents blowout risks.</p>
                  </div>
                  <span className="font-mono font-bold text-gray-900">+${10 * quantity}</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl hover:border-gray-300 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addAllignment}
                  onChange={(e) => setAddAllignment(e.target.checked)}
                  className="rounded border-gray-300 text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer h-4 w-4"
                />
                <div className="flex-1 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-gray-900">Pre-Paid Wheel Alignment Service</p>
                    <p className="text-[10px] text-gray-400 font-medium font-sans">Calibrates suspension variables locally. Highly recommended for new tires.</p>
                  </div>
                  <span className="font-mono font-bold text-gray-900">+$89</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl hover:border-gray-300 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addHazardWarranty}
                  onChange={(e) => setAddHazardWarranty(e.target.checked)}
                  className="rounded border-gray-300 text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer h-4 w-4"
                />
                <div className="flex-1 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-gray-900">1-Year Road-Hazard Hazard Warranty</p>
                    <p className="text-[10px] text-gray-400 font-medium">Covers pothole cuts and nail punctures. Immediate swap.</p>
                  </div>
                  <span className="font-mono font-bold text-[#0D0D0D]">+${15 * quantity}</span>
                </div>
              </label>

            </div>
          </div>

          {/* Checkout CTA block */}
          <div className="pt-4 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-bold">Estimated Order Total</span>
              <span className="text-2xl font-black text-gray-950">${grandTotal}</span>
              <span className="text-[10px] text-gray-500 block font-mono">Including ${installationTotal} installation fee</span>
            </div>
            
            <button
              onClick={handleAddToCartSubmit}
              className="w-full md:w-auto bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold px-8 py-4.5 rounded-xl shadow-lg shadow-[#FF5A1F]/10 text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
              id="pdp-add-to-cart-btn"
            >
              Configure Set & Add to Cart
            </button>
          </div>

        </div>

      </div>

      {/* Specifications & Overview Tabs */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 space-y-6" id="pdp-specifications-section">
        
        {/* Tab triggers */}
        <div className="flex gap-4 border-b border-gray-100 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', title: 'Product Overview' },
            { id: 'specs', title: 'Detailed Specifications' },
            { id: 'warranty', title: 'Warranty details' },
            { id: 'shipping', title: 'Shipping & Easy Returns' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-bold pb-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-gray-600 leading-relaxed">{tire.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {tire.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-700">
                  <span className="text-orange-500 font-extrabold">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-fade-in" id="pdp-specs-grid">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block font-medium">Treadwear UTQG</span>
              <span className="font-bold text-gray-900 mt-1 block font-mono">{tire.specs.utqg}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block font-medium">Load Rating Index</span>
              <span className="font-bold text-gray-900 mt-1 block font-mono">{tire.specs.loadIndex}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block font-medium">Speed Symbol</span>
              <span className="font-bold text-gray-900 mt-1 block font-mono">{tire.specs.speedRating}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block font-medium">Season / Compound</span>
              <span className="font-bold text-gray-900 mt-1 block">{tire.specs.season}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block font-medium">Sidewall Style</span>
              <span className="font-bold text-gray-900 mt-1 block">{tire.specs.sidewall}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block font-medium">Run-Flat Safety Tech</span>
              <span className="font-bold text-gray-900 mt-1 block">{tire.specs.runFlat ? 'Yes' : 'No'}</span>
            </div>
          </div>
        )}

        {/* Tab 3: Warranty */}
        {activeTab === 'warranty' && (
          <div className="space-y-3 text-xs text-gray-600 animate-fade-in">
            <h4 className="font-bold text-gray-900 text-sm">Manufacturer Coverage Plan</h4>
            <p className="leading-relaxed">Your purchase of {tire.name} is protected by a solid <strong>{tire.specs.warranty}</strong> treadwear warranty coverage.</p>
            <p className="leading-relaxed">Additionally, we offer a 45-day trial period. If you are not satisfied with the noise levels, ride smoothness, or handling parameters of your tires, return them within 45 days for an immediate set swap or full purchase refund.</p>
          </div>
        )}

        {/* Tab 4: Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-3 text-xs text-gray-600 animate-fade-in">
            <h4 className="font-bold text-gray-900 text-sm">Free Delivery to Local Installer</h4>
            <p className="leading-relaxed">All tires are shipped free of charge to any of our 10,000+ partner local installers across the United States. Transit times take 1-2 business days depending on warehouse distance.</p>
            <p className="leading-relaxed">If you decide to cancel before installation or returns are requested, return shipping is covered with no hidden restocking fees. Rest assured knowing your online purchase is 100% protected.</p>
          </div>
        )}

      </section>

      {/* CUSTOMER REVIEWS WITH RATING Visual block and dynamic Review write form */}
      <section className="bg-[#F5F5F3] rounded-xl p-6 md:p-8 space-y-8" id="pdp-reviews-section">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-[#0D0D0D] uppercase tracking-tight font-display">Customer Ratings & Feedback</h2>
            <p className="text-xs text-gray-500 mt-1">Showing actual verified reviews of the {tire.name}.</p>
          </div>
          
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white font-extrabold px-5 py-2.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            id="write-review-trigger-btn"
          >
            <MessageSquare size={14} /> Write Product Review
          </button>
        </div>

        {/* Interactive write review form */}
        {showReviewForm && (
          <form onSubmit={handleAddReviewSubmit} className="bg-white border border-[#E5E5E5] p-6 rounded-xl space-y-4 animate-fade-in" id="add-review-form">
            <h3 className="text-xs font-black text-[#0D0D0D] border-b border-[#E5E5E5] pb-2 uppercase tracking-widest">Submit Your Review</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Your Name</label>
                <input 
                  type="text" 
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Sandra Bullock" 
                  className="w-full bg-gray-50 border border-[#E5E5E5] rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#FF5A1F] font-semibold text-gray-800"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Your Vehicle Fitment</label>
                <input 
                  type="text" 
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  placeholder="e.g. 2024 Tesla Model Y" 
                  className="w-full bg-gray-50 border border-[#E5E5E5] rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#FF5A1F] font-semibold text-gray-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Star Rating</label>
                <select 
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-[#E5E5E5] rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#FF5A1F] cursor-pointer font-bold text-gray-800"
                >
                  <option value={5}>★★★★★ 5 Stars</option>
                  <option value={4}>★★★★☆ 4 Stars</option>
                  <option value={3}>★★★☆☆ 3 Stars</option>
                  <option value={2}>★★☆☆☆ 2 Stars</option>
                  <option value={1}>★☆☆☆☆ 1 Star</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Review Description</label>
              <textarea 
                rows={3}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="How was the noise level, dry grip, road comfort, or installation experience?"
                className="w-full bg-gray-50 border border-[#E5E5E5] rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-[#FF5A1F] text-gray-800 font-semibold"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="py-2.5 px-4 rounded text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer uppercase tracking-wider text-[10px]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-2.5 px-5 rounded text-xs cursor-pointer shadow-lg shadow-[#FF5A1F]/10 uppercase tracking-wider"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}

        {/* Review list */}
        <div className="flex flex-col gap-4" id="pdp-reviews-list">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-sm space-y-3.5"
              id={`pdp-review-card-${rev.id}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-gray-950">{rev.author}</span>
                  <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">({rev.vehicle})</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex text-[#FF5A1F]">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                </div>
                <span className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck size={11} /> Verified Buyer
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic font-medium font-sans">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-2.5 text-[10px] text-gray-400 pt-1">
                <span className="font-medium">Was this review helpful?</span>
                <button 
                  onClick={() => alert("Thank you for your feedback!")}
                  className="hover:text-[#FF5A1F] font-bold underline cursor-pointer"
                >
                  Yes ({rev.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* MOBILE PERSISTENT FLOATING ADD TO CART PILL (sticks to bottom on small devices) */}
      <div 
        className="md:hidden fixed bottom-18 left-4 right-4 bg-black/95 text-white p-3.5 rounded-xl shadow-2xl border border-neutral-800 z-30 flex items-center justify-between"
        id="mobile-sticky-cart-strip"
      >
        <div>
          <span className="text-[9px] text-gray-400 block uppercase font-mono">Estimate set of {quantity}:</span>
          <span className="text-sm font-black text-white">${grandTotal}</span>
        </div>
        <button
          onClick={handleAddToCartSubmit}
          className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded cursor-pointer animate-pulse"
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
};
