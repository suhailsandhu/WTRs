import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { RankedCourt } from '../types';
import { ArrowUpRight, Flame, Crosshair, Layers } from 'lucide-react';

export const MapView: React.FC = () => {
  const { courts, setSelectedCourtId, location } = useApp();
  const [selectedMapCourt, setSelectedMapCourt] = useState<RankedCourt | null>(courts[0] || null);
  const [filterBrand, setFilterBrand] = useState<'ALL' | '24_HOUR' | 'IN_SHAPE' | 'PARKS' | 'ACTIVE'>('ALL');
  
  // Heat map display mode: 'HEATMAP' (default heat view), 'HYBRID' (both heat & markers), 'PINS' (standard pins)
  const [mapMode, setMapMode] = useState<'HEATMAP' | 'HYBRID' | 'PINS'>('HEATMAP');

  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<L.Map | null>(null);
  const leafletHeatLayerRef = useRef<any>(null);
  const leafletMarkersRef = useRef<{ [key: string]: L.Layer }>({});
  const leafletUserMarkerRef = useRef<L.Marker | null>(null);

  // Filtered courts based on active filter chip
  const filteredCourts = courts.filter(court => {
    if (filterBrand === '24_HOUR') return court.brand === '24 Hour Fitness';
    if (filterBrand === 'IN_SHAPE') return court.brand === 'In-Shape Family Fitness';
    if (filterBrand === 'PARKS') return court.brand === 'Public Park' || court.brand === 'Sports Complex';
    if (filterBrand === 'ACTIVE') return court.confirmedPlayersCount > 0 || court.isLiveConfirmed;
    return true;
  });

  // Calculate court heat intensity from 0.15 (quiet) to 1.0 (blazing pickup run)
  const getCourtHeat = (court: RankedCourt): number => {
    const players = court.confirmedPlayersCount || 0;
    const heading = court.headingThereCount || 0;
    if (players >= 10) return 1.0;
    if (players >= 6) return 0.85;
    if (players >= 3) return 0.7;
    if (heading >= 2) return 0.55;
    if (players >= 1 || heading >= 1) return 0.45;
    return 0.2;
  };

  // Jump camera to Sacramento sub-regions
  const handleJumpToRegion = (lat: number, lng: number, zoom = 13) => {
    if (leafletInstanceRef.current) {
      leafletInstanceRef.current.flyTo([lat, lng], zoom, { duration: 0.8 });
    }
  };

  const handleRecenter = () => {
    if (leafletInstanceRef.current) {
      leafletInstanceRef.current.flyTo([location.lat, location.lng], 13);
    }
  };

  // Initialize Leaflet Map (No external API keys required)
  useEffect(() => {
    if (!leafletContainerRef.current) return;

    if (typeof window !== 'undefined') {
      (window as any).L = L;
    }

    // Center on Greater Sacramento
    const map = L.map(leafletContainerRef.current, {
      center: [location.lat || 38.5816, location.lng || -121.4944],
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    // High performance dark tiles with clear street names and highways (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    leafletInstanceRef.current = map;

    // Handle container resize cleanly
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(leafletContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      leafletInstanceRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    const map = leafletInstanceRef.current;
    if (!map) return;

    if (leafletUserMarkerRef.current) {
      leafletUserMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'wtr-user-location-marker',
      html: `
        <div class="relative flex items-center justify-center w-7 h-7">
          <div class="absolute w-7 h-7 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#2563eb] border-2 border-white shadow-md"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    leafletUserMarkerRef.current = L.marker([location.lat, location.lng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map);
  }, [location.lat, location.lng]);

  // Update Heat Map Layer & Markers
  useEffect(() => {
    const map = leafletInstanceRef.current;
    if (!map) return;

    let isSubscribed = true;

    const setupHeatmap = async () => {
      if (typeof window !== 'undefined' && !(window as any).L) {
        (window as any).L = L;
      }

      try {
        await import('leaflet.heat');
      } catch (e) {
        // Fallback gracefully if leaflet.heat is unavailable
      }

      if (!isSubscribed || !leafletInstanceRef.current) return;

      // Remove existing heat layer if present
      if (leafletHeatLayerRef.current) {
        map.removeLayer(leafletHeatLayerRef.current);
        leafletHeatLayerRef.current = null;
      }

      // Remove old markers
      Object.values(leafletMarkersRef.current).forEach((m: any) => m.remove());
      leafletMarkersRef.current = {};

      const showHeat = mapMode === 'HEATMAP' || mapMode === 'HYBRID';
      const showPins = mapMode === 'PINS' || mapMode === 'HYBRID';

      // Build heat points data [[lat, lng, intensity], ...]
      if (showHeat) {
        const heatPoints: [number, number, number][] = [];

        filteredCourts.forEach(court => {
          const intensity = getCourtHeat(court);
          const weight = Math.max(1, Math.round(intensity * 12));
          for (let i = 0; i < weight; i++) {
            heatPoints.push([court.lat, court.lng, intensity]);
          }
        });

        if (typeof (L as any).heatLayer === 'function' && heatPoints.length > 0) {
          leafletHeatLayerRef.current = (L as any).heatLayer(heatPoints, {
            radius: 45,
            blur: 28,
            maxZoom: 16,
            max: 1.0,
            minOpacity: 0.35,
            gradient: {
              0.15: '#2563eb', // Cool blue (quiet baseline)
              0.35: '#06b6d4', // Cyan
              0.55: '#10b981', // Emerald green
              0.75: '#f59e0b', // Amber
              0.88: '#f97316', // Orange
              1.0: '#ef4444'   // Blazing red (active run)
            }
          }).addTo(map);
        }
      }

      // Render Court Markers and Radial Glowing Halos
      filteredCourts.forEach(court => {
        const intensity = getCourtHeat(court);
        const playerCount = court.confirmedPlayersCount;
        const isSelected = selectedMapCourt?.id === court.id;
        const isHot = intensity >= 0.7;

        let markerHtml = '';

        if (showHeat && !showPins) {
          // Heat Map Focused Mode: glowing radiant heat nodes
          const haloColor = intensity >= 0.8 
            ? 'rgba(239, 68, 68, 0.5)' 
            : intensity >= 0.5 
              ? 'rgba(245, 158, 11, 0.4)' 
              : 'rgba(59, 130, 246, 0.25)';
          const coreColor = intensity >= 0.8 
            ? '#ef4444' 
            : intensity >= 0.5 
              ? '#f59e0b' 
              : '#3b82f6';

          markerHtml = `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125">
              ${isHot ? `<div class="absolute w-14 h-14 rounded-full animate-ping" style="background: ${haloColor};"></div>` : ''}
              <div class="absolute w-10 h-10 rounded-full blur-sm" style="background: ${haloColor};"></div>
              <div class="relative flex items-center justify-center w-7 h-7 rounded-full text-white font-black text-[10px] shadow-lg border border-white/40" style="background: ${coreColor};">
                ${playerCount > 0 ? playerCount : '🏀'}
              </div>
            </div>
          `;
        } else {
          // Pins or Hybrid Mode: Clean badges
          if (court.isLiveConfirmed || playerCount >= 5) {
            markerHtml = `
              <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95">
                <div class="absolute w-12 h-12 rounded-full bg-[#FF5722]/30 animate-ping"></div>
                <div class="flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded-full border-2 border-[#FF5722] shadow-xl">
                  <span class="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse"></span>
                  <span class="text-[11px] font-black italic tracking-tight font-display">${playerCount || 'RUN'}P</span>
                </div>
              </div>
            `;
          } else if (playerCount > 0 || court.headingThereCount > 0) {
            markerHtml = `
              <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95">
                <div class="flex items-center gap-1 bg-[#18181b] text-white px-2 py-0.5 rounded-full border border-amber-500 shadow-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span class="text-[10px] font-bold tracking-tight">${playerCount || court.headingThereCount}P</span>
                </div>
              </div>
            `;
          } else {
            markerHtml = `
              <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95">
                <div class="w-7 h-7 rounded-full ${isSelected ? 'bg-black border-2 border-white' : 'bg-[#18181b] border border-zinc-700'} shadow-md flex items-center justify-center text-white text-[11px]">
                  🏀
                </div>
              </div>
            `;
          }
        }

        const customIcon = L.divIcon({
          className: 'wtr-custom-court-marker',
          html: markerHtml,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([court.lat, court.lng], { icon: customIcon })
          .addTo(map)
          .on('click', () => {
            setSelectedMapCourt(court);
            map.panTo([court.lat, court.lng], { animate: true, duration: 0.5 });
          });

        leafletMarkersRef.current[court.id] = marker;
      });
    };

    setupHeatmap();

    return () => {
      isSubscribed = false;
    };
  }, [filteredCourts, selectedMapCourt, mapMode]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-[#09090b] overflow-hidden select-none">
      
      {/* Top Floating Controls */}
      <div className="absolute top-3 inset-x-3 z-[400] space-y-2 pointer-events-none">
        
        {/* Row 1: Heat Map Mode Toggle & Recenter */}
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/90 backdrop-blur-md border border-zinc-800 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setMapMode('HEATMAP')}
              className={`flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                mapMode === 'HEATMAP'
                  ? 'bg-[#FF5722] text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame size={13} />
              <span>Heat Map</span>
            </button>
            <button
              onClick={() => setMapMode('HYBRID')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                mapMode === 'HYBRID'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Both</span>
            </button>
            <button
              onClick={() => setMapMode('PINS')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                mapMode === 'PINS'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Pins</span>
            </button>
          </div>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="p-2 bg-black/90 backdrop-blur-md border border-zinc-800 text-white rounded-full shadow-lg hover:border-zinc-500 transition-colors"
            title="Recenter location"
          >
            <Crosshair size={16} className="text-[#FF5722]" />
          </button>
        </div>

        {/* Row 2: Region Quick Jumps */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => handleJumpToRegion(38.5746, -121.4880, 13)}
            className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-zinc-800 text-zinc-300 font-medium text-[10px] rounded-full whitespace-nowrap hover:text-white transition-colors"
          >
            Downtown Sac
          </button>
          <button
            onClick={() => handleJumpToRegion(38.6419, -121.5032, 13)}
            className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-zinc-800 text-zinc-300 font-medium text-[10px] rounded-full whitespace-nowrap hover:text-white transition-colors"
          >
            Natomas
          </button>
          <button
            onClick={() => handleJumpToRegion(38.7665, -121.2619, 12)}
            className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-zinc-800 text-zinc-300 font-medium text-[10px] rounded-full whitespace-nowrap hover:text-white transition-colors"
          >
            Roseville / Rocklin
          </button>
          <button
            onClick={() => handleJumpToRegion(38.4116, -121.3934, 13)}
            className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-zinc-800 text-zinc-300 font-medium text-[10px] rounded-full whitespace-nowrap hover:text-white transition-colors"
          >
            Elk Grove
          </button>
        </div>

        {/* Row 3: Filter Chips */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setFilterBrand('ALL')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap border ${
              filterBrand === 'ALL' 
                ? 'bg-white text-black border-white' 
                : 'bg-black/80 text-zinc-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            All Courts ({courts.length})
          </button>
          <button
            onClick={() => setFilterBrand('ACTIVE')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap border flex items-center gap-1 ${
              filterBrand === 'ACTIVE' 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-black/80 text-orange-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <Flame size={12} />
            <span>Active Runs</span>
          </button>
          <button
            onClick={() => setFilterBrand('24_HOUR')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap border ${
              filterBrand === '24_HOUR' 
                ? 'bg-zinc-700 text-white border-zinc-600' 
                : 'bg-black/80 text-zinc-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            24 Hour Fitness
          </button>
          <button
            onClick={() => setFilterBrand('IN_SHAPE')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap border ${
              filterBrand === 'IN_SHAPE' 
                ? 'bg-zinc-700 text-white border-zinc-600' 
                : 'bg-black/80 text-zinc-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            In-Shape
          </button>
          <button
            onClick={() => setFilterBrand('PARKS')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap border ${
              filterBrand === 'PARKS' 
                ? 'bg-zinc-700 text-white border-zinc-600' 
                : 'bg-black/80 text-zinc-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            Parks & Complex
          </button>
        </div>
      </div>

      {/* Heat Map Legend */}
      {(mapMode === 'HEATMAP' || mapMode === 'HYBRID') && (
        <div className="absolute top-28 right-3 z-[400] bg-black/85 backdrop-blur-md border border-zinc-800/80 rounded-xl px-2.5 py-2 shadow-lg pointer-events-auto">
          <div className="text-[10px] font-semibold text-zinc-300 mb-1 flex items-center gap-1">
            <Flame size={12} className="text-[#FF5722]" />
            <span>Run Activity Heat</span>
          </div>
          <div className="space-y-1 text-[9px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
              <span>Blazing (8+ Hoopers)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
              <span>Active (3–7 Players)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
              <span>Quiet / Shootaround</span>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Interactive Tile Heat Map */}
      <div ref={leafletContainerRef} className="w-full h-full z-0" />

      {/* Selected Court Bottom Card Preview */}
      {selectedMapCourt && (
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+4.8rem)] inset-x-3 z-[400] max-w-md mx-auto">
          <div className="bg-[#121215]/95 border border-zinc-800 backdrop-blur-xl rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
            <div
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              onClick={() => setSelectedCourtId(selectedMapCourt.id)}
            >
              <img
                src={selectedMapCourt.primaryPhoto}
                alt={selectedMapCourt.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-700 shadow-sm"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#FF5722]">
                    {selectedMapCourt.distanceMiles} mi away
                  </span>
                  {selectedMapCourt.confirmedPlayersCount > 0 && (
                    <span className="text-[10px] font-medium text-emerald-400">
                      · {selectedMapCourt.confirmedPlayersCount} hooping
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate leading-snug">
                  {selectedMapCourt.name}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate">
                  {selectedMapCourt.city} · {selectedMapCourt.indoor ? 'Indoor Hardwood' : 'Outdoor'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCourtId(selectedMapCourt.id)}
              className="px-3 py-2 bg-white text-black hover:bg-zinc-200 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 transition-all shadow-md active:scale-95"
            >
              <span>View</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
