import React from 'react'
import TerminalAssistant from './TerminalAssistant'

const projects = [
    { name: "Weather App", fileName: "project-weather-app.exe", url: "https://your‑demo1" },
    { name: "Retro To‑Do", fileName: "todo-retro.exe", url: "https://your‑demo2" },
];

const Chat = () => {
    
    return (
        <div className=' w-full h-full p-4'>
            <TerminalAssistant projects={projects}
                skills={["React", "Tailwind", "GSAP", "Node"]} />
        </div>
    )
}

export default Chat