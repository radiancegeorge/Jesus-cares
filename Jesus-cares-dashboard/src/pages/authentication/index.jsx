import React, { useState } from 'react';
import {Redirect} from 'react-router-dom';

const Auth = ()=>{
    const [redirect, setRedierect] = useState()
    return(
        <div className="auth">
            <form action="" onSubmit={e=>{
                e.preventDefault()
                //for now just add to sessionStorage

                sessionStorage.setItem('loggedIn', true);
                window.location.href = '/'
            }}>
                <h1>Your Password</h1>
                <input type="password" className="password" name='password'/>
                <button type="submit">Sign In</button>
            </form>
            {redirect}
        </div>
    )
}

export default Auth;