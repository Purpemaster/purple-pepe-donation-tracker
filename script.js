
document.addEventListener('click', function () {
  const audio = document.getElementById('hypeMusic');
  if (audio.paused) {
    audio.play().catch(e => console.log(e));
  }
}, { once: true });

const fill = document.getElementById('progressFill');
const text = document.getElementById('amountText');

const current = 12000;
const goal = 20000;
const percent = (current / goal) * 100;
fill.style.width = percent + "%";
text.textContent = `$${current.toLocaleString()} / $${goal.toLocaleString()}`;
