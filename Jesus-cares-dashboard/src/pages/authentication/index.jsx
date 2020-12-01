import Axios from 'axios';
import React from 'react';
import {Redirect} from 'react-router-dom';
const url = 'http://localhost:4000/auth'

const Auth = ()=>{
    // const [redirect, setRedierect] = useState()
    return(
        <div className="auth">
            <form action="" onSubmit={e=>{
                e.preventDefault()
                //for now just add to sessionStorage
                Axios.post(url, {password: e.target.password.value})
                .then(response=>{
                    if(response.status === 200){
                        sessionStorage.setItem('loggedIn', true);
                        window.location.href = '/';
                    }else{

                    }
                })
                
            }}>
                <h1>Your Password</h1>
                <input type="password" className="password" name='password'/>
                <button type="submit">Sign In</button>
            </form>
            {/* {redirect} */}
        </div>
    )
}

export default Auth;