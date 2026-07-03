import React, { useState, useMemo } from 'react';
import { Search, Grid, List, SlidersHorizontal, Star, Check, HelpCircle, X, ArrowLeft, ArrowRight, Car } from 'lucide-react';
import { Tire, SavedVehicle } from '../types';
import { TIRES } from '../data';

interface PLPViewProps {
  setPage: (p: string) => void;
  setSelectedTire: (t: Tire) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeVehicle: SavedVehicle | null;
}

export const PLPView: React.FC<PLPViewProps> = ({
  setPage,
  setSelectedTire,
  searchQuery,
  setSearchQuery,
  activeVehicle
}) => {
  // Local Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(300);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('best'); // best, price-low, price-high, rating
  const [isListView, setIsListView] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Tire Comparison States
  const [compareList, setCompareList] = useState<Tire[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Dynamic filter lists
  const availableBrands = useMemo(() => Array.from(new Set(TIRES.map(t => t.brand))), []);
  const availableTypes = useMemo(() => Array.from(new Set(TIRES.map(t => t.type))), []);

  // Filter & Search Logic
  const filteredTires = useMemo(() => {
    return TIRES.filter((tire) => {
      // 1. Text Search query matching brand, name, type, size or specs
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          tire.name.toLowerCase().includes(query) ||
          tire.brand.toLowerCase().includes(query) ||
          tire.type.toLowerCase().includes(query) ||
          tire.sizes.some(size => size.toLowerCase().includes(query)) ||
          tire.specs.season.toLowerCase().includes(query);
        
        if (!matchesQuery) return false;
      }

      // 2. Brand checkbox filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(tire.brand)) {
        return false;
      }

      // 3. Tire type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(tire.type)) {
        return false;
      }

      // 4. Price slider filter
      if (tire.price > priceRange) {
        return false;
      }

      // 5. Star rating filter
      if (selectedRating !== null && tire.rating < selectedRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // best seller/match is reviews based
    });
  }, [searchQuery, selectedBrands, selectedTypes, priceRange, selectedRating, sortBy]);

  // Handle Brand Filter Toggle
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Handle Type Filter Toggle
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Handle Comparison Adding/Removal
  const handleCompareToggle = (tire: Tire, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent route click to PDP
    if (compareList.some(item => item.id === tire.id)) {
      setCompareList(prev => prev.filter(item => item.id !== tire.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 tires side-by-side!");
        return;
      }
      setCompareList(prev => [...prev, tire]);
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setPriceRange(300);
    setSelectedRating(null);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8" id="plp-view-container">
      
      {/* 1. Page Header with Garage integration */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E5E5] pb-6" id="plp-header-box">
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TIRE RETAIL CATALOG</span>
          <h1 className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tight mt-1 uppercase font-display">
            {searchQuery ? `Search results for "${searchQuery}"` : "All Tires & Fitments"}
          </h1>
          {activeVehicle && (
            <div className="mt-2 inline-flex items-center gap-2 bg-[#FF5A1F]/5 border border-[#E5E5E5] px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-950">
              <Car size={14} className="text-[#FF5A1F]" /> Active Garage Fitment Filter: <span className="font-black text-[#FF5A1F]">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.tireSize})</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 font-mono self-end">
          Showing <span className="font-bold text-gray-900">{filteredTires.length}</span> of {TIRES.length} Premium models
        </p>
      </div>

      {/* 2. Main Catalog Grid & Sideboards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="plp-main-layout">
        
        {/* Left Filters - DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 border border-[#E5E5E5] rounded-xl h-max" id="desktop-filters-sidebar">
          <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5]">
            <span className="text-xs font-black uppercase text-[#0D0D0D] tracking-wider">Refine Options</span>
            <button 
              onClick={clearFilters} 
              className="text-xs text-[#FF5A1F] font-bold hover:underline cursor-pointer uppercase tracking-wider text-[10px]"
              id="clear-all-filters-btn"
            >
              Reset All
            </button>
          </div>

          {/* Filter block 1: Brand */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manufacturer Brands</h4>
            <div className="flex flex-col gap-2">
              {availableBrands.map((b) => (
                <label key={b} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => handleBrandToggle(b)}
                    className="rounded border-gray-300 text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter block 2: Tire Type */}
          <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5]">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tread Profile Type</h4>
            <div className="flex flex-col gap-2">
              {availableTypes.map((t) => (
                <label key={t} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t)}
                    onChange={() => handleTypeToggle(t)}
                    className="rounded border-gray-300 text-[#FF5A1F] focus:ring-[#FF5A1F] cursor-pointer"
                  />
                  <span>{t} Tires</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter block 3: Price Limit */}
          <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5]">
            <div className="flex justify-between items-center text-xs">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Price Limit</h4>
              <span className="font-mono font-bold text-[#FF5A1F]">${priceRange}</span>
            </div>
            <input
              type="range"
              min={100}
              max={300}
              step={10}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#FF5A1F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>$100</span>
              <span>$200</span>
              <span>$300</span>
            </div>
          </div>

          {/* Filter block 4: Min Stars Rating */}
          <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5]">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Minimum Rating</h4>
            <div className="flex flex-col gap-2">
              {[4.8, 4.6, 4.5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                  className={`text-left text-xs py-1.5 px-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between ${
                    selectedRating === stars 
                      ? 'bg-[#FF5A1F]/5 border-[#FF5A1F] text-[#FF5A1F] font-bold' 
                      : 'border-transparent hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#FF5A1F]">★</span> {stars}+ Stars
                  </span>
                  {selectedRating === stars && <Check size={12} className="text-[#FF5A1F] stroke-[3px]" />}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Content Column */}
        <div className="lg:col-span-9 space-y-6" id="catalog-results-block">
          
          {/* Controls Bar */}
          <div className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-3 flex justify-between items-center flex-wrap gap-3" id="catalog-controls-bar">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden bg-white border border-[#E5E5E5] text-xs font-bold text-gray-800 px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer"
              id="mobile-filters-trigger"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">Sort Results:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E5E5E5] rounded-xl py-1.5 px-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
                id="catalog-sort-select"
              >
                <option value="best">Best Selling Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rated Reviews</option>
              </select>
            </div>

            {/* View Layout Toggle */}
            <div className="flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-xl p-1">
              <button 
                onClick={() => setIsListView(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${!isListView ? 'bg-[#FF5A1F] text-white' : 'text-gray-400 hover:text-gray-600'}`}
                id="toggle-grid-view"
              >
                <Grid size={15} />
              </button>
              <button 
                onClick={() => setIsListView(true)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isListView ? 'bg-[#FF5A1F] text-white' : 'text-gray-400 hover:text-gray-600'}`}
                id="toggle-list-view"
              >
                <List size={15} />
              </button>
            </div>

          </div>

          {/* SKELETON RE-LOAD INDICATOR OR EMPTY STATE */}
          {filteredTires.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm" id="empty-results-box">
              <div className="w-16 h-16 bg-[#F5F5F3] rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-950 uppercase tracking-tight">No Matching Tires Found</h3>
              <p className="text-xs text-gray-500">We couldn't find a set matching your active filters. Try searching for "Velocita" or adjusting the pricing limits.</p>
              <button 
                onClick={clearFilters}
                className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider"
                id="empty-reset-btn"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* ACTIVE PRODUCT DISPLAY (GRID OR LIST) */
            <div className={isListView ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"} id="catalog-products-container">
              {filteredTires.map((tire) => {
                const inCompare = compareList.some(item => item.id === tire.id);
                
                if (isListView) {
                  // LIST VIEW ROW
                  return (
                    <div 
                      key={tire.id}
                      onClick={() => { setSelectedTire(tire); setPage('pdp'); }}
                      className="bg-white border border-[#E5E5E5] hover:border-[#FF5A1F]/30 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer p-4 grid grid-cols-12 gap-4 items-center group relative animate-fade-in"
                      id={`product-row-${tire.id}`}
                    >
                      <div className="col-span-3 bg-[#F5F5F3]/50 rounded-xl p-3 flex items-center justify-center">
                        <img 
                          src={tire.image1} 
                          alt={tire.name} 
                          referrerPolicy="no-referrer"
                          className="max-h-24 object-contain group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      
                      <div className="col-span-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#E5E5E5] bg-gray-50 text-gray-700">{tire.brand}</span>
                          <span className="font-bold tracking-wider uppercase text-[10px] text-gray-500">{tire.type}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-[#FF5A1F] transition-colors">{tire.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-[#FF5A1F]"><Star size={11} fill="currentColor" /></div>
                          <span className="text-xs font-bold text-gray-900">{tire.rating}</span>
                          <span className="text-[10px] text-gray-400">({tire.reviewsCount} reviews)</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{tire.description}</p>
                      </div>

                      <div className="col-span-3 text-right space-y-2 border-l border-[#E5E5E5] pl-4 h-full flex flex-col justify-between py-2">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Per Tire</span>
                          <p className="text-lg font-black text-gray-950">${tire.price}</p>
                          <span className="text-[9px] text-gray-400 font-mono block">Starts at +${tire.installPrice} install</span>
                        </div>

                        {/* Compare button */}
                        <button
                          onClick={(e) => handleCompareToggle(tire, e)}
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border w-full text-center transition-all cursor-pointer ${
                            inCompare 
                              ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] text-[#FF5A1F]' 
                              : 'bg-white border-[#E5E5E5] text-gray-500 hover:text-gray-950 hover:border-gray-400'
                          }`}
                        >
                          {inCompare ? '✓ COMPARING' : '+ COMPARE'}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  // GRID VIEW CARD
                  return (
                    <div 
                      key={tire.id}
                      onClick={() => { setSelectedTire(tire); setPage('pdp'); }}
                      className="bg-white border border-[#E5E5E5] hover:border-[#FF5A1F]/30 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative animate-fade-in"
                      id={`product-card-${tire.id}`}
                    >
                      {/* Product Image viewport */}
                      <div className="aspect-4/3 bg-[#F5F5F3]/50 p-4 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={tire.image1} 
                          alt={tire.name} 
                          referrerPolicy="no-referrer"
                          className="max-h-36 object-contain group-hover:scale-105 transition-transform" 
                        />
                        
                        {/* Compare checkbox on thumbnail */}
                        <button
                          onClick={(e) => handleCompareToggle(tire, e)}
                          className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border backdrop-blur-sm shadow-sm transition-all cursor-pointer ${
                            inCompare 
                              ? 'bg-[#FF5A1F] border-[#FF5A1F] text-white' 
                              : 'bg-white/90 border-[#E5E5E5] text-gray-600 hover:bg-white'
                          }`}
                        >
                          {inCompare ? 'Comparing' : '+ Compare'}
                        </button>

                        {/* Badge */}
                        {tire.promoBadge && (
                          <span className="absolute top-3 left-3 bg-[#0D0D0D] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                            {tire.promoBadge}
                          </span>
                        )}

                        <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase bg-white border border-[#E5E5E5] px-2 py-0.5 rounded tracking-wider text-gray-400">
                          {tire.type}
                        </span>
                      </div>

                      {/* Info details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#E5E5E5] bg-gray-50 text-gray-700">{tire.brand}</span>
                          </div>
                          
                          <h4 className="font-extrabold text-sm text-gray-900 mt-1 leading-tight group-hover:text-[#FF5A1F] transition-colors">
                            {tire.name}
                          </h4>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex text-[#FF5A1F]"><Star size={11} fill="currentColor" /></div>
                            <span className="text-xs font-bold text-gray-900">{tire.rating}</span>
                            <span className="text-[10px] text-gray-400">({tire.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Cost Box */}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Tire Price</span>
                            <p className="text-base font-black text-gray-950">${tire.price}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-medium">starts at:</span>
                            <span className="text-xs font-extrabold text-[#FF5A1F] font-mono">+${tire.installPrice} install</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                }
              })}
            </div>
          )}

        </div>

      </div>

      {/* 3. FLOATING COMPARISON DOCK BAR */}
      {compareList.length > 0 && (
        <div 
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 bg-black text-white p-4 rounded-xl shadow-2xl border border-neutral-800 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl animate-bounce-short"
          id="compare-dock-bar"
        >
          <div className="flex items-center gap-3">
            <span className="bg-[#FF5A1F] text-white text-[9px] font-black uppercase px-2 py-1 rounded">COMPARE DOCK</span>
            <span className="text-xs font-semibold text-gray-300">{compareList.length} / 3 selected</span>
          </div>

          <div className="flex gap-2.5 items-center">
            {compareList.map((c) => (
              <div key={c.id} className="relative bg-[#111112] p-1.5 rounded border border-neutral-800 flex items-center gap-1.5 px-2">
                <span className="text-[10px] truncate max-w-28 font-bold">{c.name.split(' ')[0]}</span>
                <button 
                  onClick={(e) => handleCompareToggle(c, e)}
                  className="text-gray-400 hover:text-white text-xs cursor-pointer ml-1 p-0.5 leading-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-gray-400 hover:text-white underline cursor-pointer font-bold uppercase tracking-wider text-[10px]"
            >
              Clear
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold px-4 py-2 rounded text-xs transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
              id="compare-start-btn"
            >
              Compare Selected
            </button>
          </div>
        </div>
      )}

      {/* 4. COMPARISON MATRIX OVERLAY MODAL */}
      {showCompareModal && compareList.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
          id="compare-modal-overlay"
        >
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#E5E5E5]">
            
            <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comparison Matrix</span>
                <h3 className="text-lg font-black text-[#0D0D0D] uppercase tracking-tight font-display">Side-by-Side Tire Specification</h3>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
                id="close-compare-modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto flex-1 pb-4">
              <table className="w-full text-xs text-left text-gray-700">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F5F5F3]">
                    <th className="p-3 font-black text-gray-400 uppercase tracking-wider w-32 text-[9px]">Spec Category</th>
                    {compareList.map((c) => (
                      <th key={c.id} className="p-3 text-center min-w-44">
                        <p className="font-extrabold text-gray-900 mt-1">{c.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">{c.brand}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Price</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-black text-sm text-[#FF5A1F]">
                        ${c.price} <span className="text-xs text-gray-400 font-normal font-mono">/ea</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Size</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-mono font-bold text-gray-600 text-[10px] max-w-[200px] whitespace-normal">
                        {c.sizes.join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Warranty</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-gray-700 font-mono">
                        {c.specs.warranty}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Tread Life (UTQG)</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-mono font-bold text-gray-700">
                        {c.specs.utqg}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Load Index</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-mono">
                        {c.specs.loadIndex}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Speed Rating</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-mono">
                        {c.specs.speedRating}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Traction Season</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-gray-800 uppercase tracking-wider text-[10px]">
                        {c.specs.season}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Run-Flat Safety</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center font-bold text-gray-700">
                        {c.specs.runFlat ? '✓ Yes' : 'No'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-950 uppercase tracking-wider text-[10px]">Key Feature</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="p-3 text-center italic text-gray-500 text-[11px] leading-relaxed">
                        "{c.features[0]}"
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex justify-end gap-3">
              <button
                onClick={() => setShowCompareModal(false)}
                className="bg-[#0D0D0D] hover:bg-[#1f1f1f] text-white font-extrabold px-6 py-2.5 rounded text-xs cursor-pointer uppercase tracking-wider"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. MOBILE COLLAPSIBLE FILTER DRAWER BOTTOM SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-fade-in" id="mobile-filter-drawer">
          <div className="bg-white rounded-t-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border-t border-[#E5E5E5]">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5]">
              <span className="text-xs font-black uppercase text-gray-950 tracking-wider">Refine Options</span>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-900 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Filter Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manufacturer Brands</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBrandToggle(b)}
                      className={`text-left text-xs py-2 px-3 rounded border transition-colors cursor-pointer flex justify-between items-center ${
                        selectedBrands.includes(b) 
                          ? 'bg-[#FF5A1F]/5 border-[#FF5A1F] text-[#FF5A1F] font-bold' 
                          : 'border-[#E5E5E5] hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {b} {selectedBrands.includes(b) && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E5E5E5]">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tread Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTypeToggle(t)}
                      className={`text-left text-xs py-2 px-3 rounded border transition-colors cursor-pointer flex justify-between items-center ${
                        selectedTypes.includes(t) 
                          ? 'bg-[#FF5A1F]/5 border-[#FF5A1F] text-[#FF5A1F] font-bold' 
                          : 'border-[#E5E5E5] hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {t} {selectedTypes.includes(t) && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E5E5E5]">
                <div className="flex justify-between text-xs font-bold text-gray-900">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Range Limit</span>
                  <span className="text-[#FF5A1F] font-mono">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={300}
                  step={10}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#FF5A1F] cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-3.5 rounded text-xs transition-colors cursor-pointer uppercase tracking-wider"
            >
              Apply Filter Settings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
