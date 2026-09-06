import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function GlobalAtmosphere() {
  const { theme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isLight = theme === 'light';

  return (
    <>
      {/* Interactive Foreground Mouse Spotlight Glow */}
      <div 
        className="app-spotlight-top" 
        style={{
          background: isLight
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.04), transparent 70%)`
            : `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 70%)`
        }} 
      />

      {/* Interactive Ambient Deep Spotlight Glow */}
      <div 
        className="app-spotlight" 
        style={{
          background: isLight
            ? `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 75%)`
            : `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.14), transparent 75%)`
        }} 
      />

      {/* Atmospheric Background Layers (Aurora Orbs & Perspective Grid) */}
      <div className={`app-global-bg ${isLight ? 'app-global-bg-light' : ''}`}>
        <div className="app-bg-orb app-bg-orb-1" />
        <div className="app-bg-orb app-bg-orb-2" />
        <div className="app-bg-orb app-bg-orb-3" />
        <div className="app-bg-grid" />
      </div>
    </>
  );
}
