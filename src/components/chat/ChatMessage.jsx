import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User } from 'lucide-react';
import GrowthHubLogo from '../ui/Logo';

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slideUp`}>
            <div className={`max-w-[88%] sm:max-w-[80%] flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-[#222]' : ''
                        }`}
                >
                    {isUser ? (
                        <User size={14} className="text-gray-300" />
                    ) : (
                        <GrowthHubLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    )}
                </div>

                {/* Message Bubble */}
                <div
                    className={`p-3 sm:p-4 rounded-2xl text-sm leading-relaxed ${isUser
                        ? 'bg-[#7B61FF] text-white rounded-tr-none'
                        : 'bg-[#1a1a1c] text-gray-200 rounded-tl-none'
                        }`}
                >
                    {isUser ? (
                        message.content
                    ) : (
                        <div className="gh-markdown">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
