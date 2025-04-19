const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

// Correct PYUSD Mint Address
const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const pyusdPrice = 0.9997; // Fixed price in USD

function logDebug(message) {
  const el = document.getElementById("debug-output");
  if (el) el.textContent += message + "\n";
}

function clearDebug() {
  const el = document.getElementById("debug-output");
  if (el) el.textContent = "";
}

async function fetchPYUSD() {
  clearDebug();

  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();
    const tokens = data.tokens || [];

    let pyusdAmountUSD = 0;

    for (const token of tokens) {
      const mint = (token.mint || "").trim();
      const decimals = token.decimals || 6;
      const amount = token.amount / Math.pow(10, decimals);

      if (mint === pyusdMint) {
        pyusdAmountUSD = amount * pyusdPrice;
        break;
      }
    }

    document.getElementById("raised-amount").textContent = `$${pyusdAmountUSD.toFixed(2)}`;
    document.getElementById("token-breakdown").textContent = `• PYUSD: $${pyusdAmountUSD.toFixed(2)}`;
  } catch (err) {
    logDebug("Fetch error: " + err.message);
  }
}

fetchPYUSD();
setInterval(fetchPYUSD, 60000);
