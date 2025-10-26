#----------------------[IMPORT MODEL]-----------------#
import os
import pandas as pd
import numpy as np
import yfinance as yf
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import plotly.graph_objects as go
from plotly.offline import plot
import matplotlib
import matplotlib.pyplot as plt
import io
import base64
import joblib
from datetime import datetime, timedelta
import warnings
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

warnings.filterwarnings('ignore')
matplotlib.use('Agg')


'''
its for the stoping the lagaing probrom
in code
'''
try:
    import logging
    logger = logging.getLogger(__name__)
except ImportError:
    logger = None  # Fallback to print

def log_error(msg, exc=None):
    if logger:
        logger.error(msg, exc_info=exc)
    else:
        print(f"ERROR: {msg}")
        if exc:
            import traceback
            traceback.print_exc()

#-------------[FILE HANDING PATH]--------------#
'''
It help us to identify the stock file path where to store the 
File and where we can take the file from

'''
try:
    STOCK_LIST_PATH = os.path.join(settings.BASE_DIR, 'stock', 'nasdaq-listed-symbols.csv')
    MEDIA_ROOT_FALLBACK = os.path.join(settings.BASE_DIR, 'media')
    STOCK_DATA_DIR = os.path.join(getattr(settings, 'MEDIA_ROOT', MEDIA_ROOT_FALLBACK), 'Training', 'stock_data')
    MODEL_DIR = os.path.join(getattr(settings, 'MEDIA_ROOT', MEDIA_ROOT_FALLBACK), 'Training', 'models')
    CHART_DIR = os.path.join(getattr(settings, 'MEDIA_ROOT', MEDIA_ROOT_FALLBACK), 'Training', 'charts')
    os.makedirs(STOCK_DATA_DIR, exist_ok=True)
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(CHART_DIR, exist_ok=True)
    print(f"Paths set: STOCK_DATA_DIR={STOCK_DATA_DIR}")  # Debug
except Exception as e:
    log_error(f"Failed to set up paths: {e}")
    STOCK_DATA_DIR = MODEL_DIR = CHART_DIR = '/tmp/django_stock'  # Temp fallback
    os.makedirs(STOCK_DATA_DIR, exist_ok=True)
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(CHART_DIR, exist_ok=True)

# STOCK_DATABASE
'''
In this stock database the stock name are written in short from
so it will be easy to use the symbol

'''
STOCK_DATABASE = {
    
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla Inc.',
    'GOOGL': 'Alphabet Inc. (Google)',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix Inc.',
    'BTC-USD': 'Bitcoin USD',
    'ETH-USD': 'Ethereum USD',
    'SPY': 'SPDR S&P 500 ETF',
    'QQQ': 'Invesco QQQ Trust',
    'JPM': 'JPMorgan Chase & Co.',
    'JNJ': 'Johnson & Johnson',
    'V': 'Visa Inc.',
    'PG': 'Procter & Gamble Co.',
    'DIS': 'Walt Disney Co.',
    'NKE': 'Nike Inc.',
    'BA': 'Boeing Co.',
    'XOM': 'Exxon Mobil Corp.',
    'KO': 'Coca-Cola Co.'
}

def load_stock_list():
    try:
        if os.path.exists(STOCK_LIST_PATH):
            return pd.read_csv(STOCK_LIST_PATH)
        else:
            df = pd.DataFrame(list(STOCK_DATABASE.items()), columns=['Symbol', 'Company Name'])
            return df
    except Exception as e:
        log_error(f"Failed to load stock list: {e}")
        return pd.DataFrame(list(STOCK_DATABASE.items()), columns=['Symbol', 'Company Name'])

def fig_to_base64(fig):
    try:
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)  # Lower DPI for speed
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        print(f"Debug: Base64 generated, length: {len(img_base64)}")  # Debug
        plt.close(fig)
        return img_base64
    except Exception as e:
        log_error(f"Failed to convert fig to base64: {e}")
        print(f"Debug: Base64 error: {e}")
        return ""

