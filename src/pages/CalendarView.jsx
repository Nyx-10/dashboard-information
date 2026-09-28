import React, { useState, useEffect, useContext } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { AppContext } from '../context/AppContext';
import { LanguageContext } from '../context/LanguageContext';
import { toast } from '../components/Toast';

export function CalendarView() {
  const { user } = useContext(AppContext);
  const { t } = useContext(LanguageContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari Supabase (Table: academic_calendar)
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_calendar')
        .select('*')
        .order('date', { ascending: true })
        .gte('date', new Date().toISOString().split('T')[0]); // Hanya ambil acara hari ini dan ke atas

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist yet
          console.warn("Table 'academic_calendar' tidak dijumpai. Menggunakan data contoh.");
          setEvents([
            { id: 1, title: 'Cuti Pertengahan Semester', date: '2026-10-15', time: '08:00', location: 'Seluruh Kampus', type: 'holiday' },
            { id: 2, title: 'Minggu Peperiksaan Akhir', date: '2026-11-20', time: '08:00', location: 'Dewan Peperiksaan', type: 'exam' },
            { id: 3, title: 'Karnival Sukan ADTEC', date: '2026-10-05', time: '14:30', location: 'Padang Utama', type: 'event' }
          ]);
        } else {
          throw error;
        }
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error("Ralat mengambil jadual:", error);
      toast.error("Gagal memuatkan jadual kalendar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getTypeColor = (type) => {
    switch(type) {
      case 'holiday': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', label: 'Cuti' };
      case 'exam': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', label: 'Peperiksaan' };
      default: return { bg: 'rgba(79, 70, 229, 0.1)', text: '#4F46E5', label: 'Acara' };
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ms-MY', options);
  };

  return (
    <div className="fade-in" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={28} color="var(--primary)" /> Takwim & Jadual
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Aktiviti dan jadual rasmi institut</p>
        </div>
        
        {/* Butang Tambah hanya untuk Admin */}
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={() => alert('Fungsi tambah akan dibina seterusnya!')}>
            <Plus size={18} /> Tambah Acara
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader className="spinner" size={32} color="var(--primary)" />
        </div>
      ) : events.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <CalendarIcon size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tiada acara akan datang</h3>
          <p style={{ color: 'var(--text-muted)' }}>Jadual kosong buat masa ini.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((event) => {
            const style = getTypeColor(event.type);
            return (
              <div key={event.id} className="glass-panel hover-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                
                {/* Kotak Tarikh */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', minWidth: '100px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {new Date(event.date).toLocaleDateString('ms-MY', { month: 'short' })}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1' }}>
                    {new Date(event.date).getDate()}
                  </div>
                </div>

                {/* Info Acara */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{event.title}</h3>
                    <span style={{ background: style.bg, color: style.text, padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {style.label}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {event.time && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={16} /> {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={16} /> {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
