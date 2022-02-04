export const API_KEY = "f354ee7cde587f576652e7979db2f24a";
export const BASE_PATH = "https://api.themoviedb.org/3";


//interface 

interface IResults{
    id:number;
    poster_path:string;
    overview:string;
    title:string;
    release_date:string;
    vote_average:number;


}
export interface IGetApi  {
    results:IResults[]
}

export function getPopularMovieFetch(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&append_to_response=videos,images`)
    .then((res)=>res.json())
}
export function getTopMovieFetch(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&append_to_response=videos,images`)
    .then((res)=>res.json())
}

//https://image.tmdb.org/t/p/original/cVn8E3Fxbi8HzYYtaSfsblYC4gl.jpg 이미지

//https://api.themoviedb.org/3/movie/lastest?api_key=f354ee7cde587f576652e7979db2f24a

//https://api.themoviedb.org/3/movie/157336/videos?api_key=f354ee7cde587f576652e7979db2f24a     id,results 만포함된 데이터

//https://api.themoviedb.org/3/movie/popular?api_key=f354ee7cde587f576652e7979db2f24a&append_to_response=videos,images

//https://youtube.com/embed/Rt2LHkSwdPQ  https://youtube.com/embed/ +해당 영화 키 비디오나옴
