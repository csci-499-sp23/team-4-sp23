import { collection, limit, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useUserSelector } from "../services/selectors"
import { db } from "../firebase-config"

const Convo = ({ guest }) => {
    return <div>
        <img src="" alt="" />
        <p>{guest.email}</p>
    </div>
}

const fetchLast20ConversationProfiles = (host) => {
    // fetch users i am chatting with
    const messagesRef = collection(db, 'messages')

    const q = query(messagesRef, where('messageKey', 'contains', [host.emaail]), limit(50))

    return onSnapshot(q, (snapshots) => {
        snapshots.docChanges().map(msg => ({}))
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