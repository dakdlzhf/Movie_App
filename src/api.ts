export const API_KEY = "f354ee7cde587f576652e7979db2f24a";
export const BASE_PATH = "https://api.themoviedb.org/3";


//interface 
export interface IListResults {
    id: number;
    poster_path: string;
    overview: string;
    title: string;
    release_date: string;
    vote_average: number;
  }
  export interface IGetListApi {
    dates: {
      maximum: string;
      minimum: string;
    };
    page: number;
    total_pages: number;
    total_results: number;
    results: IListResults[];
    id: number;
    poster_path: string;
    overview: string;
    title: string;
    release_date: string;
    vote_average: number;
  }
interface IResults{
    id:number;
    poster_path:string;
    overview:string;
    title:string;
    release_date:string;
    vote_average:number;
}
interface IvideoValue{
    key:string;
}
export interface IVideo{
    id:number;
    poster_path:string;
    backdrop_path:string;
    overview:string;
    title:string;
    release_date:string;
    vote_average:number;
    videos:{
        results:IvideoValue[];
    }
}
export interface IGetApi  {
    results:IResults[]
}

export function getPopularMovieFetch(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`)
    .then((res)=>res.json())
}
export function getTopMovieFetch(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&append_to_response=videos,images`)
    .then((res)=>res.json())
}

//https://image.tmdb.org/t/p/original/osyTJKFpP3HEHbFY5FzuZNEXo7q.jpg 이미지

//https://api.themoviedb.org/3/movie/lastest?api_key=f354ee7cde587f576652e7979db2f24a

//https://api.themoviedb.org/3/movie/157336/videos?api_key=f354ee7cde587f576652e7979db2f24a     id,results 만포함된 데이터

//https://api.themoviedb.org/3/movie/19404?api_key=f354ee7cde587f576652e7979db2f24a&append_to_response=videos,images

//https://youtube.com/embed/Rt2LHkSwdPQ  https://youtube.com/embed/ +해당 영화 키 비디오나옴
