import React, { useState } from 'react';
import { BookOpen, Calendar, Mail, FileText, ChevronDown, Check, Building, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { ARTICLES } from '../data';
import { Article } from '../types';

/* ==========================================================================
   1. LEARN / BLOG VIEW
   ========================================================================== */
interface LearnViewProps {
  onSearchSubmit: (q: string) => void;
  setPage: (p: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onSearchSubmit, setPage }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10" id="learn-view-container">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">BLOG & TIRES UNIVERSITY</span>
        <h1 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight mt-1">Tire Guides & Maintenance Advice</h1>
        <p className="text-xs text-gray-500 mt-1">Educate yourself on tread compound compositions, local weather recommendations, and federal tire codes.</p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="articles-grid-list">
        {ARTICLES.map((art) => (
          <div 
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            id={`article-card-${art.id}`}
          >
            <div className="space-y-4">
              {/* Card Banner Thumbnail simulation */}
              <div className="h-40 bg-gray-900 flex items-center justify-center text-center text-white relative">
                <span className="text-3xl">📝</span>
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-orange-500 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                  {art.category}
                </span>
              </div>

              {/* Text items */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Calendar size={12} />
                  <span>{art.date}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-extrabold text-sm text-gray-950 leading-tight hover:text-orange-500 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-gray-50 text-xs text-orange-500 font-extrabold flex items-center gap-1">
              Read Guide Article ➔
            </div>
          </div>
        ))}
      </div>

      {/* FULL ARTICLE VIEW MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="article-detail-modal">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-950 p-1 bg-gray-50 hover:bg-gray-100 rounded-full cursor-pointer text-xs font-bold"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-gray-950 leading-tight">{selectedArticle.title}</h2>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <span>Published: {selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime} read time</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-medium italic border-l-2 border-orange-500 pl-3">
              "{selectedArticle.excerpt}"
            </p>

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-4" id="article-full-body">
              {selectedArticle.id === 'art-1' && (
                <>
                  <h4 className="font-bold text-gray-900 text-sm">Understanding Tread Wear Patterns</h4>
                  <p>When investigating tire health, the most revealing stories are written across the tread block sipes. Uneven tread wear patterns often indicate underlying suspension or alignment anomalies rather than manufacturing defects.</p>
                  <p><strong>Shoulder Wear:</strong> If the inside or outside shoulders are wearing down faster than the center block, your suspension camber may be incorrectly aligned or loose.</p>
                  <p><strong>Center Wear:</strong> Accelerated center block depletion is a classic signature of chronic over-inflation. Keep psi variables checked according to driver panel regulations.</p>
                </>
              )}

              {selectedArticle.id === 'art-2' && (
                <>
                  <h4 className="font-bold text-gray-900 text-sm">Decoding DOT Codes and Tire Markings</h4>
                  <p>Look along the bead of any standard radial tire and you will see a series of alphanumeric symbols starting with "DOT". These letters verify compliance with the Department of Transportation's rigorous safety standards.</p>
                  <p>The last four digits represent the date of manufacture. For example, "3223" translates to the 32nd week of the year 2023. Tire sipes naturally harden and degrade over time even if unmounted. Industry safety boards highly advise replacing any tire set that exceeds 6 years of aging.</p>
                </>
              )}

              {selectedArticle.id === 'art-3' && (
                <>
                  <h4 className="font-bold text-gray-900 text-sm">When to Choose All-Season vs. Winter Snow Compounds</h4>
                  <p>Many drivers are confused by the differences between standard All-Season rubber and Winter Snow tires. While all-season tread siping is formulated to perform across dry and moderately wet road coordinates, standard compounds harden significantly when ambient temperatures drop below 45°F.</p>
                  <p>Winter tires are built using dense silica block compounds that remain pliable in extreme freezing conditions. They also contain hundreds of microscopic sipes that create frictional traction loops inside compacted snow, delivering significantly shorter wet braking stops.</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-black hover:bg-orange-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Close Article Reader
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


/* ==========================================================================
   2. BUSINESS / B2B VIEWS
   ========================================================================== */
export const BusinessView: React.FC = () => {
  const [b2bName, setB2bName] = useState<string>('');
  const [b2bCompany, setB2bCompany] = useState<string>('');
  const [b2bFleetSize, setB2bFleetSize] = useState<string>('5-10 vehicles');
  const [b2bSuccess, setB2bSuccess] = useState<boolean>(false);

  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bName || !b2bCompany) {
      alert("Please provide contact and company name.");
      return;
    }
    setB2bSuccess(true);
    setTimeout(() => {
      setB2bSuccess(false);
      setB2bName('');
      setB2bCompany('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10" id="b2b-view-container">
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl" id="b2b-header-hero">
        <div className="absolute top-0 right-0 text-[10rem] text-white/5 font-black leading-none pointer-events-none translate-x-12 -translate-y-8">
          B2B
        </div>
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-widest">
            COMMERCIAL FLOTILLA SERVICES
          </span>
          <h1 className="text-3xl md:text-4xl font-black leading-tight">Reduce Fleet Operational Overhead by 15%</h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            Get dedicated commercial tire accounts, customized shipping logistics to logistics terminals, pre-paid local installer plans, and 30-day corporate credit options.
          </p>
        </div>
      </div>

      {/* Fleet pricing tiers list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">CONTRACTOR LITE</span>
          <h3 className="font-black text-gray-900 text-lg">2 to 5 Vehicles</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Perfect for plumbing, electrical, and small local contracting fleets. Save on heavy-duty light truck models.</p>
          <div className="border-t border-gray-100 pt-3 text-xs font-bold text-orange-500 flex items-center gap-1.5">
            ✓ 5% Automatic bulk discount
          </div>
        </div>

        <div className="bg-white border border-orange-500 p-6 rounded-2xl space-y-4 shadow-sm relative">
          <span className="absolute top-4 right-4 bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">Popular</span>
          <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider block">LOGISTICS PRO</span>
          <h3 className="font-black text-gray-900 text-lg">6 to 20 Vehicles</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Customized shipping intervals directly to your terminals. Immediate dedicated dispatch contact on-call.</p>
          <div className="border-t border-gray-100 pt-3 text-xs font-bold text-orange-500 flex items-center gap-1.5">
            ✓ 10% Bulk tire compound discount
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">ENTERPRISE CARGO</span>
          <h3 className="font-black text-gray-900 text-lg">20+ Vehicles</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Custom manufacturing specifications, heavy transport radial compounds, and net-30 invoicing terms.</p>
          <div className="border-t border-gray-100 pt-3 text-xs font-bold text-orange-500 flex items-center gap-1.5">
            ✓ 15% Bulk discount + credit accounts
          </div>
        </div>

      </div>

      {/* Consultation form panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 p-6 md:p-8 rounded-3xl" id="b2b-form-section">
        <div className="lg:col-span-5 space-y-4">
          <Building className="text-orange-500" size={32} />
          <h2 className="text-xl font-bold text-gray-950 tracking-tight">Request Commercial Callback consultation</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Submit your fleet size and business details, and a senior commercial tire executive will contact you in under 1 business hour with net custom pricing sheets.
          </p>
        </div>

        <form onSubmit={handleB2bSubmit} className="lg:col-span-7 bg-white border border-gray-200 p-6 rounded-2xl space-y-4">
          {b2bSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-950 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="text-emerald-600 font-bold" /> Thank you! Your B2B consultation request is registered. An specialist will call you soon.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Contact Name</label>
              <input 
                type="text"
                value={b2bName}
                onChange={(e) => setB2bName(e.target.value)}
                placeholder="e.g. Sandra Day"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Company Name</label>
              <input 
                type="text"
                value={b2bCompany}
                onChange={(e) => setB2bCompany(e.target.value)}
                placeholder="e.g. Day Construction Group"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Approx Fleet size</label>
              <select 
                value={b2bFleetSize}
                onChange={(e) => setB2bFleetSize(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none cursor-pointer"
              >
                <option value="2-5 vehicles">2 to 5 Vehicles</option>
                <option value="5-10 vehicles">5 to 10 Vehicles</option>
                <option value="10-20 vehicles">10 to 20 Vehicles</option>
                <option value="20+ vehicles">More than 20 Vehicles</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="bg-black hover:bg-orange-500 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-md transition-colors"
          >
            Submit Commercial Consultation Request
          </button>
        </form>
      </div>

    </div>
  );
};


/* ==========================================================================
   3. STATIC PAGES (FAQ, ABOUT, CONTACT, SHIPPING)
   ========================================================================== */
export const StaticPagesView: React.FC<{ subpage: string }> = ({ subpage }) => {
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);
  
  // Contact state
  const [contName, setContName] = useState<string>('');
  const [contText, setContText] = useState<string>('');
  const [contSuccess, setContSuccess] = useState<boolean>(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContSuccess(true);
    setTimeout(() => {
      setContSuccess(false);
      setContName('');
      setContText('');
    }, 4000);
  };

  const faqItems = [
    { q: "How does shipping to a local installer work?", a: "When you select and checkout a tire set on our website, we ship the tires 100% free of charge directly from our nearest national warehouse terminal to your chosen local certified workshop. The tires will arrive labeled under your name. Simply drive in at your pre-scheduled appointment slot." },
    { q: "Can I choose to ship the tires to my residence address?", a: "Currently, to maintain perfect quality installation and prevent transport safety issues, we prioritize shipping directly to certified shops. If you specifically require delivery to a custom commercial terminal or residence, please contact our support desk." },
    { q: "What mounting and balancing fees must I pay locally?", a: "Standard mounting and balance fees vary between $15 and $25 per tire depending on wheel profile depth and size. These rates are locked on our checkout screen so you face zero surprises at the workshop." },
    { q: "How do return policies operate?", a: "We offer a 45-day satisfaction trial. If you are unsatisfied, return the unmounted tires or schedule a swap at no additional cost. Shipped tires remain 100% covered." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10" id="static-view-container">
      
      {/* FAQ Subpage rendering */}
      {subpage === 'faq' && (
        <div className="space-y-6 animate-fade-in" id="static-faq-page">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">GET HELP INSTANTLY</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight mt-1">Frequently Asked Questions</h1>
            <p className="text-xs text-gray-500 mt-1">Quick support guidelines for shipping, alignment, and installation schedules.</p>
          </div>

          <div className="space-y-3.5" id="faq-accordions">
            {faqItems.map((item, idx) => {
              const isOpen = faqOpenIdx === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all"
                  id={`faq-item-${idx}`}
                >
                  <button
                    onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex justify-between items-center text-xs font-extrabold text-gray-950 cursor-pointer hover:bg-gray-50/50"
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 border-t border-gray-50 text-xs text-gray-600 leading-relaxed bg-gray-50/20">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* About Subpage rendering */}
      {subpage === 'about' && (
        <div className="space-y-6 animate-fade-in text-xs text-gray-600 leading-relaxed" id="static-about-page">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ABOUT OUR BRAND</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight mt-1">Redefining Tire Retail</h1>
          </div>

          <p>TireMax was founded in the USA with a singular objective: to dismantle the complex, opaque, and friction-filled process of purchasing replacement tires online. We believe drivers deserve clean digital interfaces, dynamic fitting, and honest pricing.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-gray-950 text-sm">10k+ Certified Installers</h3>
              <p>We partner with certified family workshops and commercial clinics across all 50 states to guarantee high-quality local fittings.</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-gray-950 text-sm">Direct-to-Warehouse Logistics</h3>
              <p>By connecting directly to manufacturer stockpiles, we skip intermediaries to save customers up to 25% on tire sets.</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Subpage rendering */}
      {subpage === 'contact' && (
        <div className="space-y-6 animate-fade-in" id="static-contact-page">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">GET IN TOUCH</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight mt-1">Customer Support Center</h1>
            <p className="text-xs text-gray-500 mt-1">Submit your queries and we will respond in under 2 hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* contact detail tags */}
            <div className="md:col-span-5 space-y-4 text-xs text-gray-600 leading-relaxed">
              <div className="bg-gray-50 p-4 border border-gray-100 rounded-2xl space-y-2">
                <h3 className="font-extrabold text-gray-950">📞 Support Hotline</h3>
                <p className="font-bold text-orange-500 text-sm">1-800-555-TIRE</p>
                <p className="text-[10px] text-gray-400">Available Mon-Fri 8:00 AM - 6:00 PM EST</p>
              </div>

              <div className="bg-gray-50 p-4 border border-gray-100 rounded-2xl space-y-2">
                <h3 className="font-extrabold text-gray-950">✉️ General Inquiries</h3>
                <p className="font-bold text-gray-800 text-[11px]">support@tiremaxretail.com</p>
              </div>
            </div>

            {/* Support callback form */}
            <form onSubmit={handleContactSubmit} className="md:col-span-7 bg-white border border-gray-200 p-6 rounded-2xl space-y-4">
              {contSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-950 text-xs rounded-xl flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600 font-bold" /> Message successfully dispatched!
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Your Name</label>
                <input 
                  type="text"
                  value={contName}
                  onChange={(e) => setContName(e.target.value)}
                  placeholder="e.g. Sandra Bullock"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Message Inquiry Details</label>
                <textarea 
                  rows={4}
                  value={contText}
                  onChange={(e) => setContText(e.target.value)}
                  placeholder="Tell us about tire fitments, missing tracking codes, or order custom schedules..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-lg shadow-orange-500/10"
              >
                Send Message Support
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
