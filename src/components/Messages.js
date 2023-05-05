import { useMessageReceiver } from "../services/selectors"
import Conversations from "./Conversations"
import Chat from "./pages/Chat"

export default function Messages() {
    const messageReceiver = useMessageReceiver()

    if (messageReceiver) {
        return <Chat />
    }
    return <Conversations />
}