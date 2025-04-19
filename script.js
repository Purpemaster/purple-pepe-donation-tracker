const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";

function log(msg) {
  const el = document.getElementById("debug-log");
  if (el) el.textContent += msg + "\n";
}

async function fetchWalletData() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/balances?api-key=${heliusApiKey}`);
    const data = await res.json();

    const sol = (data.nativeBalance || 0) / 1_000_000_000;
    log(`SOL (native): ${sol}`);

    const tokens = data.tokens || [];
    if (tokens.length === 0) {
      log("Keine Tokens gefunden.");
      return;
    }

    log("\n--- Tokens im Wallet ---\n");

    for (const token of tokens) {
      const mint = token.mint || "Unbekannt";
      const tokenAmount = token.tokenAmount || {};
      const decimals = tokenAmount.decimals || 6;
      const uiAmount = tokenAmount.uiAmount ?? (tokenAmount.amount / Math.pow(10, decimals));
      const name = token?.tokenInfo?.name || "Kein Name";
      const symbol = token?.tokenInfo?.symbol || "???";

      log(`Token: ${name}`);
      log(`Symbol: ${symbol}`);
      log(`Mint: ${mint}`);
      log(`Menge: ${uiAmount}`);
      log("-----------------------\n");
    }
  } catch (err) {
    log("Fehler beim Abrufen der Wallet-Daten: " + err.message);
  }
}

fetchWalletData();
