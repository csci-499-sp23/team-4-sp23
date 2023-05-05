import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../../firebase-config";
import { useMessageReceiver, useUserSelector } from "../../services/selectors";
// import SendMessage from './SendMessage';
import { addDoc, collection, onSnapshot, query } from "@firebase/firestore";
import { where, or, orderBy } from "firebase/firestore";

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
  const q = query(messagesRef, filter, orderBy("timestamp"));
  // lisften for new messages
  return onSnapshot(q, (snapshots) => {
    const newMessages = snapshots.docChanges().map(({ doc }) => doc.data());
    console.log("messages", { messages: newMessages });
    cb((oldMessages) => getUniqueMessages([...oldMessages, ...newMessages]));
  });
};

function getUniqueMessages(arr) {
  const keyedMessages = arr.map((msg) => [msg.messageId, msg]);
  return [...new Map(keyedMessages).values()];
}

//fetch the receivers i am chatting with
// const fetchReceivers = (cb) => {
//   db.collection("students")
//     .doc(auth.currentUser.uid)
//     .get()
//     .then((doc) => {
//       const currentUser = doc.data();
//     });
// };

const makeMessage = (guestEmail, hostEmail, msg) => {
  return { messageKey: [guestEmail, hostEmail], message: msg, timestamp: new Date().toISOString(), messageId: crypto.randomUUID(), read: false };
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
  const [activeGuest, setActiveGuest] = useState(null);

  console.log({ guest, host });

  const doSend = async (guestEmail = guest.email, hostEmail = host.email, message = draft) => {
    await sendMessage(makeMessage(guestEmail, hostEmail, message));
    setDraft(null); //clear last input
  };

  const updatemessages = useCallback((msgs) => setMessages(msgs), [setMessages]);

  useEffect(() => {
    console.log("component useEffect");
    const guestChanged = activeGuest?.email !== guest.email;

    //make sure to only run if the guest has changed
    if (guestChanged) {
      //clear messages
      updatemessages([]); //initialize messages on first load, which will run once
      //change guest
      setActiveGuest(guest);
      //load chats with guest
      fetchMessages(guest.email, host.email, setMessages);

      console.log("message listener active");
      // fetchReceivers();
    }
  }, [host, guest, messages, updatemessages, activeGuest, setActiveGuest]);

  if (!messages) {
    return <div>loading...</div>;
  }

  return (
    <>
      <div className="messageBox card row">
        <p className="col-12  d-flex">Messages {messages.length} with</p>
        <h2 className="fs-5 d-flex">
          {guest.first_name} {guest.last_name}
        </h2>

        <div className="msgs-list overflow-scroll col-12 bg-grey row" style={{ height: "80vh" }}>
          {messages.map(({ messageKey, message, timestamp, messageId = Math.floor(Math.random() * 10_000) }) => (
            <div
              key={[...messageKey, timestamp, messageId].join("__")}
              className={`msg-item border border-4 shadow  col-8  fs-6 ${messageKey[1] === host.email ? "sent text-align-right offset-4" : "recieved"}`}
            >
              {/* Construct the URL of the student's photo from the "students" collection */}
              <img src={""} alt="" />
              <p className="m-0 p-1">{message}</p>
              <p className="m-0 p-1">{messageKey[1]}</p>
            </div>
          ))}
        </div>

        <textarea name="newMessage" id="newMessage" cols="30" rows="3" className="col-12" value={draft ?? ""} onChange={(e) => setDraft(e.target.value)}></textarea>

        <div className="d-flex justify-content-end col-12">
          <button className="btn btn-primary mt-3 block" onClick={() => doSend()}>
            <i class="fa fa-send-o fs-3" aria-hidden="true"></i>
          </button>
        </div>
        {/* <SendMessage scroll={scroll} /> */}
        <div ref={scroll}></div>
      </div>
    </>
  );
}

export default Chat;
