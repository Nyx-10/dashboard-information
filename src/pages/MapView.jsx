import React, { useState } from 'react';
import { Map as MapIcon, Search, MapPin, Navigation, Compass, Layers, Building } from 'lucide-react';

export function MapView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    { id: 1, name: 'Pejabat Pentadbiran', type: 'office', desc: 'Pusat pengurusan utama institut.', icon: Building },
    { id: 2, name: 'Bengkel Automotif', type: 'workshop', desc: 'Latihan automotif berteknologi tinggi.', icon: Layers },
    { id: 3, name: 'Bengkel Pemesinan (CNC)', type: 'workshop', desc: 'Makmal pakar mesin CNC & mekanikal.', icon: Layers },
    { id: 4, name: 'Dewan Makan', type: 'facility', desc: 'Kafeteria premium gaya hidup pelajar.', icon: Compass },
    { id: 5, name: 'Asrama Mewah (Blok A & B)', type: 'hostel', desc: 'Penginapan eksklusif pelajar lelaki.', icon: Building },
    { id: 6, name: 'Asrama Mewah (Blok C)', type: 'hostel', desc: 'Penginapan eksklusif pelajar perempuan.', icon: Building },
    { id: 7, name: 'Perpustakaan Digital', type: 'facility', desc: 'Pusat sumber pintar dan santai.', icon: Compass },
  ];

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeStyle = (type) => {
    switch(type) {
      case 'office': return { color: '#818CF8', gradient: 'linear-gradient(135deg, #4F46E5, #818CF8)', glow: 'rgba(129, 140, 248, 0.4)' };
      case 'workshop': return { color: '#F87171', gradient: 'linear-gradient(135deg, #EF4444, #F87171)', glow: 'rgba(248, 113, 113, 0.4)' };
      case 'hostel': return { color: '#34D399', gradient: 'linear-gradient(135deg, #10B981, #34D399)', glow: 'rgba(52, 211, 153, 0.4)' };
      default: return { color: '#FBBF24', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)', glow: 'rgba(251, 191, 36, 0.4)' };
    }
  };

  return (
    <div className="fade-in premium-map-container">
      {/* Header Premium */}
      <div className="premium-header">
        <div className="header-content">
          <div className="icon-wrapper">
            <Navigation size={28} color="white" />
          </div>
          <div>
            <h1 className="gradient-text">Navigasi Pintar Kampus</h1>
            <p className="subtitle">Sistem Penjejakan Lokasi Bersepadu ADTEC Melaka</p>
          </div>
        </div>
      </div>

      <div className="map-grid">
        
        {/* Panel Kiri - Direktori Interaktif */}
        <div className="directory-panel">
          
          {/* Bar Carian Futuristik */}
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari lokasi, dewan, bengkel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-search-input"
            />
          </div>

          {/* Senarai Lokasi Kaca (Glassmorphism) */}
          <div className="location-list">
            {filteredLocations.map(loc => {
              const style = getTypeStyle(loc.type);
              const isSelected = selectedLocation?.id === loc.id;
              const Icon = loc.icon;
              
              return (
                <div 
                  key={loc.id} 
                  className={`premium-card ${isSelected ? 'active-card' : ''}`}
                  onClick={() => setSelectedLocation(loc)}
                  style={{
                    '--card-glow': style.glow,
                    '--card-border': style.color,
                  }}
                >
                  <div className="card-icon" style={{ background: style.gradient }}>
                    <Icon size={18} color="white" />
                  </div>
                  <div className="card-info">
                    <h3>{loc.name}</h3>
                    <p>{loc.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="active-indicator">
                      <div className="pulse-dot" style={{ background: style.color }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel Kanan - Peta Pintar (Mockup Premium) */}
        <div className="map-visual-panel">
          <div className="map-viewport">
            <div className="map-overlay-grid"></div>
            
            {/* UI Kompas Terapung */}
            <div className="floating-compass">
              <Compass size={24} color="var(--text-muted)" />
              <span>UTARA</span>
            </div>

            {selectedLocation ? (
              <div className="location-marker-container zoom-in">
                <div className="marker-ring" style={{ borderColor: getTypeStyle(selectedLocation.type).color }}></div>
                <div className="marker-pin" style={{ background: getTypeStyle(selectedLocation.type).gradient, boxShadow: `0 0 30px ${getTypeStyle(selectedLocation.type).glow}` }}>
                  <MapPin size={32} color="white" />
                </div>
                <div className="marker-popup glass-panel">
                  <h4>{selectedLocation.name}</h4>
                  <span className="badge" style={{ background: getTypeStyle(selectedLocation.type).glow, color: getTypeStyle(selectedLocation.type).color }}>
                    Terpilih
                  </span>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <MapIcon size={64} className="empty-icon" />
                <h2>Peta Satelit Sedia Ada</h2>
                <p>Sila pilih lokasi dari panel direktori untuk memulakan navigasi maya.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .premium-map-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 80vh;
        }

        .premium-header {
          margin-bottom: 2.5rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-wrapper {
          background: linear-gradient(135deg, #6366F1, #EC4899);
          padding: 1rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
        }

        .gradient-text {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(to right, var(--text-main), #818CF8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin: 0.25rem 0 0 0;
          font-weight: 500;
        }

        .map-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          height: calc(100vh - 200px);
          min-height: 600px;
        }

        @media (min-width: 992px) {
          .map-grid {
            grid-template-columns: 380px 1fr;
          }
        }

        /* DIRECTORY PANEL */
        .directory-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
        }

        .search-wrapper {
          position: relative;
          background: var(--surface);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 0.25rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .search-wrapper:focus-within {
          border-color: #818CF8;
          box-shadow: 0 4px 25px rgba(129, 140, 248, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .premium-search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.25rem;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 1rem;
          outline: none;
          font-weight: 500;
        }

        .location-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 0.5rem;
        }

        .location-list::-webkit-scrollbar {
          width: 6px;
        }
        .location-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .premium-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background: var(--surface);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          overflow: hidden;
        }

        .premium-card:hover {
          transform: translateY(-2px);
          background: var(--surface-hover);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .active-card {
          background: linear-gradient(145deg, var(--surface), rgba(255,255,255,0.02));
          border-color: var(--card-border) !important;
          box-shadow: 0 10px 30px var(--card-glow);
        }

        .active-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--card-border);
        }

        .card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .card-info h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 0.25rem 0;
        }

        .card-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        .active-indicator {
          margin-left: auto;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(255,255,255,0.4);
          animation: pulse-animation 2s infinite;
        }

        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 var(--card-border); }
          70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }

        /* MAP VISUAL PANEL */
        .map-visual-panel {
          background: #0f172a; /* Deep blue dark theme */
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 100px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.3);
        }

        .map-viewport {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-overlay-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        .floating-compass {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem 1rem;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          z-index: 10;
        }

        .empty-state {
          text-align: center;
          z-index: 10;
          animation: float 6s ease-in-out infinite;
        }

        .empty-icon {
          color: rgba(255,255,255,0.1);
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.05));
        }

        .empty-state h2 {
          color: white;
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .empty-state p {
          color: #94a3b8;
          font-size: 1rem;
          max-width: 300px;
          margin: 0 auto;
        }

        /* Animated Marker */
        .location-marker-container {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .marker-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px dashed;
          animation: spin 10s linear infinite;
          opacity: 0.3;
        }

        .marker-pin {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          border: 4px solid #0f172a;
          animation: pulse-pin 2s infinite;
        }

        .marker-popup {
          margin-top: 1.5rem;
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          text-align: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .marker-popup h4 {
          color: white;
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          white-space: nowrap;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .zoom-in {
          animation: zoomIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes zoomIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes spin {
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-pin {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
