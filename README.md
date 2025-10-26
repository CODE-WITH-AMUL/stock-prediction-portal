![Stock Analysis Banner](https://github.com/CODE-WITH-AMUL/stock-prediction-portal/blob/main/media/Img/Banner.png?raw=true)

# Stock Analysis Project

A powerful and data-driven **Stock Analysis Web Application** built to analyze, visualize, and predict stock market performance using **Python, Django, and Machine Learning**.

This project allows users to explore historical stock data, generate insights, and visualize trends — helping investors and analysts make informed decisions.

---

##  Key Features

-  **Real-Time Stock Data Fetching** – Fetch live data directly from Yahoo Finance or CSV files  
-  **Interactive Visualizations** – View stock price trends, moving averages, and performance graphs  
-  **Machine Learning Predictions** – Predict future stock prices using trained regression models  
-  **Data Management System** – Clean, merge, and preprocess data efficiently  
-  **Model Training & Export** – Train models and save them as `.pkl` files for reuse  
-  **Multi-Stock Support** – Analyze multiple stocks and compare trends  
-  **User-Friendly Interface** – Simple dashboard with intuitive design  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | Python, Django |
| **Data Handling** | Pandas, NumPy |
| **Machine Learning** | Scikit-learn (Linear Regression, etc.) |
| **Data Source** | Yahoo Finance (`yfinance`) |
| **Visualization** | Matplotlib, Plotly |
| **Storage** | SQLite / CSV Files |
| **Model Management** | Joblib |

---

##  Installation

```bash
# Clone this repository
git clone https://github.com/CODE-WITH-AMUL/stock-prediction-portal.git

# Navigate into the project folder
cd stock-prediction-portal

# Create a virtual environment
python -m venv venv
venv\Scripts\activate      # On Windows
source venv/bin/activate   # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run Django server
python manage.py runserver
```

## ML Model Pridcution 
Below is a visual representation of how the Machine Learning Model processes and predicts stock data:

![ML Model Workflow](https://github.com/CODE-WITH-AMUL/stock-prediction-portal/media/img/image.png)

