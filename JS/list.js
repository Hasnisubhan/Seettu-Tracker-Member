document.addEventListener("DOMContentLoaded", async () => {
  const gistId = "1bec72536e04b329e842a128a2d6fc23"; // your gist ID
  const listElement = document.getElementById("adminList");

  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`);
    const gist = await res.json();

    const files = Object.keys(gist.files);

    // Show only admin JSON files (ignore others like README, etc.)
    const adminFiles = files.filter(f => f.endsWith(".json"));

    if (adminFiles.length === 0) {
      listElement.innerHTML = "<p>No Seettu accounts found.</p>";
      return;
    }

    adminFiles.forEach(file => {
      const adminId = file.replace(".json", "");
      const li = document.createElement("li");
      li.textContent = adminId;
      li.className = "admin-item";

      li.addEventListener("click", () => {
        localStorage.setItem("viewerAdminId", adminId); // save selected ID
        window.location.href = "index.html"; // go back to viewer page
      });

      listElement.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch gist:", err);
    listElement.innerHTML = "<p>❌ Failed to load list.</p>";
  }
});

