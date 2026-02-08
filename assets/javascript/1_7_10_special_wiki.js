function showPageFromHash() {
    const hash = window.location.hash.substring(1); // remove the #
    const pages = document.querySelectorAll('.wiki-page');

    // Hide all pages
    pages.forEach(page => page.style.display = 'none');

    // If hash matches a page ID, show it
    if (hash && document.getElementById(hash)) {
        document.getElementById(hash).style.display = 'block';
    } else {
        // Default page when no hash is present
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