def calculate_technical_indicators(data):
    try:
        df = data.copy()
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        close = df['Close'].squeeze()
        volume = df['Volume'].squeeze()
        df['MA_7'] = close.rolling(7).mean()
        df['MA_20'] = close.rolling(20).mean()
        df['MA_50'] = close.rolling(50).mean()
        df['MA_200'] = close.rolling(200).mean()
        df['EMA_12'] = close.ewm(span=12, adjust=False).mean()
        df['EMA_26'] = close.ewm(span=26, adjust=False).mean()
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
        df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
        delta = close.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss.replace(0, np.nan)
        df['RSI'] = 100 - (100 / (1 + rs))
        bb_middle = close.rolling(20).mean()
        bb_std = close.rolling(20).std()
        df['BB_Middle'] = bb_middle
        df['BB_Upper'] = bb_middle + (bb_std * 2)
        df['BB_Lower'] = bb_middle - (bb_std * 2)
        df['Volume_MA'] = volume.rolling(20).mean()
        print(f"Debug: Technical indicators added, df shape: {df.shape}")  # Debug
        return df
    except Exception as e:
        log_error(f"Failed in technical indicators: {e}")
        return data

class StockPricePredictor:
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.feature_columns = None
        self.is_trained = {}
        self.ticker = None
        self.company_name = None
        self.training_metrics = {}

    def prepare_features(self, data):
        try:
            df = data.copy()
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            close = df['Close'].squeeze()
            open_price = df['Open'].squeeze()
            high = df['High'].squeeze()
            low = df['Low'].squeeze()
            volume = df['Volume'].squeeze()
            df['Price_Range'] = high - low
            df['Price_Change'] = close - open_price
            df['Close_Open_Ratio'] = close / open_price.replace(0, np.nan)
            df['High_Low_Ratio'] = high / low.replace(0, np.nan)
            for window in [5, 7, 10, 20, 50, 200]:
                ma = close.rolling(window).mean()
                df[f'MA_{window}'] = ma
                df[f'Price_vs_MA_{window}'] = close / ma.replace(0, np.nan)
            df['EMA_12'] = close.ewm(span=12, adjust=False).mean()
            df['EMA_26'] = close.ewm(span=26, adjust=False).mean()
            macd = df['EMA_12'] - df['EMA_26']
            df['MACD'] = macd
            df['MACD_Signal'] = macd.ewm(span=9, adjust=False).mean()
            df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
            delta = close.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss.replace(0, np.nan)
            df['RSI'] = 100 - (100 / (1 + rs))
            bb_middle = close.rolling(20).mean()
            bb_std = close.rolling(20).std()
            df['BB_Middle'] = bb_middle
            df['BB_Upper'] = bb_middle + (bb_std * 2)
            df['BB_Lower'] = bb_middle - (bb_std * 2)
            df['BB_Position'] = (close - df['BB_Lower']) / (df['BB_Upper'] - df['BB_Lower']).replace(0, np.nan)
            volume_ma = volume.rolling(20).mean()
            df['Volume_MA'] = volume_ma
            df['Volume_Ratio'] = volume / volume_ma.replace(0, np.nan)
            for period in [5, 10, 20]:
                df[f'Momentum_{period}'] = close - close.shift(period)
                df[f'ROC_{period}'] = ((close - close.shift(period)) / close.shift(period).replace(0, np.nan)) * 100
            df['Volatility_20'] = close.rolling(20).std()
            df['Daily_Return'] = close.pct_change()
            for lag in [1, 2, 3]:
                df[f'Close_Lag_{lag}'] = close.shift(lag)
                df[f'Volume_Lag_{lag}'] = volume.shift(lag)
            df['Target_1_Day'] = close.shift(-1)
            df['Target_5_Days'] = close.shift(-5)
            df['Target_21_Days'] = close.shift(-21)
            return df
        except Exception as e:
            log_error(f"Failed in prepare_features: {e}")
            return data

    def train_model(self, data, target_horizon='1_Day'):
        try:
            data_with_features = self.prepare_features(data)
            data_clean = data_with_features.dropna()
            if len(data_clean) < 100:
                raise ValueError("Insufficient data after cleaning")
            feature_candidates = [
                'Open', 'High', 'Low', 'Close', 'Volume',
                'Price_Range', 'Price_Change', 'Close_Open_Ratio', 'High_Low_Ratio',
                'MA_5', 'MA_20', 'MA_50', 'MA_200',
                'Price_vs_MA_5', 'Price_vs_MA_50', 'Price_vs_MA_200',
                'EMA_12', 'EMA_26', 'MACD', 'MACD_Signal', 'MACD_Histogram',
                'RSI', 'BB_Middle', 'BB_Upper', 'BB_Lower', 'BB_Position',
                'Volume_Ratio', 'Momentum_5', 'ROC_5',
                'Volatility_20', 'Daily_Return',
                'Close_Lag_1', 'Close_Lag_2', 'Volume_Lag_1'
            ]
            available_features = [col for col in feature_candidates if col in data_clean.columns]
            target_column = f'Target_{target_horizon}'
            if target_column not in data_clean.columns:
                return False
            X = data_clean[available_features]
            y = data_clean[target_column].dropna()
            if len(X) != len(y):
                min_len = min(len(X), len(y))
                X = X.iloc[:min_len]
                y = y.iloc[:min_len]
            split_index = int(len(X) * 0.8)
            if split_index < 10:
                raise ValueError("Too few samples for training")
            X_train, X_test = X[:split_index], X[split_index:]
            y_train, y_test = y[:split_index], y[split_index:]
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
            model.fit(X_train_scaled, y_train)
            self.models[target_horizon] = model
            y_pred = model.predict(X_test_scaled)
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            r2 = r2_score(y_test, y_pred)
            self.training_metrics[target_horizon] = {
                'mae': float(mae), 'rmse': float(rmse), 'r2_score': float(r2),
                'test_predictions': y_pred.tolist(), 'test_actual': y_test.values.tolist()
            }
            self.is_trained[target_horizon] = True
            self.feature_columns = available_features
            return True
        except Exception as e:
            log_error(f"Failed in train_model for {target_horizon}: {e}")
            return False

    def predict_future(self, data, target_horizon='1_Day'):
        try:
            if target_horizon not in self.models:
                if not self.train_model(data, target_horizon):
                    return None
            data_with_features = self.prepare_features(data)
            if self.feature_columns is None or len(data_with_features) == 0:
                raise ValueError("No features available")
            latest_data = data_with_features[self.feature_columns].iloc[-1:].fillna(0).values
            latest_data_scaled = self.scaler.transform(latest_data)
            model = self.models[target_horizon]
            predicted_price = model.predict(latest_data_scaled)[0]
            current_price = data['Close'].iloc[-1] if not isinstance(data['Close'], pd.DataFrame) else data['Close'].iloc[-1].values[0]
            return {
                'current_price': float(current_price),
                'predicted_price': float(predicted_price),
                'price_change': float(predicted_price - current_price),
                'price_change_pct': float(((predicted_price / current_price) - 1) * 100)
            }
        except Exception as e:
            log_error(f"Failed in predict_future for {target_horizon}: {e}")
            return None

