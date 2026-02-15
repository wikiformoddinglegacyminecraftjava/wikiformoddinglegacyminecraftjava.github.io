// Footer date information
const SITE_LAST_UPDATED = "February 14, 2026";	// Update this manually before committing changes to github
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
function decodeEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

function normalizeText(text) {
    return text
        .replace(/\s+/g, " ")   // collapse all whitespace
        .trim();                // remove leading/trailing whitespace
}

function searchLocalWiki() {
    const queryInput = document.getElementById("local-search");
    const resultsContainer = document.getElementById("local-search-results");
    const query = queryInput.value.trim();
    const queryLower = query.toLowerCase();

    if (!query) {
        window.location.hash = "#default";
        return;
    }

    // Update URL
    window.location.hash = `#search:${encodeURIComponent(query)}`;

    // Update title
    const titleEl = document.querySelector("#search h1");
    if (titleEl) {
        titleEl.textContent = `Search Results for "${query}"`;
    }

    const pages = document.querySelectorAll(".wiki-page");
    const results = [];

    pages.forEach(page => {
        if (page.id === "search") return; // skip search page itself

        const html = page.innerHTML;

		// Fixes a few bugs such as:
		// - Searching for < or > returns no results while searching for &lt; or &gt; returns < or >
		// - The "..." string would not always show up correctly in snippets of text in search results.
		// Strip tags
		let originalText = html.replace(/<[^>]*>/g, " ");
		// Decode HTML entities (&lt; → <)
		originalText = decodeEntities(originalText);
		// Normalize whitespace
		originalText = normalizeText(originalText);
		
        const lowerText = originalText.toLowerCase();

        if (!lowerText.includes(queryLower)) return;

        const snippets = extractAllLocalSnippets(originalText, queryLower);

        results.push({
            id: page.id,
            title: page.querySelector("h1, h2, h3")?.textContent || page.id,
            snippets
        });
    });

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    resultsContainer.innerHTML = results.map(r => `
        <div class="local-result">
            <h3><a href="#${r.id}">${r.title}</a></h3>
            ${r.snippets.map(s => `<p>${s}</p>`).join("")}
        </div>
    `).join("");
}


// Extract ALL snippets
function extractAllLocalSnippets(originalText, queryLower) {
    const lowerText = originalText.toLowerCase();
    const snippets = [];
    let index = 0;

    while (true) {
        index = lowerText.indexOf(queryLower, index);
        if (index === -1) break;

        const start = Math.max(0, index - 75);
        const end = Math.min(originalText.length, index + queryLower.length + 75);

        let snippet = originalText.substring(start, end);

        // Highlight all occurrences
        const regex = new RegExp(queryLower, "gi");
        snippet = snippet.replace(regex, match => `<mark>${match}</mark>`);

        // Add leading ellipsis only if snippet is NOT at the start
        if (start > 0) snippet = "..." + snippet;

        // Add trailing ellipsis only if snippet is NOT at the end
        if (end < originalText.length) snippet = snippet + "...";

        snippets.push(snippet);

        index += queryLower.length;
    }

    return snippets;
}



document.getElementById("local-search-button")?.addEventListener("click", searchLocalWiki);
document.getElementById("local-search")?.addEventListener("keydown", e => {
    if (e.key === "Enter") searchLocalWiki();
});
// ---------- The code above is specifically for the wiki pages themselves
