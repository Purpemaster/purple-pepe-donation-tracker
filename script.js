const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";
const goalUSD = 20000;

const purpeMint = "HBoNJ5v8g71s2boRivrHnfSB5MVPLDHHyVjruPfhGkvL";
const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";

const fallbackPurpePrice = 0.0000373;
const fixedPyusdPrice = 1.00;

function logToScreen(msg) {
  const el = document.getElementById("debug-log");
  if (el) {
    el.textContent += msg + "\n";
  }
}

async function fetchSolPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await res.json();
    return data.solana?.usd || 0;
  } catch (err) {
    logToScreen("Fehler bei SOL-Preis: " + err.message);
    return 0;
  }
}

async function fetchPurpePrice() {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${purpeMint}`);
    const data = await res.json();
    if (data.pairs && data.pairs.length > 0) {
      const priceUsd = parseFloat(data.pairs[0].priceUsd);
      return isNaN(priceUsd) ? fallbackPurpePrice : priceUsd;
    }
    return fallbackPurpePrice;
  } catch (err) {
    logToScreen("Fehler bei PURPE-Preis: " + err.message);
    return fallbackPurpePrice;
  }
}

async function fetchWalletBalance() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();

    const tokens = data.tokens || [];
    const lamports = data.nativeBalance || 0;
    const sol = lamports / 1_000_000_000;

    const solPrice = await fetchSolPrice();
    const purpePrice = await fetchPurpePrice();

    const solUSD = sol * solPrice;
    let purpeUSD = 0;
    let pyusdUSD = 0;

    for (const token of tokens) {
      const mint = token.mint?.trim().toLowerCase();
      const tokenAmount = token.tokenAmount;

      if (!mint || !tokenAmount) continue;

      const decimals = tokenAmount.decimals || 6;
      const amount = tokenAmount.uiAmount || (tokenAmount.amount / Math.pow(10, decimals));

      logToScreen("MINT: " + mint + " | AMOUNT: " + amount);

      if (mint === purpeMint.toLowerCase()) {
        logToScreen(">>> PURPE erkannt!");
        purpeUSD = amount * purpePrice;
      }

      if (mint === pyusdMint.toLowerCase()) {
        logToScreen(">>> PYUSD erkannt!");
        pyusdUSD = amount * fixedPyusdPrice;
      }
    }

    const totalUSD = solUSD + purpeUSD + pyusdUSD;
    const percent = Math.min((totalUSD / goalUSD) * 100, 100);

    document.getElementById("raised-amount").textContent = `$${totalUSD.toFixed(2)}`;
    document.getElementById("progress-bar").style.width = `${percent}%`;

    const breakdownEl = document.getElementById("token-breakdown");
    if (breakdownEl) {
      breakdownEl.innerHTML = `
        • SOL: $${solUSD.toFixed(2)}<br>
        • PURPE: $${purpeUSD.toFixed(2)}<br>
        • PYUSD: $${pyusdUSD.toFixed(2)}
      `;
    }

  } catch (err) {
    logToScreen("Fehler beim Wallet-Check: " + err.message);
  }
}

fetchWalletBalance();
setInterval(fetchWalletBalance, 60000);
