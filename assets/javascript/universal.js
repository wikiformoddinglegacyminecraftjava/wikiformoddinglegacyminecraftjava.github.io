// Footer date information
const SITE_LAST_UPDATED = "February 8, 2026";	// Update this manually before committing changes to github
document.addEventListener("DOMContentLoaded", () => {
	const el = document.getElementById("site-last-updated");
	if (!el) return;
	
	el.textContent = SITE_LAST_UPDATED;
});