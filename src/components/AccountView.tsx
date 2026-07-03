import React, { useState } from 'react';
import { PenTool, Check, Trash2, Calendar, FileText, Clipboard, Plus, ShieldCheck, User, Car, Package } from 'lucide-react';
import { SavedVehicle, Tire } from '../types';
import { CAR_DATABASE } from '../data';

interface AccountViewProps {
  savedVehicles: SavedVehicle[];
  setSavedVehicles: React.Dispatch<React.SetStateAction<SavedVehicle[]>>;
  activeVehicle: SavedVehicle | null;
  setActiveVehicle: (v: SavedVehicle | null) => void;
  addVehicleToGarage: (v: SavedVehicle) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  savedVehicles,
  setSavedVehicles,
  activeVehicle,
  setActiveVehicle,
  addVehicleToGarage
}) => {
  const [activeTab, setActiveTab] = useState<'garage' | 'orders' | 'registration'>('garage');
  
  // New vehicle add form states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [addYear, setAddYear] = useState<string>('2024');
  const [addMake, setAddMake] = useState<string>('Tesla');
  const [addModel, setAddModel] = useState<string>('Model 3');
  const [addTrim, setAddTrim] = useState<string>('');
  const [addSize, setAddSize] = useState<string>('245/40R19');

  // Tire registration form states
  const [regBrand, setRegBrand] = useState<string>('Velocita');
  const [regSize, setRegSize] = useState<string>('245/40R19');
  const [regDot, setRegDot] = useState<string>('');
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  // Past Orders mock database
  const pastOrders = [
    {
      id: 'TMX-4421-90',
      date: 'May 14, 2026',
      tireName: 'Velocita Sport A/S 4',
      size: '245/40R19',
      qty: 4,
      total: 756,
      status: 'Fully Installed',
      installer: 'Elite Wheel & Fitment Labs',
      dateInstalled: 'May 16, 2026'
    },
    {
      id: 'TMX-2210-44',
      date: 'April 02, 2026',
      tireName: 'EcoGlide Premium Tour',
      size: '205/55R16',
      qty: 2,
      total: 270,
      status: 'Delivered / Completed',
      installer: 'Apex Auto & Tire Center',
      dateInstalled: 'April 04, 2026'
    }
  ];

  // Handle local car selections to autofill sizes
  const handleMakeChange = (make: string) => {
    setAddMake(make);
    const firstModel = CAR_DATABASE.models[make]?.[0] || '';
    setAddModel(firstModel);
    const trimObj = CAR_DATABASE.trims[firstModel]?.[0];
    setAddTrim(trimObj?.trim || 'Standard Fitment');
    setAddSize(trimObj?.size || '245/40R19');
  };

  const handleModelChange = (model: string) => {
    setAddModel(model);
    const trimObj = CAR_DATABASE.trims[model]?.[0];
    setAddTrim(trimObj?.trim || 'Standard Fitment');
    setAddSize(trimObj?.size || '245/40R19');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVeh: SavedVehicle = {
      id: `saved-${Date.now()}`,
      year: addYear,
      make: addMake,
      model: addModel,
      trim: addTrim || 'Standard Fitment',
      tireSize: addSize,
      isDefault: savedVehicles.length === 0
    };
    addVehicleToGarage(newVeh);
    setShowAddForm(false);
  };

  const handleDeleteVehicle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedVehicles(prev => prev.filter(v => v.id !== id));
    if (activeVehicle?.id === id) {
      setActiveVehicle(null);
    }
  };

  const handleRegisterTire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDot) {
      alert("Please enter a valid DOT code.");
      return;
    }
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegDot('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8" id="account-view-container">
      
      {/* Account view layout banner */}
      <div className="flex items-center gap-4 bg-[#F5F5F3] border border-[#E5E5E5] p-6 rounded-xl" id="account-header">
        <div className="h-14 w-14 bg-[#FF5A1F] rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-sm">
          U
        </div>
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PERSONAL ACCOUNT DASHBOARD</span>
          <h1 className="text-xl md:text-2xl font-black text-[#0D0D0D] uppercase tracking-wider font-display">John Doe Garage Workspace</h1>
          <p className="text-xs text-gray-500 mt-0.5">mhassaanbasit@gmail.com • Member since 2026</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#E5E5E5] pb-3 overflow-x-auto scrollbar-none" id="account-tabs">
        <button
          onClick={() => setActiveTab('garage')}
          className={`text-xs font-black pb-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'garage' ? 'border-[#FF5A1F] text-[#FF5A1F]' : 'border-transparent text-gray-400 hover:text-[#0D0D0D]'
          }`}
        >
          <Car size={15} />
          <span>My Garage ({savedVehicles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`text-xs font-black pb-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-[#FF5A1F] text-[#FF5A1F]' : 'border-transparent text-gray-400 hover:text-[#0D0D0D]'
          }`}
        >
          <Package size={15} />
          <span>Past Order Invoices ({pastOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('registration')}
          className={`text-xs font-black pb-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'registration' ? 'border-[#FF5A1F] text-[#FF5A1F]' : 'border-transparent text-gray-400 hover:text-[#0D0D0D]'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Federal Tire Registration</span>
        </button>
      </div>

      {/* TAB 1: MY GARAGE */}
      {activeTab === 'garage' && (
        <div className="space-y-6 animate-fade-in" id="account-garage-tab">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="font-black text-[#0D0D0D] text-sm uppercase tracking-wider">Saved Vehicles List</h3>
              <p className="text-xs text-gray-400">Select a vehicle to lock sizing constraints on catalog pages.</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
              id="add-vehicle-trigger-btn"
            >
              <Plus size={14} /> Add New Vehicle
            </button>
          </div>

          {/* Add Vehicle Interactive form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="bg-white border border-[#E5E5E5] p-6 rounded-xl space-y-4 max-w-2xl shadow-sm" id="add-vehicle-form">
              <h4 className="text-xs font-black text-[#0D0D0D] uppercase tracking-widest border-b border-[#E5E5E5] pb-2">Add Vehicle Specifications</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                {/* Year Select */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Year</label>
                  <select 
                    value={addYear}
                    onChange={(e) => setAddYear(e.target.value)}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    {CAR_DATABASE.years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                {/* Make Select */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Make</label>
                  <select 
                    value={addMake}
                    onChange={(e) => handleMakeChange(e.target.value)}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(CAR_DATABASE.makes).includes(addYear) && 
                      CAR_DATABASE.makes[addYear].map((mk) => <option key={mk} value={mk}>{mk}</option>)
                    }
                  </select>
                </div>

                {/* Model Select */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Model</label>
                  <select 
                    value={addModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    {CAR_DATABASE.models[addMake]?.map((md) => <option key={md} value={md}>{md}</option>)}
                  </select>
                </div>

                {/* Size / Trim select based on models */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Trim Spec</label>
                  <select 
                    value={addTrim}
                    onChange={(e) => {
                      const selTrim = e.target.value;
                      setAddTrim(selTrim);
                      const matchedSize = CAR_DATABASE.trims[addModel]?.find(t => t.trim === selTrim)?.size || '245/40R19';
                      setAddSize(matchedSize);
                    }}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    {CAR_DATABASE.trims[addModel]?.map((t, idx) => (
                      <option key={idx} value={t.trim}>{t.trim}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Automatic matching size text */}
              <div className="flex justify-between items-center text-xs bg-[#F5F5F3] border border-[#E5E5E5] p-3 rounded-xl">
                <span className="font-bold text-[#0D0D0D] uppercase tracking-wider text-[10px]">Autofilled Target Tire Diameter size:</span>
                <span className="font-mono font-black bg-[#FF5A1F] text-white px-2.5 py-1 rounded shadow-sm">{addSize}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-500 hover:bg-[#F5F5F3] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-2.5 px-5 rounded-xl text-xs cursor-pointer shadow-lg shadow-[#FF5A1F]/10"
                >
                  Save Vehicle to Garage
                </button>
              </div>
            </form>
          )}

          {/* List of saved fleet */}
          {savedVehicles.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-10 text-center max-w-sm mx-auto space-y-4 shadow-sm flex flex-col items-center justify-center" id="empty-garage">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-gray-300">
                <Car size={28} className="stroke-[1.5]" />
              </div>
              <h4 className="font-black text-[#0D0D0D] uppercase tracking-wider">Your Garage is Empty</h4>
              <p className="text-xs text-gray-400 font-medium">Save your vehicles to dynamically match exact tire profiles and fitment guarantees.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-md"
              >
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="garage-grid-list">
              {savedVehicles.map((veh) => {
                const isActive = activeVehicle?.id === veh.id;
                return (
                  <div 
                    key={veh.id}
                    onClick={() => setActiveVehicle(veh)}
                    className={`p-5 rounded-xl border text-left text-xs cursor-pointer flex justify-between items-center transition-all relative ${
                      isActive 
                        ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 shadow-sm' 
                        : 'border-[#E5E5E5] hover:border-gray-400 bg-white shadow-sm'
                    }`}
                    id={`account-garage-veh-${veh.id}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-[#FF5A1F]" />
                        <h4 className="font-black text-sm text-[#0D0D0D] uppercase tracking-wider">{veh.year} {veh.make} {veh.model}</h4>
                      </div>
                      <p className="text-gray-400 font-bold pl-6 uppercase text-[10px] tracking-wide">{veh.trim}</p>
                      
                      <div className="flex items-center gap-2 pl-6 pt-1">
                        <span className="text-[10px] font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-2.5 py-0.5 rounded">
                          Size: {veh.tireSize}
                        </span>
                        {isActive && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            ACTIVE FILTER
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isActive && <Check size={18} className="text-[#FF5A1F] stroke-[3px]" />}
                      <button 
                        onClick={(e) => handleDeleteVehicle(veh.id, e)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: PAST ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in" id="account-orders-tab">
          <div className="border-b border-[#E5E5E5] pb-2">
            <h3 className="font-black text-[#0D0D0D] text-sm uppercase tracking-wider">Purchase History Receipts</h3>
            <p className="text-xs text-gray-400 font-medium">Track and view invoices for completed transactions.</p>
          </div>

          <div className="space-y-4" id="orders-list-history">
            {pastOrders.map((ord) => (
              <div key={ord.id} className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[#E5E5E5] pb-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-mono font-bold uppercase text-[9px] tracking-wider">Invoice ID </span>
                    <strong className="text-[#0D0D0D] font-mono font-black">{ord.id}</strong>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Date: <strong className="text-gray-700 font-mono">{ord.date}</strong></span>
                    <span className="text-emerald-700 font-black text-[9px] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck size={12} /> {ord.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs items-center">
                  <div className="md:col-span-6 space-y-1">
                    <p className="font-black text-sm text-[#0D0D0D] uppercase tracking-wider">{ord.tireName}</p>
                    <p className="text-gray-400 font-medium">Tire Size fitment: <strong className="text-gray-600 font-mono font-bold">{ord.size}</strong></p>
                    <p className="text-gray-400 font-medium">Quantity purchased: <strong className="text-gray-700 font-bold">{ord.qty} tires</strong></p>
                  </div>
                  
                  <div className="md:col-span-4 space-y-1">
                    <p className="text-gray-400 font-black uppercase text-[9px] tracking-wider">Installed locally at:</p>
                    <p className="font-black text-gray-800 uppercase text-xs">{ord.installer}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Service Date: {ord.dateInstalled}</p>
                  </div>

                  <div className="md:col-span-2 text-right">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Total Paid:</span>
                    <span className="text-base font-black text-[#0D0D0D] font-mono">${ord.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIRE REGISTRATION */}
      {activeTab === 'registration' && (
        <div className="space-y-6 max-w-3xl animate-fade-in" id="account-registration-tab">
          <div className="border-b border-[#E5E5E5] pb-2">
            <h3 className="font-black text-[#0D0D0D] text-sm uppercase tracking-wider">Federal Tire & Safety Registration</h3>
            <p className="text-xs text-gray-400 font-medium">Register DOT serial markings of mounted tires to secure active recall notices.</p>
          </div>

          <form onSubmit={handleRegisterTire} className="bg-white border border-[#E5E5E5] p-6 rounded-xl space-y-4 shadow-sm">
            {regSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-950 text-xs rounded-xl flex items-center gap-2 font-medium">
                <ShieldCheck className="text-emerald-700 font-bold" /> Registration Successful! DOT records submitted to Federal Highway safety boards.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Tire Brand</label>
                <select 
                  value={regBrand}
                  onChange={(e) => setRegBrand(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Velocita">Velocita</option>
                  <option value="TerraCore">TerraCore</option>
                  <option value="NorseGrip">NorseGrip</option>
                  <option value="EcoMax">EcoMax</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Size Fitment</label>
                <input 
                  type="text"
                  value={regSize}
                  onChange={(e) => setRegSize(e.target.value)}
                  placeholder="e.g. 245/40R19"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Tire DOT Serial Code (Look on Outer sidewall edge)</label>
                <input 
                  type="text"
                  maxLength={12}
                  value={regDot}
                  onChange={(e) => setRegDot(e.target.value.toUpperCase())}
                  placeholder="e.g. DOT MALO 2420"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl py-2 px-3 focus:outline-none font-mono tracking-widest text-xs"
                  required
                />
                <span className="text-[10px] text-gray-400 font-medium block mt-1">
                  ★ Consists of "DOT" letters followed by 8 to 12 alphanumeric digits representing production week.
                </span>
              </div>
            </div>

            <button 
              type="submit"
              className="bg-[#FF5A1F] hover:bg-brand-orange-hover text-white font-extrabold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-lg shadow-[#FF5A1F]/10 text-xs uppercase tracking-wider"
              id="submit-registration-btn"
            >
              Submit DOT Registration Form
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
