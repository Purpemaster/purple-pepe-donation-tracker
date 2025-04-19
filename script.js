const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const fixedPyusdPrice = 0.9997;

async function fetchPyusd() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();

    const tokens = data.tokens || [];
    let pyusdUSD = 0;

    for (const token of tokens) {
      const mint = (token.mint || "").trim(); // Wichtig: Case-sensitive!
      if (mint === pyusdMint) {
        const decimals = token.decimals || 6;
        const amount = token.amount / Math.pow(10, decimals);
        pyusdUSD = amount * fixedPyusdPrice;
        break;
      }
    }

    document.getElementById("raised-amount").textContent = `$${pyusdUSD.toFixed(2)}`;
    document.getElementById("token-breakdown").innerHTML = `• PYUSD: $${pyusdUSD.toFixed(2)}`;

  } catch (err) {
    console.error("Fehler bei PYUSD-Abruf:", err);
  }
}

fetchPyusd();
setInterval(fetchPyusd, 60000);
