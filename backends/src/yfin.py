import yfinance as yf
import requests, json
import datetime
import numpy as np

class yfin:
    def __init__(self, ticker):
        self.ticker = ticker

    def get_yfinance(self):
        res = yf.Ticker(self.ticker)
        his1m = res.history(period='1m')
        his_arr = his1m.to_numpy()
        info = res.info
        return { 'current': his_arr[0][3], 'last': info['previousClose'] }
