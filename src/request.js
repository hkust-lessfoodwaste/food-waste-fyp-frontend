import axios from "axios";

export const server = "https://food-waste-management-fyp.herokuapp.com/v0/";

export function get(url, params) {
  return axios
    .get(server + url, params && { params })
    .then(res => res.data)
    .catch(err => {
      alert(JSON.stringify(err.message));
      throw err;
    });
}