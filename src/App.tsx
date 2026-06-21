import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Brain, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  FileText, 
  Star, 
  Plane, 
  Search, 
  User, 
  LogOut, 
  Plus, 
  Award,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { DESTINATIONS, TOUR_PACKAGES, HOTELS, FLIGHTS, REVIEWS } from './data.ts';
import { Destination, TourPackage, Hotel, Flight, Booking, User as UserType } from './types.ts';
import InteractiveMap from './components/InteractiveMap.tsx';
import ItineraryGenerator from './components/ItineraryGenerator.tsx';
import BookingForm from './components/BookingForm.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation & View Controllers
  // activeSection options: 'catalog' | 'map' | 'ai-planner' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'catalog' | 'map' | 'ai-planner' | 'dashboard'>('catalog');
  
  // Custom states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [activeBooking, setActiveBooking] = useState<{
    itemType: 'tour' | 'hotel' | 'flight' | 'custom_itinerary';
    itemId: string;
    itemName: string;
    unitPrice: number;
  } | null>(null);

  // User State
  const [user, setUser] = useState<UserType | null>({
    id: 'voyago-user-99',
    email: 'ms2633547@gmail.com',
    name: 'Alexandra Thornton',
    role: 'admin', // defaulted to admin so they can easily preview both Admin panel & Custom hold booking flows!
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  const [googleToken, setGoogleToken] = useState<string | null>('mock-voyago-google-token'); // pre-authenticated to immediately unlock workspace functions!
  const [localBookings, setLocalBookings] = useState<Booking[]>([]);
  const [userReviews, setUserReviews] = useState(REVIEWS);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewDest, setNewReviewDest] = useState('Amalfi Coast');

  // Load bookings from server
  const loadBookingsFromServer = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setLocalBookings(data);
      }
    } catch (err) {
      console.warn('Backend server bookings load failed, using local fallback state:', err);
    }
  };

  useEffect(() => {
    loadBookingsFromServer();
  }, [activeTab]);

  // Handle seamless booking success callback
  const handleBookingSuccess = (newBooking: Booking) => {
    setLocalBookings(prev => [newBooking, ...prev]);
  };

  // Convert AI generated itinerary seamlessly into a live Checkout Hold!
  const handleAddBookingFromItinerary = (itinerary: any) => {
    setActiveBooking({
      itemType: 'custom_itinerary',
      itemId: itinerary.id,
      itemName: ` Bespoke Custom AI Trip to ${itinerary.destination}`,
      unitPrice: itinerary.duration * (itinerary.budget === 'Elite Private Reserve' ? 2200 : itinerary.budget === 'Bespoke Ultra-Luxe' ? 1400 : 800)
    });
  };

  // Filtering Destination list
  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = filterTag === 'All' || dest.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  // Handle Review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const addedReview = {
      id: `rev-${Date.now()}`,
      user: user?.name || 'Voyago Elite Guest',
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      destinationName: newReviewDest
    };

    setUserReviews(prev => [addedReview, ...prev]);
    setNewReviewComment('');
    alert('Thank you for logging your high-fashion reviews hold! It has been rendered.');
  };

  // Calculate unique tags
  const ALL_TAGS = ['All', 'Luxury', 'Romantic', 'Adventure', 'Wellness', 'Culture', 'Coastal'];

  return (
    <div id="voyago-root-layout" className="min-h-screen bg-[#050505] text-white selection:bg-amber-200 selection:text-black font-sans antialiased">
      
      {/* Dynamic Workspace Connect Banner */}
      <div className="bg-[#080808] border-b border-white/5 px-4 py-2.5 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white/40 font-mono text-[11px] mx-auto sm:mx-0">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></div>
            <span className="tracking-widest uppercase">Active Workspace Connected Successfully (Gmail, Google Docs, Google Sheets)</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60 mx-auto sm:mx-0">
            <span className="font-mono text-[10px] bg-white/5 text-amber-200/80 border border-white/10 px-2 py-0.5 rounded-sm font-semibold">ms2633547@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-12 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white text-black rounded-sm shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-serif tracking-[0.25em] font-light text-white uppercase">
                  Voyago
                </h1>
                <p className="text-[9px] tracking-[0.3em] uppercase text-amber-200/60 font-mono mt-0.5">Elite luxury voyager</p>
              </div>
            </div>
            
            {/* Small screen role indicator */}
            <div className="md:hidden flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>ADMIN</span>
            </div>
          </div>

          {/* Tab Navigation selector */}
          <nav className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-sm border border-white/10 text-[11px] uppercase tracking-[0.15em]">
            <button
              id="nav-catalog"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-sm font-medium transition-all ${
                activeTab === 'catalog' 
                  ? 'bg-white text-black font-semibold shadow-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              🌍 Destinations
            </button>
            <button
              id="nav-map"
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-sm font-medium transition-all ${
                activeTab === 'map' 
                  ? 'bg-white text-black font-semibold shadow-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              🗺 Satellite Explorer
            </button>
            <button
              id="nav-ai-planner"
              onClick={() => setActiveTab('ai-planner')}
              className={`px-4 py-2 rounded-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'ai-planner' 
                  ? 'bg-white text-black font-semibold shadow-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              🧠 AI Planner
            </button>
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard' 
                  ? 'bg-white text-black font-semibold shadow-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              💼 Concierge Dispatch
            </button>
          </nav>

          {/* User Status Bar */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-[#080808] border border-white/10 p-1.5 pr-4 rounded-full">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-white/20 object-cover" 
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-white pr-1">{user.name}</p>
                  <p className="text-[9px] text-amber-200/60 font-mono">Administration Hub</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setUser({
                  id: 'voyago-user-99',
                  email: 'ms2633547@gmail.com',
                  name: 'Alexandra Thornton',
                  role: 'admin',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                })}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-sm py-2 px-4 uppercase text-[10px] tracking-widest font-mono transition-all"
              >
                Sign in with Google
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Hero Display section (Only displays on the home/catalog Tab) */}
      {activeTab === 'catalog' && (
        <section id="hero-segment" className="relative py-24 px-4 flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/10 bg-[#080808]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none"></div>
          {/* Stylized background overlay image */}
          <div className="absolute inset-0 opacity-10 saturate-20 mix-blend-screen">
            <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80" alt="Amalfi background map" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-20 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/5 text-amber-200/80 border border-white/10 rounded-full text-[9px] uppercase tracking-[0.2em] font-mono font-medium animate-pulse">
              <Award className="w-3.5 h-3.5" /> Luxury Voyage Concierge Platform
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif text-white font-light tracking-tight leading-tight max-w-3xl mx-auto">
              The Crown Jewels of <br />
              <span className="font-serif italic text-amber-200/60 font-light">Global Exploration</span>
            </h2>

            <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto leading-relaxed font-light">
              Voyago is a curated enclave of ultra-luxurious destinations and yacht charters, powered by elite Generative AI trip mapping and synchronized perfectly to your Google Workspace productivity cloud.
            </p>

            {/* Quick Filter Controls Board */}
            <div className="bg-[#0a0a0a]/90 border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto mt-12 backdrop-blur-md">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-3.5" />
                <input
                  id="hero-search-query"
                  type="text"
                  placeholder="Search Positano, Kyoto gardens, volcanic cellars, flights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-amber-200/30 font-mono italic"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {ALL_TAGS.slice(0, 5).map(tag => (
                  <button
                    id={`btn-tag-${tag.toLowerCase()}`}
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-2 text-[10px] uppercase font-mono rounded-sm border transition-all truncate shrink-0 ${
                      filterTag === tag 
                        ? 'bg-white text-black font-semibold border-white' 
                        : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-12 py-16 bg-[#050505]">
        
        {/* VIEW 1: Catalog view (Tours, Hotels, Flight list, and Reviews) */}
        {activeTab === 'catalog' && (
          <div className="space-y-20">
            
            {/* Section A: Destinations catalogue */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.3em] text-amber-200/60 mb-2 font-semibold">Featured Selection</h2>
                  <h3 className="text-4xl font-serif text-white font-light">Custom Luxury Sanctuary Havens</h3>
                  <p className="text-xs text-white/40 mt-1 font-light">Immersive private islands, clifftop dining platforms, and historic Ryokans.</p>
                </div>
                <span className="text-xs font-mono text-amber-200/70 uppercase tracking-widest">{filteredDestinations.length} Options Found</span>
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="bg-[#080808] border border-dashed border-white/10 p-16 text-center rounded-sm">
                  <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-xs font-mono text-white/40 uppercase tracking-wider">No high-end properties found matching query. Try 'Amalfi' or 'Kyoto'.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDestinations.map(dest => (
                    <div 
                      key={dest.id} 
                      className="group bg-[#080808] border border-white/5 hover:border-white/20 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg"
                      id={`destination-card-${dest.id}`}
                    >
                      {/* Cover Photo */}
                      <div className="relative h-60 overflow-hidden bg-neutral-900">
                        <img 
                          src={dest.coverImage} 
                          alt={dest.name} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-[#050505]/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-amber-200 border border-white/10 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-200 text-amber-200" /> {dest.rating}
                        </div>
                        <div className="absolute bottom-4 left-6">
                          <span className="text-[10px] uppercase tracking-widest text-amber-200/80 mb-1 block font-bold">{dest.country}</span>
                          <h4 className="text-2xl font-serif text-white font-light tracking-tight">{dest.name}</h4>
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="p-6 space-y-5">
                        <p className="text-[13px] text-white/50 leading-relaxed font-light">
                          {dest.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {dest.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] uppercase font-mono bg-[#050505] text-white/40 px-2.5 py-0.5 rounded-sm border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="border-t border-white/5 pt-5 flex items-center justify-between">
                          <button
                            id={`btn-explore-map-${dest.id}`}
                            onClick={() => {
                              setActiveTab('map');
                            }}
                            className="text-[10px] font-mono font-bold tracking-[0.15em] text-amber-200/60 hover:text-amber-200 transition-colors uppercase flex items-center gap-1"
                          >
                            Satellite Coordinates &rarr;
                          </button>

                          <button
                            id={`btn-book-dest-${dest.id}`}
                            onClick={() => setActiveBooking({
                              itemType: 'tour',
                              itemId: dest.id,
                              itemName: `${dest.name} Signature Concierge Tour`,
                              unitPrice: dest.costScore * 950
                            })}
                            className="bg-white text-black hover:bg-neutral-200 text-xs font-semibold uppercase px-4 py-2 rounded-sm transition-all shadow-sm"
                          >
                            Reserve State
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section B: Tour Packages & Yacht Holds */}
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-5">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-amber-200/60 mb-2 font-semibold font-mono">Bespoke Expeditions</h2>
                <h3 className="text-4xl font-serif text-white font-light">Bespoke Majestic Expedition Slots</h3>
                <p className="text-xs text-white/40 mt-1 font-light">Guaranteed luxury slots including speed boat charters, Michelin-starred chefs, Ryokans, and private estates.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {TOUR_PACKAGES.map(pkg => (
                  <div 
                    key={pkg.id} 
                    className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row justify-between transition-all shadow-lg"
                    id={`package-card-${pkg.id}`}
                  >
                    <div className="md:w-5/12 h-52 md:h-auto bg-neutral-950 relative">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-mono uppercase text-amber-200 font-bold border border-white/10">
                        {pkg.difficulty} Charter
                      </div>
                    </div>
                    <div className="md:w-7/12 p-6 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-lg font-serif text-white leading-snug">{pkg.name}</h4>
                          <span className="text-[13px] font-mono text-amber-200/80 font-semibold shrink-0">${pkg.price.toLocaleString()}+</span>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed font-light">{pkg.description}</p>
                        
                        <div className="pt-2 text-[10px] font-sans text-white/50 space-y-1.5">
                          {pkg.features.slice(0, 2).map((feat, idx) => (
                            <p key={idx} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-amber-200"></span>
                              {feat}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/5 mt-6 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{pkg.durationDays} Days / Max {pkg.maxGroupSize} Guests</span>
                        <button
                          id={`btn-book-pkg-${pkg.id}`}
                          onClick={() => setActiveBooking({
                            itemType: 'tour',
                            itemId: pkg.id,
                            itemName: pkg.name,
                            unitPrice: pkg.price
                          })}
                          className="bg-gradient-to-r from-amber-200/80 to-amber-100/40 text-black font-bold text-xs uppercase px-4 py-2 rounded-sm hover:opacity-90 transition-opacity"
                        >
                          Reserve Slot
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Flight and seat listings */}
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-5 font-light">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-amber-200/60 mb-2 font-semibold">Luxury Travel Vectors</h2>
                <h3 className="text-4xl font-serif text-white font-light">Elite Aviation Arrangements</h3>
                <p className="text-xs text-white/40 mt-1 font-light">Exclusive first and business seat holds on long-range flights with Emirates and Singapore Airlines.</p>
              </div>

              <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#050505] text-white/60 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest">
                        <th className="p-5 font-semibold">Aviation Carrier</th>
                        <th className="p-5 font-semibold">Arrangement Segments</th>
                        <th className="p-5 font-semibold">Schedule Timings</th>
                        <th className="p-5 font-semibold">Cabin Class Option</th>
                        <th className="p-5 font-semibold">Assess seat hold</th>
                        <th className="p-5 font-semibold text-center">Filing Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {FLIGHTS.map(fl => (
                        <tr key={fl.id} className="hover:bg-white/5 transition-all">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <Plane className="w-4 h-4 text-amber-200" />
                              <div>
                                <p className="font-semibold text-white">{fl.airline}</p>
                                <p className="text-[10px] text-white/40 font-mono mt-0.5">{fl.flightNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 font-mono font-medium text-white/80">
                            {fl.from} &rarr; {fl.to}
                          </td>
                          <td className="p-5">
                            <p className="text-white/80 font-medium">{fl.departureTime} Departure</p>
                            <p className="text-[10px] text-white/40 mt-0.5">Est flight: {fl.duration}</p>
                          </td>
                          <td className="p-5">
                            <span className="inline-block text-[10px] font-mono px-2.5 py-1 rounded-sm bg-white/5 text-amber-200 font-bold uppercase border border-white/10">
                              {fl.classType}
                            </span>
                          </td>
                          <td className="p-5 font-mono font-bold text-amber-100">
                            ${fl.price.toLocaleString()}
                          </td>
                          <td className="p-5 text-center">
                            <button
                              id={`btn-book-flight-${fl.id}`}
                              onClick={() => setActiveBooking({
                                itemType: 'flight',
                                itemId: fl.id,
                                itemName: `${fl.airline} - ${fl.flightNumber} (${fl.from} to ${fl.to})`,
                                unitPrice: fl.price
                              })}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-white/20 text-xs px-3.5 py-1.5 rounded-sm transition-all"
                            >
                              Reserve Seat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section D: Customer reviews list & submission */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/10">
              {/* Reviews Display */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h4 className="text-2xl font-serif text-white font-light">Voyager Testimonial Holds</h4>
                  <p className="text-xs text-white/40 mt-1 font-light">Verified comments log submitted by luxury card accounts. Syncing active.</p>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                  {userReviews.map(rev => (
                    <div key={rev.id} className="bg-[#080808] p-5 rounded-2xl border border-white/5 space-y-3 shadow-md">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-[10px] text-amber-200/60 font-mono uppercase font-semibold tracking-widest">{rev.destinationName}</p>
                          <h5 className="font-sans font-semibold text-white text-sm mt-0.5">{rev.user}</h5>
                        </div>
                        <div className="flex gap-0.5 text-amber-200 text-xs">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`w-3 h-3 ${idx < Math.floor(rev.rating) ? 'fill-amber-200 text-amber-200' : 'text-neutral-800'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[13px] text-white/75 italic leading-relaxed font-light">
                        "{rev.comment}"
                      </p>
                      <p className="text-[9px] text-white/30 font-mono text-right">{rev.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave holding reviews form */}
              <div className="lg:col-span-5 bg-[#080808] p-8 rounded-2xl border border-white/10 relative self-start shadow-xl">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-200/80 font-mono">Submit Guest Review</h4>
                <p className="text-xs text-white/40 mt-2 mb-6 leading-relaxed font-light">Submit your recent bespoke travels assessment. Verified ratings are logged immediately to regional records.</p>
                
                <form onSubmit={handleAddReview} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-white/60 uppercase font-mono text-[10px] mb-1.5 tracking-wider font-medium">Target Destination</label>
                    <select
                      value={newReviewDest}
                      onChange={(e) => setNewReviewDest(e.target.value)}
                      className="w-full bg-[#050505] text-white/90 py-2 px-3 rounded-sm border border-white/10 focus:outline-none focus:border-amber-200/25 text-xs font-mono"
                    >
                      {DESTINATIONS.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 uppercase font-mono text-[10px] mb-1.5 tracking-wider font-medium">Reviewer Name</label>
                      <input
                        required
                        type="text"
                        disabled
                        value={user?.name || 'Voyago Elite Guest'}
                        className="w-full bg-[#050505] text-white/30 py-2 px-3 rounded-sm border border-white/10 text-xs cursor-not-allowed font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 uppercase font-mono text-[10px] mb-1.5 tracking-wider font-medium">Curation score</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                        className="w-full bg-[#050505] text-white py-2 px-3 rounded-sm border border-white/10 focus:outline-none focus:border-amber-200/25 text-xs font-mono"
                      >
                        <option value="5">5 of 5 Stars</option>
                        <option value="4">4 of 5 Stars</option>
                        <option value="3">3 of 5 Stars</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 uppercase font-mono text-[10px] mb-1.5 tracking-wider font-medium">Your assessment holding statement</label>
                    <textarea
                      required
                      placeholder="Impeccable service, private yacht anchors was pristine, ryokan spa was amazing..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={3}
                      className="w-full bg-[#050505] text-white py-2 px-3 rounded-sm border border-white/10 focus:outline-none focus:border-amber-200/25 text-xs font-sans leading-relaxed"
                    />
                  </div>

                  <button
                    id="btn-submit-review"
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-200/80 to-amber-100/40 hover:opacity-90 text-black font-bold font-mono py-3 rounded-sm text-xs border-none uppercase transition-all tracking-widest mt-2"
                  >
                    File Public Review Hold
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Satellite Map explorer view */}
        {activeTab === 'map' && (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-5">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-amber-200/60 mb-2 font-semibold">Radar Navigation</h2>
              <h3 className="text-4xl font-serif text-white font-light">Interactive Exploration</h3>
              <p className="text-xs text-white/40 mt-1 font-light">Satellite tracking coordinates, nearby custom lodging recommendations, and bespoke helicopter route plans.</p>
            </div>

            <InteractiveMap />
          </div>
        )}

        {/* VIEW 3: AI Trip Planner creator view */}
        {activeTab === 'ai-planner' && (
          <div className="space-y-8">
            <ItineraryGenerator 
              onAddBookingFromItinerary={handleAddBookingFromItinerary} 
              googleToken={googleToken} 
            />
          </div>
        )}

        {/* VIEW 4: Admin and Guest Dashboard Portal */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <AdminDashboard googleToken={googleToken} />
          </div>
        )}

      </main>

      {/* Checkout Booking Form Dialog Overlay */}
      {activeBooking && (
        <BookingForm
          itemType={activeBooking.itemType}
          itemId={activeBooking.itemId}
          itemName={activeBooking.itemName}
          unitPrice={activeBooking.unitPrice}
          user={user}
          googleToken={googleToken}
          onClose={() => setActiveBooking(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Premium Elegant Footer */}
      <footer className="bg-[#050505] border-t border-white/10 py-16 px-4 mt-24 text-center font-sans tracking-wide">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-center items-center gap-3">
            <Compass className="w-5 h-5 text-amber-200/80" />
            <span className="text-base font-serif tracking-[0.4em] text-white uppercase font-light">Voyago</span>
          </div>
          
          <p className="text-xs text-white/40 max-w-lg mx-auto leading-relaxed font-light">
            Voyago Elite Concierge. All global luxury properties, helipads holding slots, & premium yachts are operated in accordance with elite charter standards. Workspace integration enabled for Google Sheets, Docs & Gmail.
          </p>

          <div className="text-[10px] font-mono text-white/30 flex justify-center gap-8 items-center">
            <span>© 2026 Voyago VIP Inc.</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-amber-200 rounded-full"></div> GNSS POS: 40.6331° N</span>
            <span>Secure Architecture</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
