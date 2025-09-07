const API_BASE = "https://seettu-api.vercel.app";

document.addEventListener("DOMContentLoaded", async () => {
  const listElement = document.getElementById("adminList");

  try {
    const res = await fetch(`${API_BASE}/api/get?list=all`);
    const data = await res.json();

    if (!data || data.length === 0) {
      listElement.innerHTML = "<p>No Seettu accounts found.</p>";
      return;
    }

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
    listElement.innerHTML = "<p>❌ Failed to load list.</p>";
  }
});
