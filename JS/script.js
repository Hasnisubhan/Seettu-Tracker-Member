const API_BASE = "https://your-admin.vercel.app";
let plan, members, payments, currentRound = 0;

document.addEventListener("DOMContentLoaded", () => {
  const savedId = localStorage.getItem("viewerAdminId");
  if (savedId) {
    document.getElementById("tokenInput").value = savedId;
    loadData(savedId);
  }
});

document.getElementById("loadBtn").addEventListener("click", () => {
  const id = document.getElementById("tokenInput").value.trim();
  if (!id) {
    alert("Please enter an Admin ID!");
    return;
  }
  localStorage.setItem("viewerAdminId", id);
  loadData(id);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  localStorage.removeItem("viewerAdminId");
  document.getElementById("tokenInput").value = "";
  document.getElementById("tabContent").innerHTML = "<p>No data loaded.</p>";
  document.getElementById("planFrequency").textContent = "-";
  document.getElementById("planPeople").textContent = "-";
  document.getElementById("planAmount").textContent = "-";
  document.getElementById("currentDate").textContent = "-";
});

async function loadData(adminId) {
  try {
    const res = await fetch(`${API_BASE}/api/get?adminId=${adminId}`);
    const data = await res.json();

    if (data.error) {
      alert("❌ Admin ID not found.");
      return;
    }

    plan = data.plan;
    members = data.members;
    payments = data.payments || {};
    currentRound = getRoundForToday();

    showRound(currentRound);
    updateNavButtons();

    document.getElementById("planFrequency").textContent = plan.frequency;
    document.getElementById("planPeople").textContent = plan.peopleCount;
    document.getElementById("planAmount").textContent =
      plan.totalAmount.toLocaleString() + "/=";
  } catch (err) {
    alert("❌ Failed to load data");
    console.error(err);
  }
}

// keep your getRoundForToday(), showRound(), updateNavButtons() functions as before
