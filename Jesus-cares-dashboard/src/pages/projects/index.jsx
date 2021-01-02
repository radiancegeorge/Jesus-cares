import React, {useState} from 'react';
// import Cropper from 'cropperjs'
// import '../../App.css'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
const Projects = ()=>{
const [src, setSrc] = useState();
const [aspectRatio, setAspectRatio] = useState({aspect: 16/9});
const getImageSelection = e =>{
    let {x, y, width, height} = aspectRatio;
    const holder = document.querySelector('.holder');
    if(width === 0) width = holder.clientWidth;
    if(height === 0) height = holder.clientHeight;
    const img = document.createElement('img');
    img.src = src;
    img.onload = e =>{
        const image = e.target;
        alert('loaded');
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, x * scaleX, y * scaleY, width * scaleX, height * scaleY, 0 ,0 , width, height);
        const data = ctx.canvas.toDataURL('image/jpeg', 0.7);
        
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
                        <textarea name="" id="" cols="30" rows="3"></textarea>
                        </div>}
                {/* </canvas> */}

                <div className="container">
                <form className="upload">
                    
                    <input type="file" name='image' style={{
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
        </div>
    )
}
export default Projects