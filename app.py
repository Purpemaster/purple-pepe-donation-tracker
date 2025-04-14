from flask import Flask, jsonify
import requests
import os

app = Flask(__name__)

SHYFT_API_KEY = os.getenv("SHYFT_API_KEY")
WALLET_ADDRESS = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn"

# CoinGecko IDs
TOKEN_IDS = {
    "SOL": "solana",
    "USDC": "usd-coin",
    "PURPLEPEPE": "purple-pepe"  # Name laut CoinGecko prüfen!
}

def get_prices():
    url = "https://api.coingecko.com/api/v3/simple/price"
    ids = ",".join(TOKEN_IDS.values())
    params = {"ids": ids, "vs_currencies": "usd"}
    res = requests.get(url, params=params)
    data = res.json()
    return {
        "SOL": data.get(TOKEN_IDS["SOL"], {}).get("usd", 0),
        "USDC": data.get(TOKEN_IDS["USDC"], {}).get("usd", 1),
        "PURPLEPEPE": data.get(TOKEN_IDS["PURPLEPEPE"], {}).get("usd", 0)
    }

@app.route("/")
def home():
    return jsonify({"status": "Purple Pepe Donation Tracker is live!"})

@app.route("/donation")
def get_donation():
    # 1. Token-Balances abrufen
    url = f"https://api.shyft.to/sol/v1/wallet/balance?network=mainnet-beta&wallet={WALLET_ADDRESS}"
    headers = {
        "accept": "application/json",
        "x-api-key": SHYFT_API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    balances = data.get("result", {}).get("balance", [])

    # 2. Token-Mengen extrahieren
    usdc = float(next((b for b in balances if b["token_symbol"] == "USDC"), {"amount": "0"})["amount"])
    sol = float(next((b for b in balances if b["token_symbol"] == "SOL"), {"amount": "0"})["amount"])
    pepe = float(next((b for b in balances if b["token_symbol"].upper() == "PURPLEPEPE"), {"amount": "0"})["amount"])

    # 3. Echtzeitpreise holen
    prices = get_prices()

    # 4. USD-Wert berechnen
    total_usd = round(
        usdc * prices["USDC"] +
        sol * prices["SOL"] +
        pepe * prices["PURPLEPEPE"],
        2
    )

    return jsonify({
        "wallet": WALLET_ADDRESS,
        "donation_total_usd": total_usd,
        "prices": prices
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
