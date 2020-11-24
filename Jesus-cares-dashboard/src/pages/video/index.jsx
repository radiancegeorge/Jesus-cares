import React, {useState} from 'react';
import {ImUpload2,ImPlay} from 'react-icons/all';
import {Editor} from '@tinymce/tinymce-react';
// import axios from 'axios';
import Axios from 'axios';
import Loader from '../../components/Loader';
const url = 'http://localhost:4000/video_upload'

const Video = ()=>{
    const [upload , setUpload] = useState();
    const [progress, setProgress] = useState();
    const [header, setHeader] = useState();
    const [content, setContent] = useState();
    const [doc, setDoc] = useState();
    const [stage, setStage] = useState()


    const uploadData = ()=>{
        setStage(Loader)


        const data = new FormData();
        data.append('video', upload[0]);
        data.append('header', header);
        data.append('content', content);
        data.append('document', doc);


        Axios.post(url, data , {
            onUploadProgress: e =>{
                const {loaded, total} = e;
                const percentage = Math.floor((loaded * 100) / total);
                const percentageForProgress = percentage /100;
                console.log(percentageForProgress)
                setProgress({percentageForProgress, loaded});
            }
        })
        .then(response=>{
            if(response.status === 200){
                //display message and reload page;
                const complete = <div className="complete" 
                style ={{
                    textAlign:'center',
                    width:'100%',
                    fontSize: '20px',
                    margin:'1rem 0',
                    color: 'green',
                    fontWeight: '600'
                    
                }}
                >Done!!</div>
                setStage(complete);
                setTimeout(()=>{
                    window.location.href = '/video_upload'
                }, 2000)
            }else{
                // display error
            }
        })
    }

    return(
        <div className = 'upload'>
            <form className="wrap" onSubmit={e=>{
                e.preventDefault();
                if(upload === undefined){
                    e.target.video.click()
                }else{
                    if(upload !== undefined && header !== undefined && content !== undefined){
                        uploadData(e)
                    }else{
                        //fix error
                    }
                }
            }}>
                {/* <h1>Upload A Video</h1> */}
                <input type="text" name='header' className='header' placeholder='Heading...' onChange={e=>{
                    setHeader(e.target.value)
                }}/>
                <input type="file" name="video" id="video" accept='video/*' onChange={e=>{
                    setUpload(e.target.files);
                    // console.log(e.target.files[0].name)
                }}/>
                <Editor
                    apiKey="cyzxz48qlxcjtrlm33fqjx8ndfaxsiptkyr7f39owox4hu5h"
                    init={{
                        plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen emoticons powerpaste tinycomments tinymcespellchecker link',
                        height: 300,
                        width: '100%',
                        menubar: false,
                        toolbar: 'a11ycheck emoticons heading link bold italic checklist code formatpainter pageembed permanentpen table',
                        toolbar_mode: 'floating',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                        block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3'
                    }}
                    onChange = {e=>{
                        setContent(e.target.getContent())
                    }}
                    />
                    <input type="file" name='doc' accept='application/pdf' style={{
                        display: 'none'
                    }} onChange={e=>{
                        setDoc(e.target.files[0])
                    }}/>
                    <p className='docName'>{doc !== undefined && doc.name}</p>
                    <span className="document" onClick={e=>{
                        e.target.parentElement.doc.click()
                    }}>Attatch A document</span>
                {stage}
                <button> <ImUpload2 color= 'white' /> <p>Upload Video</p> </button>
                {upload !== undefined ? (<div className='progress'><ImPlay size='60px' color='purple'/> <div className='right'><span>{upload[0].name}</span> <progress value = {progress !== undefined ? progress.percentageForProgress : 0}></progress></div> </div>) : undefined }
            </form>
        </div>
    )
}
export default Video