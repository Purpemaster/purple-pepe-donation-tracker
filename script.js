const WALLET_ADDRESS = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";
const GOAL_USD = 20000;

async function fetchDonationAmount() {
  try {
    const response = await fetch(`https://api.shyft.to/sol/v1/wallet/balance?network=mainnet-beta&wallet=${WALLET_ADDRESS}`, {
      headers: {
        "x-api-key": "QapPC-x-OPrgQC0r",
        "accept": "application/json"
      }
    });

    const data = await response.json();
    const balances = data.result.balance;

    let totalUSD = 0;
    for (let token of balances) {
      if (["USDC", "SOL", "PYUSD", "PURPE"].includes(token.token_symbol)) {
        totalUSD += parseFloat(token.amount) * (parseFloat(token.price_usd) || 0);
      }
    }

    updateProgress(totalUSD);
  } catch (err) {
    console.error("Fehler beim Laden der Wallet-Daten:", err);
  }
}

function updateProgress(amountUSD) {
  const percent = Math.min((amountUSD / GOAL_USD) * 100, 100);
  document.getElementById("progressFill").style.width = `${percent}%`;
  document.getElementById("amountText").innerText = `$${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} / $${GOAL_USD}`;
}

document.addEventListener("DOMContentLoaded", fetchDonationAmount);
function updateProgress(amountUSD) {
  const percent = Math.min((amountUSD / GOAL_USD) * 100, 100);
  document.getElementById("progressFill").style.width = `${percent}%`;
  document.getElementById("amountText").innerText = `$${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} / $${GOAL_USD}`;

  const message = document.getElementById("milestoneMessage");

  if (amountUSD >= 20000) {
    message.innerText = "LEGENDARY! $20K GOAL SMASHED!";
  } else if (amountUSD >= 15000) {
    message.innerText = "Purple Pepe is flying to the stars!";
  } else if (amountUSD >= 10000) {
    message.innerText = "10K reached! Moon mission engaged!";
  } else if (amountUSD >= 5000) {
    message.innerText = "Over $5K! Purple Power rising!";
  } else {
    message.innerText = "";
  }
}
