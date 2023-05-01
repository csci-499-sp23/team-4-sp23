import React, { useState, useEffect, useRef, useCallback } from "react";
import { db, auth } from "../../firebase-config";
import { useMessageReceiver, useUserSelector } from "../../services/selectors";
// import SendMessage from './SendMessage';
import { addDoc, collection, getDocs, query, where, orderBy, limit, or, onSnapshot } from "@firebase/firestore";

const getMessageKeyPair = (...emails) => {
  const [email1, email2] = emails;
  return [
    [email1, email2],
    [email2, email1],
  ];
};
//fetch messages, between host and gest
const fetchMessages = (guestEmail, hostEmail, cb) => {
  //where message messageKey in [[guestEmail,hostuid],[hostEmail,guestEmail]]
  const messageKeyPair = getMessageKeyPair(guestEmail, hostEmail);
  console.log({ messageKeyPair });

  const messagesRef = collection(db, "messages");

  const filter = or(where("messageKey", "==", messageKeyPair[0]), where("messageKey", "==", messageKeyPair[1]));
  const q = query(messagesRef);
  // lisften for new messages
  onSnapshot(q, (snapshots) => {
    const newMessages = snapshots.docChanges().map(({ doc }) => doc.data());
    console.log("messages", { messages: newMessages });
    cb((oldMessages) => [...oldMessages, ...newMessages]);
  });
};

//fetch the receivers i am chatting with
const fetchReceivers = (cb) => {
  db.collection("students")
    .doc(auth.currentUser.uid)
    .get()
    .then((doc) => {
      const currentUser = doc.data();
    });
};

const makeMessage = (guestEmail, hostEmail, msg) => {
  return { messageKey: [guestEmail, hostEmail], message: msg, timestamp: new Date().toISOString(), messageId: crypto.randomUUID() };
};
const sendMessage = async (/** @type {ReturnType <makeMessage>}*/ messageObject) => {
  console.log("sending new message", messageObject);
  return addDoc(collection(db, "messages"), messageObject);
};

function Chat() {
  const scroll = useRef();
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState(null);
  const guest = useMessageReceiver();
  const host = useUserSelector();

  console.log({ guest, host });

  const doSend = async (guestEmail = guest.email, hostEmail = host.email, message = draft) => {
    await sendMessage(makeMessage(guestEmail, hostEmail, message));
    setDraft(null); //clear last input
  };

  const updatemessages = useCallback((msgs) => setMessages(msgs), [setMessages]);

  useEffect(() => {
    //make sure to only run if messages is null
    console.log("component useEffect");
    if (messages != null) return;
    updatemessages([]); //initialize messages on first load, which will run once

    console.log("message listener active");
    // fetchReceivers();
    fetchMessages(guest.email, host.email, setMessages);
  }, [host, guest, messages, updatemessages]);

  if (!messages) {
    return <div>loading...</div>;
  }

  return (
    <>
      <div className="messageBox card row">
        <p className="col-12 fs-2">Messages with</p>
        <h2>
          {guest.first_name} {guest.last_name}
        </h2>

        <div className="msgs-list overflow-scroll col-12 bg-grey row" style={{ height: "80vh" }}>
          {messages.map(({ messageKey, message, timestamp, messageId = Math.floor(Math.random() * 10_000) }) => (
            <div
              key={[...messageKey, timestamp, messageId].join("__")}
              className={`msg-item border border-4 shadow  col-8   ${messageKey[1] === host.email ? "sent text-align-right offset-4" : "recieved"}`}
            >
              {/* Construct the URL of the student's photo from the "students" collection */}
              <img src={""} alt="" />
              <p className='m-0 p-1'>{message}</p>
              <p className='m-0 p-1'>{messageKey[0]}</p>
            </div>
          ))}
        </div>

        <textarea name="newMessage" id="newMessage" cols="30" rows="3" className="col-12" value={draft ?? ""} onChange={(e) => setDraft(e.target.value)}></textarea>

        <div className="d-flex justify-content-end col-12">
          <button className="btn btn-primary mt-3 block" onClick={() => doSend()}>
            Send
          </button>
        </div>
        {/* <SendMessage scroll={scroll} /> */}
        <div ref={scroll}></div>
      </div>
    </>
  );
}

export default Chat;
