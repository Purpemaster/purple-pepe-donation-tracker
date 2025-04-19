const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const pyusdPriceUSD = 0.9997;
const goalUSD = 20000;

function debug(message) {
  const el = document.getElementById("debug-output");
  if (el) el.textContent += message + "\n";
}

function clearDebug() {
  const el = document.getElementById("debug-output");
  if (el) el.textContent = "";
}

async function fetchBalance() {
  clearDebug();

  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();
    const tokens = data.tokens || [];

    let pyusdUSD = 0;

    for (const token of tokens) {
      const mint = token.mint?.trim() || "";
      const decimals = token.decimals || 6;
      const amount = token.amount / Math.pow(10, decimals);

      debug(`Mint: ${mint}`);
      debug(`→ Amount: ${amount} | Decimals: ${decimals}`);

      if (mint.toLowerCase() === pyusdMint.toLowerCase()) {
        pyusdUSD = amount * pyusdPriceUSD;
        debug(`✓ PYUSD erkannt: $${pyusdUSD.toFixed(2)}`);
      }
    }

    if (pyusdUSD === 0) {
      debug("⚠️ Kein gültiger PYUSD gefunden");
    }

    // UI aktualisieren
    document.getElementById("raised-amount").textContent = `$${pyusdUSD.toFixed(2)}`;
    document.getElementById("token-breakdown").innerHTML = `• PYUSD: $${pyusdUSD.toFixed(2)}`;

    const percent = Math.min((pyusdUSD / goalUSD) * 100, 100);
    document.getElementById("progress-bar").style.width = `${percent}%`;

  } catch (err) {
    debug("Fehler beim Abruf: " + err);
  }
}

fetchBalance();
setInterval(fetchBalance, 60000);
