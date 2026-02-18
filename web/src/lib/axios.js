import axios from 'axios';

const api = axios.create({
  baseURL: "https://talksy-ajfa.onrender.com/api",
  withCrendentials:true
})

export default api;