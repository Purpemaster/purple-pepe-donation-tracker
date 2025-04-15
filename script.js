
document.addEventListener('click', function () {
    const audio = document.getElementById('hypeMusic');
    if (audio.paused) {
        audio.play().catch(e => console.log(e));
    }
}, { once: true });
