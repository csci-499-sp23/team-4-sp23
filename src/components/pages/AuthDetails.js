import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import { auth } from '../../firebase-config';

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

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
    }
    return (
        <div>{ authUser ? <div><p>Signed In</p><button onClick={userSignOut}>Sign Out</button></div>: <p>Signed Out</p>}</div>
    );
}

export default AuthDetails;