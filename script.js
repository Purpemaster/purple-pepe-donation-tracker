const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

// Zwei bekannte PYUSD-Mints (du hattest beide im Wallet-Verlauf)
const pyusdMints = [
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
  "CxUvRAxLanvp587AQVpFanK6tzXS9RRUVK6gkqo3pump"
];

const fixedPyusdPrice = 0.9997;

function debugLog(message) {
  const el = document.getElementById("debug-output");
  if (el) {
    el.textContent += message + "\n";
  }
}

async function fetchPYUSDValue() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();

    const tokens = data.tokens || [];
    debugLog("Tokens im Wallet:\n" + JSON.stringify(tokens, null, 2));

    let pyusdUSD = 0;

    for (const token of tokens) {
      const mint = (token.mint || "").trim().toLowerCase();
      const decimals = token.decimals || 6;
      const amount = token.amount / Math.pow(10, decimals);

      debugLog(`Gefunden: ${mint} | Amount: ${amount} | Decimals: ${decimals}`);

      if (pyusdMints.map(m => m.toLowerCase()).includes(mint)) {
        pyusdUSD = amount * fixedPyusdPrice;
        debugLog("→ PYUSD erkannt! USD-Wert: $" + pyusdUSD.toFixed(2));
        break;
      }
    }

    // Anzeige ins HTML
    const breakdownEl = document.getElementById("token-breakdown");
    if (breakdownEl) {
      breakdownEl.innerHTML = `• PYUSD: $${pyusdUSD.toFixed(2)}`;
    }

  } catch (err) {
    debugLog("Fehler bei PYUSD-Erkennung: " + err);
  }
}

fetchPYUSDValue();
setInterval(fetchPYUSDValue, 60000);
