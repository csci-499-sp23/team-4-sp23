import React, { useState } from 'react'
import { db, auth } from '../firebase-config.js'
import firebase from 'firebase'

function SendMessage({ scroll }) {
    const [msg, setMsg] = useState('')


async function sendMessage(e) {
    e.preventDefault()
    const { uid, image } = auth.currentUser

    await db.collection('message').add({
        text: msg,
        image,
        uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    setMsg('')
    scroll.current.scrollIntoView({ behavior: 'smooth' })
}
return (
    <div>
        <form onSubmit={sendMessage} >
            <div className="input-group" >
                <input className="form-control me-2" style={{ fontSize: '15px', fontWeight: '550' }} placeholder='Message...' type='text' value={msg} onChange={e => setMsg(e.target.value)} />
                <button className='btn btn-primary' type='submit' style={{ fontSize: '15px', fontWeight: '550', maxWidth: '220px' }}>Send</button>
            </div>
        </form>
    </div>
)   

}

export default SendMessage;