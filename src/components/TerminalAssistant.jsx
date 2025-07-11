import React, { useState, useRef, useEffect } from "react";

export default function TerminalAssistant({
    projects = [],
    skills = [],
}) {
    const initialMessage = <span className="text-purple-400">Type '<span className="text-purple-300 font-bold">help</span>' to see available commands</span>;
    const [history, setHistory] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const historyEndRef = useRef(null);

    // Focus the input and scroll to bottom
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

    const PurpleCmd = ({ children }) => (
        <span className="text-purple-300 font-bold">{children}</span>
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
                        <span className="text-green-200">Available commands:</span><br />
                        • <PurpleCmd>help</PurpleCmd> - Show this help message<br />
                        • <PurpleCmd>about</PurpleCmd> - Learn about me<br />
                        • <PurpleCmd>projects</PurpleCmd> - List my projects<br />
                        • <PurpleCmd>skills</PurpleCmd> - List my skills<br />
                        • <PurpleCmd>clear</PurpleCmd> - Clear the terminal
                    </>);
                    break;
                case "about":
                    addLine(<>
                        <span className="text-green-200">Hello! I'm a front-end developer specializing in:</span><br />
                        - React.js development<br />
                        - Interactive animations with GSAP<br />
                        - Creating retro-style user interfaces<br />
                        <span className="text-green-200">I love building engaging web experiences with modern tech!</span>
                    </>);
                    break;
                case "projects":
                case "list projects":
                    if (!projects.length) {
                        addLine("No projects available at the moment.");
                    } else {
                        addLine(<span className="text-green-200">My projects:</span>);
                        projects.forEach((p, i) => {
                            addLine(
                                <a
                                    key={i}
                                    href={p.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline decoration-dotted hover:text-lime-300"
                                >
                                    {`${i + 1}. ${p.name}`} - {p.description || "Check it out!"}
                                </a>
                            );
                        });
                    }
                    break;
                case "skills":
                case "list skills":
                    if (!skills.length) {
                        addLine("No skills listed yet.");
                    } else {
                        addLine(<>
                            <span className="text-green-200">My skills:</span><br />
                            {skills.map((skill, i) => (
                                <span key={i}>
                                    {i > 0 && " · "}
                                    <span className="text-purple-300">{skill}</span>
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
                        <span className="text-red-300">Command not found: '{cmd}'</span><br />
                        <span className="text-purple-400">Type '<PurpleCmd>help</PurpleCmd>' to see available commands</span>
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
            <div className="text-lime-200">
                <span className="text-lime-500">❯</span> {input}
            </div>
        );

        await execCommand(input);
        setInput("");
    };

    return (
        <div
            className=" relative flex flex-col h-full w-full bg-black text-green-300 font-mono overflow-hidden p-4 text-sm"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="terminal-output flex-1 overflow-y-auto pr-2 mb-2 scrollbar-thin scrollbar-thumb-lime-700">
                {history.map((line, idx) => (
                    <div
                        key={idx}
                        className="terminal-line whitespace-pre-wrap select-text leading-relaxed mb-1"
                    >
                        {line}
                    </div>
                ))}
                {isLoading && (
                    <div className="loading-dots flex items-center text-lime-400">
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </div>
                )}
                <div ref={historyEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="terminal-input pt-2 flex items-center border-t border-lime-800">
                <span className="text-lime-500 mr-2">❯</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none caret-lime-500 text-lime-300 placeholder-lime-600"
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
          color: #bef264;
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