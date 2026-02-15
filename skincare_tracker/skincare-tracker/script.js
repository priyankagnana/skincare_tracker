let data = JSON.parse(localStorage.getItem("skinData")) || [];
let streak = Number(localStorage.getItem("skinStreak")) || 0;

document.getElementById("streak").innerText = streak;
document.getElementById("days").innerText = data.length;

function saveDay() {
  const morning = document.querySelectorAll(".morning");
  const night = document.querySelectorAll(".night");

  let doneMorning = [...morning].filter((x) => x.checked).length;
  let doneNight = [...night].filter((x) => x.checked).length;

  const notes = document.getElementById("notes").value;
  const today = new Date().toISOString().slice(0, 10);

  const entry = {
    date: today,
    morning: doneMorning,
    night: doneNight,
    notes: notes,
  };

  data.push(entry);
  localStorage.setItem("skinData", JSON.stringify(data));

  if (doneMorning >= 3 && doneNight >= 2) {
    streak++;
    alert("Routine complete — glow maintained ✨");
  } else {
    alert("Routine incomplete — try again tonight 💧");
  }

  localStorage.setItem("skinStreak", streak);

  document.getElementById("streak").innerText = streak;
  document.getElementById("days").innerText = data.length;

  document.querySelectorAll("input").forEach((i) => (i.checked = false));
  document.getElementById("notes").value = "";
}
