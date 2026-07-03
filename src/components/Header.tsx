import React, { useState } from 'react';
import { Search, MapPin, ShoppingCart, User, Percent, Compass, MessageSquare, BookOpen, Check, Home } from 'lucide-react';
import { CartItem, SavedVehicle } from '../types';

interface HeaderProps {
  page: string;
  setPage: (p: string) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  zipCode: string;
  setZipCode: (z: string) => void;
  savedVehicles: SavedVehicle[];
  activeVehicle: SavedVehicle | null;
  setActiveVehicle: (v: SavedVehicle | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  page,
  setPage,
  cart,
  setIsCartOpen,
  zipCode,
  setZipCode,
  savedVehicles,
  activeVehicle,
  setActiveVehicle,
  searchQuery,
  setSearchQuery,
  onSearchSubmit
}) => {
  const [showPromo, setShowPromo] = useState<boolean>(true);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [tempZip, setTempZip] = useState<string>(zipCode);
  const [showGarageDropdown, setShowGarageDropdown] = useState<boolean>(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState<boolean>(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{5}$/.test(tempZip)) {
      setZipCode(tempZip);
      setShowLocationModal(false);
    } else {
      alert("Please enter a valid 5-digit ZIP code");
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <>
      {/* 1. Sticky Promo Bar */}
      {showPromo && (
        <div 
          className="bg-black text-[#FF5A1F] text-[11px] font-bold py-2.5 px-8 flex justify-center items-center relative z-50 transition-all uppercase tracking-widest"
          id="promo-bar"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <a href="#" className="hover:underline underline-offset-4" onClick={() => setPage('deals')}>GET $25 OFF $250 OR MORE</a>
          </div>
        </div>
      )}

      {/* 2. Main Desktop / Mobile Header */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-10">
              <button 
                onClick={() => setPage('home')} 
                className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#1A1A1A] hover:opacity-90 cursor-pointer"
                id="brand-logo-btn"
              >
                <span>xyz<span className="font-black">tyre</span></span>
              </button>
            </div>

            {/* Right Nav */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#1A1A1A]">
                <button 
                  onClick={() => setPage('plp')} 
                  className={`hover:text-[#FF5A1F] transition-colors cursor-pointer ${page === 'plp' ? 'text-[#FF5A1F]' : 'text-[#1A1A1A]'}`}
                >
                  Browse tires
                </button>

                <button 
                  onClick={() => setPage('deals')} 
                  className={`hover:text-[#FF5A1F] transition-colors cursor-pointer ${page === 'deals' ? 'text-[#FF5A1F]' : 'text-[#1A1A1A]'}`}
                >
                  Deals
                </button>

                <button 
                  onClick={() => setPage('business')} 
                  className={`hover:text-[#FF5A1F] transition-colors cursor-pointer ${page === 'business' ? 'text-[#FF5A1F]' : 'text-[#1A1A1A]'}`}
                >
                  SimpleBusiness
                </button>

                <button 
                  onClick={() => setPage('learn')} 
                  className={`hover:text-[#FF5A1F] transition-colors cursor-pointer ${page === 'learn' ? 'text-[#FF5A1F]' : 'text-[#1A1A1A]'}`}
                >
                  Learn
                </button>
              </nav>

              <div className="hidden lg:block w-px h-5 bg-[#E5E5E5] mx-2"></div>
              
              {/* Location Pin */}
              <button 
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1.5 text-xs text-[#1A1A1A] hover:text-[#FF5A1F] transition-colors font-semibold cursor-pointer"
                title={`Installer near: ${zipCode}`}
              >
                <MapPin size={18} />
              </button>

              {/* Sign In */}
              <button 
                onClick={() => setPage('account')}
                className="hidden sm:flex items-center gap-1.5 text-xs text-[#1A1A1A] hover:text-[#FF5A1F] transition-colors font-semibold cursor-pointer"
              >
                <User size={18} />
                <span>Sign in</span>
              </button>

              {/* Shopping Cart Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-[#1A1A1A] hover:text-[#FF5A1F] transition-colors cursor-pointer flex items-center justify-center p-1 ml-2"
                id="header-cart-btn"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-1.5 bg-[#FF5A1F] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                    id="cart-count-badge"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* 3. ZIP Code / Location Selector Modal */}
      {showLocationModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          id="location-modal-overlay"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative border border-[#E5E5E5]">
            <button 
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-lg cursor-pointer"
              id="close-location-modal"
            >
              ✕
            </button>
            
            <div className="text-center mb-5">
              <MapPin size={32} className="text-[#FF5A1F] mx-auto mb-2" />
              <h3 className="text-base font-black text-[#0D0D0D] mt-2 uppercase tracking-tight font-display">Update Installation Location</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">Enter your ZIP code so we can find matching local installer warehouses near you and quote custom installation rates.</p>
            </div>

            <form onSubmit={handleZipSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5">US ZIP Code</label>
                <input
                  type="text"
                  maxLength={5}
                  value={tempZip}
                  onChange={(e) => setTempZip(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 90021"
                  className="w-full text-center text-xl font-bold tracking-widest py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF5A1F] bg-[#F5F5F3]"
                  id="location-zip-input"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-gray-600 bg-[#F5F5F3] hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  id="location-cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-white bg-[#FF5A1F] hover:bg-brand-orange-hover rounded-xl shadow-lg shadow-[#FF5A1F]/10 transition-colors cursor-pointer"
                  id="location-save-btn"
                >
                  Update ZIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MOBILE BOTTOM STICKY NAV BAR (thumb reachable, 4 items) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] h-16 grid grid-cols-4 items-center justify-center z-40 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
        id="mobile-bottom-tabs"
      >
        <button
          onClick={() => setPage('home')}
          className={`flex flex-col items-center justify-center h-full text-center cursor-pointer ${page === 'home' ? 'text-[#FF5A1F] font-black' : 'text-gray-500 font-bold'}`}
          id="tab-home"
        >
          <Home size={18} className={page === 'home' ? 'text-[#FF5A1F] stroke-[2.5px]' : 'text-gray-500'} />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        <button
          onClick={() => setPage('plp')}
          className={`flex flex-col items-center justify-center h-full text-center cursor-pointer ${page === 'plp' ? 'text-[#FF5A1F] font-black' : 'text-gray-500 font-bold'}`}
          id="tab-search"
        >
          <Search size={18} className={page === 'plp' ? 'text-[#FF5A1F] stroke-[2.5px]' : 'text-gray-500'} />
          <span className="text-[10px] mt-1">Shop Tires</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center h-full text-center cursor-pointer text-gray-500 relative font-bold"
          id="tab-cart"
        >
          <div className="relative">
            <ShoppingCart size={18} className="text-gray-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#FF5A1F] text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center ring-1 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Cart</span>
        </button>

        <button
          onClick={() => setPage('account')}
          className={`flex flex-col items-center justify-center h-full text-center cursor-pointer ${page === 'account' ? 'text-[#FF5A1F] font-black' : 'text-gray-500 font-bold'}`}
          id="tab-account"
        >
          <User size={18} className={page === 'account' ? 'text-[#FF5A1F] stroke-[2.5px]' : 'text-gray-500'} />
          <span className="text-[10px] mt-1">Account</span>
        </button>
      </nav>
    </>
  );
};
