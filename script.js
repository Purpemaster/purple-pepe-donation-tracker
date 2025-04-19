const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";
const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const pyusdPrice = 0.9997; // Fixed USD price

function updateText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

async function fetchPYUSD() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();
    const tokens = data.tokens || [];

    let pyusdUSD = 0;

    for (const token of tokens) {
      const mint = (token.mint || "").trim();
      const decimals = token.decimals || 6;
      const amount = token.amount / Math.pow(10, decimals);

      if (mint === pyusdMint) {
        pyusdUSD = amount * pyusdPrice;
        break;
      }
    }

    updateText("raised-amount", `$${pyusdUSD.toFixed(2)}`);
    updateText("token-breakdown", `• PYUSD: $${pyusdUSD.toFixed(2)}`);
  } catch (err) {
    updateText("token-breakdown", "Error loading PYUSD");
  }
}

fetchPYUSD();
setInterval(fetchPYUSD, 60000);
