import React, { useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, MessageSquare } from 'lucide-react';

const ChatArea = ({ messages, isLoading, onSendMessage, currentQuery, setCurrentQuery }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      onSendMessage(currentQuery);
      setCurrentQuery('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-950 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 relative z-10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center animate-fade-in">
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl backdrop-blur-xl mb-6">
               <MessageSquare className="w-12 h-12 text-primary-500 mb-2" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Insightful Local RAG</h2>
            <p className="text-slate-400 max-w-sm text-center">
              Upload your PDF documents and ask questions in private, secured way using local AI.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700' 
                  : 'bg-slate-800 border border-slate-700 backdrop-blur-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-primary-400" />}
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-xl border ${
                  msg.role === 'user' 
                    ? 'bg-primary-600/90 border-primary-500 text-white rounded-tr-none' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none backdrop-blur-md'
                }`}>
                  {msg.content || (isLoading && idx === messages.length - 1 ? (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></span>
                    </div>
                  ) : '')}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-6 md:p-8 bg-slate-950/40 backdrop-blur-xl border-t border-slate-800/50 relative z-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 relative group">
             <input
              type="text"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="Deep dive into your documents..."
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl px-6 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-600 shadow-2xl"
            />
          </div>
          <button
            type="submit"
            disabled={!currentQuery.trim() || isLoading}
            className="bg-primary-600 hover:bg-primary-500 hover:scale-105 active:scale-95 text-white px-6 rounded-2xl disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-4 font-semibold uppercase tracking-widest opacity-60">
           Enterprise Grade • Fully Offline • Private
        </p>
      </div>
    </div>
  );
};


export default ChatArea;
