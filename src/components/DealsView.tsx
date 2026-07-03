import React, { useState } from 'react';
import { Percent, Copy, Check, Ticket, Award, HelpCircle, ArrowRight } from 'lucide-react';
import { REBATES } from '../data';

interface DealsViewProps {
  setPage: (p: string) => void;
  onSearchSubmit: (q: string) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({ setPage, onSearchSubmit }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10" id="deals-view-container">
      
      {/* Page Header */}
      <div className="border-b border-[#E5E5E5] pb-6" id="deals-header">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROMOTIONAL CENTER</span>
        <h1 className="text-2xl md:text-3xl font-black text-[#0D0D0D] uppercase tracking-wider font-display mt-1">Active Deals & Mail-in Rebates</h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">Combine manufacturing promotions with pre-paid local installer rates for the lowest absolute pricing.</p>
      </div>

      {/* Featured Grand Coupon Banner */}
      <div className="bg-[#0D0D0D] border-2 border-[#FF5A1F] rounded-xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl" id="deals-hero-banner">
        <div className="absolute top-0 right-0 text-[12rem] text-white/5 font-black leading-none pointer-events-none translate-x-20 -translate-y-12">
          %
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="bg-[#FF5A1F] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-widest">
            EXCLUSIVE ONLINE PACKAGE
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-display leading-tight">Save $100 + Free Tire Mounting & Balance</h2>
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            Order any matching set of 4 premium tires today and get an automatic $100 mail-in rebate eligibility. Plus, enjoy zero local transport fees to your chosen installer workshop.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => { onSearchSubmit('Velocita'); setPage('plp'); }}
              className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/20 transition-colors cursor-pointer"
            >
              Shop Qualifying Tires
            </button>
          </div>
        </div>
      </div>

      {/* Coupon Codes list (Copyable) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Ticket className="text-[#FF5A1F]" size={18} />
          <h3 className="text-xs font-black text-[#0D0D0D] uppercase tracking-widest">Active Promotional Codes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="coupons-grid">
          {[
            { code: "TIREMAX20", discount: "$20 OFF Coupon", desc: "Save $20 on any individual tire order. Applies immediately at checkout.", condition: "Requires minimum $150 order value" },
            { code: "ALIGN89", discount: "Pre-paid Alignment", desc: "Get full 4-wheel steering alignment pre-paid for only $89 locally.", condition: "Must bundle with 4 tire set purchase" },
            { code: "FLEET15", discount: "15% B2B Discount", desc: "Fleet savings on bulk tire delivery. Fits small businesses and vans.", condition: "Requires minimum 8 tires in cart" }
          ].map((c) => (
            <div 
              key={c.code}
              className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group shadow-sm"
              id={`coupon-card-${c.code}`}
            >
              <div className="space-y-1.5">
                <span className="bg-[#FF5A1F]/10 text-[#FF5A1F] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  {c.discount}
                </span>
                <h4 className="font-black text-sm text-[#0D0D0D] uppercase tracking-wider mt-2">{c.desc}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{c.condition}</p>
              </div>

              {/* Copy action field */}
              <div className="flex items-center justify-between bg-[#F5F5F3] border border-[#E5E5E5] p-2.5 rounded-xl">
                <span className="font-mono text-xs font-black text-gray-900">{c.code}</span>
                <button
                  onClick={() => handleCopyCode(c.code)}
                  className="p-1.5 rounded-lg text-xs font-bold bg-white border border-[#E5E5E5] text-gray-700 hover:text-[#FF5A1F] hover:border-[#FF5A1F] transition-colors flex items-center gap-1 cursor-pointer"
                  id={`copy-btn-${c.code}`}
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check size={12} className="text-emerald-700 stroke-[3px]" />
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mail-In Rebates Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="text-[#FF5A1F]" size={18} />
          <h3 className="text-xs font-black text-[#0D0D0D] uppercase tracking-widest">Manufacturer Rebate Forms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="rebates-cards-grid">
          {REBATES.map((reb) => (
            <div 
              key={reb.id}
              className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-gray-400 hover:shadow-md transition-all shadow-sm"
              id={`rebate-card-details-${reb.id}`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl bg-[#F5F5F3] p-2 rounded-xl border border-[#E5E5E5] font-black">{reb.brandLogo}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Form {reb.id.toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="font-black text-[#0D0D0D] uppercase tracking-wider text-sm leading-tight">{reb.title}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed font-medium">
                    {reb.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Expires: {reb.expires}</span>
                <button 
                  onClick={() => { onSearchSubmit(reb.brand); setPage('plp'); }}
                  className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-black py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  id={`shop-eligible-${reb.id}`}
                >
                  Shop Eligible
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
