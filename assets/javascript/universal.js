// Footer date information
const SITE_LAST_UPDATED = "February 12, 2026";	// Update this manually before committing changes to github
document.addEventListener("DOMContentLoaded", () => {
	const el = document.getElementById("site-last-updated");
	if (!el) return;
	
	el.textContent = SITE_LAST_UPDATED;
});


// I decided to move the below code to this file because every wiki page will be using this code.
// ---------- The code below is specifically for the wiki pages themselves
function showPageFromHash() {
    const hash = window.location.hash.substring(1); // remove '#'
    const pages = document.querySelectorAll('.wiki-page');

    // Hide all pages
    pages.forEach(page => page.style.display = 'none');

    // Detect search page
    if (hash.startsWith("search:")) {
        document.getElementById("search").style.display = "block";

        const query = decodeURIComponent(hash.split(":")[1] || "").toLowerCase();
        document.getElementById("local-search").value = query;

        // Trigger search rendering
        searchLocalWiki();
        return;
    }

    // Normal page
    if (hash && document.getElementById(hash)) {
        document.getElementById(hash).style.display = 'block';
    } else {
        document.getElementById('default').style.display = 'block';
    }
}
window.addEventListener('load', showPageFromHash);
window.addEventListener('hashchange', showPageFromHash);

// For highlighting the sidebar link that is clicked
function highlightActiveLink() {
    const hash = window.location.hash || '#default';
    const links = document.querySelectorAll('.wiki-side-navigation-bar a');

    links.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('different-sidebar-background-color');
        } else {
            link.classList.remove('different-sidebar-background-color');
        }
    });
}
window.addEventListener('load', () => {
    showPageFromHash();
    highlightActiveLink();
});
window.addEventListener('hashchange', () => {
    showPageFromHash();
    highlightActiveLink();
});


// For searching the wiki
/*
function searchWiki() {
    const query = document.getElementById('wiki-search').value.toLowerCase();
    const pages = document.querySelectorAll('.wiki-page');
    const links = document.querySelectorAll('.wiki-side-navigation-bar a');

    // If search is empty, restore normal behavior
    if (query.trim() === "") {
        highlightActiveLink();
        showPageFromHash();
        return;
    }

    let firstMatch = null;

    pages.forEach(page => {
        const text = page.textContent.toLowerCase();

        if (text.includes(query)) {
            if (!firstMatch) firstMatch = page.id;
        }
    });

    if (firstMatch) {
        // Jump to the first matching page
        window.location.hash = firstMatch;
    }
}
document.getElementById('wiki-search').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        searchWiki();
    }
});
document.getElementById('wiki-search-button').addEventListener('click', searchWiki);
*/







// GLOBAL SEARCH
function performGlobalSearch() {
    const query = document.getElementById("global-search")?.value.trim();
    if (!query) return;
    window.location.href = "/search/search.html?q=" + encodeURIComponent(query);
}

document.getElementById("global-search-button")?.addEventListener("click", performGlobalSearch);
document.getElementById("global-search")?.addEventListener("keydown", e => {
    if (e.key === "Enter") performGlobalSearch();
});


// LOCAL SEARCH (wiki SPA only)
function searchLocalWiki() {
    const query = document.getElementById("local-search").value.toLowerCase().trim();
    const resultsContainer = document.getElementById("local-search-results");

    if (!query) {
        window.location.hash = "#default";
        return;
    }

    // Update URL to include query
    window.location.hash = `#search:${encodeURIComponent(query)}`;

    const pages = document.querySelectorAll(".wiki-page");
    const matches = [];

    pages.forEach(page => {
        if (page.id !== "search") {
            if (page.textContent.toLowerCase().includes(query)) {
                matches.push({
                    id: page.id,
                    title: page.querySelector("h1, h2, h3")?.textContent || page.id,
                    snippet: page.textContent.substring(0, 200)
                });
            }
        }
    });

    if (matches.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    resultsContainer.innerHTML = matches.map(m => `
        <div class="local-result">
            <h3><a href="#${m.id}">${m.title}</a></h3>
            <p>${m.snippet}...</p>
        </div>
    `).join("");
}



document.getElementById("local-search-button")?.addEventListener("click", searchLocalWiki);
document.getElementById("local-search")?.addEventListener("keydown", e => {
    if (e.key === "Enter") searchLocalWiki();
});
// ---------- The code above is specifically for the wiki pages themselves
