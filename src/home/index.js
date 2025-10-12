import React, { useEffect, useRef } from 'react';
import './index.css';

const SmartAILanding = () => {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Smooth scrolling implementation
    const handleSmoothScroll = (e) => {
      if (e.target.hash === '#about' && aboutRef.current) {
        e.preventDefault();
        aboutRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (e.target.hash === '#features' && featuresRef.current) {
        e.preventDefault();
        featuresRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="smart-ai-landing">
      {/* Live Ticker */}
      <div className="live-ticker">
        <div className="ticker-content">
          <span>LIVE: </span>
          <span>AAPL $182.34 ↑1.2%</span>
          <span>MSFT $415.26 ↑0.8%</span>
          <span>TSLA $245.18 ↓0.5%</span>
          <span>NVDA $895.22 ↑2.1%</span>
          <span>GOOGL $152.43 ↑0.7%</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="particles"></div>
          <div className="graph-animation"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Smart AI — The Future of Stock Market Analysis
          </h1>
          <p className="hero-subtitle">
            Harness the power of artificial intelligence to predict, analyze, and act smarter in the market.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>
              Get Started
            </button>
            <a href="#about" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about" id="about">
        <div className="container">
          <h2 className="section-title">What is Smart AI?</h2>
          <p className="about-description">
            Smart AI is your intelligent trading companion. It processes real-time financial data, 
            predicts stock behavior, and provides actionable insights so you can make confident 
            investment decisions.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features" id="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered Predictions</h3>
              <p>Get trend forecasts powered by machine learning and advanced algorithms.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Live Market Data</h3>
              <p>Monitor stock movements and market changes in real time with zero delay.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Sentiment Analysis</h3>
              <p>Understand market sentiment and investor behavior through AI analysis.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Target Insights</h3>
              <p>Find AI-calculated stock targets and growth potentials with high accuracy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose Smart AI?</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-bullet">⚡</span>
              <span>Built with real-time AI models</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-bullet">🔒</span>
              <span>Data from trusted financial sources</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-bullet">💎</span>
              <span>Simple, elegant interface for all levels of traders</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-bullet">🔄</span>
              <span>Continuous updates with latest trends</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Start analyzing smarter today.</h2>
          <button 
            className="btn btn-primary btn-glow"
            onClick={() => window.location.href = '/dashboard'}
          >
            Launch Smart AI
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 Smart AI — Designed for smarter investing.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartAILanding;