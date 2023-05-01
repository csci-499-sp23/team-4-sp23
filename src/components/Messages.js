import { useMessageReceiver } from "../services/selectors"

export default function Messages(){
    const messageReceiver = useMessageReceiver()

    if (messageReceiver){
        return <Chat />
    }
    return <Conversations />
}