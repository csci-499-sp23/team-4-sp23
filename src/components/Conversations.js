import { useEffect, useState } from "react"

const Convo = ({ guest }) => {
    return <div>
        <img src="" alt="" />
        <p>{guest.email}</p>
    </div>
}


const loadConvos = () => {
}

export default function Conversations() {
    const [recentConvos] = useState([])

    useEffect(() => {

    }, [])
    //return list of people  i am coversing with
    return <div className="conversations-container">
        <h2>Conversations</h2>
        {recentConvos?.map(guest => <Convo guest={guest} />)}
    </div>
}