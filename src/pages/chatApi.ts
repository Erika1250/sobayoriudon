import axios from "axios";

export const getRandomArticle = () => {
    return axios.get("https://ja.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=random&grnnamespace=0&prop=info&inprop=url&indexpageids");
};

export const getRandomDog = () => {
    return axios.get("https://dog.ceo/api/breeds/image/random");
}

export const getRandomCat = () => {
    return axios.get("https://api.thecatapi.com/v1/images/search?api_key=live_jzhQPOY0wQxwboDEfeUqFzcyX6vo1xbKXyawfipOwklPpSOweWokuAn2VIF9WKMO");
}