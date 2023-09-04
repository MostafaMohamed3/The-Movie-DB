$(document).ready(function(){
    $(".loading").fadeOut(2000 , function(){
        $(".loading").remove();
        $("body").css("overflow-y" , "auto");
    });
});
// catch width of navMneu
let navWidth = $("#navMneu").innerWidth();
// close navbar
$("#navbar").animate({left:`-${navWidth}`} , 0);
// open/close navbar
$("#navToggle").click(function(){
    $("#navToggle i").toggleClass('fa-xmark');
    if($("#navbar").css("left") == '0px'){
        $("#navbar").animate({left:`-${navWidth}`} , 500);
        $("#navMneu ul li").animate({marginTop:'50px' , opacity:'0'} , 1000);
    }else{
        $("#navbar").animate({left:'0px'} , 500);
        $("#navMneu ul li").animate({marginTop:'0px' , opacity:'100%'} , 1000);
    };
});

let theMovieArray = [];
let myHttp = new XMLHttpRequest();
// change category of movies
$('.nav-menu-header ul li a').click(function(e){
    let TypeOfMovie = $(e.target).attr('id');
    if (TypeOfMovie != "") {
        if (TypeOfMovie == "trending") {
            myHttp.open('GET' , `https://api.themoviedb.org/3/trending/movie/week?api_key=16542d9f1f371134892646df5c5d7bbf`);
            myHttp.send();
        }else{
            myHttp.open('GET' , `https://api.themoviedb.org/3/movie/${TypeOfMovie}?api_key=16542d9f1f371134892646df5c5d7bbf`);
            myHttp.send();
        };
    };
});
// search for movies
document.getElementById('searchMovie').addEventListener('input' , function(){
    let keyword = document.getElementById('searchMovie');
    myHttp.open('GET' , `https://api.themoviedb.org/3/search/movie?api_key=16542d9f1f371134892646df5c5d7bbf&query=${keyword.value}`);
    myHttp.send();
});
myHttp.open('GET' , `https://api.themoviedb.org/3/movie/now_playing?api_key=16542d9f1f371134892646df5c5d7bbf`);
myHttp.send();
// if response is ready , show data
myHttp.addEventListener('readystatechange' , function(){
    if(myHttp.readyState == 4 && myHttp.status == 200){
        let movieContainer = document.getElementById('movieContainer');
        theMovieArray = JSON.parse(myHttp.response).results;
        displayMovies(theMovieArray , movieContainer);
    };
});
// search for the movies showed
function searchMovies(searchTerm){
    let currantMovieContainer = document.getElementById('currantMovieContainer');
    let currantMovieArray = [];
    let line = document.querySelector('.h-line');
    if(searchTerm == ""){
        line.classList.add("d-none");
        currantMovieContainer.innerHTML = "";
        currantMovieArray = [];
    }else{
        for (let i = 0; i < theMovieArray.length; i++){
            if(theMovieArray[i].title.toLowerCase().includes(searchTerm.toLowerCase())){
                currantMovieArray.push(theMovieArray[i]);
            };
        };
        if(currantMovieArray.length != 0){
            displayMovies(currantMovieArray , currantMovieContainer);
            line.classList.remove("d-none");
            currantMovieArray = [];
        }else{
            line.classList.add("d-none");
            currantMovieContainer.innerHTML = "";
        };
    };
};
// show movies
function displayMovies(arrayOfMovie , containerOfMovie) {
    let container = ``;
    for (let i = 0; i < arrayOfMovie.length; i++) {
        if(arrayOfMovie[i].title != "" && arrayOfMovie[i].overview != "" && arrayOfMovie[i].poster_path != null){
            container += `<div class="col-lg-4 col-md-6">
            <div class="moviePoster position-relative overflow-hidden">
                <div class="movieDesc position-absolute top-100 start-0 end-0 bg-light bg-opacity-75 rounded-3 text-center p-5">
                    <h3>${arrayOfMovie[i].title}</h3>
                    <p>${arrayOfMovie[i].overview}</p>
                    <p>Rate: ${arrayOfMovie[i].vote_average}</p>
                    <p>${arrayOfMovie[i].release_date}</p>
                </div><!-- /movieDesc -->
                <img class="w-100 rounded-3" src="https://image.tmdb.org/t/p/w500${arrayOfMovie[i].poster_path}" alt="">
            </div><!-- /moviePoster -->
        </div>`;
        };
    };
    containerOfMovie.innerHTML = container;
};