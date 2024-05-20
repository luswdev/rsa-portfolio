import yfinance as yf
import requests, json
import datetime
import numpy as np

class yfin:
    def __init__(self, ticker):
        self.ticker = ticker

    def get_yfinance(self):
        res = yf.Ticker(self.ticker)
        return res.info
