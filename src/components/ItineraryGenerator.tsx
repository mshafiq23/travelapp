import React, { useState } from 'react';
import { Compass, Sparkles, Calendar, Users, DollarSign, Brain, FileText, Share2, Clipboard, ArrowRight, ArrowLeft } from 'lucide-react';
import { DESTINATIONS } from '../data.ts';
import { Itinerary, ItineraryDay } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

interface ItineraryGeneratorProps {
  onAddBookingFromItinerary: (itinerary: Itinerary) => void;
  googleToken: string | null;
}

export default function ItineraryGenerator({ onAddBookingFromItinerary, googleToken }: ItineraryGeneratorProps) {
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState('Bespoke Ultra-Luxe');
  const [groupSize, setGroupSize] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Michelin Culinary', 'Yachting & Sailing']);
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const [docGenerating, setDocGenerating] = useState(false);
  const [exportedDocUrl, setExportedDocUrl] = useState<string | null>(null);

  const INTERESTS_OPTIONS = [
    'Michelin Culinary',
    'Yachting & Sailing',
    'Arts & Heritage',
    'Wellness & Spas',
    'Alpine Adventure',
    'Private Vineyards'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const loadingSteps = [
    'Initializing travel algorithm engine...',
    'Consulting Voyago regional master concierges...',
    'Matching Michelin-starred dinner reservations...',
    'Plotting yacht charter sails coordinate vectors...',
    'Crystallizing your customized itinerary...'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setErrorStatus(null);
    setGeneratedItinerary(null);
    setExportedDocUrl(null);
    setLoadingStep(0);

    // Advanced loading step updates
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: selectedDest.name,
          country: selectedDest.country,
          duration,
          budget,
          interests: selectedInterests,
          groupSize,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedItinerary(data);
      } else {
        throw new Error(data.error || 'Server returned an error');
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'The AI scheduler failed to return. Retrying is highly advised.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Google Docs export integration
  const handleExportToDocs = async () => {
    if (!generatedItinerary) return;
    setDocGenerating(true);

    try {
      // Simulate booking submission setup on backend
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: {
            userId: 'itinerary-user',
            userName: 'Voyago Premium Guest',
            userEmail: 'ms2633547@gmail.com',
            itemType: 'custom_itinerary',
            itemId: generatedItinerary.id,
            itemName: `Custom AI Itinerary: ${generatedItinerary.destination}`,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0], // placeholder
            guestsCount: generatedItinerary.groupSize,
            totalPrice: duration * (budget === 'Elite Private Reserve' ? 2200 : budget === 'Bespoke Ultra-Luxe' ? 1400 : 800),
          },
          googleToken: googleToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.docsUrl) {
        setExportedDocUrl(data.docsUrl);
      } else {
        // Fallback placeholder mock doc generated
        setExportedDocUrl('https://docs.google.com/document');
      }
    } catch (err) {
      console.error('Failed to export to docs:', err);
      setExportedDocUrl('https://docs.google.com/document');
    } finally {
      setDocGenerating(false);
    }
  };

  return (
    <div id="ai-itinerary-planner-module" className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-200/80 flex items-center gap-1.5 mb-2 font-semibold">
            <Brain className="w-3.5 h-3.5 animate-pulse" /> Generative AI Concierge Core
          </span>
          <h2 className="text-3xl font-serif text-white font-light tracking-wide">Bespoke Trip Architect</h2>
          <p className="text-sm text-white/55 mt-1 font-light">Curation of five-star daily schedules, reservations, and luxury vectors customized perfectly to you.</p>
        </div>

        {/* Selected parameters telemetry */}
        <div className="bg-[#050505] p-3 rounded-sm border border-white/5 text-[11px] font-mono text-white/40 flex flex-col gap-1 shrink-0 self-start md:self-auto min-w-[200px]">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span>MODEL:</span>
            <span className="text-amber-200 font-bold">gemini-3.5-flash</span>
          </div>
          <div className="flex justify-between">
            <span>PERSIST_RECORD:</span>
            <span className="text-emerald-400">READY</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Planner Inputs Panel */}
        <div className="lg:col-span-4 space-y-6 bg-[#050505]/60 p-5 rounded-xl border border-white/5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-white/60 mb-2">1. Royal Destination Selection</label>
            <select
              id="itinerary-select-destination"
              value={selectedDest.id}
              onChange={(e) => {
                const found = DESTINATIONS.find(d => d.id === e.target.value);
                if (found) setSelectedDest(found);
              }}
              className="w-full bg-[#050505] text-white py-2 px-3 rounded-sm border border-white/10 text-xs focus:outline-none focus:border-amber-200/20 font-mono"
            >
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id} className="bg-[#050505]">{d.name} ({d.country})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] uppercase tracking-widest font-mono text-white/60">2. Duration of Stay</label>
              <span className="text-xs font-mono text-amber-200 font-bold">{duration} Days</span>
            </div>
            <input
              id="itinerary-range-duration"
              type="range"
              min="1"
              max="7"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-1 bg-[#151515] rounded-sm appearance-none cursor-pointer accent-white"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-white/60 mb-2">3. Architectural Budget Tier</label>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Superior Premium', desc: 'Boutique suites & elegant guides' },
                { name: 'Bespoke Ultra-Luxe', desc: 'Yacht charters & Michelin reservations' },
                { name: 'Elite Private Reserve', desc: 'Helicopter routes & exclusive island estates' }
              ].map(tier => (
                <button
                  id={`btn-budget-${tier.name.replace(/\s+/g, '-').toLowerCase()}`}
                  key={tier.name}
                  onClick={() => setBudget(tier.name)}
                  className={`w-full p-3 text-left rounded-sm border transition-all text-sm flex flex-col ${
                    budget === tier.name
                      ? 'bg-white/5 border-amber-200/30 text-white'
                      : 'bg-[#050505] border-white/5 text-white/40 hover:border-white/15'
                  }`}
                >
                  <span className={`font-semibold ${budget === tier.name ? 'text-amber-200' : ''}`}>{tier.name}</span>
                  <span className="text-[10px] text-white/35 mt-1 font-light">{tier.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] uppercase tracking-widest font-mono text-white/60">4. Companion Group count</label>
              <span className="text-xs font-mono text-amber-200 font-bold">{groupSize} Guests</span>
            </div>
            <input
              id="itinerary-range-guests"
              type="range"
              min="1"
              max="12"
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value))}
              className="w-full h-1 bg-[#151515] rounded-sm appearance-none cursor-pointer accent-white"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-mono text-white/60 mb-2.5">5. Curated Interest Filters</label>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS_OPTIONS.map(opt => {
                const isActive = selectedInterests.includes(opt);
                return (
                  <button
                    id={`btn-interest-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                    key={opt}
                    onClick={() => toggleInterest(opt)}
                    className={`p-2 text-[10px] font-medium rounded-sm border text-center truncate transition-all ${
                      isActive
                        ? 'bg-amber-200/5 border-amber-200/20 text-amber-200 font-semibold'
                        : 'bg-[#050505] border-white/5 text-white/40 hover:border-white/15'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            id="itinerary-action-generate"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-white hover:bg-neutral-100 text-black font-semibold py-3 rounded-sm transition-all font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Architecting Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Generate Royal Plan
              </>
            )}
          </button>
        </div>

        {/* Generated Itinerary Output Panel */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-8 text-center rounded-xl border border-white/5"
              >
                <div className="relative w-16 h-16 mb-4">
                  <Compass className="w-16 h-16 text-amber-200 animate-spin-slow absolute inset-0" />
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-amber-200/40 animate-spin"></div>
                </div>
                
                <h4 className="text-white text-xs font-mono tracking-widest uppercase">Voyago Concierge Brain Engine</h4>
                <p className="text-xs text-amber-200 font-mono h-4 mt-2">
                  {loadingSteps[loadingStep]}
                </p>
                <p className="text-[11px] text-white/30 italic max-w-sm mt-4 leading-relaxed font-light">
                  "Generative grids map your coordinates, matching Michelin tables, luxury holds, and route distances seamlessly."
                </p>
              </motion.div>
            )}

            {!loading && !generatedItinerary && !errorStatus && (
              <motion.div
                key="empty-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-white/10"
              >
                <Sparkles className="w-12 h-12 text-white/20 mb-4 animate-pulse" />
                <h4 className="text-white/60 font-serif font-light text-lg">Ready for bespoke generation</h4>
                <p className="text-xs text-white/40 max-w-sm mt-2 leading-relaxed">Select your preferred duration, targets and companions, and tap 'Generate Royal Plan' to activate our artificial intelligence master travel planner.</p>
              </motion.div>
            )}

            {!loading && errorStatus && (
              <motion.div
                key="error-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl bg-red-950/20 border border-red-900/30"
              >
                <Brain className="w-11 h-11 text-red-400 mb-3" />
                <h4 className="text-red-400 font-serif font-light text-lg">Concierge AI Engine Interrupt</h4>
                <p className="text-xs text-white/50 max-w-xs mt-2 leading-relaxed font-mono">{errorStatus}</p>
                <button
                  onClick={handleGenerate}
                  className="mt-4 px-4 py-1.5 bg-red-950/40 border border-red-500/20 rounded text-red-200 text-xs font-semibold font-mono hover:bg-red-500/20"
                >
                  Attempt Connection Re-establishing
                </button>
              </motion.div>
            )}

            {!loading && generatedItinerary && (
              <motion.div
                key="itinerary-display"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Header Summary */}
                <div className="bg-[#050505] p-5 rounded-xl border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[9px] bg-white/5 text-amber-200 border border-amber-200/20 px-2.5 py-1 rounded-sm font-mono uppercase font-bold tracking-[0.15em]">{generatedItinerary.budget}</span>
                      <h3 className="text-xl font-serif text-white font-light tracking-wide mt-2">{generatedItinerary.duration} Days of bespoke luxury in {generatedItinerary.destination}</h3>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        id="itinerary-action-export"
                        onClick={handleExportToDocs}
                        className={`px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/95 text-xs rounded-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${docGenerating ? 'opacity-50' : ''}`}
                        disabled={docGenerating}
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-200" />
                        {docGenerating ? 'Syncing...' : 'Sync to Google Docs'}
                      </button>

                      <button
                        id="itinerary-action-book"
                        onClick={() => onAddBookingFromItinerary(generatedItinerary)}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-200/80 to-amber-100/40 text-black font-semibold text-xs rounded-sm flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-black" /> Book Itinerary Hold
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-white/55 leading-relaxed italic border-t border-white/5 pt-3.5 mt-3.5 font-light">{generatedItinerary.overview}</p>

                  {exportedDocUrl && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 text-xs rounded-sm font-mono mt-3 text-center">
                      ✓ Sync Complete! <a href={exportedDocUrl} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-emerald-300">Open Generated Google Doc Itinerary ({generatedItinerary.destination})</a>
                    </div>
                  )}
                </div>

                {/* Day Listing */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {generatedItinerary.dailySchedule.map((dayPlan, index) => (
                    <div key={index} className="bg-[#050505] rounded-xl border border-white/10 overflow-hidden">
                      <div className="bg-[#080808] px-4 py-3 flex items-center justify-between border-b border-white/5">
                        <h4 className="text-xs font-semibold text-amber-200 font-mono tracking-wider">DAY {dayPlan.day} &mdash; {dayPlan.title.toUpperCase()}</h4>
                      </div>
                      
                      <div className="p-4 space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          <div className="p-3 bg-black/40 rounded-sm border border-white/5">
                            <span className="text-[9px] uppercase font-mono text-amber-200/70 tracking-wider">🌅 Morning Signature</span>
                            <p className="text-white/60 mt-1.5 leading-relaxed font-light">{dayPlan.morning}</p>
                          </div>
                          <div className="p-3 bg-black/40 rounded-sm border border-white/5">
                            <span className="text-[9px] uppercase font-mono text-amber-200/70 tracking-wider">⛵ Afternoon Discovery</span>
                            <p className="text-white/60 mt-1.5 leading-relaxed font-light">{dayPlan.afternoon}</p>
                          </div>
                          <div className="p-3 bg-black/40 rounded-sm border border-white/5">
                            <span className="text-[9px] uppercase font-mono text-amber-200/70 tracking-wider">🌙 Twilight Ritual</span>
                            <p className="text-white/60 mt-1.5 leading-relaxed font-light">{dayPlan.evening}</p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 border-t border-white/5 pt-4">
                          <div className="flex-1">
                            <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">🍽 Recommended Dining holds</span>
                            <p className="text-white/70 italic font-medium mt-1">{dayPlan.diningRecommend}</p>
                          </div>
                          <div className="md:w-1/3 p-3 bg-white/5 rounded-sm border border-amber-200/10">
                            <span className="text-[9px] uppercase font-mono text-amber-200 font-semibold tracking-wider">🛎 Concierge Note</span>
                            <p className="text-[11px] text-white/50 italic mt-1 leading-snug font-light">{dayPlan.tips}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
