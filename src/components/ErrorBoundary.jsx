import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', textAlign: 'center', color: 'white', background: '#05070e' }}>
          <h1 style={{ color: '#EF4444', marginBottom: '16px' }}>Sesuatu yang tidak dijangka berlaku.</h1>
          <p style={{ marginBottom: '24px', color: '#94A3B8' }}>Aplikasi sedang mengemaskini versi baharu atau terdapat ralat sambungan.</p>
          <button 
            onClick={() => {
              if (navigator.serviceWorker) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              window.location.reload(true);
            }} 
            style={{ background: '#6366F1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
          >
            Muat Semula Aplikasi
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}
