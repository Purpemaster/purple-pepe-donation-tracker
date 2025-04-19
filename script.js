const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";

function log(msg) {
  const el = document.getElementById("debug-log");
  if (el) el.textContent += msg + "\n";
}

async function fetchSolscanTokens() {
  try {
    const res = await fetch(`https://public-api.solscan.io/account/tokens?account=${walletAddress}`, {
      headers: {
        accept: "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const tokens = await res.json();

    if (!tokens || tokens.length === 0) {
      log("Keine Tokens gefunden.");
      return;
    }

    log("--- Tokens über Solscan ---\n");

    for (const token of tokens) {
      const amount = token.tokenAmount?.uiAmount;
      const decimals = token.tokenAmount?.decimals || 0;
      const name = token.tokenName || "Kein Name";
      const symbol = token.tokenSymbol || "???";
      const mint = token.tokenAddress || "Unbekannt";

      log(`Token: ${name}`);
      log(`Symbol: ${symbol}`);
      log(`Mint: ${mint}`);
      log(`Menge: ${amount ?? "Unbekannt"} (${decimals} Dezimalstellen)`);
      log("-----------------------\n");
    }

  } catch (err) {
    log("Fehler bei Solscan-Abfrage: " + err.message);
  }
}

fetchSolscanTokens();
