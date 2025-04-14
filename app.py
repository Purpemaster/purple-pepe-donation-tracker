from flask import Flask, jsonify
import requests
import os

app = Flask(__name__)

SHYFT_API_KEY = os.getenv("SHYFT_API_KEY")
WALLET_ADDRESS = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn"

@app.route("/")
def home():
    return jsonify({"status": "Purple Pepe Donation Tracker is live!"})

@app.route("/donation")
def get_donation():
    url = f"https://api.shyft.to/sol/v1/wallet/balance?network=mainnet-beta&wallet={WALLET_ADDRESS}"
    headers = {
        "accept": "application/json",
        "x-api-key": SHYFT_API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    balances = data.get("result", {}).get("balance", [])
    usdc = next((b for b in balances if b["token_symbol"] == "USDC"), None)
    
    return jsonify({
        "wallet": WALLET_ADDRESS,
        "usdc_balance": usdc["amount"] if usdc else "0"
    })
