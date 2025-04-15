
document.addEventListener("DOMContentLoaded", async () => {
  const donationText = document.getElementById("donation-text");
  const progressBar = document.getElementById("progress-bar");
  const response = await fetch("https://purple-pepe-donation-tracker.onrender.com/donation");
  const data = await response.json();

  const current = Math.min(data.donation_total_usd, 20000);
  const percentage = (current / 20000) * 100;

  donationText.innerText = `$${current.toLocaleString()} / $20,000`;
  progressBar.style.width = percentage + "%";
});
