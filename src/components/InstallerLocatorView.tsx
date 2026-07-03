import React, { useState, useEffect, useRef } from 'react';
import { Map, MapPin, Star, Search, ShieldCheck, Check, Phone, Navigation, Wifi, Coffee } from 'lucide-react';
import { INSTALLERS } from '../data';
import { Installer } from '../types';

interface InstallerLocatorViewProps {
  zipCode: string;
  setZipCode: (z: string) => void;
  selectedInstaller: Installer | null;
  setSelectedInstaller: (inst: Installer | null) => void;
  setPage: (p: string) => void;
}

export const InstallerLocatorView: React.FC<InstallerLocatorViewProps> = ({
  zipCode,
  setZipCode,
  selectedInstaller,
  setSelectedInstaller,
  setPage
}) => {
  const [searchZip, setSearchZip] = useState<string>(zipCode);
  const [activeShop, setActiveShop] = useState<Installer>(INSTALLERS[0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{5}$/.test(searchZip)) {
      setZipCode(searchZip);
    } else {
      alert("Please enter a valid 5-digit ZIP code");
    }
  };

  // Draw vector map showing installers
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Grid lines background
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 25) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j < h; j += 25) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Street outline geometries
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 6;
    
    // Main cross roads
    ctx.beginPath(); ctx.moveTo(0, h * 0.45); ctx.lineTo(w, h * 0.45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.35, 0); ctx.lineTo(w * 0.35, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 50); ctx.lineTo(w, h - 50); ctx.stroke(); // diagonal freeway

    // radiating beacon from center
    const cx = w / 2;
    const cy = h / 2;
    const time = Date.now() * 0.003;
    const pulse = 12 + Math.abs(Math.sin(time)) * 6;
    ctx.fillStyle = 'rgba(255, 90, 31, 0.15)';
    ctx.beginPath(); ctx.arc(cx, cy, pulse, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#FF5A1F';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Map pin nodes for installers
    INSTALLERS.forEach((inst, idx) => {
      const px = w * (0.15 + (idx * 0.22) + (inst.rating - 4.5) * 0.25);
      const py = h * (0.2 + (idx % 2 === 0 ? 0.3 : 0.52) - (inst.distance * 0.02));

      const isActive = activeShop.id === inst.id;

      if (isActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();
      }

      // Pin shape teardrop
      ctx.fillStyle = isActive ? '#FF5A1F' : '#111827';
      ctx.beginPath();
      ctx.arc(px, py - 10, 5, 0, Math.PI * 2);
      ctx.moveTo(px - 5, py - 10);
      ctx.lineTo(px, py);
      ctx.lineTo(px + 5, py - 10);
      ctx.closePath();
      ctx.fill();

      // Core dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(px, py - 10, 1.8, 0, Math.PI * 2); ctx.fill();

      // Pin text
      ctx.fillStyle = isActive ? '#FF5A1F' : '#4B5563';
      ctx.font = isActive ? 'bold 8px sans-serif' : '8px sans-serif';
      ctx.fillText(inst.name.split(' ')[0], px - 12, py - 16);
    });

  }, [activeShop]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8" id="locator-view-container">
      
      {/* Header and ZIP search field */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#E5E5E5] pb-6">
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">INSTALLER DIRECTORY</span>
          <h1 className="text-2xl md:text-3xl font-black text-[#0D0D0D] uppercase tracking-wider font-display mt-1">Local Certified Fitting Centers</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Tires ship pre-loaded to any of our certified local warehouses. Schedule on checkout.</p>
        </div>

        {/* Search Input bar */}
        <form onSubmit={handleZipSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            maxLength={5}
            value={searchZip}
            onChange={(e) => setSearchZip(e.target.value.replace(/\D/g, ''))}
            placeholder="Search ZIP code..."
            className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2.5 px-4 text-xs font-black focus:outline-none focus:border-[#FF5A1F]"
          />
          <button 
            type="submit"
            className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF5A1F]/15 uppercase tracking-wider"
          >
            <Search size={14} /> Search
          </button>
        </form>
      </div>

      {/* Main split locator layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left list directory column */}
        <div className="lg:col-span-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2" id="locator-list">
          {INSTALLERS.map((inst) => (
            <div
              key={inst.id}
              onClick={() => setActiveShop(inst)}
              className={`p-4 rounded-xl border text-left text-xs cursor-pointer transition-all flex justify-between items-center shadow-sm ${
                activeShop.id === inst.id
                  ? 'border-[#FF5A1F] bg-[#FF5A1F]/5'
                  : 'border-[#E5E5E5] hover:border-gray-400 bg-white'
              }`}
              id={`loc-shop-${inst.id}`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-gray-950 text-xs">{inst.name}</span>
                  <span className="text-gray-400 text-[10px]">({inst.distance}mi)</span>
                </div>
                <p className="text-gray-400 text-[10px] line-clamp-1 font-medium">{inst.address}</p>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-0.5">
                  <span className="flex items-center gap-0.5"><Star size={10} fill="#FF5A1F" className="text-[#FF5A1F]" /> {inst.rating}</span>
                  <span>•</span>
                  <span className="font-bold text-emerald-700 uppercase tracking-wide text-[9px]">Available {inst.nextAvailable.split(',')[0]}</span>
                </div>
              </div>
              <span className="text-gray-300 text-base font-bold">➔</span>
            </div>
          ))}
        </div>

        {/* Center Vector Map column */}
        <div className="lg:col-span-5 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-sm space-y-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Map size={13} className="text-[#FF5A1F]" /> Live Vector Plotting Grid (ZIP: {zipCode})
          </span>
          <canvas 
            ref={canvasRef} 
            width={380} 
            height={320} 
            className="block w-full border border-[#E5E5E5] rounded-xl bg-[#F5F5F3]"
          />
        </div>

        {/* Right Active Shop Details Dashboard card */}
        <div className="lg:col-span-3 bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl p-6 space-y-6" id="locator-detail-aside">
          <div className="border-b border-[#E5E5E5] pb-4">
            <span className="text-[9px] font-black text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2 py-0.5 rounded-md">
              Verified Workshop
            </span>
            <h3 className="font-black text-[#0D0D0D] uppercase tracking-wider text-base mt-2 leading-tight">{activeShop.name}</h3>
            <p className="text-[10px] text-gray-400 font-medium mt-1">{activeShop.address}</p>
          </div>

          <div className="space-y-4 text-xs text-gray-700">
            {/* Rating */}
            <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#E5E5E5] shadow-sm">
              <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">User Rating</span>
              <span className="font-bold text-gray-900 flex items-center gap-1">★ {activeShop.rating} ({activeShop.reviewsCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#E5E5E5] shadow-sm">
              <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Standard Fee</span>
              <span className="font-black text-gray-950 text-sm font-mono">${activeShop.pricePerTire} /tire</span>
            </div>

            {/* Amenities list */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Shop Amenities</span>
              <div className="flex flex-wrap gap-1.5">
                {activeShop.amenities.map((am) => (
                  <span key={am} className="bg-white border border-[#E5E5E5] px-2 py-1 rounded-md text-[10px] text-gray-600 font-bold uppercase tracking-wider shadow-sm">
                    {am}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 space-y-1">
              <p className="font-bold text-[10px] text-emerald-800 uppercase tracking-wider">Next Available schedule opening:</p>
              <p className="font-black text-[10px] text-emerald-700 font-mono">{activeShop.nextAvailable}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedInstaller(activeShop);
              setPage('plp');
              alert(`Assigned ${activeShop.name} as your shopping installation point!`);
            }}
            className="w-full bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
            id="locator-assign-shop-btn"
          >
            Select Installer & Shop
          </button>
        </div>

      </div>

    </div>
  );
};
