import React, {useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import '../../App.css';
import sendData from './sendData';
import compress from './compress';
// import { resume } from '../../../../Jesus-cares-server/routes/dashboard/db';


const Post = ()=>{
    const [content, setContent] = useState('');
    const [header, setHeader] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState();
    const [imageName, setImageName]= useState()

    return(
        <div className="post">
            <form action="" onSubmit={e=>{
                e.preventDefault();
                
                if(content.trim() !== '' && header.trim() !== '' && author.trim() !== '' && image !== undefined){
                    
                    const data = new FormData();
                    data.append('content', content);
                    data.append('header', header);
                    data.append('author', author)
                    data.append('coverPhoto', image, 'photo.jpg')
                    sendData(data)
                    .then(response=>{
                        if(response.status === 200){
                            setContent('');
                            setHeader('');
                            setAuthor('');

                            setTimeout(() => {
                                window.location.href = '/blog_post'
                            }, 3000);
                        }
                    })
                }
            }}>
                
                <input value ={header} type="text" name='header' className= 'header' placeholder='Your Heading...' onChange = {e=>{
                    setHeader(e.target.value)
                }}/>
                <Editor 
                    id= 'editor'
                    initialValue = {content}
                    
                apiKey = 'cyzxz48qlxcjtrlm33fqjx8ndfaxsiptkyr7f39owox4hu5h'
                init= {{
                    height: 300,
                    width: '100%',
                    menubar: false,
                    
                }}
                onChange={e=>{
                    setContent(e.target.getContent())
                }}
                onClick = {e=>{
                    console.log('clicked');
                    
                }}
                />
                <input type="file" accept = 'image/*' className="image" name='image' style={{
                    display:'none'
                }} onChange={e=>{
                    const file = e.target.files[0].name
                    const compressed = compress(e.target.files[0]);
                    compressed.then(result=>{
                        setImage(result);
                        setImageName(file)
                    })
                    
                    //compress image;

                }}/>
                
                <input value={author} type="text" placeholder='Author...' className='header' onChange={e=>{
                    setAuthor(e.target.value)
                }}/>
                <p className="imageName">{imageName !== undefined && imageName}</p>
                <span className="image" onClick={e=>{
                    e.target.parentElement.image.click()
                }}>Add Cover Photo</span>
                <button type= 'submit'>Post</button>
            </form>
            <img src={image !== undefined && image} alt=""/>
        </div>
    )
}

export default Post;