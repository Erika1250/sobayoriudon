import axios from "axios";

export const getRandomArticle = () => {
    return axios.get("https://ja.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=random&grnnamespace=0&prop=info&inprop=url&indexpageids");
};