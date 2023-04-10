import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import { auth } from '../../firebase-config';
import { useNavigate } from "react-router-dom";


const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthUser(user);
            }  else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        }
    }, []);

    const userSignOut = () => {
        signOut(auth);
        
        navigate("/Login")
    }
    return (
        <div>{ authUser ? <div><p> {authUser?.email} Signed In</p><button onClick={userSignOut}>Sign Out</button></div>: <p>Signed Out</p>}</div>
    );
}

export default AuthDetails;