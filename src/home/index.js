// src/index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function GetStart() {
  // Header Component
  const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <header style={{ 
        ...headerStyle, 
        backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.98)' : 'transparent', 
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        boxShadow: isScrolled ? '0 20px 40px rgba(0, 0, 0, 0.25)' : 'none'
      }}>
        <div style={navStyle}>
          <h1 style={logoStyle}>StockAnalyzer Pro</h1>
          <nav>
            <ul style={navListStyle}>
              <li style={navItemStyle}><a href="#dashboard" style={navLinkStyle}>Dashboard</a></li>
              <li style={navItemStyle}><a href="#tools" style={navLinkStyle}>Analysis Tools</a></li>
              <li style={navItemStyle}><a href="#portfolio" style={navLinkStyle}>Portfolio</a></li>
              <li style={navItemStyle}><a href="#login" style={navLinkStyle}>Login</a></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  // Hero Section Component
  const Hero = () => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(timer);
    }, []);

    return (
      <section style={heroStyle}>
        <div style={{ 
          ...heroContentStyle, 
          opacity: animated ? 1 : 0, 
          transform: animated ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)', 
          transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
        }}>
          <h2 style={{ 
            ...heroTitleStyle, 
            opacity: animated ? 1 : 0, 
            transform: animated ? 'translateY(0)' : 'translateY(25px)', 
            transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s, transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s' 
          }}>
            Empower Your Investment Decisions with AI-Driven Insights
          </h2>
          <p style={{ 
            ...heroTextStyle, 
            opacity: animated ? 1 : 0, 
            transform: animated ? 'translateY(0)' : 'translateY(25px)', 
            transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s, transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s' 
          }}>
            Unlock real-time stock data, predictive analytics, and intelligent alerts. 
            Trusted by 10,000+ professional traders for unmatched market intelligence.
          </p>
          <div style={{ 
            ...buttonContainerStyle, 
            opacity: animated ? 1 : 0, 
            transform: animated ? 'translateY(0)' : 'translateY(25px)', 
            transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s, transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s' 
          }}>
            <button 
              style={primaryButtonStyle}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.4)'; }}
            >
              Start Free Trial
            </button>
            <button 
              style={secondaryButtonStyle}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              View Demo
            </button>
          </div>
        </div>
        <div style={heroIllustrationStyle}>💼📈🧠</div>
        <div style={heroGradientOverlay}></div>
        <div style={floatingElementsStyle}>
          <div style={{ ...floatingElement, left: '10%', animationDelay: '0s' }}></div>
          <div style={{ ...floatingElement, left: '25%', top: '50%', animationDelay: '1.5s' }}></div>
          <div style={{ ...floatingElement, right: '20%', animationDelay: '1s' }}></div>
          <div style={{ ...floatingElement, right: '8%', top: '80%', animationDelay: '2.5s' }}></div>
        </div>
      </section>
    );
  };

  // Stock Highlights Component
  const StockHighlights = () => {
    const [highlightsVisible, setHighlightsVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('highlights');
        if (element && window.scrollY > element.offsetTop - 300) {
          setHighlightsVisible(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <section id="highlights" style={highlightsStyle}>
        <div style={containerStyle}>
          <h2 style={{ 
            ...sectionTitleStyle, 
            color: '#f8fafc',
            opacity: highlightsVisible ? 1 : 0, 
            transform: highlightsVisible ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          }}>
            Market at a Glance
          </h2>
          <div style={highlightsGridStyle}>
            {[
              { title: 'S&P 500', change: '+1.2%', value: '4,567.89', trend: 'up' },
              { title: 'NASDAQ', change: '-0.5%', value: '15,234.12', trend: 'down' },
              { title: 'Dow Jones', change: '+0.8%', value: '38,912.45', trend: 'up' }
            ].map((highlight, index) => (
              <div 
                key={index} 
                style={{ 
                  ...highlightCardStyle, 
                  opacity: highlightsVisible ? 1 : 0, 
                  transform: highlightsVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)', 
                  transition: `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 * (index + 1)}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 * (index + 1)}s`
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'; 
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(99, 102, 241, 0.3)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
                }}
              >
                <h3 style={highlightTitleStyle}>{highlight.title}</h3>
                <p style={{ ...highlightValueStyle, color: highlight.trend === 'up' ? '#10b981' : '#ef4444' }}>
                  {highlight.change} <span style={{ fontSize: '1.5rem' }}>{highlight.trend === 'up' ? '↑' : '↓'}</span>
                </p>
                <p style={highlightSubtextStyle}>{highlight.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Features Component
  const Features = () => {
    const [featuresVisible, setFeaturesVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('features');
        if (element && window.scrollY > element.offsetTop - 300) {
          setFeaturesVisible(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
      {
        title: "Real-Time Data",
        description: "Access live stock quotes, interactive charts, and breaking news with millisecond precision.",
        icon: "📈",
        bullets: ["Sub-second updates", "Global market coverage", "Historical data archive"]
      },
      {
        title: "AI-Powered Insights",
        description: "Leverage machine learning for trend predictions, sentiment analysis, and automated trading signals.",
        icon: "🧠",
        bullets: ["Predictive modeling", "NLP sentiment", "Risk assessment AI"]
      },
      {
        title: "Custom Alerts",
        description: "Configure intelligent notifications for price movements, volume anomalies, and portfolio thresholds.",
        icon: "🔔",
        bullets: ["SMS/Email alerts", "Custom thresholds", "Real-time pushes"]
      },
      {
        title: "Portfolio Tracker",
        description: "Monitor your investments with advanced metrics, diversification analysis, and performance forecasting.",
        icon: "💼",
        bullets: ["ROI calculations", "Diversification scores", "Scenario simulations"]
      }
    ];

    return (
      <section id="features" style={featuresStyle}>
        <div style={containerStyle}>
          <h2 style={{ 
            ...sectionTitleStyle, 
            opacity: featuresVisible ? 1 : 0, 
            transform: featuresVisible ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          }}>
            Advanced Tools for Elite Traders
          </h2>
          <div style={featuresGridStyle}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                style={{ 
                  ...featureCardStyle, 
                  opacity: featuresVisible ? 1 : 0, 
                  transform: featuresVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)', 
                  transition: `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 * (index + 1)}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 * (index + 1)}s`
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)'; 
                  e.currentTarget.style.boxShadow = '0 25px 70px rgba(99, 102, 241, 0.25)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ ...iconStyle, opacity: featuresVisible ? 1 : 0, transform: featuresVisible ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-10deg)', transition: `opacity 0.8s ease ${0.3 * (index + 1)}s, transform 0.8s ease ${0.3 * (index + 1)}s` }}>
                  {feature.icon}
                </div>
                <h3 style={featureTitleStyle}>{feature.title}</h3>
                <p style={featureDescriptionStyle}>{feature.description}</p>
                <ul style={bulletsStyle}>
                  {feature.bullets.map((bullet, bIndex) => (
                    <li key={bIndex} style={bulletItemStyle}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Testimonials Component
  const Testimonials = () => {
    const [testimonialsVisible, setTestimonialsVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('testimonials');
        if (element && window.scrollY > element.offsetTop - 300) {
          setTestimonialsVisible(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const testimonials = [
      {
        quote: "StockAnalyzer Pro transformed my trading strategy. The AI insights are spot-on and saved me hours of analysis daily.",
        author: "Sarah Chen",
        role: "Hedge Fund Manager",
        avatar: "👩‍💼"
      },
      {
        quote: "Real-time alerts and portfolio tracking have boosted my returns by 25%. Highly recommended for serious investors.",
        author: "Mike Rodriguez",
        role: "Independent Trader",
        avatar: "👨‍💼"
      },
      {
        quote: "The predictive analytics are revolutionary. It's like having a team of experts at your fingertips.",
        author: "Elena Petrova",
        role: "FinTech Analyst",
        avatar: "👩‍🔬"
      }
    ];

    return (
      <section id="testimonials" style={testimonialsStyle}>
        <div style={containerStyle}>
          <h2 style={{ 
            ...sectionTitleStyle, 
            color: '#f1f5f9',
            opacity: testimonialsVisible ? 1 : 0, 
            transform: testimonialsVisible ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          }}>
            What Our Traders Say
          </h2>
          <div style={testimonialsGridStyle}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                style={{ 
                  ...testimonialCardStyle, 
                  opacity: testimonialsVisible ? 1 : 0, 
                  transform: testimonialsVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)', 
                  transition: `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 * (index + 1)}s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 * (index + 1)}s`
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                }}
              >
                <div style={avatarStyle}>{testimonial.avatar}</div>
                <p style={quoteStyle}>"{testimonial.quote}"</p>
                <div style={authorStyle}>
                  <h4 style={authorNameStyle}>{testimonial.author}</h4>
                  <p style={authorRoleStyle}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // FAQ Component
  const FAQ = () => {
    const [faqsVisible, setFaqsVisible] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('faq');
        if (element && window.scrollY > element.offsetTop - 300) {
          setFaqsVisible(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const faqs = [
      {
        question: "How accurate are the AI predictions?",
        answer: "Our AI models achieve over 85% accuracy on historical data, continuously trained on the latest market trends."
      },
      {
        question: "Is there a free trial?",
        answer: "Yes, start with a 14-day free trial including full access to all premium features."
      },
      {
        question: "What data sources do you use?",
        answer: "We integrate with top providers like Bloomberg, Reuters, and Yahoo Finance for reliable, real-time data."
      },
      {
        question: "Can I integrate with my broker?",
        answer: "Absolutely, seamless API integrations with major brokers like Interactive Brokers and TD Ameritrade."
      }
    ];

    return (
      <section id="faq" style={faqStyle}>
        <div style={containerStyle}>
          <h2 style={{ 
            ...sectionTitleStyle, 
            opacity: faqsVisible ? 1 : 0, 
            transform: faqsVisible ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          }}>
            Frequently Asked Questions
          </h2>
          <div style={faqListStyle}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                style={{ 
                  ...faqItemStyle, 
                  opacity: faqsVisible ? 1 : 0, 
                  transform: faqsVisible ? 'translateY(0)' : 'translateY(20px)', 
                  transition: `opacity 0.8s ease ${0.2 * (index + 1)}s, transform 0.8s ease ${0.2 * (index + 1)}s`
                }}
              >
                <button 
                  style={{ ...faqQuestionStyle, ...(openFaq === index && { color: '#6366f1' }) }}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  <span style={{ ...faqArrowStyle, transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>
                <div style={{ ...faqAnswerContainerStyle, maxHeight: openFaq === index ? '100px' : '0', opacity: openFaq === index ? 1 : 0, transition: 'all 0.3s ease' }}>
                  <p style={faqAnswerStyle}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // CTA Component
  const CTA = () => {
    const [ctaVisible, setCtaVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('cta');
        if (element && window.scrollY > element.offsetTop - 300) {
          setCtaVisible(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <section id="cta" style={ctaStyle}>
        <div style={containerStyle}>
          <div style={{ 
            ...ctaContentStyle, 
            opacity: ctaVisible ? 1 : 0, 
            transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)', 
            transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          }}>
            <h2 style={ctaTitleStyle}>Ready to Revolutionize Your Trading?</h2>
            <p style={ctaTextStyle}>Join thousands of investors who trust StockAnalyzer Pro for superior performance.</p>
            <div style={ctaButtonContainerStyle}>
              <button 
                style={primaryButtonStyle}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Footer Component
  const Footer = () => {
    const [footerVisible, setFooterVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const element = document.getElementById('footer');
        if (element && window.scrollY > element.offsetTop - 300) {
          setFooterVisible(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <footer id="footer" style={{ ...footerStyle, opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
        <div style={containerStyle}>
          <div style={footerContentStyle}>
            <div style={footerSectionStyle}>
              <h3 style={footerSectionTitleStyle}>StockAnalyzer Pro</h3>
              <p style={footerSectionTextStyle}>Empowering traders with cutting-edge AI tools for smarter, faster decisions in dynamic markets.</p>
              <div style={socialIconsStyle}>
                <a 
                  href="#twitter" 
                  style={socialIconStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.15)'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.color = '#f1f5f9'; }}
                >
                  🐦
                </a>
                <a 
                  href="#linkedin" 
                  style={{ ...socialIconStyle, marginLeft: '1.5rem', marginRight: '1.5rem' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.15)'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.color = '#f1f5f9'; }}
                >
                  💼
                </a>
                <a 
                  href="#github" 
                  style={socialIconStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.15)'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.color = '#f1f5f9'; }}
                >
                  🐙
                </a>
              </div>
            </div>
            <div style={footerSectionStyle}>
              <h4 style={footerLinkTitleStyle}>Product</h4>
              <ul style={footerLinkListStyle}>
                <li><a href="#features" style={footerLinkStyle}>Features</a></li>
                <li><a href="#pricing" style={footerLinkStyle}>Pricing</a></li>
                <li><a href="#docs" style={footerLinkStyle}>Documentation</a></li>
                <li><a href="#api" style={footerLinkStyle}>API Access</a></li>
              </ul>
            </div>
            <div style={footerSectionStyle}>
              <h4 style={footerLinkTitleStyle}>Company</h4>
              <ul style={footerLinkListStyle}>
                <li><a href="#about" style={footerLinkStyle}>About Us</a></li>
                <li><a href="#careers" style={footerLinkStyle}>Careers</a></li>
                <li><a href="#blog" style={footerLinkStyle}>Blog</a></li>
                <li><a href="#news" style={footerLinkStyle}>Market News</a></li>
              </ul>
            </div>
            <div style={footerSectionStyle}>
              <h4 style={footerLinkTitleStyle}>Support</h4>
              <ul style={footerLinkListStyle}>
                <li><a href="#help" style={footerLinkStyle}>Help Center</a></li>
                <li><a href="#contact" style={footerLinkStyle}>Contact Us</a></li>
                <li><a href="#privacy" style={footerLinkStyle}>Privacy Policy</a></li>
                <li><a href="#terms" style={footerLinkStyle}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div style={footerBottomStyle}>
            <p style={footerTextStyle}>
              &copy; 2025 StockAnalyzer Pro. All rights reserved. Made with ❤️ for traders worldwide.
            </p>
          </div>
        </div>
      </footer>
    );
  };

  // Main App Component
  const App = () => {
    return (
      <div style={appStyle}>
        <Header />
        <Hero />
        <StockHighlights />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    );
  };

  // Styles
  const appStyle = {
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    overflowX: 'hidden',
    scrollBehavior: 'smooth'
  };

  const headerStyle = {
    padding: '1.5rem 0',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  };

  const navStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem'
  };

  const logoStyle = {
    color: '#8b5cf6',
    fontSize: '2.2rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.03em',
    transition: 'all 0.3s ease'
  };

  const navListStyle = {
    display: 'flex',
    listStyle: 'none',
    gap: '3rem',
    margin: 0,
    padding: 0
  };

  const navItemStyle = {
    display: 'inline-block'
  };

  const navLinkStyle = {
    color: '#f1f5f9',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    position: 'relative'
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3730a3 100%)',
    color: 'white',
    padding: '14rem 2rem 12rem',
    textAlign: 'center',
    marginTop: '70px',
    position: 'relative',
    overflow: 'hidden'
  };

  const heroIllustrationStyle = {
    fontSize: '8rem',
    margin: '2rem auto',
    opacity: 0.8,
    animation: 'pulse 2s infinite'
  };

  const heroGradientOverlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none'
  };

  const floatingElementsStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden'
  };

  const floatingElement = {
    position: 'absolute',
    width: '6px',
    height: '6px',
    background: 'rgba(139, 92, 246, 0.7)',
    borderRadius: '50%',
    animation: 'float 8s ease-in-out infinite'
  };

  const heroContentStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  };

  const heroTitleStyle = {
    fontSize: '5rem',
    marginBottom: '2.5rem',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-0.035em'
  };

  const heroTextStyle = {
    fontSize: '1.5rem',
    marginBottom: '4rem',
    opacity: 0.95,
    lineHeight: '1.8',
    maxWidth: '750px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '2.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const primaryButtonStyle = {
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    padding: '20px 50px',
    fontSize: '1.2rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)',
    transform: 'translateY(0) scale(1)'
  };

  const secondaryButtonStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid #8b5cf6',
    padding: '20px 50px',
    fontSize: '1.2rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0) scale(1)'
  };

  const featuresStyle = {
    padding: '12rem 2rem',
    backgroundColor: '#ffffff'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const sectionTitleStyle = {
    textAlign: 'center',
    fontSize: '4rem',
    marginBottom: '5.5rem',
    color: '#0f172a',
    fontWeight: '800',
    letterSpacing: '-0.02em'
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '4.5rem'
  };

  const featureCardStyle = {
    backgroundColor: 'white',
    padding: '4rem 3.5rem',
    borderRadius: '28px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    transform: 'translateY(0) scale(1)'
  };

  const iconStyle = {
    fontSize: '5rem',
    marginBottom: '2.5rem',
    transition: 'all 0.4s ease'
  };

  const featureTitleStyle = {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#0f172a',
    fontWeight: '700'
  };

  const featureDescriptionStyle = {
    color: '#475569',
    lineHeight: '1.8',
    fontSize: '1.15rem',
    marginBottom: '2rem'
  };

  const bulletsStyle = {
    textAlign: 'left',
    margin: 0,
    padding: '0 1rem'
  };

  const bulletItemStyle = {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '0.5rem'
  };

  const highlightsStyle = {
    padding: '12rem 2rem',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
  };

  const highlightsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3.5rem',
    marginTop: '3.5rem'
  };

  const highlightCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: '3.5rem',
    borderRadius: '28px',
    textAlign: 'center',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0) scale(1)'
  };

  const highlightTitleStyle = {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#f8fafc',
    fontWeight: '600'
  };

  const highlightValueStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '0.75rem'
  };

  const highlightSubtextStyle = {
    fontSize: '1.4rem',
    opacity: 0.9,
    margin: 0,
    fontWeight: '600'
  };

  const testimonialsStyle = {
    padding: '12rem 2rem',
    backgroundColor: '#0f172a'
  };

  const testimonialsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '3rem'
  };

  const testimonialCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '3rem',
    borderRadius: '24px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s ease',
    transform: 'translateY(0) scale(1)'
  };

  const avatarStyle = {
    fontSize: '4rem',
    marginBottom: '2rem'
  };

  const quoteStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#e2e8f0',
    fontStyle: 'italic',
    marginBottom: '2rem'
  };

  const authorStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const authorNameStyle = {
    color: '#f8fafc',
    fontWeight: '600',
    margin: 0
  };

  const authorRoleStyle = {
    color: '#94a3b8',
    fontSize: '0.95rem',
    margin: '0.25rem 0 0'
  };

  const faqStyle = {
    padding: '12rem 2rem',
    backgroundColor: '#f8fafc'
  };

  const faqListStyle = {
    maxWidth: '800px',
    margin: '0 auto'
  };

  const faqItemStyle = {
    marginBottom: '1.5rem',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  };

  const faqQuestionStyle = {
    width: '100%',
    backgroundColor: 'white',
    border: 'none',
    padding: '1.5rem 2rem',
    textAlign: 'left',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#0f172a',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const faqArrowStyle = {
    fontSize: '1rem',
    color: '#8b5cf6',
    transition: 'transform 0.3s ease'
  };

  const faqAnswerContainerStyle = {
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const faqAnswerStyle = {
    backgroundColor: '#f1f5f9',
    padding: '1.5rem 2rem',
    margin: 0,
    color: '#475569',
    lineHeight: '1.6'
  };

  const ctaStyle = {
    padding: '8rem 2rem',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    color: 'white',
    textAlign: 'center'
  };

  const ctaContentStyle = {
    maxWidth: '700px',
    margin: '0 auto'
  };

  const ctaTitleStyle = {
    fontSize: '3.5rem',
    marginBottom: '1.5rem',
    fontWeight: '700'
  };

  const ctaTextStyle = {
    fontSize: '1.3rem',
    marginBottom: '3rem',
    opacity: 0.95,
    lineHeight: '1.7'
  };

  const ctaButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'center'
  };

  const footerStyle = {
    backgroundColor: '#020617',
    color: 'white',
    padding: '6rem 0 3rem'
  };

  const footerContentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '4.5rem',
    marginBottom: '4.5rem'
  };

  const footerSectionStyle = {
    textAlign: 'left'
  };

  const footerSectionTitleStyle = {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#8b5cf6',
    fontWeight: '700'
  };

  const footerSectionTextStyle = {
    color: '#94a3b8',
    lineHeight: '1.8',
    marginBottom: '2.5rem',
    fontSize: '1.05rem'
  };

  const socialIconsStyle = {
    display: 'flex',
    gap: '2rem'
  };

  const socialIconStyle = {
    fontSize: '2rem',
    color: '#f1f5f9',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0) scale(1)'
  };

  const footerLinkTitleStyle = {
    color: '#f1f5f9',
    marginBottom: '1.5rem',
    fontWeight: '600',
    fontSize: '1.2rem'
  };

  const footerLinkListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const footerLinkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '1rem',
    transition: 'all 0.3s ease',
    fontSize: '1.05rem'
  };

  const footerBottomStyle = {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '3rem',
    textAlign: 'center'
  };

  const footerTextStyle = {
    margin: 0,
    fontSize: '1rem',
    color: '#64748b'
  };

  // Add global styles for animations
  useEffect(() => {
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
        50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(globalStyles);
    return () => document.head.removeChild(globalStyles);
  }, []);

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}

export default GetStart;