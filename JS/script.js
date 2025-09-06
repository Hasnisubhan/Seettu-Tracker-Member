let plan, members, payments, currentRound = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill saved ID if exists
  const savedId = localStorage.getItem("viewerAdminId");
  if (savedId) {
    document.getElementById("tokenInput").value = savedId;
    loadData(savedId); // auto-load last ID's data
  }
});

// --- Load Button ---
document.getElementById("loadBtn").addEventListener("click", () => {
  const id = document.getElementById("tokenInput").value.trim();
  if (!id) {
    alert("Please enter an Admin ID!");
    return;
  }
  localStorage.setItem("viewerAdminId", id); // remember last used ID
  loadData(id);
});

// --- Clear Button ---
document.getElementById("clearBtn").addEventListener("click", () => {
  localStorage.removeItem("viewerAdminId"); // clear saved ID
  document.getElementById("tokenInput").value = ""; // clear input box
  document.getElementById("tabContent").innerHTML = "<p>No data loaded.</p>"; // reset content
  document.getElementById("planFrequency").textContent = "-";
  document.getElementById("planPeople").textContent = "-";
  document.getElementById("planAmount").textContent = "-";
  document.getElementById("currentDate").textContent = "-";
});

async function loadData(adminId) {
  const gistId = "c71c02db07cf009893bd4e81066627db"; // your gist ID
  const filename = `${adminId}.json`; // each admin has their own file

  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`);
    const gist = await res.json();

    if (!gist.files[filename]) {
      alert("❌ Admin ID not found in data.");
      return;
    }

    const data = JSON.parse(gist.files[filename].content);
    plan = data.plan;
    members = data.members;
    payments = data.payments || {};
    currentRound = getRoundForToday();

    showRound(currentRound);
    updateNavButtons();

    // Fill header info
    document.getElementById("planFrequency").textContent = plan.frequency;
    document.getElementById("planPeople").textContent = plan.peopleCount;
    document.getElementById("planAmount").textContent =
      plan.totalAmount.toLocaleString() + "/=";
  } catch (err) {
    alert("❌ Failed to load data");
    console.error(err);
  }
}

function getRoundForToday() {
  const startDate = new Date(plan.startDate);
  const today = new Date();

  for (let round = 0; round < plan.peopleCount; round++) {
    const roundDate = new Date(startDate);

    if (plan.frequency === "Daily") roundDate.setDate(startDate.getDate() + round);
    if (plan.frequency === "Weekly") roundDate.setDate(startDate.getDate() + (7 * round));
    if (plan.frequency === "Monthly") roundDate.setMonth(startDate.getMonth() + round);

    if (today < roundDate) return Math.max(0, round - 1);

    if (
      today.getFullYear() === roundDate.getFullYear() &&
      today.getMonth() === roundDate.getMonth() &&
      today.getDate() === roundDate.getDate()
    ) return round;
  }
  return plan.peopleCount - 1;
}

function showRound(round) {
  const startDate = new Date(plan.startDate);
  const tabContent = document.getElementById("tabContent");

  const roundDate = new Date(startDate);
  if (plan.frequency === "Daily") roundDate.setDate(startDate.getDate() + round);
  if (plan.frequency === "Weekly") roundDate.setDate(startDate.getDate() + (7 * round));
  if (plan.frequency === "Monthly") roundDate.setMonth(startDate.getMonth() + round);

  const dateStr = roundDate.toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric"
  });

  document.getElementById("currentDate").textContent = dateStr;

  const member = members[round];
  if (!member) {
    tabContent.innerHTML = "<p>No member for this round.</p>";
    return;
  }

  const paidMembers = payments[round] || [];
  const paidCount = paidMembers.length;
  const total = members.length;
  const contribution = plan.contribution;
  const remainingAmount = plan.totalAmount - paidCount * contribution;
  const progressPercent = Math.round((paidCount / total) * 100);

  tabContent.innerHTML = `
    <div class="receiver-card">
      <div class="round-badge">${round + 1}</div>
      <h3>${member.name}</h3>
      <p>Remaining: ${remainingAmount.toLocaleString()} / ${plan.totalAmount.toLocaleString()}</p>
      <p>Paid: ${paidCount}/${total}</p>
      <div class="progress-bar"><span style="width:${progressPercent}%"></span></div>
    </div>
    <div id="payList"></div>
  `;

  const payList = document.getElementById('payList');
  members.forEach((m) => {
    const paid = paidMembers.includes(m.number);
    const payerRow = document.createElement('div');
    payerRow.className = `payer-row ${paid ? "paid" : "unpaid"}`;
    payerRow.innerHTML = `
      <span>${m.name}</span>
      <span>${plan.contribution.toLocaleString()}/=</span>
      <i class="${paid ? 'fa-solid fa-square-check' : 'fa-regular fa-square'}"></i>
    `;
    payList.appendChild(payerRow);
  });
}

function updateNavButtons() {
  const prevBtn = document.getElementById("prevRound");
  const nextBtn = document.getElementById("nextRound");

  prevBtn.disabled = currentRound === 0;
  nextBtn.disabled = currentRound === plan.peopleCount - 1;

  prevBtn.onclick = () => {
    if (currentRound > 0) {
      currentRound--;
      showRound(currentRound);
      updateNavButtons();
    }
  };

  nextBtn.onclick = () => {
    if (currentRound < plan.peopleCount - 1) {
      currentRound++;
      showRound(currentRound);
      updateNavButtons();
    }
  };
}

