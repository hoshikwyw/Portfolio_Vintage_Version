import React from 'react'
import TerminalAssistant from './TerminalAssistant'

const Chat = () => {
    return (
        <div className=' w-full h-full p-4'>
            <TerminalAssistant
                skills={["React", "Tailwind", "GSAP", "Node"]} />
        </div>
    )
}

export default Chat
