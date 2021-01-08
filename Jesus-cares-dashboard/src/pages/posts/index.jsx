import React, {useState, useEffect} from 'react';
import {BiTrash, BsTrash2, BiPencil} from 'react-icons/all';
import axios from 'axios';
import {Redirect} from 'react-router-dom'
const url = 'http://localhost:4000/get_recent';
const editUrl = 'https://jesuscarescharity.com/edit'
const Posts = ()=>{
    const trashType = {
        first:<BiTrash />,
        second:<BsTrash2 color='purple' />
    }
    const [trash, setTrash] = useState(trashType.first)
    const [data, setData] = useState();
    const [activeDelete, setActiveDelete] = useState();
    const [redirect, setRedirect] = useState()
    const [uploadsActiveDelete, setUploadsActiveDelete] = useState();
    const [projectsDelete, setProjectsDelete] = useState();
    
    useEffect(()=>{
      axios.get(url)
      .then(response=>{
          
          setData(response.data);
         
      })  
    }, [data])

    const deletePost = (data)=>{
        axios.post(url, data)
        .then(response=>{
            if(response.status === 200){
                console.log('deleted')
                setData()
            }
        })
    }
    const retrieve = data =>{
        axios.post(editUrl, data)
        .then(response =>{
            sessionStorage.setItem('edit', JSON.stringify(response.data));
            // console.log(response.data);
            setRedirect(<Redirect to='/edit' />)
        })
    }
    console.log(data)
    return(
        <div className='posts'>
            <div className="wrap">
                <ul>
                <h4 style={{
                        margin: '1rem 0'
                    }}>Blog Posts</h4>
                    {
                        data === undefined ? undefined : (
                            data[0].length === 0 ? <p className="empty">Nothing to display</p> : data[0].map(item=>(
                                <li key= {item.id}>{item.heading} <span className='trash' onClick={e=>{
                                    setActiveDelete(Number(item.id));
                                    setUploadsActiveDelete();
                                    setProjectsDelete()
                                }}>{trash}</span> <span className="edit" style={{marginLeft: 10, marginTop:5}} onClick={e=>{
                                    retrieve({id: item.id, type: 'blog_post'})
                                }}><BiPencil size='20px' color='purple'/></span> <div className="verify" style={{
                                    marginRight: activeDelete === Number(item.id) ? 0 : -130
                                }}><span className="yes" onClick={e=>{
                                    deletePost({name:'blog_post', id: activeDelete})
                                }}>yes</span><span className="no"  style={{
                                    marginLeft: 50
                                }} onClick={e=>{
                                    setActiveDelete()
                                }}>no</span></div></li>
                            ))
                        )
                    }
                    <h4 style={{
                        margin: '1rem 0'
                    }}>Last Uploads</h4>
                    {
                        data === undefined ? undefined : (
                            data[1].length === 0 ? <p className="empty">Nothing to display</p> : data[1].map(item=>(
                                <li key= {item.id}>{item.heading} <span className='trash' onClick={e=>{
                                    setUploadsActiveDelete(Number(item.id));
                                    setActiveDelete();
                                    setProjectsDelete()
                                }}>{trash}</span><span className="edit" style={{marginLeft: 10, marginTop:5}} onClick={e=>{
                                    retrieve({id: item.id, type: 'video_upload'})
                                }}><BiPencil size='20px' color='purple'/></span> <div className="verify" style={{
                                    marginRight: uploadsActiveDelete === Number(item.id) ? 0 : -190
                                }}><span className="yes" onClick={e=>{
                                    deletePost({name: 'video_upload', id: uploadsActiveDelete})
                                }}>yes</span><span className="no" style={{
                                    marginLeft: 50
                                }} onClick={e=>{
                                    setUploadsActiveDelete()
                                }}> no</span></div></li>
                            ))
                        )
                    }
                    <h4 style={{
                        margin: '1rem 0'
                    }}>Last Projects</h4>
                    {
                        data === undefined ? undefined : (
                            data[2].length === 0 ? <p className="empty">Nothing to display</p> : data[2].map(item=>(
                                <li key= {item.id}>{item.content} <span className='trash' onClick={e=>{
                                    setUploadsActiveDelete();
                                    setActiveDelete();
                                    setProjectsDelete(Number(item.id))
                                }}>{trash}</span><div className="verify" style={{
                                    marginRight: projectsDelete === Number(item.id) ? 0 : -190
                                }}><span className="yes" onClick={e=>{
                                    deletePost({name: 'projects', id: projectsDelete})
                                }}>yes</span><span className="no" style={{
                                    marginLeft: 50
                                }} onClick={e=>{
                                    setProjectsDelete()
                                }}> no</span></div></li>
                            ))
                        )
                    }
                    
                </ul>
            </div>
            {redirect}
        </div>
    )
}

export default Posts