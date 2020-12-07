import axios from 'axios';
const url = 'https://jesuscarescharity.com/blog_post';

const sendData = async (data)=>{
    const response = await axios.post(url, data);
    return response;
}

export default sendData;