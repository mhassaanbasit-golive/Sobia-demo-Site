import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  setPage: (p: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  return (
    <footer className="bg-white text-[#1A1A1A] border-t border-[#E5E5E5] pt-12 pb-24 md:pb-12" id="app-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Upper Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1 Brand */}
          <div className="col-span-1 md:col-span-1">
            <button 
              onClick={() => setPage('home')} 
              className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#1A1A1A] hover:opacity-90 cursor-pointer mb-6"
            >
              <span>xyz<span className="font-black">tyre</span></span>
            </button>
            <div className="flex gap-4 text-gray-500">
              <a href="#" className="hover:text-[#FF5A1F] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-[#FF5A1F] transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-[#FF5A1F] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-[#FF5A1F] transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Col 2 Company */}
          <div>
            <h4 className="text-base font-bold text-[#1A1A1A] mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setPage('about')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">About us</button></li>
              <li><button onClick={() => setPage('careers')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Careers</button></li>
              <li><button onClick={() => setPage('affiliate')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Affiliate program</button></li>
              <li><button onClick={() => setPage('installer')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Become an installer</button></li>
              <li><button onClick={() => setPage('privacy')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Privacy policy</button></li>
              <li><button onClick={() => setPage('partners')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Our Partners</button></li>
              <li><button onClick={() => setPage('ambassador')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Ambassador program</button></li>
              <li><button onClick={() => setPage('sitemap')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Sitemap</button></li>
              <li><button onClick={() => setPage('gear')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Gear Tire Accessories</button></li>
              <li><button onClick={() => setPage('cookies')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Cookie Preference Settings</button></li>
            </ul>
          </div>

          {/* Col 3 Customer Support */}
          <div>
            <h4 className="text-base font-bold text-[#1A1A1A] mb-4">Customer Support</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setPage('terms')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Terms & conditions</button></li>
              <li><button onClick={() => setPage('account')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">My account</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Contact us</button></li>
              <li><button onClick={() => setPage('help')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Help Center</button></li>
              <li><button onClick={() => setPage('track')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Track your order</button></li>
              <li><button onClick={() => setPage('returns')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Return policy</button></li>
              <li><button onClick={() => setPage('register')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Register your tires</button></li>
            </ul>
          </div>

          {/* Col 4 Tires 101 */}
          <div>
            <h4 className="text-base font-bold text-[#1A1A1A] mb-4">Tires 101</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setPage('learn')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Learn about tires</button></li>
              <li><button onClick={() => setPage('reviews')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Tire reviews</button></li>
              <li><button onClick={() => setPage('shops')} className="hover:text-[#FF5A1F] transition-colors cursor-pointer font-medium text-gray-600">Find local shops</button></li>
            </ul>
          </div>

          {/* Col 5 Mailing List */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-base font-bold text-[#1A1A1A] mb-4">Join our mailing list</h4>
            <p className="text-sm font-medium text-gray-600 mb-4">Subscribe for updates and promotions.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] bg-[#F9F9F9]"
              />
              <button 
                type="submit" 
                className="w-full py-3 bg-[#FF5A1F] hover:bg-orange-600 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </form>
          </div>

        </div>

        {/* Lower Demo bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 border-t border-[#E5E5E5] pt-8 mt-12">
          <div className="text-center md:text-left">
            <p className="font-semibold text-gray-500">Demo Website Developed For Sobia Yasmeen Syed By Tech Resolves Pvt Ltd.</p>
          </div>
          <div className="flex gap-4">
            <span className="font-semibold text-gray-500">© 2026 SimpleTire Demo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
