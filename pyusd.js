const pyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const fixedPyusdPrice = 1.00;
const walletAddress = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const heliusApiKey = "2e046356-0f0c-4880-93cc-6d5467e81c73";
const goalUSD = 20000;

async function fetchPyusdAmount() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/token-accounts?api-key=${heliusApiKey}`);
    const data = await res.json();
    let pyusdAmount = 0;

    for (const token of data) {
      const mint = token?.mint?.trim().toLowerCase();
      const decimals = token?.tokenAmount?.decimals || 6;
      const rawAmount = parseFloat(token?.tokenAmount?.amount || "0");
      const amount = rawAmount / Math.pow(10, decimals);

      if (mint === pyusdMint.toLowerCase()) {
        pyusdAmount = amount;
        break;
      }
    }

    const pyusdUSD = pyusdAmount * fixedPyusdPrice;

    const breakdownEl = document.getElementById("token-breakdown");
    if (breakdownEl) {
      const pyusdLine = `• PYUSD: $${pyusdUSD.toFixed(2)}<br>`;
      if (!breakdownEl.innerHTML.includes("PYUSD")) {
        breakdownEl.innerHTML += pyusdLine;
      } else {
        breakdownEl.innerHTML = breakdownEl.innerHTML.replace(/• PYUSD:.*?<br>/, pyusdLine);
      }
    }

    const totalEl = document.getElementById("raised-amount");
    if (totalEl) {
      const currentText = totalEl.textContent || "$0.00";
      const currentValue = parseFloat(currentText.replace("$", "")) || 0;
      const newTotal = currentValue + pyusdUSD;
      totalEl.textContent = `$${newTotal.toFixed(2)}`;

      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        const percent = Math.min((newTotal / goalUSD) * 100, 100);
        progressBar.style.width = `${percent}%`;
      }
    }

  } catch (err) {
    console.error("Fehler beim Abrufen von PYUSD über Token-Accounts:", err);
  }
}

fetchPyusdAmount();
setInterval(fetchPyusdAmount, 60000);
