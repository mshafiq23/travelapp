import React, { useState, useMemo } from 'react';
import { MapPin, Compass, Navigation, Landmark, ArrowRight, Eye, RefreshCw, Zap } from 'lucide-react';
import { DESTINATIONS, HOTELS } from '../data.ts';
import { Destination } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

export default function InteractiveMap() {
  const [selectedDest, setSelectedDest] = useState<Destination>(DESTINATIONS[0]);
  const [activeTab, setActiveTab] = useState<'attractions' | 'hotels' | 'routes'>('attractions');
  const [routePlan, setRoutePlan] = useState<string[]>([]);
  const [customRecFilter, setCustomRecFilter] = useState<string>('all');

  // Find hotels in selected destination country / region
  const localHotels = useMemo(() => {
    return HOTELS.filter(h => h.location.toLowerCase().includes(selectedDest.name.toLowerCase()) || h.location.toLowerCase().includes(selectedDest.country.toLowerCase()));
  }, [selectedDest]);

  const toggleRouteItem = (name: string) => {
    if (routePlan.includes(name)) {
      setRoutePlan(prev => prev.filter(item => item !== name));
    } else {
      setRoutePlan(prev => [...prev, name]);
    }
  };

  const handleClearRoute = () => {
    setRoutePlan([]);
  };

  const recommendedItems = useMemo(() => {
    let list = [...selectedDest.attractions];
    if (customRecFilter !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === customRecFilter.toLowerCase() || (customRecFilter === 'nature' && item.category.toLowerCase() === 'waterfall'));
    }
    return list;
  }, [selectedDest, customRecFilter]);

  // Coordinates formatting for visual precision
  const formatLatLng = (lat: number, lng: number) => {
    const latStr = lat >= 0 ? `${lat.toFixed(4)}° N` : `${Math.abs(lat).toFixed(4)}° S`;
    const lngStr = lng >= 0 ? `${lng.toFixed(4)}° E` : `${Math.abs(lng).toFixed(4)}° W`;
    return `${latStr}, ${lngStr}`;
  };

  return (
    <div id="interactive-explorer-panel" className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="bg-[#050505] border-b border-white/10 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-sm text-amber-200">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-light text-white tracking-wide">Voyago Interactive Satellite & Exploration Hub</h3>
            <p className="text-xs text-white/40 font-mono">Precision GNSS Positioning: 40.6331° N, 14.6029° E &bull; AI Assisted Maps Guidance</p>
          </div>
        </div>
        
        {/* Navigation Selector */}
        <div className="flex gap-1 bg-[#050505] p-1 border border-white/5 rounded-sm">
          {DESTINATIONS.map(dest => (
            <button
              id={`btn-map-dest-${dest.id}`}
              key={dest.id}
              onClick={() => {
                setSelectedDest(dest);
                setRoutePlan([]);
              }}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-sm transition-all ${
                selectedDest.id === dest.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {dest.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Control Board */}
        <div className="lg:col-span-5 p-6 border-r border-white/10 bg-[#080808] flex flex-col justify-between max-h-[600px] overflow-y-auto">
          <div>
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-200/80 font-mono font-semibold">{selectedDest.country}</span>
                <h4 className="text-2xl font-serif text-white font-light tracking-tight mt-1">{selectedDest.name}</h4>
              </div>
              <div className="bg-white/5 text-amber-200/80 px-2.5 py-1 rounded-sm text-xs font-mono border border-white/10">
                {formatLatLng(selectedDest.lat, selectedDest.lng)}
              </div>
            </div>

            <p className="text-[13px] text-white/50 leading-relaxed font-light mb-6">
              {selectedDest.description}
            </p>

            {/* Sub-tab Switchers */}
            <div className="flex border-b border-white/10 mb-5 gap-4">
              <button
                id="tab-map-attractions"
                onClick={() => setActiveTab('attractions')}
                className={`pb-2.5 text-[10px] font-semibold uppercase tracking-widest relative transition-all ${
                  activeTab === 'attractions' ? 'text-amber-200 border-b-2 border-amber-200' : 'text-white/40 hover:text-white'
                }`}
              >
                Attractions
              </button>
              <button
                id="tab-map-hotels"
                onClick={() => setActiveTab('hotels')}
                className={`pb-2.5 text-[10px] font-semibold uppercase tracking-widest relative transition-all ${
                  activeTab === 'hotels' ? 'text-amber-200 border-b-2 border-amber-200' : 'text-white/40 hover:text-white'
                }`}
              >
                Elite Lodging
              </button>
              <button
                id="tab-map-routes"
                onClick={() => setActiveTab('routes')}
                className={`pb-2.5 text-[10px] font-semibold uppercase tracking-widest relative transition-all ${
                  activeTab === 'routes' ? 'text-amber-200 border-b-2 border-amber-200' : 'text-white/40 hover:text-white'
                }`}
              >
                Route Planner ({routePlan.length})
              </button>
            </div>

            {/* List Components */}
            <div>
              {activeTab === 'attractions' && (
                <div className="space-y-3">
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {['all', 'Historic Site', 'Nature', 'Beach'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCustomRecFilter(cat)}
                        className={`text-[9px] uppercase font-mono px-2 py-1 rounded-sm border ${
                          customRecFilter === cat
                            ? 'bg-amber-200/10 border-amber-200/30 text-amber-200'
                            : 'border-white/5 text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat === 'all' ? 'All Sites' : cat}
                      </button>
                    ))}
                  </div>

                  {recommendedItems.map((att, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-4 p-3.5 bg-[#0a0a0a] rounded-xl hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={routePlan.includes(att.name)}
                        onChange={() => toggleRouteItem(att.name)}
                        className="mt-1 accent-white text-black rounded cursor-pointer"
                        id={`chk-attraction-${i}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-amber-200/70">{att.category}</span>
                          <span className="text-[10px] text-white/40 bg-[#050505] px-1.5 py-0.5 rounded font-mono">★ {att.rating}</span>
                        </div>
                        <h5 className="text-sm font-sans font-medium text-white group-hover:text-amber-200 pr-1 mt-0.5 transition-colors">{att.name}</h5>
                        <p className="text-xs text-white/40 line-clamp-1 mt-1 font-mono">{att.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'hotels' && (
                <div className="space-y-3">
                  {localHotels.length === 0 ? (
                    <div className="text-center py-8 text-white/35 text-xs font-mono">No boutique resorts listed in this region. Add via search.</div>
                  ) : (
                    localHotels.map((hot, i) => (
                      <div
                        key={i}
                        className="group p-4 bg-[#0a0a0a] rounded-xl hover:bg-white/5 border border-white/5 hover:border-amber-200/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-white group-hover:text-amber-200 transition-colors">{hot.name}</h5>
                          <span className="text-xs font-mono text-amber-200 font-semibold">${hot.pricePerNight}+</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed font-light">{hot.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          {hot.amenities.slice(0, 3).map((am, idx) => (
                            <span key={idx} className="text-[9px] font-mono bg-[#050505] text-white/40 px-2 py-0.5 rounded border border-white/5">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'routes' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-white/40">{routePlan.length} Selected Waypoints</span>
                    {routePlan.length > 0 && (
                      <button
                        onClick={handleClearRoute}
                        className="text-[10px] font-mono text-amber-200 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Clear Waypoints
                      </button>
                    )}
                  </div>
                  
                  {routePlan.length === 0 ? (
                    <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-xl p-8 text-center">
                      <Navigation className="w-8 h-8 text-white/20 mx-auto mb-3 animate-pulse" />
                      <p className="text-xs font-mono text-white/40">Click checkboxes next to attractions or hotels to map your custom day coordinates route!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative pl-6 space-y-4">
                        {/* Line connector */}
                        <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gradient-to-b from-amber-200 to-transparent"></div>
                        
                        {routePlan.map((item, idx) => (
                          <div key={idx} className="relative flex items-center justify-between">
                            {/* Dot */}
                            <div className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-amber-200 border-2 border-black shadow"></div>
                            
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="text-[10px] font-mono text-white/40">Waypoint #{idx + 1}</p>
                              <p className="text-sm font-sans font-medium text-white truncate">{item}</p>
                            </div>
                            <button
                              onClick={() => toggleRouteItem(item)}
                              className="text-xs font-mono text-red-400 hover:text-red-300 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#050505] rounded-xl p-4 mt-6 border border-white/10">
                        <div className="flex justify-between items-center text-xs font-mono text-white">
                          <span>Total Route Transit:</span>
                          <span className="text-amber-200 font-bold">~ 22 min drive</span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                          Assisted mapping incorporates scenic coastal overlooks, elite chauffeur holds, and priority VIP gates.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-sm border border-white/5">
              <Zap className="w-4 h-4 text-amber-200 shrink-0" />
              <p className="text-[11px] text-white/60">
                <strong>Voyago Recommendation:</strong> Visit {selectedDest.attractions[0].name} after 4:00 PM to bypass heavy crowds and capture pristine luxury twilight imagery.
              </p>
            </div>
          </div>
        </div>

        {/* Right Map Canvas Frame */}
        <div className="lg:col-span-7 h-[420px] lg:h-auto min-h-[500px] bg-[#050505] p-6 relative flex flex-col justify-between overflow-hidden">
          {/* Futuristic grid overlay background resembling map display */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
          
          {/* Top telemetry HUD */}
          <div className="relative z-10 flex justify-between items-start font-mono text-[10px] text-amber-200/80 bg-[#080808]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
            <div>REGION: {selectedDest.name.toUpperCase()} / GEO-LOCATOR</div>
            <div>STATUS: INTEL_ACTIVE // ACCURACY: 99.8%</div>
          </div>

          {/* Fully styled SVG luxury interactive visual map */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
            <svg 
              className="w-full h-full max-h-[380px] text-slate-800" 
              viewBox="0 0 500 300" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Radial sonar wave rings around target coordinates */}
              <circle cx="250" cy="150" r="130" stroke="#fde68a" strokeWidth="0.5" strokeDasharray="4,4" className="animate-pulse" />
              <circle cx="250" cy="150" r="80" stroke="#fde68a" strokeWidth="0.5" className="opacity-20" />
              <circle cx="250" cy="150" r="40" stroke="#fde68a" strokeWidth="0.75" className="opacity-30" />

              {/* Main crosshairs lines */}
              <line x1="250" y1="20" x2="250" y2="280" stroke="#ffffff" strokeWidth="0.25" strokeDasharray="2,2" className="opacity-10" />
              <line x1="20" y1="150" x2="480" y2="150" stroke="#ffffff" strokeWidth="0.25" strokeDasharray="2,2" className="opacity-10" />

              {/* Decorative luxury coordinates overlay grids */}
              <path d="M 50,50 L 80,50 M 50,50 L 50,80" stroke="#fde68a" strokeWidth="1" className="opacity-20" />
              <path d="M 450,50 L 420,50 M 450,50 L 450,80" stroke="#fde68a" strokeWidth="1" className="opacity-20" />
              <path d="M 50,250 L 80,250 M 50,250 L 50,220" stroke="#fde68a" strokeWidth="1" className="opacity-20" />
              <path d="M 450,250 L 420,250 M 450,250 L 450,220" stroke="#fde68a" strokeWidth="1" className="opacity-20" />

              {/* Base topological visual blobs that simulate lands */}
              <path d="M 100,80 Q 150,110 200,90 T 320,130 T 400,100 T 450,180 Q 400,240 330,220 T 150,240 T 80,170 Z" fill="#111111" fillOpacity="0.4" stroke="#333333" strokeWidth="0.5" />
              <path d="M 180,120 Q 220,140 260,110 T 350,160 Q 300,200 240,180 Z" fill="#161616" fillOpacity="0.6" stroke="#444444" strokeWidth="0.5" />

              {/* Render Selected Attractions as pins on map */}
              {selectedDest.attractions.map((att, idx) => {
                const positions = [
                  { x: 190, y: 110 },
                  { x: 280, y: 130 },
                  { x: 230, y: 180 }
                ];
                const pos = positions[idx % positions.length];
                const isHighlighted = routePlan.includes(att.name);

                return (
                  <g key={idx}>
                    {/* Pulsing ring for selected pin */}
                    {isHighlighted && (
                      <circle cx={pos.x} cy={pos.y} r="10" fill="#fde68a" fillOpacity="0.2" className="animate-ping" style={{ transformOrigin: `${pos.x}px ${pos.y}px` }} />
                    )}
                    <circle cx={pos.x} cy={pos.y} r={isHighlighted ? 4 : 3} fill={isHighlighted ? '#fde68a' : '#888888'} stroke="#000000" strokeWidth="1" />
                    
                    {/* Caption label */}
                    <text x={pos.x + 8} y={pos.y + 4} fill={isHighlighted ? '#fde68a' : '#cccccc'} fontSize="8" fontFamily="monospace" fontWeight={isHighlighted ? 'bold' : 'normal'} className="transition-all select-none">
                      {att.name}
                    </text>
                  </g>
                );
              })}

              {/* Draw customized route plan trajectory curves linking active markers */}
              {routePlan.length >= 2 && (
                <g>
                  {/* Draws a golden glowing line connectors */}
                  <path 
                    d="M 190,110 Q 235,120 280,130 T 230,180" 
                    fill="none" 
                    stroke="#fde68a" 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4" 
                    className="stroke-dash-animation"
                  />
                </g>
              )}

              {/* Center Beacon */}
              <g transform="translate(250, 150)">
                <circle r="6" fill="#fde68a" fillOpacity="0.1" />
                <circle r="3" fill="#fde68a" />
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#fde68a" strokeWidth="0.5" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="#fde68a" strokeWidth="0.5" />
              </g>
            </svg>
          </div>

          {/* Bottom Satellite Detail Panel */}
          <div className="relative z-10 bg-[#080808]/95 border border-white/10 rounded-lg p-3.5 backdrop-blur-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-white/40">Satellite Carrier Uplink</p>
                <p className="text-xs font-sans text-white/90 font-medium">{selectedDest.name} - Luxury Escort Online</p>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono text-white/30">
              HD GRAPHICS RENDERED <br />
              BY SATELLITE RADAR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
