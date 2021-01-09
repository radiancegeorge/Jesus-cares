import Axios from 'axios';
import React, {useState} from 'react';
// import Cropper from 'cropperjs'
// import '../../App.css'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
const host = 'https://jesuscarescharity.com/'

const Projects = ()=>{
    const [content, setContent] = useState('')
    const [src, setSrc] = useState();
    const [aspectRatio, setAspectRatio] = useState({aspect: 16/9});
    const [success, setSuccess] = useState(false)
    const getImageSelection = e =>{
        let {x, y, width, height} = aspectRatio;
        const holder = document.querySelector('.holder');
        if(width === 0) width = holder.clientWidth;
        if(height === 0) height = holder.clientHeight;
        const img = document.createElement('img');
        img.src = src;
        img.onload = e =>{
            const image = e.target;
            // alert('loaded');
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0 ,0 , width, height);
            const data = new Promise((resolve, reject)=>{
                ctx.canvas.toBlob(e=>{
                    console.log(e)
                    resolve(e);
                })
            })
            
            data.then(result=>{
                // console.log(result)
                const formData = new FormData();
                formData.append('image', result, 'photo.jpg');
                formData.append('content', content)
                if(content.trim() !== ''){
                    Axios.post(host + 'projects_upload', formData).then(response=>{
                        //display success message
                        setSuccess(!success);
                        setTimeout(() => {
                            response.status === 200 && (window.location.href = '/');
                        }, 2000);
                    }).catch(err=>{
                        //display an err message;
                    })
                }else{
                    //input a text error
                }
            })
        
    }
    

    // console.log(height)

}
    return(
        <div className="projects">
            <div className="wrap">

                {/* <canvas className="placeholder"> */}
                    <div className="holder">
                        <ReactCrop src = {src} crop= {aspectRatio} onChange ={e=>{
                            setAspectRatio(e);
                            console.log(e)
                        }}/>
                    </div>
                    {src && <div className='caption'>
                        <p>Caption</p>
                        <textarea name="" id="" cols="30" rows="3" onChange={e=>{
                            setContent(e.target.value)
                        }}></textarea>
                        </div>}
                {/* </canvas> */}

                <div className="container">
                <form className="upload"> 
                    
                    <input type="file" accept= 'image/jpeg' name='image' style={{
                    display:'none'
                    }}
                    onChange={e=>{
                        const file = e.target.files[0];
                        const reader = new FileReader()
                        reader.readAsDataURL(file);
                        reader.onload = e=>{
                            const data = e.target.result;
                            setSrc(data)
                        }
                        
                        // console.log(fileReader)
                    }}
                    />
                    <span className='tap-to-upload' 
                    onClick={e=>{
                        e.target.parentElement.image.click()
                    }}
                    >Select Image</span>
                    {src && <span className='upload-cropped' onClick={e=>{
                        getImageSelection();
                    }}> Upload </span>}
                </form>
                </div>
                
            </div>
            {
                success && (
                    <div className="message">
                        <p className = {success && 'show-success'}>Posted</p>
                    </div>
                )
            }
        </div>
    )
}
export default Projects