import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
if(!apiUrl) {
  console.log("VITE_API_URL environment variable is not set");
  
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
})



export default api;