const donationWallet = "9uo3TB4a8synap9VMNpby6nzmnMs9xJWmgo2YKJHZWVn";

// Placeholder for now – you can later connect real data via API
let donationAmount = 12000;
let goalAmount = 20000;

function updateProgressBar() {
  const percent = Math.min((donationAmount / goalAmount) * 100, 100);
  const progressFill = document.getElementById("progressFill");
  const amountText = document.getElementById("amountText");

  progressFill.style.width = `${percent}%`;
  amountText.innerText = `$${donationAmount.toLocaleString()} / $${goalAmount.toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", updateProgressBar);
