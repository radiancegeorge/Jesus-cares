import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {GiHamburgerMenu} from 'react-icons/all'
import '../App.css';
import logo from '../logo.png'

const Header = ()=>{
    const [classes, setClasses] = useState(true);
    return (
        <header>
            <nav>
                <div className="hambugger" onClick={e=>{
                    const value = classes === true ? false : true;
                    setClasses(!classes);
                    console.log(value)
                }} > <GiHamburgerMenu  size= '30px'/></div>
                <div className="leftSection">
                    <img src= {logo} alt="" width='100%'/>
                </div>
                <div className= {classes ? 'rightSection out' : 'rightSection'} onClick={e=>{
                    if(e.target.classList.contains('out') === false){
                        setClasses(!classes)
                        console.log('clicked')
                    }
                }}>
                    <Link to='video_upload'>Video Upload</Link>
                    <Link to='blog_post'>Blog Post</Link>
                    <Link to='posts'>Posts</Link>
                </div>
            </nav>
        </header>
    )
}

export default Header