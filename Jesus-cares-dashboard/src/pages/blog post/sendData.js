import axios from 'axios';
const url = 'http://localhost:4000/blog_post';

const sendData = async (data)=>{
    const response = await axios.post(url, data);
    return response;
}

export default sendData;