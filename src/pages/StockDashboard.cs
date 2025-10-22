/* StockDashboard.css */
.stock-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 2.5em;
}

.dashboard-header p {
  color: #7f8c8d;
  font-size: 1.2em;
  margin: 10px 0 0 0;
}

.input-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.ticker-input {
  flex: 1;
  min-width: 300px;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.ticker-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analyze-btn {
  background: #007bff;
  color: white;
}

.analyze-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
}

.analyze-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
  color: white;
}

.clear-btn:hover {
  background: #545b62;
  transform: translateY(-2px);
}

.refresh-btn {
  background: #28a745;
  color: white;
}

.refresh-btn:hover {
  background: #218838;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.debug-info {
  background: #fff3cd;
  color: #856404;
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stock-header {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-info h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 2em;
}

.stock-info p {
  margin: 5px 0;
  color: #7f8c8d;
  font-size: 1.1em;
}

.current-price {
  margin-top: 10px;
  font-size: 1.2em;
  color: #28a745;
}

.chart-section,
.panels-section,
.predictions-section,
.metrics-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-section h3,
.panels-section h3,
.predictions-section h3,
.metrics-section h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 15px;
}

.plotly-container {
  width: 100%;
  overflow: hidden;
}

.plotly-chart {
  width: 100%;
  min-height: 500px;
}

.panels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.panel-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.panel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.panel-header {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-header h4 {
  margin: 0;
  color: #2c3e50;
}

.panel-icon {
  font-size: 1.2em;
}

.panel-image-container {
  position: relative;
  padding: 15px;
  background: white;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.panel-placeholder-text {
  color: #6c757d;
  text-align: center;
  font-style: italic;
}

.predictions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.prediction-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.prediction-card:hover {
  transform: translateY(-3px);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.prediction-header h4 {
  margin: 0;
  color: #2c3e50;
}

.recommendation-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.prediction-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric label {
  font-weight: 600;
  color: #6c757d;
}

.metric .value {
  font-weight: bold;
}

.metric .highlight {
  color: #007bff;
  font-size: 1.1em;
}

.metric .change.positive {
  color: #28a745;
}

.metric .change.negative {
  color: #dc3545;
}

.metrics-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.metric-item label {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 5px;
  font-weight: 600;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.summary-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  line-height: 1.6;
  color: #495057;
}

.debug-section {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.debug-section summary {
  cursor: pointer;
  font-weight: bold;
  color: #6c757d;
}

.debug-content {
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.debug-item {
  margin-bottom: 15px;
}

.debug-item pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  overflow-x: auto;
  margin: 5px 0 0 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-steps {
  margin-top: 20px;
  text-align: left;
}

.step {
  padding: 10px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 5px;
  color: #6c757d;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

.no-predictions,
.no-metrics {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stock-dashboard {
    padding: 10px;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .ticker-input {
    min-width: auto;
  }
  
  .button-group {
    width: 100%;
    justify-content: stretch;
  }
  
  .btn {
    flex: 1;
    justify-content: center;
  }
  
  .panels-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-section {
    grid-template-columns: 1fr;
  }
  
  .stock-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}

/* Animation for smooth transitions */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}