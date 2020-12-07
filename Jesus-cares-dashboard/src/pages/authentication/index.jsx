import Axios from 'axios';
import React, {useState} from 'react';
// import {Redirect} from 'react-router-dom';
const url = 'https://jesuscarescharity.com/auth'

const Auth = ()=>{
    // const [redirect, setRedierect] = useState();
    const [error, setError] = useState();
    return(
        <div className="auth">
            <form action="" onSubmit={e=>{
                e.preventDefault()
                //for now just add to sessionStorage
                Axios.post(url, {password: e.target.password.value})
                .then(response=>{
                    console.log(response)
                    if(response.status === 200){
                        sessionStorage.setItem('loggedIn', true);
                        window.location.href = '/';
                    }else{

                    }
                }).catch(err=>{
                    // console.log(err);
                    setError('Something went wrong!');
                    setTimeout(() => {
                        setError()
                    }, 3000);
                })
                
            }}>
                {error && <div className = 'error'>{error}</div>}
                <h1>Your Password</h1>
                <input type="password" className="password" name='password'/>
                <button type="submit">Sign In</button>
            </form>
            {/* {redirect} */}
        </div>
    )
}

export default Auth;