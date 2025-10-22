# stocks/views.py (API version)

import os
import json
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import yfinance as yf
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# ... (keep your STOCK_DATABASE or load from CSV as before)

def load_stock_list():
    csv_path = os.path.join(settings.BASE_DIR, 'stock', 'nasdaq-listed-symbols.csv')
    try:
        return pd.read_csv(csv_path)
    except:
        return pd.DataFrame()

def engineer_features(data):
    # ... (same as your feature engineering function)
    df = data.copy()
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)

    df['MA7'] = df['Close'].rolling(7).mean()
    df['MA21'] = df['Close'].rolling(21).mean()
    df['MA50'] = df['Close'].rolling(50).mean()
    df['MA200'] = df['Close'].rolling(200).mean()

    df['EMA12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['EMA26'] = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = df['EMA12'] - df['EMA26']
    df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()

    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))

    bb_mid = df['Close'].rolling(20).mean()
    bb_std = df['Close'].rolling(20).std()
    df['BB_Middle'] = bb_mid
    df['BB_Upper'] = bb_mid + 2 * bb_std
    df['BB_Lower'] = bb_mid - 2 * bb_std

    df['Volume_MA'] = df['Volume'].rolling(20).mean()
    df['Volume_Ratio'] = df['Volume'] / df['Volume_MA']
    df['Momentum'] = df['Close'] - df['Close'].shift(10)
    df['ROC'] = ((df['Close'] - df['Close'].shift(10)) / df['Close'].shift(10)) * 100
    df['Volatility'] = df['Close'].rolling(20).std()
    df['Daily_Return'] = df['Close'].pct_change()
    df['Price_Range'] = df['High'] - df['Low']
    df['Price_Change'] = df['Close'] - df['Open']
    df['Target'] = df['Close'].shift(-1)

    return df.dropna()

def create_panel_image(axes_func, data, title):
    """Generate base64 image for a panel"""
    fig, ax = plt.subplots(figsize=(8, 5))
    axes_func(ax, data)
    ax.set_title(title)
    ax.grid(True, alpha=0.3)
    
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    plt.close(fig)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{img_base64}"

def plot_price_ma(ax, data):
    ax.plot(data.index, data['Close'], label='Close', color='blue', alpha=0.7)
    ax.plot(data.index, data['MA50'], label='MA50', color='red', alpha=0.7)
    ax.plot(data.index, data['MA200'], label='MA200', color='green', alpha=0.7)
    ax.legend()

def plot_volume(ax, data):
    ax.bar(data.index, data['Volume'], color='purple', alpha=0.5)
    ax.plot(data.index, data['Volume_MA'], color='red')
    ax.set_yscale('log')

def plot_rsi(ax, data):
    ax.plot(data.index, data['RSI'], color='orange')
    ax.axhline(70, color='red', linestyle='--', alpha=0.5)
    ax.axhline(30, color='green', linestyle='--', alpha=0.5)
    ax.set_ylim(0, 100)

def plot_macd(ax, data):
    ax.plot(data.index, data['MACD'], color='blue', label='MACD')
    ax.plot(data.index, data['Signal_Line'], color='red', label='Signal')
    ax.bar(data.index, data['MACD'] - data['Signal_Line'], color='gray', alpha=0.3)
    ax.legend()

