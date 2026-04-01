import React, { useState, useRef, useEffect } from "react";
import { useFetchProjects } from "../../queries/projectQueries";

export default function TerminalAssistant({
    skills = [],
}) {
    const initialMessage = <span className="text-[#5768ad]">Type '<span className="text-[#45473a] font-bold">help</span>' to see available commands</span>;
    const [history, setHistory] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const historyEndRef = useRef(null);

    const { data: projects } = useFetchProjects();

    useEffect(() => {
        inputRef.current?.focus();
        scrollToBottom();
    }, [history, isLoading]);

    const scrollToBottom = () => {
        historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const addLine = (line) => {
        setHistory((h) => [...h, line]);
    };

    const clearTerminal = () => {
        setHistory([initialMessage]);
    };

    const Cmd = ({ children }) => (
        <span className="text-[#45473a] font-bold">{children}</span>
    );

    const execCommand = async (cmd) => {
        const lower = cmd.toLowerCase().trim();
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            switch (lower) {
                case "":
                    break;
                case "help":
                    addLine(<>
                        <span className="text-[#45473a] font-bold">Available commands:</span><br />
                        • <Cmd>help</Cmd> - Show this help message<br />
                        • <Cmd>about</Cmd> - Learn about me<br />
                        • <Cmd>projects</Cmd> - List my projects<br />
                        • <Cmd>skills</Cmd> - List my skills<br />
                        • <Cmd>clear</Cmd> - Clear the terminal
                    </>);
                    break;
                case "about":
                    addLine(<>
                        <span className="text-[#45473a] font-bold">Hello! I'm a front-end developer specializing in:</span><br />
                        - React.js development<br />
                        - Interactive animations with GSAP<br />
                        - Creating user-friendly and responsive cross-browser web apps<br />
                        <span className="text-[#45473a] font-bold">I love building engaging web experiences with modern tech!</span>
                    </>);
                    break;
                case "projects":
                case "list projects": {
                    const visibleProjects = projects.filter(p => p.status !== false);

                    if (!visibleProjects.length) {
                        addLine("No projects available at the moment.");
                    } else {
                        addLine(<span className="text-[#45473a] font-bold">My projects:</span>);
                        visibleProjects.forEach((p, i) => {
                            addLine(
                                <a
                                    key={i}
                                    href={p.demolink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline decoration-dotted hover:text-[#5768ad] text-[#45473a]"
                                >
                                    {`${i + 1}. ${p.title}`} - {p.description || "Check it out!"}
                                </a>
                            );
                        });
                    }
                    break;
                }
                case "skills":
                case "list skills":
                    if (!skills.length) {
                        addLine("No skills listed yet.");
                    } else {
                        addLine(<>
                            <span className="text-[#45473a] font-bold">My skills:</span><br />
                            {skills.map((skill, i) => (
                                <span key={i}>
                                    {i > 0 && " · "}
                                    <span className="text-[#45473a] font-bold">{skill}</span>
                                </span>
                            ))}
                        </>);
                    }
                    break;
                case "clear":
                    clearTerminal();
                    break;
                default:
                    addLine(<>
                        <span className="text-[#5768ad]">Command not found: '{cmd}'</span><br />
                        <span className="text-[#5768ad]">Type '<Cmd>help</Cmd>' to see available commands</span>
                    </>);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        addLine(
            <div className="text-[#45473a]">
                <span className="text-[#5768ad]">❯</span> {input}
            </div>
        );

        await execCommand(input);
        setInput("");
    };

    return (
        <div
            style={{ padding: '10px 18px' }}
            className="relative flex flex-col h-full w-full bg-white/95 text-[#45473a] font-mono overflow-hidden p-4 text-sm border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="terminal-output flex-1 overflow-y-auto pr-2 mb-2 scrollbar-thin scrollbar-thumb-[#dfdde0]">
                {history.map((line, idx) => (
                    <div
                        key={idx}
                        className="terminal-line whitespace-pre-wrap select-text leading-relaxed mb-1"
                    >
                        {line}
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-dots flex items-center text-[#5768ad]">
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </div>
                )}
                <div ref={historyEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{ paddingTop: '10px' }} className="terminal-input pt-2 flex items-center border-t-2 border-[#000000]">
                <span style={{ paddingRight: '10px' }} className="text-[#5768ad] mr-2 font-bold">❯</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none caret-[#5768ad] text-[#45473a] placeholder-[#a9a9ab] font-semibold"
                    placeholder={isLoading ? "Processing..." : "Type a command..."}
                    aria-label="Terminal input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={isLoading}
                />
            </form>

            <style jsx>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                input::placeholder {
                    animation: blink 1.2s step-end infinite;
                }
                .terminal-line {
                    line-height: 1.6;
                }
                a:hover {
                    color: #5768ad;
                }
                .loading-dots {
                    height: 24px;
                }
                .dot {
                    animation: bounce 1.4s infinite ease-in-out both;
                    font-size: 24px;
                    line-height: 1;
                }
                .dot:nth-child(1) {
                    animation-delay: -0.32s;
                }
                .dot:nth-child(2) {
                    animation-delay: -0.16s;
                }
                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-5px);
                    }
                }
            `}</style>
        </div>
    );
}
