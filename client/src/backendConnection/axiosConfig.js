import axios from "axios";


const Backend_server = 'http://localhost:5000';


axios.defaults.baseURL = Backend_server;
export default axios