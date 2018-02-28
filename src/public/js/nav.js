( () => {

    let menulist = document.querySelectorAll(".menu-item");
    let submenulist = document.querySelectorAll(".sub-side-menu");

    for (let i = 0; i < menulist.length; i++) {
        menulist[i].addEventListener("click", function () {
            if (window.getComputedStyle(submenulist[i], 'style').display==='none') {
                submenulist[i].setAttribute('style', 'display:block');
            } else {
                submenulist[i].setAttribute('style', 'display:none');
            }
        });
    }

    let icon = document.querySelector('#search-icon');
    let bar = document.querySelector('#corner-search');

    icon.addEventListener("click", function () {
        if (window.getComputedStyle(bar, 'style').display==='none') {
            bar.setAttribute('style', 'display:inline');
        } else {
            bar.setAttribute('style', 'display:none');
        }
    });
})();