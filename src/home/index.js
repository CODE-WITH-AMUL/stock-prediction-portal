import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StockAnalyzerPro() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const GetStartedButton = ({ variant = 'primary', size = 'large', onClick, children = 'Get Started' }) => {
    const isPrimary = variant === 'primary';
    const isLarge = size === 'large';
    
    const buttonStyle = {
      padding: isLarge ? '1.25rem 3rem' : '1rem 2rem',
      fontSize: isLarge ? '1.1rem' : '1rem',
      fontWeight: '700',
      color: isPrimary ? 'white' : '#e0e7ff',
      background: isPrimary 
        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
        : 'transparent',
      border: isPrimary ? 'none' : '2px solid rgba(139, 92, 246, 0.5)',
      borderRadius: '50px',
      cursor: 'pointer',
      boxShadow: isPrimary ? '0 20px 40px rgba(139, 92, 246, 0.4)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: !isPrimary ? 'blur(10px)' : 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: 10
    };

    const arrowStyle = {
      fontSize: '1.2em',
      transition: 'transform 0.3s ease'
    };

    return (
      <button
        style={buttonStyle}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
          if (isPrimary) {
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(139, 92, 246, 0.5)';
          } else {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = '#8b5cf6';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          if (isPrimary) {
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)';
          } else {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
          }
        }}
      >
        {children}
        <span style={arrowStyle}>→</span>
      </button>
    );
  };

  const Header = () => (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1.25rem 0',
      background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: scrolled ? '0 10px 40px rgba(0, 0, 0, 0.3)' : 'none'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          StockAnalyzer Pro
        </div>
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {['Features', 'Pricing', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                position: 'relative',
                padding: '0.5rem 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {item}
            </a>
          ))}
          <GetStartedButton 
            variant="secondary" 
            size="small"
            onClick={() => navigate('/register')}
          />
        </nav>
      </div>
    </header>
  );

  const Hero = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      setTimeout(() => setVisible(true), 100);
    }, []);

    return (
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        paddingTop: '5rem'
      }}>
        {/* Animated gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 20s ease-in-out infinite',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'float 25s ease-in-out infinite reverse',
          transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`
        }} />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(139, 92, 246, 0.6)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}

        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1100px',
          padding: '0 2rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '50px',
            color: '#a78bfa',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            🚀 Trusted by 50,000+ Traders Worldwide
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            AI-Powered Trading
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Made Simple
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: '#cbd5e1',
            lineHeight: '1.8',
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem'
          }}>
            Harness real-time market data, predictive AI analytics, and intelligent alerts to make smarter investment decisions in seconds.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <GetStartedButton 
              variant="primary" 
              size="large"
              onClick={() => navigate('/register')}
            />
            <button style={{
              padding: '1.25rem 3rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#e0e7ff',
              background: 'transparent',
              border: '2px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '50px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }}
            onClick={() => {
              // Scroll to features section
              document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>📹</span>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            marginTop: '5rem',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { value: '50K+', label: 'Active Traders' },
              { value: '$2.4B', label: 'Traded Volume' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, -30px); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
        `}</style>
      </section>
    );
  };

  const Features = () => {
    const [visibleItems, setVisibleItems] = useState([]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => [...prev, entry.target.id]);
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);

    const features = [
      {
        icon: '⚡',
        title: 'Lightning-Fast Data',
        desc: 'Real-time quotes with sub-millisecond latency from global markets',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
      },
      {
        icon: '🤖',
        title: 'AI Predictions',
        desc: 'Machine learning models trained on billions of data points',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
      },
      {
        icon: '📊',
        title: 'Advanced Charts',
        desc: 'Professional-grade technical analysis with 100+ indicators',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)'
      },
      {
        icon: '🔔',
        title: 'Smart Alerts',
        desc: 'Custom notifications for price movements and market events',
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
      },
      {
        icon: '💎',
        title: 'Portfolio Insights',
        desc: 'Track performance with AI-powered risk analysis',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
      },
      {
        icon: '🛡️',
        title: 'Bank-Grade Security',
        desc: 'Military-level encryption and secure data storage',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)'
      }
    ];

    return (
      <section id="features" style={{
        padding: '8rem 2rem',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Everything You Need to Trade Smarter
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Professional tools designed for both beginners and expert traders
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                id={`feature-${i}`}
                data-animate
                style={{
                  padding: '2.5rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: visibleItems.includes(`feature-${i}`) ? 1 : 0,
                  transform: visibleItems.includes(`feature-${i}`) ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${i * 0.1}s`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(139, 92, 246, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}>
                <div style={{
                  fontSize: '3.5rem',
                  marginBottom: '1.5rem',
                  display: 'inline-block',
                  padding: '1rem',
                  background: feature.gradient,
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#f1f5f9',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#94a3b8',
                  lineHeight: '1.7',
                  fontSize: '1.05rem'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section within Features */}
          <div style={{
            textAlign: 'center',
            marginTop: '5rem',
            padding: '4rem 2rem',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '24px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#f1f5f9',
              marginBottom: '1rem'
            }}>
              Ready to Get Started?
            </h3>
            <p style={{
              color: '#cbd5e1',
              fontSize: '1.2rem',
              marginBottom: '2rem'
            }}>
              Join thousands of traders already using StockAnalyzer Pro
            </p>
            <GetStartedButton 
              variant="primary" 
              size="large"
              onClick={() => navigate('/register')}
            />
          </div>
        </div>
      </section>
    );
  };

  const Pricing = () => {
    const [visibleItems, setVisibleItems] = useState([]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => [...prev, entry.target.id]);
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);

    const plans = [
      {
        name: 'Starter',
        price: '$19',
        period: '/month',
        features: ['Real-time data', 'Basic AI predictions', '10 alerts', 'Email support'],
        popular: false,
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
      },
      {
        name: 'Pro',
        price: '$49',
        period: '/month',
        features: ['All Starter features', 'Advanced charts', 'Unlimited alerts', 'Priority support', 'Portfolio insights'],
        popular: true,
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
      },
      {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        features: ['All Pro features', 'Custom AI models', 'API access', 'Dedicated manager', 'Bank-grade security'],
        popular: false,
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)'
      }
    ];

    return (
      <section id="pricing" style={{
        padding: '8rem 2rem',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Choose the plan that fits your trading style. All plans include a 14-day free trial.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            justifyItems: 'center'
          }}>
            {plans.map((plan, i) => (
              <div
                key={i}
                id={`plan-${i}`}
                data-animate
                style={{
                  padding: '3rem 2rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: visibleItems.includes(`plan-${i}`) ? 1 : 0,
                  transform: visibleItems.includes(`plan-${i}`) ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${i * 0.1}s`,
                  maxWidth: '350px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#f1f5f9',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {plan.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    background: plan.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {plan.price}
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '1rem' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {plan.features.map((feature, j) => (
                    <li key={j} style={{ 
                      color: '#cbd5e1', 
                      marginBottom: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}>
                      <span style={{ color: '#8b5cf6' }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <GetStartedButton 
                  variant="primary" 
                  size="large"
                  onClick={() => navigate('/register')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Start Free Trial
                </GetStartedButton>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const About = () => (
    <section id="about" style={{
      padding: '8rem 2rem',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            About StockAnalyzer Pro
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            Founded by a team of Wall Street veterans and AI experts, we're revolutionizing how traders access market intelligence.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#f1f5f9',
              marginBottom: '1.5rem'
            }}>
              Our Mission
            </h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
              To democratize advanced trading tools, making professional-grade AI insights accessible to every investor, regardless of experience.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {[
                { icon: '🏆', label: 'Award-Winning' },
                { icon: '🌍', label: 'Global Markets' },
                { icon: '⚡', label: 'Lightning Fast' }
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '50px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#a78bfa'
                }}>
                  <span>{badge.icon}</span>
                  <span style={{ fontSize: '0.9rem' }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🚀
            </div>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#f1f5f9',
              marginBottom: '1rem'
            }}>
              Join the Future of Trading
            </h4>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              We're backed by top VCs and trusted by leading hedge funds.
            </p>
            <GetStartedButton 
              variant="primary" 
              size="large"
              onClick={() => navigate('/register')}
            />
          </div>
        </div>
      </div>
    </section>
  );

  const CTA = () => (
    <section style={{
      padding: '8rem 2rem',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '900',
          color: 'white',
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          Ready to Transform Your Trading?
        </h2>
        <p style={{
          fontSize: '1.3rem',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '3rem',
          lineHeight: '1.7'
        }}>
          Join thousands of successful traders using AI-powered insights to maximize returns
        </p>
        <GetStartedButton 
          variant="primary" 
          size="large"
          onClick={() => navigate('/register')}
        />
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '1.5rem', fontSize: '0.95rem' }}>
          No credit card required • Cancel anytime • Full feature access
        </p>
      </div>
    </section>
  );

  const Footer = () => (
    <footer style={{
      background: '#020617',
      padding: '4rem 2rem 2rem',
      color: '#94a3b8'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        <div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            StockAnalyzer Pro
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            Empowering traders with AI-driven insights for smarter decisions.
          </p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Pricing', 'API', 'Security'] },
          { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
          { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'Terms'] }
        ].map((section, i) => (
          <div key={i}>
            <h4 style={{ color: '#f1f5f9', marginBottom: '1rem', fontWeight: '600' }}>{section.title}</h4>
            {section.links.map((link) => (
              <div key={link} style={{ marginBottom: '0.75rem' }}>
                <a href={`#${link.toLowerCase()}`} style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                  {link}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        paddingTop: '2rem',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        © 2025 StockAnalyzer Pro. All rights reserved. Built with ❤️ for traders.
      </div>
    </footer>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: 'white',
      overflowX: 'hidden'
    }}>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}

export default StockAnalyzerPro;