const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";
const goalUSD = 20000;

const purpeMint = "HBoNJ5v8g71s2boRivrHnfSB5MVPLDHHyVjruPfhGkvL";

const fallbackPurpePrice = 0.0000373;

async function fetchSolPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await res.json();
    return data.solana?.usd || 0;
  } catch (err) {
    console.error("Fehler bei SOL-Preisabfrage:", err);
    return 0;
  }
}

async function fetchPurpePrice() {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana/" + purpeMint);
    const data = await res.json();
    if (data.pairs && data.pairs.length > 0) {
      const priceUsd = parseFloat(data.pairs[0].priceUsd);
      return isNaN(priceUsd) ? fallbackPurpePrice : priceUsd;
    }
    return fallbackPurpePrice;
  } catch (err) {
    console.error("Fehler bei PURPE-Preisabfrage:", err);
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

    for (const token of tokens) {
      const mint = token.mint?.trim().toLowerCase();
      const decimals = token.decimals || 6;
      const rawAmount = parseFloat(token.amount) || 0;
      const amount = rawAmount / Math.pow(10, decimals);

      if (mint === purpeMint.toLowerCase()) {
        purpeUSD = amount * purpePrice;
      }
    }

    const totalUSD = solUSD + purpeUSD; // PYUSD wird separat durch pyusd.js behandelt
    const percent = Math.min((totalUSD / goalUSD) * 100, 100);

    document.getElementById("raised-amount").textContent = `$${totalUSD.toFixed(2)}`;
    document.getElementById("progress-bar").style.width = `${percent}%`;

    const breakdownEl = document.getElementById("token-breakdown");
    if (breakdownEl) {
      breakdownEl.innerHTML = `
        • SOL: $${solUSD.toFixed(2)}<br>
        • PURPE: $${purpeUSD.toFixed(2)}<br>
        • PYUSD: $0.00<br> <!-- Platzhalter, wird von pyusd.js überschrieben -->
      `;
    }

  } catch (err) {
    console.error("Fehler beim Wallet-Abgleich:", err);
  }
}

fetchWalletBalance();
setInterval(fetchWalletBalance, 60000);
