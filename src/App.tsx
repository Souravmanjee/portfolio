import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentAltitude, setCurrentAltitude] = useState(0);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Simple pins data
  const pins = [
    { id: 'about', label: 'About Me', x: 20, y: 85, altitude: 15, icon: '👋', color: '#059669' },
    { id: 'projects', label: 'Projects', x: 75, y: 65, altitude: 35, icon: '🚀', color: '#0EA5E9' },
    { id: 'skills', label: 'Skills', x: 30, y: 45, altitude: 55, icon: '⚡', color: '#8B5CF6' },
    { id: 'experience', label: 'Experience', x: 65, y: 25, altitude: 75, icon: '🏆', color: '#F59E0B' },
    { id: 'contact', label: 'Contact', x: 50, y: 5, altitude: 95, icon: '📧', color: '#EF4444' },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;

      if (maxScroll > 0) {
        const progress = Math.min(scrollTop / maxScroll, 1);
        setScrollProgress(progress);
        setCurrentAltitude(Math.round(progress * 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mountain background style
  const mountainBg = {
    background: isDark 
      ? `
        radial-gradient(ellipse at bottom, #1a1a2e 0%, #16213e 100%),
        linear-gradient(to right, #0f3460 0%, #e94560 100%)
      `
      : `
        radial-gradient(ellipse at bottom, #87ceeb 0%, #98d8e8 100%),
        linear-gradient(45deg, #a8dadc 25%, transparent 25%), 
        linear-gradient(-45deg, #a8dadc 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #457b9d 75%), 
        linear-gradient(-45deg, transparent 75%, #457b9d 75%)
      `,
    backgroundSize: '100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px',
    minHeight: '100vh',
    transition: 'all 0.5s ease'
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        padding: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏔️</span>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Mountain Journey</h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {pins.map((pin) => (
              <button
                key={pin.id}
                onClick={() => currentAltitude >= pin.altitude - 10 && setSelectedPin(pin.id)}
                style={{
                  background: currentAltitude >= pin.altitude - 10 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: currentAltitude >= pin.altitude - 10 ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  cursor: currentAltitude >= pin.altitude - 10 ? 'pointer' : 'not-allowed',
                  fontSize: '0.8rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {pin.icon} {pin.label}
              </button>
            ))}
            
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '1rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          marginTop: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${scrollProgress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </nav>

      {/* Mountain Scene */}
      <div style={{
        ...mountainBg,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0
      }}>
        {/* Altitude Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span>
            <span style={{ fontWeight: 'bold' }}>{currentAltitude}% Altitude</span>
          </div>
        </div>

        {/* Trail Path */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path
            d="M 50 95 Q 30 75 20 85 Q 40 55 75 65 Q 50 35 30 45 Q 55 15 65 25 Q 45 5 50 5"
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset={1000 - (scrollProgress * 1000)}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
              transition: 'stroke-dashoffset 0.3s ease'
            }}
          />
        </svg>

        {/* Interactive Pins */}
        {pins.map((pin) => {
          const isAccessible = currentAltitude >= pin.altitude - 15;
          const isActive = currentAltitude >= pin.altitude - 10 && currentAltitude <= pin.altitude + 10;
          
          return (
            <button
              key={pin.id}
              onClick={() => isAccessible && setSelectedPin(pin.id)}
              style={{
                position: 'absolute',
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                border: 'none',
                fontSize: '1.5rem',
                cursor: isAccessible ? 'pointer' : 'not-allowed',
                background: isAccessible ? 'rgba(255, 255, 255, 0.9)' : 'rgba(128, 128, 128, 0.5)',
                boxShadow: isAccessible ? `0 4px 20px ${pin.color}40` : 'none',
                transition: 'all 0.3s ease',
                zIndex: 10,
                ...(isActive && {
                  boxShadow: `0 0 0 4px rgba(255, 255, 255, 0.5), 0 4px 20px ${pin.color}60`,
                  animation: 'pulse 2s infinite'
                })
              }}
            >
              {isAccessible ? pin.icon : '🔒'}
            </button>
          );
        })}

        {/* Avatar Character */}
        <div style={{
          position: 'absolute',
          left: `${50 + Math.sin(scrollProgress * Math.PI * 2) * 10}%`,
          top: `${95 - (scrollProgress * 90)}%`,
          transform: 'translate(-50%, -50%)',
          fontSize: '2.5rem',
          zIndex: 15,
          transition: 'all 0.3s ease'
        }}>
          🧗‍♂️
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Welcome Section */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 'bold',
              marginBottom: '2rem',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
            }}>
              Welcome to My Journey
            </h1>
            <p style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              Scroll to climb the mountain of my professional story
            </p>
            <div style={{
              fontSize: '3rem',
              animation: 'bounce 2s infinite'
            }}>
              👇
            </div>
          </div>
        </section>

        {/* Journey Sections */}
        {Array.from({ length: 5 }, (_, i) => (
          <section key={i} style={{ minHeight: '100vh' }} />
        ))}

        {/* Summit Section */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '800px',
            opacity: currentAltitude >= 90 ? 1 : 0.3,
            transform: currentAltitude >= 90 ? 'scale(1)' : 'scale(0.8)',
            transition: 'all 0.8s ease'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🏆</div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}>
              Summit Reached!
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '2rem'
            }}>
              Congratulations! You've completed the journey through my portfolio.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                color: 'white',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start New Adventure 🔄
            </button>
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedPin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(5px)'
        }} onClick={() => setSelectedPin(null)}>
          <div style={{
            background: isDark ? '#2a2a2a' : 'white',
            color: isDark ? 'white' : 'black',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '2.5rem' }}>
                  {pins.find(p => p.id === selectedPin)?.icon}
                </span>
                {pins.find(p => p.id === selectedPin)?.label}
              </h3>
              <button
                onClick={() => setSelectedPin(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  width: '2.5rem',
                  height: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ lineHeight: 1.6 }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Welcome to the <strong>{pins.find(p => p.id === selectedPin)?.label}</strong> section of my journey!
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                This milestone represents an important part of my professional story. 
                Each step up this mountain has been a learning experience, bringing new challenges and growth.
              </p>
              <div style={{
                background: isDark ? '#3a3a3a' : '#f5f5f5',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ marginBottom: '0.5rem' }}>🎯 Key Highlights:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  <li>Professional growth and development</li>
                  <li>Technical skills and expertise</li>
                  <li>Project achievements and milestones</li>
                  <li>Collaborative experiences and leadership</li>
                </ul>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedPin(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Continue Climbing 🏔️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App; 