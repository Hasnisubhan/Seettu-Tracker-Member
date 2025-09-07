const API_BASE = "https://seettu-tracker-admin.vercel.app";
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
    alert("⚠️ Please enter an Admin ID!");
    return;
  }
  localStorage.setItem("viewerAdminId", id);
  loadData(id);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  localStorage.removeItem("viewerAdminId");
  document.getElementById("tokenInput").value = "";
  resetDisplay();
});

async function loadData(adminId) {
  const tabContent = document.getElementById("tabContent");
  tabContent.innerHTML = "<p>⏳ Loading data...</p>";

  try {
    const res = await fetch(`${API_BASE}/api/get?adminId=${adminId}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      tabContent.innerHTML = "<p>❌ Admin ID not found.</p>";
      return;
    }

    plan = data.plan;
    members = data.members;
    payments = data.payments || {};
    currentRound = getRoundForToday();

    showRound(currentRound);
    updateNavButtons();

    document.getElementById("planFrequency").textContent = plan.frequency || "-";
    document.getElementById("planPeople").textContent = plan.peopleCount || "-";
    document.getElementById("planAmount").textContent =
      plan.totalAmount ? plan.totalAmount.toLocaleString() + "/=" : "-";
  } catch (err) {
    console.error("Load failed:", err);
    tabContent.innerHTML = "<p>❌ Failed to load data. Please try again.</p>";
  }
}

function resetDisplay() {
  document.getElementById("tabContent").innerHTML = "<p>No data loaded.</p>";
  document.getElementById("planFrequency").textContent = "-";
  document.getElementById("planPeople").textContent = "-";
  document.getElementById("planAmount").textContent = "-";
  document.getElementById("currentDate").textContent = "-";
}

// keep your existing functions: getRoundForToday(), showRound(), updateNavButtons()
