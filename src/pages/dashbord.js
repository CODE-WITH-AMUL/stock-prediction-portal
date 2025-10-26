// StockDashboard.js (Fixed Version - Objects are not valid as React child error resolved)
import React, { useState } from "react";

function StockDashboard() {
  const [tickerInput, setTickerInput] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [plotlyHTML, setPlotlyHTML] = useState("");
  const [panelImages, setPanelImages] = useState({});
  const [summary, setSummary] = useState("");
  const [predictions, setPredictions] = useState({});
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const API_BASE = "http://127.0.0.1:8000";

  const handleAnalyze = async () => {
    const ticker = tickerInput.trim().toUpperCase();
    if (!ticker) {
      setError("Please enter a valid stock ticker (e.g., AAPL)");
      return;
    }

    setLoading(true);
    setError("");
    setDebugInfo("Starting analysis...");

    try {
      console.log("Sending analysis request for:", ticker);
      setDebugInfo(`Requesting analysis for ${ticker}...`);
      
      const response = await fetch(`${API_BASE}/stocks/analyze/${ticker}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Analysis response status:", response.status);
      setDebugInfo(`Response status: ${response.status}`);
      
      const data = await response.json();
      console.log("Analysis response data keys:", Object.keys(data));
      console.log("Metrics data structure:", data.metrics);
      
      if (response.ok) {
        setSelectedStock({ 
          Symbol: ticker, 
          Company_Name: data.company_name || "N/A",
          Current_Price: data.current_price || 0
        });
        setPlotlyHTML(data.plotly_div || "");
        setPanelImages(data.panel_images || {});
        setSummary(data.summary || "Analysis complete.");
        setPredictions(data.predictions || {});
        
        // FIX: Ensure metrics is always a flat object or handle nested objects
        const processedMetrics = processMetrics(data.metrics || {});
        setMetrics(processedMetrics);
        
        setError("");
        setDebugInfo("Analysis complete - data loaded successfully");
      } else {
        const errorMsg = data.message || "Failed to analyze stock";
        setError(errorMsg);
        setDebugInfo(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMsg = `Error: ${error.message}. Check Django console and CORS settings.`;
      setError(errorMsg);
      setDebugInfo(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // FIX: Process metrics to handle nested objects
  const processMetrics = (metricsData) => {
    if (!metricsData || typeof metricsData !== 'object') {
      return {};
    }

    const flatMetrics = {};
    
    // Recursively flatten nested objects
    const flattenObject = (obj, prefix = '') => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = prefix ? `${prefix}_${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], newKey);
          } else {
            flatMetrics[newKey] = obj[key];
          }
        }
      }
    };
    
    flattenObject(metricsData);
    return flatMetrics;
  };

  const handleClear = () => {
    setTickerInput("");
    setSelectedStock(null);
    setPlotlyHTML("");
    setPanelImages({});
    setSummary("");
    setPredictions({});
    setMetrics({});
    setError("");
    setDebugInfo("");
  };

  const getRecommendation = (pctChange) => {
    if (pctChange > 5) return { text: "🚀 STRONG BUY", color: "#28a745", bgColor: "#d4edda" };
    if (pctChange > 2) return { text: "📈 BUY", color: "#17a2b8", bgColor: "#d1ecf1" };
    if (pctChange > -2) return { text: "⚖️ HOLD", color: "#ffc107", bgColor: "#fff3cd" };
    if (pctChange > -5) return { text: "📉 SELL", color: "#fd7e14", bgColor: "#ffe5d0" };
    return { text: "🔻 STRONG SELL", color: "#dc3545", bgColor: "#f8d7da" };
  };

  const panels = [
    { key: 'price_ma', title: 'Stock Price & Moving Averages', color: '#007bff', icon: '📊' },
    { key: 'volume', title: 'Volume Analysis', color: '#6c757d', icon: '📈' },
    { key: 'rsi', title: 'RSI (Relative Strength Index)', color: '#fd7e14', icon: '🎚️' },
    { key: 'macd', title: 'MACD Indicator', color: '#dc3545', icon: '📉' },
    { key: 'predictions', title: 'AI Price Predictions', color: '#28a745', icon: '🤖' }
  ];

  const getPlaceholderImage = (title) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e9ecef" stroke-width="1"/>
          </pattern>
        </defs>
        <text x="50%" y="45%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="#6c757d">${title}</text>
        <text x="50%" y="55%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="14" fill="#adb5bd">Chart Loading...</text>
      </svg>
    `)}`;
  };

  const renderPlotlyChart = () => {
    if (!plotlyHTML) return null;
    
    return (
      <div style={styles.plotlyContainer}>
        <div 
          dangerouslySetInnerHTML={{ __html: plotlyHTML }} 
          style={styles.plotlyChart}
        />
      </div>
    );
  };

  const renderPanelImage = (panelKey, title) => {
    const imageData = panelImages[panelKey];
    
    if (imageData && imageData.startsWith('data:image')) {
      return (
        <div style={styles.panelImageContainer}>
          <img 
            src={imageData} 
            alt={title}
            style={styles.panelImage}
            onError={(e) => {
              e.target.src = getPlaceholderImage(title);
            }}
          />
        </div>
      );
    }
    
    return (
      <div style={styles.panelImageContainer}>
        <img 
          src={getPlaceholderImage(title)} 
          alt={title}
          style={styles.panelImage}
        />
        <div style={styles.panelPlaceholderText}>
          Chart data not available
        </div>
      </div>
    );
  };

  const renderPredictions = () => {
    if (!predictions || Object.keys(predictions).length === 0) {
      return (
        <div style={styles.noData}>
          <p>No prediction data available</p>
        </div>
      );
    }

    return Object.entries(predictions).map(([horizon, data]) => {
      // FIX: Handle case where data might be nested
      const predictionData = typeof data === 'object' ? data : { 
        current_price: 0, 
        predicted_price: 0, 
        price_change: 0, 
        price_change_pct: 0 
      };
      
      const recommendation = getRecommendation(predictionData.price_change_pct || 0);
      
      return (
        <div key={horizon} style={{...styles.predictionCard, borderLeft: `4px solid ${recommendation.color}`}}>
          <div style={styles.predictionHeader}>
            <h4 style={styles.predictionTitle}>{horizon.toUpperCase()} PREDICTION</h4>
            <span 
              style={{
                ...styles.recommendationBadge,
                backgroundColor: recommendation.bgColor,
                color: recommendation.color
              }}
            >
              {recommendation.text}
            </span>
          </div>
          
          <div style={styles.predictionMetrics}>
            <div style={styles.metric}>
              <label style={styles.metricLabel}>Current Price</label>
              <span style={styles.metricValue}>${predictionData.current_price?.toFixed(2) || 'N/A'}</span>
            </div>
            <div style={styles.metric}>
              <label style={styles.metricLabel}>Predicted Price</label>
              <span style={styles.highlightValue}>${predictionData.predicted_price?.toFixed(2) || 'N/A'}</span>
            </div>
            <div style={styles.metric}>
              <label style={styles.metricLabel}>Expected Change</label>
              <span 
                style={{
                  ...styles.metricValue,
                  color: (predictionData.price_change_pct || 0) >= 0 ? '#28a745' : '#dc3545'
                }}
              >
                ${predictionData.price_change?.toFixed(2) || 'N/A'} ({predictionData.price_change_pct?.toFixed(2) || 'N/A'}%)
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  // FIX: Completely rewritten renderMetrics function to handle nested objects
  const renderMetrics = () => {
    if (!metrics || Object.keys(metrics).length === 0) {
      return (
        <div style={styles.noData}>
          <p>No metrics data available</p>
        </div>
      );
    }

    const renderMetricValue = (value) => {
      if (value === null || value === undefined) {
        return 'N/A';
      }
      
      if (typeof value === 'number') {
        return value.toFixed(2);
      }
      
      if (typeof value === 'string') {
        return value;
      }
      
      if (typeof value === 'boolean') {
        return value.toString();
      }
      
      if (Array.isArray(value)) {
        return `[${value.slice(0, 3).join(', ')}${value.length > 3 ? '...' : ''}]`;
      }
      
      // If it's still an object, show type
      return `[Object: ${typeof value}]`;
    };

    return (
      <div style={styles.metricsGrid}>
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} style={styles.metricItem}>
            <label style={styles.metricItemLabel}>
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <span style={styles.metricItemValue}>
              {renderMetricValue(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.dashboardHeader}>
        <h1 style={styles.headerTitle}>📈 AI Stock Analysis Dashboard</h1>
        <p style={styles.headerSubtitle}>Real-time stock analysis with AI-powered predictions</p>
      </div>

      {/* Input Section */}
      <div style={styles.inputSection}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Enter stock ticker (e.g., AAPL, TSLA, GOOGL)"
            style={styles.tickerInput}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              style={loading ? styles.analyzeBtnDisabled : styles.analyzeBtn}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  Analyzing...
                </>
              ) : (
                '🔍 Analyze Stock'
              )}
            </button>
            <button onClick={handleClear} style={styles.clearBtn}>
              🗑️ Clear
            </button>
          </div>
        </div>
        
        {error && (
          <div style={styles.errorMessage}>
            <span>❌ {error}</span>
            <button onClick={handleAnalyze} style={styles.retryBtn}>
              🔄 Retry
            </button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div style={styles.debugInfo}>
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}

      {/* Main Content */}
      {selectedStock && (
        <div style={styles.dashboardContent}>
          {/* Stock Header */}
          <div style={styles.stockHeader}>
            <div style={styles.stockInfo}>
              <h2 style={styles.stockSymbol}>{selectedStock.Symbol}</h2>
              <p style={styles.companyName}>{selectedStock.Company_Name}</p>
              {selectedStock.Current_Price > 0 && (
                <div style={styles.currentPrice}>
                  Current Price: <strong>${selectedStock.Current_Price.toFixed(2)}</strong>
                </div>
              )}
            </div>
            <div style={styles.stockActions}>
              <button onClick={handleAnalyze} style={styles.refreshBtn}>
                🔄 Refresh Analysis
              </button>
            </div>
          </div>

          {/* Interactive Chart */}
          {plotlyHTML && (
            <div style={styles.chartSection}>
              <h3 style={styles.sectionTitle}>📊 Interactive Stock Chart</h3>
              {renderPlotlyChart()}
            </div>
          )}

          {/* Technical Analysis Panels */}
          <div style={styles.panelsSection}>
            <h3 style={styles.sectionTitle}>🔬 Technical Analysis</h3>
            <div style={styles.panelsGrid}>
              {panels.map(panel => (
                <div key={panel.key} style={styles.panelCard}>
                  <div style={{...styles.panelHeader, borderBottom: `2px solid ${panel.color}`}}>
                    <span style={styles.panelIcon}>{panel.icon}</span>
                    <h4 style={styles.panelTitle}>{panel.title}</h4>
                  </div>
                  {renderPanelImage(panel.key, panel.title)}
                </div>
              ))}
            </div>
          </div>

          {/* AI Predictions */}
          <div style={styles.predictionsSection}>
            <h3 style={styles.sectionTitle}>🤖 AI Price Predictions</h3>
            <div style={styles.predictionsGrid}>
              {renderPredictions()}
            </div>
          </div>

          {/* Metrics & Summary */}
          <div style={styles.metricsSection}>
            <div style={styles.metricsColumn}>
              <h3 style={styles.sectionTitle}>📈 Key Metrics</h3>
              {renderMetrics()}
            </div>
            <div style={styles.summaryColumn}>
              <h3 style={styles.sectionTitle}>📋 Analysis Summary</h3>
              <div style={styles.summaryContent}>
                {summary || "No summary available. Analysis may still be processing."}
              </div>
            </div>
          </div>

          {/* Raw Data Debug */}
          <div style={styles.debugSection}>
            <details>
              <summary style={styles.debugSummary}>🔧 Debug Information (Click to expand)</summary>
              <div style={styles.debugContent}>
                <div style={styles.debugItem}>
                  <strong>Selected Stock:</strong> 
                  <pre style={styles.debugPre}>{JSON.stringify(selectedStock, null, 2)}</pre>
                </div>
                <div style={styles.debugItem}>
                  <strong>Predictions Data:</strong> 
                  <pre style={styles.debugPre}>{JSON.stringify(predictions, null, 2)}</pre>
                </div>
                <div style={styles.debugItem}>
                  <strong>Metrics Data (Raw):</strong> 
                  <pre style={styles.debugPre}>{JSON.stringify(metrics, null, 2)}</pre>
                </div>
                <div style={styles.debugItem}>
                  <strong>Panel Images Keys:</strong> 
                  <pre style={styles.debugPre}>{JSON.stringify(Object.keys(panelImages), null, 2)}</pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinnerLarge}></div>
            <h3 style={styles.loadingTitle}>Analyzing {tickerInput.toUpperCase()}...</h3>
            <p style={styles.loadingText}>Downloading data, calculating indicators, and training AI models</p>
            <div style={styles.loadingSteps}>
              <div style={styles.step}>📥 Downloading Stock Data</div>
              <div style={styles.step}>📊 Calculating Technical Indicators</div>
              <div style={styles.step}>🤖 Training Prediction Models</div>
              <div style={styles.step}>📈 Generating Charts & Analysis</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS Styles as JavaScript objects (same as before)
const styles = {
  dashboard: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: '#f8f9fa',
    minHeight: '100vh'
  },
  dashboardHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  // ... (all other styles remain exactly the same as in your original code)
  // Include all the style objects from your original code here
  inputSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  },
  inputGroup: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  tickerInput: {
    flex: '1',
    minWidth: '300px',
    padding: '15px 20px',
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  analyzeBtn: {
    padding: '15px 25px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#007bff',
    color: 'white'
  },
  analyzeBtnDisabled: {
    padding: '15px 25px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#6c757d',
    color: 'white'
  },
  clearBtn: {
    padding: '15px 25px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#6c757d',
    color: 'white'
  },
  refreshBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#28a745',
    color: 'white'
  },
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '10px',
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  retryBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  debugInfo: {
    background: '#fff3cd',
    color: '#856404',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  dashboardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  stockHeader: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stockInfo: {
    flex: '1'
  },
  stockSymbol: {
    margin: '0',
    color: '#2c3e50',
    fontSize: '2em'
  },
  companyName: {
    margin: '5px 0',
    color: '#7f8c8d',
    fontSize: '1.1em'
  },
  currentPrice: {
    marginTop: '10px',
    fontSize: '1.2em',
    color: '#28a745'
  },
  stockActions: {
    flexShrink: '0'
  },
  chartSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  panelsSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  predictionsSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  metricsSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px'
  },
  sectionTitle: {
    marginTop: '0',
    color: '#2c3e50',
    borderBottom: '2px solid #e9ecef',
    paddingBottom: '15px'
  },
  plotlyContainer: {
    width: '100%',
    overflow: 'hidden'
  },
  plotlyChart: {
    width: '100%',
    minHeight: '500px'
  },
  panelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  panelCard: {
    border: '1px solid #e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  panelHeader: {
    padding: '15px 20px',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  panelIcon: {
    fontSize: '1.2em'
  },
  panelTitle: {
    margin: '0',
    color: '#2c3e50'
  },
  panelImageContainer: {
    position: 'relative',
    padding: '15px',
    background: 'white',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panelImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain'
  },
  panelPlaceholderText: {
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  predictionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  predictionCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    transition: 'transform 0.3s ease'
  },
  predictionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  predictionTitle: {
    margin: '0',
    color: '#2c3e50'
  },
  recommendationBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  predictionMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metricLabel: {
    fontWeight: '600',
    color: '#6c757d'
  },
  metricValue: {
    fontWeight: 'bold'
  },
  highlightValue: {
    fontWeight: 'bold',
    color: '#007bff',
    fontSize: '1.1em'
  },
  metricsColumn: {
    flex: '1'
  },
  summaryColumn: {
    flex: '1'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  metricItem: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  metricItemLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6c757d',
    marginBottom: '5px',
    fontWeight: '600'
  },
  metricItemValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  summaryContent: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    lineHeight: '1.6',
    color: '#495057'
  },
  debugSection: {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  debugSummary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#6c757d'
  },
  debugContent: {
    marginTop: '15px',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  debugItem: {
    marginBottom: '15px'
  },
  debugPre: {
    background: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    overflowX: 'auto',
    margin: '5px 0 0 0'
  },
  loadingOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000'
  },
  loadingContent: {
    background: 'white',
    padding: '40px',
    borderRadius: '15px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '90%'
  },
  spinnerLarge: {
    width: '60px',
    height: '60px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  loadingTitle: {
    margin: '0 0 10px 0',
    color: '#2c3e50'
  },
  loadingText: {
    color: '#6c757d',
    marginBottom: '20px'
  },
  loadingSteps: {
    marginTop: '20px',
    textAlign: 'left'
  },
  step: {
    padding: '10px',
    margin: '5px 0',
    background: '#f8f9fa',
    borderRadius: '5px',
    color: '#6c757d'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
    marginRight: '8px'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d',
    fontStyle: 'italic'
  }
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default StockDashboard;