@require_http_methods(["GET"])
def analyze_stock_api(request, ticker):
    try:
        ticker = ticker.upper().strip()
        if not ticker:
            return JsonResponse({'error': 'Ticker is required'}, status=400)

        # Load stock list and validate
        stock_df = load_stock_list()
        if stock_df.empty:
            return JsonResponse({'error': 'Stock list not available'}, status=500)

        matches = stock_df[stock_df['Symbol'] == ticker]
        if matches.empty:
            matches = stock_df[
                stock_df['Company Name'].str.contains(ticker, case=False, na=False) |
                stock_df['Symbol'].str.contains(ticker, case=False, na=False)
            ]
            if matches.empty:
                return JsonResponse({'error': f'No stock found for "{ticker}"'}, status=404)

        ticker = matches.iloc[0]['Symbol']
        company_name = matches.iloc[0]['Company Name']

        # Download data
        data = yf.download(ticker, period='15y', auto_adjust=True)
        if data.empty:
            return JsonResponse({'error': 'No market data available'}, status=404)

        # Engineer features
        df = engineer_features(data)
        if len(df) < 100:
            return JsonResponse({'error': 'Insufficient data for analysis'}, status=400)

        # Train model
        feature_cols = [
            'Open', 'High', 'Low', 'Close', 'Volume',
            'MA7', 'MA21', 'MA50', 'MA200',
            'EMA12', 'EMA26', 'MACD', 'Signal_Line',
            'RSI', 'BB_Middle', 'BB_Upper', 'BB_Lower',
            'Volume_Ratio', 'Momentum', 'ROC', 'Volatility',
            'Daily_Return', 'Price_Range', 'Price_Change'
        ]

        X = df[feature_cols]
        y = df['Target']
        split = int(len(X) * 0.85)
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
        model.fit(X_train_scaled, y_train)

        # Predict next day
        last_X = X.iloc[[-1]]
        last_X_scaled = scaler.transform(last_X)
        predicted_price = model.predict(last_X_scaled)[0]
        current_price = df['Close'].iloc[-1]

        # Generate Plotly chart (as HTML string)
        import plotly.graph_objects as go
        from plotly.offline import plot
        fig = go.Figure(data=[go.Candlestick(
            x=df.index,
            open=df['Open'],
            high=df['High'],
            low=df['Low'],
            close=df['Close']
        )])
        fig.add_trace(go.Scatter(x=df.index, y=df['MA50'], name='MA50'))
        fig.add_trace(go.Scatter(x=df.index, y=df['MA200'], name='MA200'))
        future_date = df.index[-1] + pd.Timedelta(days=1)
        fig.add_trace(go.Scatter(
            x=[future_date],
            y=[predicted_price],
            mode='markers+text',
            name='1-Day Prediction',
            marker=dict(size=12, color='orange'),
            text=[f"${predicted_price:.2f}"]
        ))
        fig.update_layout(title=f"{ticker} - AI Prediction", height=500)
        plotly_html = plot(fig, output_type='div', include_plotlyjs='cdn')

        # Generate panel images
        panel_images = {
            'price_ma': create_panel_image(plot_price_ma, df, 'Price & Moving Averages'),
            'volume': create_panel_image(plot_volume, df, 'Volume Analysis'),
            'rsi': create_panel_image(plot_rsi, df, 'RSI Indicator'),
            'macd': create_panel_image(plot_macd, df, 'MACD Indicator')
        }

        # Prepare predictions (multi-horizon if needed)
        predictions = {
            '1 Day': {
                'current_price': float(current_price),
                'predicted_price': float(predicted_price),
                'price_change': float(predicted_price - current_price),
                'price_change_pct': float((predicted_price / current_price - 1) * 100)
            }
        }

        # Model metrics
        y_pred = model.predict(X_test_scaled)
        metrics = {
            'mae': float(mean_absolute_error(y_test, y_pred)),
            'rmse': float(np.sqrt(mean_squared_error(y_test, y_pred))),
            'r2_score': float(r2_score(y_test, y_pred))
        }

        # Summary
        change_pct = predictions['1 Day']['price_change_pct']
        if change_pct > 5:
            rec = "🚀 STRONG BUY"
        elif change_pct > 2:
            rec = "📈 BUY"
        elif change_pct > -2:
            rec = "⚖️ HOLD"
        elif change_pct > -5:
            rec = "📉 SELL"
        else:
            rec = "🔻 STRONG SELL"

        summary = f"AI predicts {ticker} will be {rec} with {change_pct:+.2f}% expected change."

        return JsonResponse({
            'ticker': ticker,
            'company_name': company_name,
            'current_price': float(current_price),
            'plotly_div': plotly_html,
            'panel_images': panel_images,
            'predictions': predictions,
            'metrics': metrics,
            'summary': summary,
            'message': 'Analysis completed successfully'
        })

    except Exception as e:
        return JsonResponse({
            'error': f'Internal error: {str(e)}',
            'message': 'Analysis failed'
        }, status=500)