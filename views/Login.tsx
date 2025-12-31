import React, { useState, useEffect } from 'react';

interface Props {
    onAuthenticated: () => void;
}

const Login: React.FC<Props> = ({ onAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [terminalLines, setTerminalLines] = useState<string[]>([
        '> Initializing secure connection...',
        '> Establishing encrypted tunnel...',
        '> Connection established.',
        '> LineF Command Center v2.0.26',
        '> Enter credentials to proceed...',
    ]);
    const [showInput, setShowInput] = useState(false);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInput(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        // Add processing lines
        setTerminalLines(prev => [...prev, `> Authenticating user: ${username}...`]);

        setTimeout(() => {
            if (username === 'LineF' && password === '45cr') {
                setTerminalLines(prev => [
                    ...prev,
                    '> Authentication successful.',
                    '> Loading user profile...',
                    '> Decrypting data streams...',
                    '> Access granted. Welcome, LineF.',
                    '> Redirecting to command center...'
                ]);

                setTimeout(() => {
                    localStorage.setItem('linef_authenticated', 'true');
                    onAuthenticated();
                }, 2000);
            } else {
                setTerminalLines(prev => [
                    ...prev,
                    '> ERROR: Authentication failed.',
                    '> Invalid credentials detected.',
                    '> Access denied.'
                ]);
                setError('Access Denied: Invalid credentials');
                setIsProcessing(false);
                setUsername('');
                setPassword('');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.02)_50%)] bg-[length:100%_4px] pointer-events-none animate-[scan_8s_linear_infinite]"></div>

            <div className="relative z-10 w-full max-w-3xl">
                {/* Terminal Window */}
                <div className="bg-slate-950 border-2 border-green-500/30 rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.2)] overflow-hidden">
                    {/* Terminal Header */}
                    <div className="bg-slate-900 border-b border-green-500/30 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-green-400 text-xs font-mono">root@linef-secure-terminal</div>
                        <div className="text-green-500/50 text-xs font-mono">192.168.1.1</div>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 font-mono text-sm">
                        {/* Terminal Output */}
                        <div className="space-y-2 mb-6 min-h-[200px]">
                            {terminalLines.map((line, index) => (
                                <div
                                    key={index}
                                    className="text-green-400 animate-[fadeIn_0.3s_ease-in]"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {line}
                                </div>
                            ))}
                        </div>

                        {/* Login Form */}
                        {showInput && !isProcessing && (
                            <form onSubmit={handleSubmit} className="space-y-4 animate-[fadeIn_0.5s_ease-in]">
                                <div>
                                    <label className="text-green-400 block mb-2">
                                        <span className="text-green-500">{'>'}</span> USERNAME:
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black border border-green-500/30 rounded px-4 py-2 text-green-400 focus:border-green-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all font-mono"
                                        placeholder="Enter username..."
                                        autoFocus
                                        disabled={isProcessing}
                                    />
                                </div>

                                <div>
                                    <label className="text-green-400 block mb-2">
                                        <span className="text-green-500">{'>'}</span> PASSWORD:
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black border border-green-500/30 rounded px-4 py-2 text-green-400 focus:border-green-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all font-mono"
                                        placeholder="Enter password..."
                                        disabled={isProcessing}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-2 text-red-400 animate-[shake_0.5s_ease-in-out]">
                                        <span className="text-red-500">{'>'}</span> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500 text-green-400 font-bold py-3 rounded transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] uppercase tracking-wider"
                                    disabled={isProcessing}
                                >
                                    {'>'} AUTHENTICATE
                                </button>
                            </form>
                        )}

                        {isProcessing && (
                            <div className="flex items-center space-x-2 text-green-400 animate-pulse">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-[ping_1s_ease-in-out_infinite]"></div>
                                <span>Processing...</span>
                            </div>
                        )}

                        {/* Blinking Cursor */}
                        {showInput && !isProcessing && (
                            <div className="mt-4 text-green-400">
                                <span className="animate-[blink_1s_step-end_infinite]">▊</span>
                            </div>
                        )}
                    </div>

                    {/* Terminal Footer */}
                    <div className="bg-slate-900 border-t border-green-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono">
                        <div className="text-green-500/50">LineF Secure Access v2.0.26</div>
                        <div className="text-green-500/50">Encrypted Connection Active</div>
                    </div>
                </div>

                {/* Warning Text */}
                <div className="mt-6 text-center text-green-500/30 text-xs font-mono">
                    <p>⚠ AUTHORIZED ACCESS ONLY ⚠</p>
                    <p className="mt-1">Unauthorized access attempts will be logged and reported.</p>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
        </div>
    );
};

export default Login;
