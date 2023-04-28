import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from './firebase-config.js';
import SendMessage from './SendMessage.js';

function Chat() {
  const scroll = useRef();
  const [messages, setMessages] = useState([]);
  const [showMessage,setShowMessage] = useState(false);
  const handleButtonClick = () => {
      setShowMessage(true);
  }
  

  useEffect(() => {
    // Limiting messages to 50 so it only displays the most recent messages.
    db.collection('messages')
      .orderBy('createdAt')
      .limit(50)
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

    // Retrieve the current user's student ID and photo.
    db.collection('students')
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const currentUser = doc.data();
        // Do something with the currentUser object, such as setting it in state.
      });
  }, []);

  return (
    <div>
      <div className="msgs">
        {messages.map(({ id, text, studentId }) => (
          <div key={id} className={`msg ${studentId === auth.currentUser.uid ? 'sent' : 'received'}`}>
            {/* Construct the URL of the student's photo from the "students" collection */}
            <img src={`students/${studentId}/image`} alt="" />
            <p>{text}</p>
          </div>
        ))}
      </div>
      {showMessage && <div className="message"> This is a message. </div> }
      <div className="d-flex justify-content-end">
          <button className="btn btn-primary mt-3" onClick={handleButtonClick}>Message</button>
      </div>
      <SendMessage scroll={scroll} />
      <div ref={scroll}></div>
    </div>
  );
}

export default Chat;
