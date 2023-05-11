import { collection, limit, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useUserSelector } from "../services/selectors"
import { db } from "../firebase-config"
import { MessageKey, docToJson } from "../jsonUtils"

const Convo = ({ guest }) => {
    return <div>
        <img src="" alt="" />
        <p>{guest.email}</p>
    </div>
}

const fetchLast20ConversationProfiles = (host) => {
    // fetch users i am chatting with
    const messagesRef = collection(db, 'messages')

    const q = query(messagesRef, where('messageKey', 'contains', [host.email]), limit(50))

    return onSnapshot(q, (snapshots) => {
        //get last 20 message
        //get the emails from those messages
        const last20messages = snapshots.docChanges().map(msg => docToJson(msg))
        const last20EmailGuests= last20messages.map((msg)=> msg.messageKey[MessageKey.GUEST_INDEX])
        console.log({last20EmailGuests})
    })
}

export default function Conversations() {
    const [recentConvos] = useState([])
    const host = useUserSelector()

    useEffect(() => {
        fetchLast20ConversationProfiles(host)
    }, [host])

    //return list of people  i am coversing with
    return <div className="conversations-container">
        <h2>Conversations</h2>
        {recentConvos?.map(guest => <Convo guest={guest} />)}
    </div>
}