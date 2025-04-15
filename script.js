
// Dummy milestone logic
const progressBar = document.getElementById('progress-bar');
const donationText = document.getElementById('donation-amount');

let donation = 12000;
const goal = 20000;

if (donation >= 5000) {
    console.log("Milestone 5k reached!");
}
if (donation >= 10000) {
    console.log("Milestone 10k reached!");
}
if (donation >= 15000) {
    console.log("Milestone 15k reached!");
}
if (donation >= 20000) {
    console.log("Goal reached!");
}
