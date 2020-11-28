import React, {useState, useEffect} from 'react';
import {BiTrash, BsTrash2} from 'react-icons/all';
import axios from 'axios';
const url = 'http://localhost:4000/get_recent'
const Posts = ()=>{
    const trashType = {
        first:<BiTrash />,
        second:<BsTrash2 color='purple' />
    }
    const [trash, setTrash] = useState(trashType.first)
    const [data, setData] = useState();
    const [activeDelete, setActiveDelete] = useState();
    const [uploadsActiveDelete, setUploadsActiveDelete] = useState();
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
                                    setUploadsActiveDelete()
                                }}>{trash}</span> <div className="verify" style={{
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
                                    setActiveDelete()
                                }}>{trash}</span><div className="verify" style={{
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
                </ul>
            </div>
        </div>
    )
}

export default Posts