def analyze_stock(request, ticker):
    if request.method == 'GET':
        response_data = {
            'ticker': ticker,
            'company_name': 'Unknown',
            'plotly_div': '',
            'panel_images': {},
            'summary': 'Analysis failed - check server logs.',
            'num_samples': 0,
            'num_features': 0,
            'predictions': {},
            'metrics': {}
        }
        try:
            # Stock validation
            stock_df = load_stock_list()
            match = stock_df[stock_df['Symbol'] == ticker.upper()]
            if match.empty:
                if ticker.upper() in STOCK_DATABASE:
                    company_name = STOCK_DATABASE[ticker.upper()]
                else:
                    return HttpResponse("No matching stock found.", status=404)
            else:
                company_name = match.iloc[0]['Company Name']
            response_data['company_name'] = company_name

            # Download data
            print(f"Debug: Downloading data for {ticker}")
            data = yf.download(ticker, period='5y', auto_adjust=True)
            if isinstance(data.columns, pd.MultiIndex):
                data.columns = data.columns.droplevel(1)
            if data.empty:
                raise ValueError("No data downloaded from yfinance")
            print(f"Debug: Data downloaded, shape: {data.shape}")
            response_data['summary'] += f"\n✓ Downloaded {len(data)} days of data"

            # Save raw (try-except)
            try:
                raw_path = os.path.join(STOCK_DATA_DIR, f"{ticker}_raw_data.csv")
                data.to_csv(raw_path)
                response_data['summary'] += f"\n✓ Raw data saved to {raw_path}"
            except Exception as e:
                log_error(f"Failed to save raw data: {e}")

            # Basic Feature Engineering
            data['MA7'] = data['Close'].rolling(7).mean()
            data['MA21'] = data['Close'].rolling(21).mean()
            data['MA50'] = data['Close'].rolling(50).mean()
            data['MA200'] = data['Close'].rolling(200).mean()
            data['EMA12'] = data['Close'].ewm(span=12, adjust=False).mean()
            data['EMA26'] = data['Close'].ewm(span=26, adjust=False).mean()
            data['MACD'] = data['EMA12'] - data['EMA26']
            data['Signal_Line'] = data['MACD'].ewm(span=9, adjust=False).mean()
            delta = data['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss.replace(0, np.nan)
            data['RSI'] = 100 - (100 / (1 + rs))
            data['BB_Middle'] = data['Close'].rolling(20).mean()
            data['BB_Upper'] = data['BB_Middle'] + 2 * data['Close'].rolling(20).std()
            data['BB_Lower'] = data['BB_Middle'] - 2 * data['Close'].rolling(20).std()
            data['Volume_MA'] = data['Volume'].rolling(20).mean()
            data['Volume_Ratio'] = data['Volume'] / data['Volume_MA'].replace(0, np.nan)
            data['Momentum'] = data['Close'] - data['Close'].shift(10)
            data['ROC'] = ((data['Close'] - data['Close'].shift(10)) / data['Close'].shift(10).replace(0, np.nan)) * 100
            data['Volatility'] = data['Close'].rolling(20).std()
            data['Daily_Return'] = data['Close'].pct_change()
            data['Price_Range'] = data['High'] - data['Low']
            data['Price_Change'] = data['Close'] - data['Open']
            data['Target'] = data['Close'].shift(-1)
            data_clean = data.dropna()
            if len(data_clean) == 0:
                raise ValueError("No data after feature engineering")
            print(f"Debug: data_clean shape: {data_clean.shape}")

            # Save processed (try-except)
            try:
                processed_path = os.path.join(STOCK_DATA_DIR, f"{ticker}_processed_data.csv")
                data_clean.to_csv(processed_path)
                response_data['summary'] += f"\n✓ Processed data saved ({len(data_clean)} samples)"
            except Exception as e:
                log_error(f"Failed to save processed data: {e}")

            # ML Prediction
            predictor = StockPricePredictor()
            predictor.ticker = ticker
            predictor.company_name = company_name
            horizons = ['1_Day', '5_Days', '21_Days']
            predictions = {}
            for h in horizons:
                pred = predictor.predict_future(data_clean, h)
                if pred:
                    h_name = {'1_Day': '1 Day', '5_Days': '1 Week', '21_Days': '1 Month'}[h]
                    predictions[h_name] = pred
            response_data['predictions'] = predictions
            response_data['metrics'] = predictor.training_metrics
            response_data['summary'] += f"\n✓ ML Predictions for {len(predictions)} horizons"

            # Summary stats
            feature_columns = [
                'Open', 'High', 'Low', 'Close', 'Volume',
                'MA7', 'MA21', 'MA50', 'MA200',
                'EMA12', 'EMA26', 'MACD', 'Signal_Line',
                'RSI', 'BB_Middle', 'BB_Upper', 'BB_Lower',
                'Volume_Ratio', 'Momentum', 'ROC', 'Volatility',
                'Daily_Return', 'Price_Range', 'Price_Change'
            ]
            response_data['num_samples'] = len(data_clean)
            response_data['num_features'] = len([col for col in feature_columns if col in data_clean.columns])

            # Viz (Matplotlib panels)
            panel_images = {}
            try:
                data_with_ind = calculate_technical_indicators(data_clean)
                print(f"Debug: data_with_ind shape after indicators: {data_with_ind.shape}")
                print(f"Debug: Columns with data: {list(data_with_ind.columns)}")

                # Panel 1: Price & MAs
                if 'Close' in data_with_ind.columns and len(data_with_ind) > 0:
                    fig1, ax1 = plt.subplots(1, 1, figsize=(12, 6))
                    ax1.plot(data_with_ind.index[-500:], data_with_ind['Close'].tail(500), label='Close', color='blue', alpha=0.7)
                    if 'MA_50' in data_with_ind.columns:
                        ax1.plot(data_with_ind.index[-500:], data_with_ind['MA_50'].tail(500), label='MA50', color='red', alpha=0.7)
                    if 'MA_200' in data_with_ind.columns:
                        ax1.plot(data_with_ind.index[-500:], data_with_ind['MA_200'].tail(500), label='MA200', color='green', alpha=0.7)
                    ax1.set_title(f"{ticker} - Stock Price & Moving Averages")
                    ax1.legend()
                    ax1.grid(True, alpha=0.3)
                    panel_images['price_ma'] = fig_to_base64(fig1)
                    print(f"Debug: price_ma base64 len: {len(panel_images['price_ma'])}")
                else:
                    print("Debug: Skipping price_ma - no Close data")

                # Panel 2: Volume
                if 'Volume' in data_with_ind.columns:
                    fig2, ax2 = plt.subplots(1, 1, figsize=(12, 6))
                    ax2.bar(data_with_ind.index[-100:], data_with_ind['Volume'].tail(100), label='Volume', color='purple', alpha=0.5)
                    if 'Volume_MA' in data_with_ind.columns:
                        ax2.plot(data_with_ind.index[-100:], data_with_ind['Volume_MA'].tail(100), label='Volume MA', color='red')
                    ax2.set_title("Volume")
                    ax2.legend()
                    ax2.grid(True, alpha=0.3)
                    panel_images['volume'] = fig_to_base64(fig2)
                    print(f"Debug: volume base64 len: {len(panel_images['volume'])}")
                else:
                    print("Debug: Skipping volume - no Volume data")

                # Panel 3: RSI
                if 'RSI' in data_with_ind.columns:
                    fig3, ax3 = plt.subplots(1, 1, figsize=(12, 6))
                    ax3.plot(data_with_ind.index[-500:], data_with_ind['RSI'].tail(500), label='RSI', color='orange')
                    ax3.axhline(70, color='red', linestyle='--', alpha=0.5)
                    ax3.axhline(30, color='green', linestyle='--', alpha=0.5)
                    ax3.set_title("RSI (Relative Strength Index)")
                    ax3.legend()
                    ax3.grid(True, alpha=0.3)
                    panel_images['rsi'] = fig_to_base64(fig3)
                    print(f"Debug: rsi base64 len: {len(panel_images['rsi'])}")
                else:
                    print("Debug: Skipping RSI - no RSI data")

                # Panel 4: MACD
                if all(col in data_with_ind.columns for col in ['MACD', 'MACD_Signal', 'MACD_Histogram']):
                    fig4, ax4 = plt.subplots(1, 1, figsize=(12, 6))
                    ax4.plot(data_with_ind.index[-500:], data_with_ind['MACD'].tail(500), label='MACD', color='blue')
                    ax4.plot(data_with_ind.index[-500:], data_with_ind['MACD_Signal'].tail(500), label='Signal', color='red')
                    ax4.bar(data_with_ind.index[-500:], data_with_ind['MACD_Histogram'].tail(500), label='Histogram', color='gray', alpha=0.3)
                    ax4.set_title("MACD")
                    ax4.legend()
                    ax4.grid(True, alpha=0.3)
                    panel_images['macd'] = fig_to_base64(fig4)
                    print(f"Debug: macd base64 len: {len(panel_images['macd'])}")
                else:
                    print("Debug: Skipping MACD - missing columns")

                # Panel 5: Predictions
                fig5, ax5 = plt.subplots(1, 1, figsize=(12, 6))
                current_price = data_with_ind['Close'].iloc[-1] if len(data_with_ind) > 0 else 0
                last_date = data_with_ind.index[-1] if len(data_with_ind) > 0 else pd.Timestamp.now()
                colors_dict = {'1 Day': 'orange', '1 Week': 'purple', '1 Month': 'red'}
                offsets_dict = {'1 Day': 1, '1 Week': 5, '1 Month': 21}
                ax5.plot(data_with_ind.index[-100:], data_with_ind['Close'].tail(100), label='Historical Close', color='blue')
                ax5.scatter(last_date, current_price, color='blue', s=200, zorder=5, marker='o', label='Current')
                for h_name, pred in predictions.items():
                    if h_name in offsets_dict:
                        future_date = last_date + timedelta(days=offsets_dict[h_name])
                        ax5.scatter(future_date, pred['predicted_price'], color=colors_dict.get(h_name, 'gray'), s=200, zorder=5, marker='*', label=f'{h_name} Pred')
                        ax5.plot([last_date, future_date], [current_price, pred['predicted_price']], color=colors_dict.get(h_name, 'gray'), linestyle='--', alpha=0.6)
                        ax5.annotate(f"${pred['predicted_price']:.2f}\n({pred['price_change_pct']:+.1f}%)",
                                     xy=(future_date, pred['predicted_price']), xytext=(10, 10), textcoords='offset points',
                                     bbox=dict(boxstyle='round,pad=0.5', fc=colors_dict.get(h_name, 'gray'), alpha=0.7),
                                     fontsize=9, fontweight='bold', color='white')
                ax5.set_title(f"{ticker} - Price Predictions")
                ax5.legend()
                ax5.grid(True, alpha=0.3)
                panel_images['predictions'] = fig_to_base64(fig5)
                print(f"Debug: predictions base64 len: {len(panel_images['predictions'])}")

            except Exception as e:
                log_error(f"Failed in Matplotlib panels: {e}")
                print(f"Panel error details: {e}")

            # Plotly
            try:
                plot_data = data_with_ind.reset_index()
                fig = go.Figure()
                fig.add_trace(go.Candlestick(
                    x=plot_data['Date'], open=plot_data['Open'], high=plot_data['High'],
                    low=plot_data['Low'], close=plot_data['Close'], name='Price'
                ))
                fig.add_trace(go.Scatter(x=plot_data['Date'], y=plot_data['MA_50'] if 'MA_50' in plot_data else plot_data['Close'], name='MA50', line=dict(color='red', width=1)))
                fig.add_trace(go.Scatter(x=plot_data['Date'], y=plot_data['MA_200'] if 'MA_200' in plot_data else plot_data['Close'], name='MA200', line=dict(color='green', width=1)))
                # Add predictions
                current_price = plot_data['Close'].iloc[-1]
                last_date = plot_data['Date'].iloc[-1]
                colors_dict = {'1 Day': 'orange', '1 Week': 'purple', '1 Month': 'red'}
                offsets_dict = {'1 Day': 1, '1 Week': 5, '1 Month': 21}
                for h_name, pred in predictions.items():
                    if h_name in offsets_dict:
                        future_date = last_date + timedelta(days=offsets_dict[h_name])
                        fig.add_trace(go.Scatter(
                            x=[future_date], y=[pred['predicted_price']], mode='markers+text',
                            name=f'{h_name} Pred', marker=dict(size=15, symbol='star', color=colors_dict.get(h_name, 'gray')),
                            text=[f"${pred['predicted_price']:.2f}"], textposition="top center"
                        ))
                fig.update_layout(
                    title=f"{ticker} - {company_name} Stock Price with Predictions",
                    xaxis_rangeslider_visible=False, height=600
                )
                response_data['plotly_div'] = plot(fig, include_plotlyjs=False, output_type='div')
                print(f"Debug: Plotly div generated, length: {len(response_data['plotly_div'])}")
            except Exception as e:
                log_error(f"Failed in Plotly: {e}")
                print(f"Plotly error: {e}")

            # Save model/metadata (try-except)
            try:
                model_path = os.path.join(MODEL_DIR, f"{ticker}_predictor.pkl")
                joblib.dump(predictor, model_path)
                metadata = {
                    'ticker': ticker, 'company_name': company_name,
                    'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'data_points': len(data_clean), 'predictions': predictions,
                    'metrics': predictor.training_metrics
                }
                joblib.dump(metadata, os.path.join(MODEL_DIR, f"{ticker}_metadata.pkl"))
                response_data['summary'] += "\n✓ Models & metadata saved"
            except Exception as e:
                log_error(f"Failed to save model: {e}")

            # Final summary
            response_data['summary'] = f"""
DATA PREPARATION & ML PREDICTION COMPLETE FOR {ticker}
{'='*60}
✓ Raw data saved ({len(data)} days)
✓ {response_data['num_features']} features engineered
✓ {response_data['num_samples']} samples available
✓ Models trained/saved for 3 horizons
✓ Predictions: {len(predictions)} timeframes
            """

            return JsonResponse(response_data)

        except Exception as e:
            log_error(f"Overall error in analyze_stock: {e}", e)
            return HttpResponse(f"Internal error: {str(e)}. Check server logs.", status=500)

    return HttpResponse("Method not allowed.", status=405)