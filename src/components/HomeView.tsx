import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, HelpCircle, Sparkles, Check, ChevronRight, PenTool, Flame, Snowflake, TreePine, Zap, CreditCard, TrendingUp, RefreshCw, Truck, Search, MapPin, Wrench } from 'lucide-react';
import { Tire, SavedVehicle } from '../types';
import { TIRES, CAR_DATABASE, REBATES } from '../data';

interface HomeViewProps {
  setPage: (p: string) => void;
  setSelectedTire: (t: Tire) => void;
  zipCode: string;
  addVehicleToGarage: (v: SavedVehicle) => void;
  setActiveVehicle: (v: SavedVehicle | null) => void;
  onSearchSubmit: (q: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setPage,
  setSelectedTire,
  zipCode,
  addVehicleToGarage,
  setActiveVehicle,
  onSearchSubmit
}) => {
  // Recommendation Wizard State
  const [wizStep, setWizStep] = useState<number>(1); // 1: Year, 2: Make, 3: Model, 4: Trim
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedTrim, setSelectedTrim] = useState<{ trim: string; size: string } | null>(null);

  // Quick tabs for recommended tires (e.g., Performance, Winter, Rugged All-Terrain)
  const [activeRecommendTab, setActiveRecommendTab] = useState<'local' | 'performance' | 'allterrain'>('local');

  // Handle Wizard Selections
  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedMake('');
    setSelectedModel('');
    setSelectedTrim(null);
    setWizStep(2);
  };

  const handleMakeSelect = (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedTrim(null);
    setWizStep(3);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setSelectedTrim(null);
    setWizStep(4);
  };

  const handleTrimSelect = (trimObj: { trim: string; size: string }) => {
    setSelectedTrim(trimObj);
    
    // Auto-create a saved vehicle and add to garage!
    const newVehicle: SavedVehicle = {
      id: `saved-${Date.now()}`,
      year: selectedYear,
      make: selectedMake,
      model: selectedModel,
      trim: trimObj.trim,
      tireSize: trimObj.size,
      isDefault: true
    };
    
    addVehicleToGarage(newVehicle);
    setActiveVehicle(newVehicle);
    
    // Set searchQuery to the matching size and submit
    onSearchSubmit(trimObj.size);
  };

  const resetWizard = () => {
    setSelectedYear('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedTrim(null);
    setWizStep(1);
  };

  // Helper: recommend tires based on ZIP first number (simulates local climates)
  const getLocalClimaticRecommendation = (): { title: string; subtitle: string; tires: Tire[]; iconType: 'winter' | 'summer' | 'allseason'; bgStyle: string } => {
    const firstDigit = zipCode.charAt(0);
    if (['5', '8', '0', '1'].includes(firstDigit)) {
      // Cold northern areas
      return {
        title: "Sub-Zero Grip Protection",
        subtitle: `Recommended for freezing temps in ZIP area ${zipCode}`,
        tires: TIRES.filter(t => t.type === 'Winter' || t.type === 'Touring'),
        iconType: 'winter',
        bgStyle: "from-blue-50/50 to-indigo-50/30 border-blue-100"
      };
    } else if (['7', '9', '3'].includes(firstDigit)) {
      // Hot/sunny southern areas
      return {
        title: "High Temp & Performance Grip",
        subtitle: `Optimized for warm Southern highways in ZIP area ${zipCode}`,
        tires: TIRES.filter(t => t.type === 'Performance' || t.type === 'Summer'),
        iconType: 'summer',
        bgStyle: "from-orange-50/50 to-amber-50/30 border-orange-100"
      };
    } else {
      // Moderate climate
      return {
        title: "All-Terrain & Versatile Comfort",
        subtitle: `Perfect all-season choices for ZIP area ${zipCode}`,
        tires: TIRES.filter(t => t.type === 'All-Terrain' || t.type === 'Touring' || t.type === 'All-Season'),
        iconType: 'allseason',
        bgStyle: "from-emerald-50/50 to-teal-50/30 border-emerald-100"
      };
    }
  };

  const climateRec = getLocalClimaticRecommendation();

  const renderBrandBadge = (brand: string) => {
    const colors: Record<string, string> = {
      'Velocita': 'bg-orange-50 text-orange-700 border-orange-200',
      'TerraCore': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'NorseGrip': 'bg-blue-50 text-blue-700 border-blue-200',
      'EcoMax': 'bg-teal-50 text-teal-700 border-teal-200',
      'HeavyDuty': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    const color = colors[brand] || 'bg-gray-50 text-gray-700 border-gray-200';
    return (
      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${color}`}>
        {brand}
      </span>
    );
  };

  // Get active display tires based on carousel selection
  const getDisplayTires = () => {
    if (activeRecommendTab === 'local') return climateRec.tires;
    if (activeRecommendTab === 'performance') return TIRES.filter(t => t.type === 'Performance' || t.type === 'Summer');
    return TIRES.filter(t => t.type === 'All-Terrain' || t.type === 'Commercial');
  };

  const displayTires = getDisplayTires();

  return (
    <div className="space-y-16 pb-12" id="home-view-container">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-neutral-100 min-h-[500px] flex items-center justify-center pt-16 pb-24 px-4 overflow-visible" id="hero-section">
        
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-8">
          
          <div className="relative w-full text-left px-4 md:px-12 py-8 md:py-16">
            <div className="relative z-20">
              <h2 className="text-gray-500 text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase mb-2">TRACK-TESTED. STREET-PROVEN.</h2>
              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[110px] font-black text-[#1A1A1A] tracking-tighter uppercase leading-[0.85] drop-shadow-sm">
                THE<br/>ULTIMATE<br/>GRIP
              </h1>
            </div>

            {/* Transparent PNG Tire Stack - overlapping the bottom-right of the text block and rightmost edge of 'E' in 'ULTIMATE' on mobile */}
            <div className="absolute z-30 bottom-[10px] sm:bottom-[0px] md:bottom-[-45px] lg:bottom-[-50px] right-[2%] sm:right-[4%] md:right-[-15px] lg:right-[-30px] w-[110px] sm:w-[140px] md:w-[220px] lg:w-[250px] pointer-events-none">
              <img 
                src="https://pngimg.com/uploads/tire/tire_PNG25.png" 
                alt="Premium Tire Stack"
                className="w-full h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>

          <div className="relative z-40 bg-[#FF5A1F] text-white p-3 md:p-4 rounded-xl inline-block shadow-lg ml-4 md:ml-12 mr-auto transform -rotate-1 hover:rotate-0 transition-transform mt-8 md:mt-4 max-w-[calc(100%-2rem)]">
            <p className="font-bold text-xs sm:text-sm md:text-lg tracking-wider uppercase text-center sm:text-left">
              Free Shipping in Houston & Up to 20% Off Nationwide!
            </p>
          </div>

          {/* Search Box */}
          <div className="relative z-40 bg-white rounded-2xl p-4 md:p-6 shadow-2xl max-w-4xl mx-auto md:mx-12 mt-8 text-left border border-gray-100">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-100 pb-4 mb-4">
              <button className="px-4 py-2 bg-gray-100 text-[#1A1A1A] font-bold rounded-lg text-sm border-2 border-transparent hover:border-gray-200 cursor-pointer">4th Of July Sale</button>
              <button className="px-4 py-2 bg-white text-gray-500 font-bold rounded-lg text-sm hover:bg-gray-50 cursor-pointer border-2 border-transparent">Vehicle</button>
              <button className="px-4 py-2 bg-white text-gray-500 font-bold rounded-lg text-sm hover:bg-gray-50 cursor-pointer border-2 border-transparent">Tire Size</button>
              <button className="px-4 py-2 bg-white text-gray-500 font-bold rounded-lg text-sm hover:bg-gray-50 cursor-pointer border-2 border-transparent">Guide</button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#FF5A1F] focus-within:border-transparent transition-all">
                <div className="pl-4 text-gray-400">
                  <Search size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by 4th of July Sale"
                  className="w-full py-3.5 px-3 focus:outline-none text-sm font-medium"
                />
              </div>
              <button className="w-full md:w-auto bg-[#FF5A1F] hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg uppercase tracking-wider text-sm whitespace-nowrap transition-colors cursor-pointer shadow-md">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GUIDED SHOPPING / 3-STEP RECOMMENDATION TOOL */}
      <section className="bg-[#F5F5F3] py-12 px-4 lg:px-8 border-t border-b border-[#E5E5E5]" id="wizard-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/5 px-3.5 py-1.5 rounded-full border border-[#E5E5E5]">Interactive Finder</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tight mt-3 uppercase font-display">Find Exactly What Fits Your Vehicle</h2>
            <p className="text-xs text-gray-500 mt-1">Our dynamic lookup matching car models directly to tire dimensions.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-8 shadow-sm relative" id="wizard-box">
            
            {/* Breadcrumb path for wizard */}
            <div className="flex items-center gap-2 mb-6 text-xs overflow-x-auto pb-2 border-b border-gray-100">
              <button 
                onClick={() => setWizStep(1)} 
                className={`font-semibold cursor-pointer ${wizStep >= 1 ? 'text-orange-500' : 'text-gray-400'}`}
              >
                Year {selectedYear ? `(${selectedYear})` : ''}
              </button>
              <ChevronRight size={12} className="text-gray-300" />
              <button 
                onClick={() => selectedYear && setWizStep(2)} 
                className={`font-semibold cursor-pointer ${wizStep >= 2 ? 'text-orange-500' : 'text-gray-400'}`}
                disabled={!selectedYear}
              >
                Make {selectedMake ? `(${selectedMake})` : ''}
              </button>
              <ChevronRight size={12} className="text-gray-300" />
              <button 
                onClick={() => selectedMake && setWizStep(3)} 
                className={`font-semibold cursor-pointer ${wizStep >= 3 ? 'text-orange-500' : 'text-gray-400'}`}
                disabled={!selectedMake}
              >
                Model {selectedModel ? `(${selectedModel})` : ''}
              </button>
              <ChevronRight size={12} className="text-gray-300" />
              <span className={`font-semibold ${wizStep === 4 ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>
                Trim & Size
              </span>
            </div>

            {/* STEP 1: Select Year */}
            {wizStep === 1 && (
              <div className="space-y-4 animate-fade-in" id="wiz-step-1">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Production Year:</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {CAR_DATABASE.years.map((y) => (
                    <button
                      key={y}
                      onClick={() => handleYearSelect(y)}
                      className="py-3 bg-[#F5F5F3] hover:bg-[#FF5A1F]/5 border border-[#E5E5E5] hover:border-[#FF5A1F] rounded-xl font-bold text-sm text-gray-800 hover:text-[#FF5A1F] transition-colors cursor-pointer"
                      id={`wiz-year-${y}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Select Make */}
            {wizStep === 2 && (
              <div className="space-y-4 animate-fade-in" id="wiz-step-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Manufacturer Make ({selectedYear}):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CAR_DATABASE.makes[selectedYear]?.map((mk) => (
                    <button
                      key={mk}
                      onClick={() => handleMakeSelect(mk)}
                      className="py-3 bg-[#F5F5F3] hover:bg-[#FF5A1F]/5 border border-[#E5E5E5] hover:border-[#FF5A1F] rounded-xl font-bold text-sm text-gray-800 hover:text-[#FF5A1F] transition-colors text-left px-4 cursor-pointer"
                      id={`wiz-make-${mk}`}
                    >
                      {mk}
                    </button>
                  ))}
                </div>
                <button onClick={resetWizard} className="text-xs text-[#FF5A1F] hover:underline font-bold mt-2">← Back / Reset</button>
              </div>
            )}

            {/* STEP 3: Select Model */}
            {wizStep === 3 && (
              <div className="space-y-4 animate-fade-in" id="wiz-step-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Vehicle Model ({selectedYear} {selectedMake}):</p>
                <div className="grid grid-cols-2 gap-3">
                  {CAR_DATABASE.models[selectedMake]?.map((md) => (
                    <button
                      key={md}
                      onClick={() => handleModelSelect(md)}
                      className="py-3 bg-[#F5F5F3] hover:bg-[#FF5A1F]/5 border border-[#E5E5E5] hover:border-[#FF5A1F] rounded-xl font-bold text-sm text-gray-800 hover:text-[#FF5A1F] transition-colors text-left px-4 cursor-pointer"
                      id={`wiz-model-${md}`}
                    >
                      {md}
                    </button>
                  ))}
                </div>
                <button onClick={() => setWizStep(2)} className="text-xs text-[#FF5A1F] hover:underline font-bold mt-2">← Back</button>
              </div>
            )}

            {/* STEP 4: Select Trim / Output tire size */}
            {wizStep === 4 && (
              <div className="space-y-4 animate-fade-in" id="wiz-step-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Specific Trim Package ({selectedYear} {selectedMake} {selectedModel}):</p>
                <div className="flex flex-col gap-3">
                  {CAR_DATABASE.trims[selectedModel] ? (
                    CAR_DATABASE.trims[selectedModel].map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTrimSelect(t)}
                        className="p-4 bg-[#F5F5F3] hover:bg-[#FF5A1F]/5 border border-[#E5E5E5] hover:border-[#FF5A1F]/30 rounded-xl transition-all text-left flex justify-between items-center group cursor-pointer"
                        id={`wiz-trim-${idx}`}
                      >
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm group-hover:text-[#FF5A1F]">{t.trim}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">OEM Wheel Size Recommendation</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-mono text-xs bg-[#FF5A1F]/10 text-[#FF5A1F] px-2.5 py-1 rounded-md font-bold group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                            {t.size}
                          </span>
                          <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-gray-500">
                      Standard Size Recommendation:
                      <button 
                        onClick={() => handleTrimSelect({ trim: 'Standard Fitment', size: '245/40R19' })}
                        className="block mt-2.5 mx-auto bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                        id="wiz-default-size"
                      >
                        Use 245/40R19 Standard
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => setWizStep(3)} className="text-xs text-[#FF5A1F] hover:underline font-bold mt-2">← Back</button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. TRUST BAR (Swipeable cards on mobile, fully responsive row) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8" id="trust-bar-section">
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-4 py-2 scrollbar-none snap-x snap-mandatory pb-4 lg:pb-0 scroll-smooth" id="trust-bar-scroller">
          {[
            { icon: <Zap className="text-[#FF5A1F]" size={20} />, title: "Free Installer Delivery", desc: "Arrives in 1-2 days" },
            { icon: <ShieldCheck className="text-[#FF5A1F]" size={20} />, title: "Best Price Match", desc: "Beating all local offers" },
            { icon: <CreditCard className="text-[#FF5A1F]" size={20} />, title: "Flexible Financing", desc: "Buy now, pay over time" },
            { icon: <TrendingUp className="text-[#FF5A1F]" size={20} />, title: "80,000-Mile Warranties", desc: "Extensive product coverage" },
            { icon: <Wrench className="text-[#FF5A1F]" size={20} />, title: "Roadside Assistance", desc: "1-Yr free towing support" },
            { icon: <RefreshCw className="text-[#FF5A1F]" size={20} />, title: "45-Day Ride Trial", desc: "Zero risk swap trial" }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="min-w-[240px] lg:min-w-0 bg-gray-50 border border-gray-150 rounded-2xl p-4 flex gap-3 items-center snap-center shadow-sm"
              id={`trust-pill-${idx}`}
            >
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-950 uppercase tracking-wider">{item.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BRAND LOGO STRIP (Color on hover) */}
      <section className="bg-gray-50/30 py-8 border-t border-b border-gray-100/60" id="brands-strip-section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-400 mb-6">Partnering with the world’s finest tire brands</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-75">
            {[
              { label: "VEL", name: "VELOCITA" },
              { label: "TER", name: "TERRA-CORE" },
              { label: "NOR", name: "NORSE-GRIP" },
              { label: "ECO", name: "ECO-MAX" },
              { label: "HDY", name: "HEAVY-DUTY" },
              { label: "CMP", name: "CHAMPION" }
            ].map((brand, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 hover:opacity-100 hover:text-[#FF5A1F] transition-all cursor-pointer grayscale hover:grayscale-0 group"
                id={`brand-logo-${idx}`}
              >
                <span className="font-mono text-[9px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-black group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">{brand.label}</span>
                <span className="text-[11px] font-black tracking-widest text-gray-800 uppercase font-sans">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RECOMMENDED FOR YOUR AREA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6" id="recommendations-section">
        
        {/* Dynamic Area Header box (Hit the road!) */}
        <div className="bg-neutral-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden" id="climate-recommendation-banner">
          <div className="z-10 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900 mb-2">Hit the road!</h3>
            <p className="text-gray-600 font-medium">These tires fare well in your area.</p>
            <button className="mt-6 bg-[#FF5A1F] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider text-sm transition-colors shadow-md">
              Shop by vehicle
            </button>
          </div>
          
          <div className="relative mt-8 md:mt-0 z-10 w-full max-w-md h-48 md:h-60 flex justify-center md:justify-end overflow-visible" id="climate-banner-media-container">
            {/* Real, gorgeous high-quality Adventure Vehicle Image */}
            <div className="w-72 sm:w-80 md:w-96 h-full rounded-2xl overflow-hidden shadow-lg border border-white">
              <img 
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600" 
                alt="Adventure Vehicle" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* High-quality local floating tire overlapping the side of the vehicle image */}
            <div className="absolute -bottom-6 -left-4 sm:left-2 md:-left-8 w-24 sm:w-28 md:w-36 h-24 sm:h-28 md:h-36 pointer-events-none z-20">
              <img 
                src="/src/assets/images/tire_rugged_allterrain_1782936558500.jpg" 
                alt="Rugged Tire Detail" 
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl bg-white" 
              />
            </div>
          </div>
        </div>

        {/* Carousel of recommended tires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="recommendations-grid">
          {displayTires.slice(0, 4).map((tire) => (
            <div 
              key={tire.id}
              onClick={() => {
                setSelectedTire(tire);
                setPage('pdp');
              }}
              className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden hover:shadow-lg hover:border-[#FF5A1F]/30 transition-all cursor-pointer group flex flex-col h-full"
              id={`rec-tire-card-${tire.id}`}
            >
              {/* Image box */}
              <div className="aspect-4/3 bg-[#F5F5F3]/50 flex items-center justify-center p-4 relative overflow-hidden">
                <img 
                  src={tire.image1} 
                  alt={tire.name} 
                  referrerPolicy="no-referrer"
                  className="max-h-36 object-contain group-hover:scale-105 transition-transform" 
                  id={`rec-tire-img-${tire.id}`}
                />
                
                {/* Dynamic badge */}
                {tire.promoBadge && (
                  <span className="absolute top-3 left-3 bg-[#0D0D0D] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    {tire.promoBadge}
                  </span>
                )}
                
                {/* Micro Category Tag */}
                <span className="absolute bottom-3 right-3 text-[9px] font-bold text-gray-400 bg-white border border-[#E5E5E5] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {tire.type}
                </span>
              </div>

              {/* Text content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    {renderBrandBadge(tire.brand)}
                  </div>
                  <h4 className="font-extrabold text-sm text-gray-900 mt-1 leading-tight group-hover:text-[#FF5A1F] transition-colors">
                    {tire.name}
                  </h4>
                  
                  {/* Reviews rating */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex text-[#FF5A1F]">
                      <Star size={11} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{tire.rating}</span>
                    <span className="text-[10px] text-gray-400">({tire.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Tire Price</span>
                    <p className="text-base font-black text-gray-950">
                      ${tire.price}
                      <span className="text-xs text-gray-400 font-normal"> /ea</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Or Installed:</span>
                    <span className="text-xs font-extrabold text-[#FF5A1F]">
                      ${tire.price + tire.installPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 6. DEALS & REBATES - Card grid with clear high-contrast imagery */}
      <section className="bg-[#FF5A1F] text-white py-16 px-6 lg:px-8" id="deals-section">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-white tracking-widest bg-white/15 border border-white/25 px-3 py-1 rounded-full">Save Big Today</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-3 uppercase font-display">Active Manufacturer Rebates</h2>
              <p className="text-xs text-orange-50/90 mt-1 font-medium">We bundle mail-in checks and immediate discounts at point of sale.</p>
            </div>
            <button 
              onClick={() => setPage('deals')}
              className="text-xs text-white hover:text-black uppercase tracking-widest font-black flex items-center gap-1 group cursor-pointer border-b-2 border-white pb-1 transition-colors"
              id="deals-see-all-btn"
            >
              See All Offers
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="deals-cards-grid">
            {REBATES.map((reb, idx) => (
              <div 
                key={reb.id}
                className="bg-white border border-orange-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                id={`deal-card-${reb.id}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black tracking-widest text-[#FF5A1F] uppercase font-mono px-2.5 py-1.5 bg-orange-50 border border-orange-100 rounded">
                      {reb.brand.toUpperCase()}
                    </span>
                    <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
                      SAVE ${reb.amount}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#1A1A1A] uppercase tracking-wider">{reb.title}</h4>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {reb.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-mono text-[10px]">Expires {reb.expires}</span>
                  <button 
                    onClick={() => { setPage('plp'); }}
                    className="text-[#FF5A1F] hover:text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    id={`apply-rebate-btn-${idx}`}
                  >
                    Apply Deal <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.5 GUIDED SHOPPING - Diagonal background */}
      <section className="relative overflow-hidden bg-[#FF5A1F] py-20 px-4 md:px-8 text-white skew-y-[-2deg] my-16">
        <div className="skew-y-[2deg] max-w-7xl mx-auto space-y-12">
          <div className="text-center md:text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2 text-orange-100">Guided shopping</h2>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Get a personalized set<br/>of tire recommendations.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
              <h4 className="text-xl font-bold uppercase">Find the tire right for you.</h4>
              <p className="text-gray-500 font-medium text-sm">Share your tire preferences and your vehicle information.</p>
            </div>
            
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
              <h4 className="text-xl font-bold uppercase">We recommend tires based on...</h4>
              <p className="text-gray-500 font-medium text-sm">Real customer feedback and performance data.</p>
            </div>
            
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
              <h4 className="text-xl font-bold uppercase">What we'll deliver to you...</h4>
              <p className="text-gray-500 font-medium text-sm">Customized tire options based on what's best for you.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-black hover:bg-neutral-900 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider transition-colors">
              Enter your vehicle info
            </button>
            <button className="bg-transparent hover:bg-orange-600 border-2 border-white text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wider transition-colors">
              Chat with a tire expert
            </button>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS - 4 Step connected layout */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10" id="how-it-works-section">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/5 px-3 py-1 rounded-full border border-[#E5E5E5]">Simple Process</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tight mt-3 uppercase font-display">How Buying Tires Online Works</h2>
          <p className="text-xs text-gray-500 mt-1">We cut out the middlemen so you don't waste hours sitting in retail lobbies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative" id="how-it-works-grid">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gray-100 -z-10" />

          {[
            { step: "01", icon: <Search className="text-[#FF5A1F]" size={22} />, title: "Select Tires Online", desc: "Use our vehicle finder or scan dimensions on your driver-side door jamb." },
            { step: "02", icon: <MapPin className="text-[#FF5A1F]" size={22} />, title: "Choose Installer", desc: "Select a certified installer near your ZIP code with transparent pricing." },
            { step: "03", icon: <Truck className="text-[#FF5A1F]" size={22} />, title: "Free Express Shipping", desc: "We ship tires directly to the selected garage bay. Ready in 1-2 days." },
            { step: "04", icon: <Wrench className="text-[#FF5A1F]" size={22} />, title: "Drive In & Install", desc: "Arrive at your scheduled time. Pay installation locally, tires are already paid!" }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-[#E5E5E5] rounded-xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow relative"
              id={`how-works-step-${idx}`}
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-gray-300 font-mono">{item.step}</div>
              <div className="w-12 h-12 bg-[#F5F5F3] rounded-xl flex items-center justify-center mx-auto shadow-inner">{item.icon}</div>
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SOCIAL PROOF & MEDIA MENTIONS */}
      <section className="bg-[#F5F5F3] py-16 px-6 lg:px-8 border-t border-b border-[#E5E5E5]" id="social-proof-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/5 px-3 py-1 rounded-full border border-[#E5E5E5]">Social Proof</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tight leading-tight uppercase font-display">Voted #1 Online Tire Retailer</h2>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed mx-auto lg:mx-0">
              Check out our verified customer statistics and what leading publications are saying.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 text-center">
              <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-2xl font-black text-[#FF5A1F]">4.8★</p>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-1">Google Reviews</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
                <p className="text-2xl font-black text-[#FF5A1F]">98%</p>
                <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-1">On-Time Rates</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6" id="reviews-cards-container">
            {[
              { author: "Michael S. (Tesla Model 3)", rating: 5, date: "June 2026", text: "Finding matching sizes for the Model 3 performance was extremely easy. The 3D view gave me a clear idea of the tread blocks, and the local shop installed them in 40 minutes flat." },
              { author: "Sarah D. (Ford F-150)", rating: 5, date: "May 2026", text: "Saved almost $180 buying my RidgeRider tires here compared to the dealership. The site coordinates the local garage appointment for you. Incredible experience!" }
            ].map((review, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#E5E5E5] p-6 rounded-xl shadow-sm space-y-3"
                id={`home-review-${idx}`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-gray-950">{review.author}</span>
                  <span className="text-gray-400">{review.date}</span>
                </div>
                <div className="flex text-[#FF5A1F]">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 w-max px-2.5 py-1 rounded uppercase tracking-wider">
                  <ShieldCheck size={12} /> Verified Purchase
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8.5 PROMISES & CONFIDENCE */}
      <section className="bg-neutral-100 py-16 px-4 md:px-8 border-t border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="space-y-8">
            <h3 className="text-xl md:text-2xl font-black uppercase text-center md:text-left tracking-tight">Our promises</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="bg-[#FF5A1F] text-white p-3 rounded-full"><Truck size={24} /></div>
                <h4 className="font-bold text-sm uppercase">Free shipping</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Fast, free delivery to your local installer or home on orders of 2 or more tires.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="bg-[#FF5A1F] text-white p-3 rounded-full"><ShieldCheck size={24} /></div>
                <h4 className="font-bold text-sm uppercase">Best price guarantee</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Find a lower price? We'll match it and give you an extra 5% off.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="bg-[#FF5A1F] text-white p-3 rounded-full"><Sparkles size={24} /></div>
                <h4 className="font-bold text-sm uppercase">SimpleCrew exclusive savings</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Members get access to special pricing, early sales, and priority support.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="bg-[#FF5A1F] text-white p-3 rounded-full"><CreditCard size={24} /></div>
                <h4 className="font-bold text-sm uppercase">0% APR Financing</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Get what you need now and pay over time with flexible financing options.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl md:text-2xl font-black uppercase text-center md:text-left tracking-tight">Shop with confidence</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div className="flex flex-col gap-1 items-center justify-center p-4">
                <span className="text-3xl font-black text-[#FF5A1F]">98%</span>
                <span className="text-xs font-bold text-gray-500 uppercase">of customers approve</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4">
                <span className="text-3xl font-black text-[#FF5A1F]">Top 500</span>
                <span className="text-xs font-bold text-gray-500 uppercase">fastest growing company in US</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4">
                <span className="text-3xl font-black text-[#FF5A1F]">20,000+</span>
                <span className="text-xs font-bold text-gray-500 uppercase">certified installers</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4">
                <span className="text-3xl font-black text-[#FF5A1F]">7,000+</span>
                <span className="text-xs font-bold text-gray-500 uppercase">local distributors</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center p-4">
                <span className="text-3xl font-black text-[#FF5A1F]">6M+</span>
                <span className="text-xs font-bold text-gray-500 uppercase">customers served</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. SIMPLECREW SIGNUP */}
      <section className="bg-black text-white relative overflow-hidden" id="simplecrew-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Join the <span className="text-[#FF5A1F]">SimpleCrew</span><br/>
              and get exclusive perks.
            </h2>
            <p className="text-gray-300 font-medium text-sm md:text-base max-w-lg leading-relaxed">
              Get <span className="font-bold text-white">FREE</span> access to discounts on select tires, personalized coupons, preferred customer service and more. <a href="#" className="text-white underline underline-offset-4 hover:text-[#FF5A1F] transition-colors">Learn More</a>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                className="bg-[#FF5A1F] hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-lg uppercase tracking-wider text-sm transition-colors cursor-pointer"
                onClick={() => setPage('account')}
              >
                Log in
              </button>
              <button 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold px-8 py-3.5 rounded-lg uppercase tracking-wider text-sm transition-colors cursor-pointer"
                onClick={() => setPage('account')}
              >
                Sign up
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end relative z-10 opacity-80 mix-blend-screen">
            {/* Simple car vector representation */}
            <svg viewBox="0 0 400 200" className="w-full max-w-[400px] text-[#FF5A1F] stroke-current" fill="none" strokeWidth="4">
              <path d="M50,150 L350,150" strokeDasharray="5,5" className="text-gray-700" />
              <path d="M70,120 L90,60 L180,40 L280,60 L330,120" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="120" cy="130" r="30" />
              <circle cx="280" cy="130" r="30" />
              <path d="M30,120 L370,120" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        {/* Background orange angle */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF5A1F]/10 skew-x-[-20deg] translate-x-32 hidden md:block"></div>
      </section>

    </div>
  );
};
