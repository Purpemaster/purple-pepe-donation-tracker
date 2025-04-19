const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const fixedPyusdPrice = 0.9997;

function debugLog(message) {
  const el = document.getElementById("debug-output");
  if (el) {
    el.textContent += message + "\n";
  }
}

async function fetchPyusdOnly() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();
    const tokens = data.tokens || [];

    let pyusdUSD = 0;

    for (const token of tokens) {
      const mint = (token.mint || "").trim().toLowerCase();
      const decimals = token.decimals || 6;
      const amount = token.amount / Math.pow(10, decimals);

      debugLog(`Token: ${mint} | Amount: ${amount}`);

      if (mint === pyusdMint.toLowerCase()) {
        pyusdUSD = amount * fixedPyusdPrice;
        debugLog("PYUSD gefunden! Wert: $" + pyusdUSD.toFixed(2));
      }
    }

    // Ausgabe ins HTML
    const breakdownEl = document.getElementById("token-breakdown");
    if (breakdownEl) {
      breakdownEl.innerHTML = `• PYUSD: $${pyusdUSD.toFixed(2)}`;
    }

  } catch (err) {
    debugLog("Fehler bei PYUSD-Check: " + err);
  }
}

fetchPyusdOnly();
setInterval(fetchPyusdOnly, 60000);
