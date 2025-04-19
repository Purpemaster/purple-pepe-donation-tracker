const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

// RICHTIGE PYUSD Mint-Adresse
const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const fixedPyusdPrice = 0.9997;

function debugLog(message) {
  const el = document.getElementById("debug-output");
  if (el) {
    el.textContent += message + "\n";
  }
}

function clearDebug() {
  const el = document.getElementById("debug-output");
  if (el) {
    el.textContent = "";
  }
}

async function fetchPyusdWithDebug() {
  clearDebug();

  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();

    const tokens = data.tokens || [];
    let pyusdUSD = 0;

    debugLog(`--- Tokens im Wallet (${tokens.length}) ---`);

    for (const token of tokens) {
      const mint = (token.mint || "").trim();
      const decimals = token.decimals || 6;
      const amount = token.amount / Math.pow(10, decimals);

      debugLog(`Mint: ${mint}`);
      debugLog(`→ Amount: ${amount} | Decimals: ${decimals}`);

      if (mint === pyusdMint) {
        pyusdUSD = amount * fixedPyusdPrice;
        debugLog(`✓ PYUSD erkannt! USD: $${pyusdUSD.toFixed(2)}\n`);
        break;
      }
    }

    if (pyusdUSD === 0) {
      debugLog("⚠️ Kein gültiger PYUSD gefunden (Mint nicht gematcht)");
    }

    document.getElementById("raised-amount").textContent = `$${pyusdUSD.toFixed(2)}`;
    document.getElementById("token-breakdown").innerHTML = `• PYUSD: $${pyusdUSD.toFixed(2)}`;

  } catch (err) {
    debugLog("Fehler beim Abruf: " + err);
  }
}

fetchPyusdWithDebug();
setInterval(fetchPyusdWithDebug, 60000);
