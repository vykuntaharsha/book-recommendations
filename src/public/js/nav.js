document.querySelector('.menu-item').addEventListener("click", function () {
    if(document.querySelector('.sub-side-menu').getAttribute('style')=='display:none'){
        document.querySelector('.sub-side-menu').setAttribute('style', 'display:block');
    }else{
        document.querySelector('.sub-side-menu').setAttribute('style', 'display:none');
    }
});
document.querySelector('#search-icon').addEventListener("click", function () {
    if(document.querySelector('#corner-search').getAttribute('style')=='display:none'){
        document.querySelector('#corner-search').setAttribute('style', 'display:inline');
    }else{
        document.querySelector('#corner-search').setAttribute('style', 'display:none');
    }
});