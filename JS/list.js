const API_BASE = "https://seettu-tracker-admin.vercel.app";

document.addEventListener("DOMContentLoaded", async () => {
  const listElement = document.getElementById("adminList");
  listElement.innerHTML = "<p>⏳ Loading accounts...</p>";

  try {
    const res = await fetch(`${API_BASE}/api/get?list=all`);
    const data = await res.json();

    if (!res.ok || !Array.isArray(data) || data.length === 0) {
      listElement.innerHTML = "<p>⚠️ No Seettu accounts found.</p>";
      return;
    }

    listElement.innerHTML = ""; // clear loading message

    data.forEach(adminId => {
      const li = document.createElement("li");
      li.textContent = adminId;
      li.className = "admin-item";

      li.addEventListener("click", () => {
        localStorage.setItem("viewerAdminId", adminId);
        window.location.href = "index.html";
      });

      listElement.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch list:", err);
    listElement.innerHTML = "<p>❌ Failed to load list. Please try again.</p>";
  }
});
