let slideIndex=0;
showSlides();
addListenersToSearchBar();
const user = {};

getUser();
function getUser() {
    fetch('users',{
        method : 'POST'
    })
    .then(res => res.json())
    .then(data => data.user)
    .then(fetchedUser => {
        console.log();
        user.id = fetchedUser.id;
        notifyUser();
    })
    .catch(error => console.log('error while fetching user: ' + error));

}

function notifyUser() {
    const welcomeNote = document.querySelector('.user-welcome');
    welcomeNote.innerHTML = `welcome user ${user.id}`;
    setTimeout(()=>{
        welcomeNote.parentNode.removeChild(welcomeNote);
    }, 2000);

}

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 2000);
}

function addListenersToSearchBar() {

    document.querySelector('.search-input').addEventListener( 'keypress', checkKeyAndPerformSearch);
    document.querySelector('.search-form >button').addEventListener('click', searchByKeywords);
}

function checkKeyAndPerformSearch( event ) {
    if(event.keyCode === 13 ){
        searchByKeywords();
    }
}

function searchByKeywords(){
    let keywords = document.querySelector('.search-input').value;
    document.getElementById('booklist').scrollIntoView();

    if(keywords){
        keywords = keywords.replace(/\s/g, '+');
        performGetRequest(`api/books/search?q[keywords]=${keywords}`);
    }
}
