import React from 'react';
import { Link } from 'react-router-dom';
import {BiVideoPlus, BiBookContent} from 'react-icons/all'

const Home = ()=>{
    return(
        <div className="home">
            <div className="wrap">
                <Link to='/video_upload'>
                    <BiVideoPlus size='100%' color='white'/>
                </Link>
                <Link style={{
                    backgroundColor:'white'
                }} to='blog_post'>
                    <BiBookContent color='purple' size='100%'/>
                </Link>
            </div>
        </div>
    )
}
export default Home;