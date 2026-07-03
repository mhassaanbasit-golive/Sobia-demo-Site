import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { PLPView } from './components/PLPView';
import { PDPView } from './components/PDPView';
import { DealsView } from './components/DealsView';
import { CartCheckoutView } from './components/CartCheckoutView';
import { InstallerLocatorView } from './components/InstallerLocatorView';
import { AccountView } from './components/AccountView';
import { LearnView, BusinessView, StaticPagesView } from './components/OtherViews';

import { Tire, CartItem, SavedVehicle, Installer } from './types';
import { TIRES } from './data';

export default function App() {
  // Navigation Router Page State
  const [page, setPage] = useState<string>('home'); // home, plp, pdp, deals, cart-checkout, locator, account, learn, business, faq, about, contact

  // Global Context States
  const [zipCode, setZipCode] = useState<string>('90021'); // default to Los Angeles CA
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pre-load a default garage vehicle so fitment widgets are active immediately for amazing UX!
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>([
    {
      id: 'saved-tesla-1',
      year: '2024',
      make: 'Tesla',
      model: 'Model 3',
      trim: 'Performance (19")',
      tireSize: '245/40R19',
      isDefault: true
    }
  ]);
  const [activeVehicle, setActiveVehicle] = useState<SavedVehicle | null>(savedVehicles[0]);
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null);

  // Selected tire detail active state for PDP view
  const [selectedTire, setSelectedTire] = useState<Tire>(TIRES[0]);

  // Handle Adding tires to cart
  const addToCart = (tire: Tire, size: string, qty: number) => {
    setCart(prev => {
      // Check if matching item is already in cart
      const existingIdx = prev.findIndex(item => item.tire.id === tire.id && item.selectedSize === size);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prev, { tire, selectedSize: size, quantity: qty }];
    });
    // Open cart sliding drawer immediately so user gets feedback!
    setIsCartOpen(true);
  };

  // Garage modifications helper
  const addVehicleToGarage = (veh: SavedVehicle) => {
    setSavedVehicles(prev => {
      const updated = prev.map(v => veh.isDefault ? { ...v, isDefault: false } : v);
      return [veh, ...updated];
    });
    if (veh.isDefault || !activeVehicle) {
      setActiveVehicle(veh);
    }
  };

  // Header Submit Search string
  const onSearchSubmit = (q: string) => {
    setSearchQuery(q);
    setPage('plp');
  };

  // Auto scroll to top on page navigation changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, selectedTire]);

  return (
    <div className="min-h-screen bg-white text-gray-950 font-sans flex flex-col justify-between" id="app-wrapper-frame">
      
      {/* 1. Header Navigation and Promos */}
      <Header 
        page={page}
        setPage={setPage}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        zipCode={zipCode}
        setZipCode={setZipCode}
        savedVehicles={savedVehicles}
        activeVehicle={activeVehicle}
        setActiveVehicle={setActiveVehicle}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={onSearchSubmit}
      />

      {/* 2. Primary Page Router body viewport */}
      <main className="flex-grow pt-4 pb-12" id="app-main-viewport">
        
        {page === 'home' && (
          <HomeView 
            setPage={setPage}
            setSelectedTire={(t) => { setSelectedTire(t); setPage('pdp'); }}
            zipCode={zipCode}
            addVehicleToGarage={addVehicleToGarage}
            setActiveVehicle={setActiveVehicle}
            onSearchSubmit={onSearchSubmit}
          />
        )}

        {page === 'plp' && (
          <PLPView 
            setPage={setPage}
            setSelectedTire={(t) => { setSelectedTire(t); setPage('pdp'); }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeVehicle={activeVehicle}
          />
        )}

        {page === 'pdp' && (
          <PDPView 
            setPage={setPage}
            tire={selectedTire}
            activeVehicle={activeVehicle}
            addToCart={addToCart}
          />
        )}

        {page === 'deals' && (
          <DealsView 
            setPage={setPage}
            onSearchSubmit={onSearchSubmit}
          />
        )}

        {page === 'locator' && (
          <InstallerLocatorView 
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedInstaller={selectedInstaller}
            setSelectedInstaller={setSelectedInstaller}
          />
        )}

        {page === 'account' && (
          <AccountView 
            savedVehicles={savedVehicles}
            setSavedVehicles={setSavedVehicles}
            activeVehicle={activeVehicle}
            setActiveVehicle={setActiveVehicle}
            addVehicleToGarage={addVehicleToGarage}
          />
        )}

        {page === 'learn' && (
          <LearnView 
            onSearchSubmit={onSearchSubmit}
            setPage={setPage}
          />
        )}

        {page === 'business' && (
          <BusinessView />
        )}

        {(page === 'faq' || page === 'about' || page === 'contact') && (
          <StaticPagesView subpage={page} />
        )}

      </main>

      {/* 3. Global Cart Slide-In Drawer overlay & Checkout Manager */}
      <CartCheckoutView 
        page={page}
        setPage={setPage}
        cart={cart}
        setCart={setCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        zipCode={zipCode}
        selectedInstaller={selectedInstaller}
        setSelectedInstaller={setSelectedInstaller}
      />

      {/* 4. Organized Footer Layout */}
      <Footer setPage={setPage} />

    </div>
  );
}
