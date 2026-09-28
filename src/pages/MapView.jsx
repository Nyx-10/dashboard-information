import React, { useState, useContext } from 'react';
import { Map as MapIcon, Search, MapPin, Info } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { LanguageContext } from '../context/LanguageContext';

export function MapView() {
  const { t } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Senarai lokasi kampus (boleh ditambah baik dalam database kemudian)
  const locations = [
    { id: 1, name: 'Pejabat Pentadbiran', type: 'office', desc: 'Pejabat utama urusan pendaftaran & pentadbiran' },
    { id: 2, name: 'Bengkel Automotif', type: 'workshop', desc: 'Pusat latihan utama kenderaan bermotor' },
    { id: 3, name: 'Bengkel Pemesinan (CNC)', type: 'workshop', desc: 'Makmal teknologi mesin & CNC' },
    { id: 4, name: 'Bengkel Kimpalan', type: 'workshop', desc: 'Pusat latihan kimpalan dan fabrikasi logam' },
    { id: 5, name: 'Dewan Makan', type: 'facility', desc: 'Kafeteria utama untuk pelajar asrama' },
    { id: 6, name: 'Asrama Lelaki (Blok A & B)', type: 'hostel', desc: 'Penginapan pelajar lelaki' },
    { id: 7, name: 'Asrama Perempuan (Blok C)', type: 'hostel', desc: 'Penginapan pelajar perempuan' },
    { id: 8, name: 'Pusat Sumber (Perpustakaan)', type: 'facility', desc: 'Bilik rujukan dan buku' },
    { id: 9, name: 'Surau Utama', type: 'facility', desc: 'Tempat ibadat rasmi warga kampus' },
    { id: 10, name: 'Padang Sukan / Futsal', type: 'facility', desc: 'Kawasan sukan dan rekreasi pelajar' },
  ];

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type) => {
    switch(type) {
      case 'office': return '#4F46E5';
      case 'workshop': return '#EF4444';
      case 'hostel': return '#10B981';
      default: return '#F59E0B';
    }
  };

  return (
    <div className="fade-in" style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapIcon size={28} color="var(--primary)" /> Peta Kampus Interaktif
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Direktori & Panduan Lokasi Fasiliti ADTEC Melaka
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (min-width: 768px)': { gridTemplateColumns: '1fr 2fr' } }} className="map-layout-grid">
        
        {/* Bahagian Kiri: Carian & Senarai */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Kotak Carian */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Cari lokasi (contoh: asrama, bengkel)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>

          {/* Senarai Lokasi */}
          <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', maxHeight: '500px', padding: '0.5rem' }}>
            {filteredLocations.length > 0 ? (
              filteredLocations.map(loc => (
                <div 
                  key={loc.id} 
                  className="hover-card"
                  onClick={() => setSelectedLocation(loc)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    background: selectedLocation?.id === loc.id ? 'var(--surface-hover)' : 'transparent',
                    borderLeft: `4px solid ${getTypeColor(loc.type)}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>{loc.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{loc.desc}</p>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Tiada lokasi dijumpai.
              </div>
            )}
          </div>
        </div>

        {/* Bahagian Kanan: Peta Visual */}
        <div className="glass-panel" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          {/* Nota untuk Peta Sebenar */}
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}>
            <Info size={14} /> Sila muat naik gambar peta sebenar ADTEC nanti
          </div>

          {/* Ruang Peta (Mockup) */}
          <div style={{ 
            flex: 1, 
            background: 'var(--surface)', 
            borderRadius: '12px', 
            border: '1px dashed var(--border)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
            opacity: 0.8
          }}>
            {selectedLocation ? (
              <div className="bounce-animation" style={{ textAlign: 'center', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: `2px solid ${getTypeColor(selectedLocation.type)}`, maxWidth: '80%' }}>
                <MapPin size={48} color={getTypeColor(selectedLocation.type)} style={{ margin: '0 auto 0.5rem' }} />
                <h2 style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{selectedLocation.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lokasi ini telah dipilih. Dalam versi penuh, kedudukannya akan ditandakan pada gambar peta sebenar.</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <MapIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>Pilih lokasi dari senarai di sebelah kiri<br/>untuk melihat kedudukannya.</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
      
      <style>{`
        .map-layout-grid {
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .map-layout-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
          }
        }
        .bounce-animation {
          animation: mapBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes mapBounce {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
