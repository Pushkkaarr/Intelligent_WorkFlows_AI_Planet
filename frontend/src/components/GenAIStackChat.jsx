import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader } from 'lucide-react';
import { chatAPI } from '../api/endpoints';

export const GenAIStackChat = ({ isOpen, onClose, workflowId }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'GenAI Stack Chat',
      timestamp: new Date(),
      isTitle: true
    },
    {
      role: 'assistant',
      content: 'Start a conversation to test your stack',
      timestamp: new Date(),
      isSubtitle: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    // Handle bold text (**text**)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Handle em dashes (-- becomes —)
    text = text.replace(/--/g, '—');
    
    // Handle line breaks
    text = text.replace(/\n/g, '<br />');
    
    // Handle numbered lists
    text = text.replace(/^(\d+)\.\s/gm, '<div class="ml-4">$1. ');
    text = text.replace(/<div class="ml-4">(\d+\.\s[^<]*)<br \/>(?=\d+\.)/gm, '<div class="ml-4">$1</div><div class="ml-4">');
    text = text.replace(/<div class="ml-4">([^<]*?)$(?!<div)/gm, '<div class="ml-4">$1</div>');
    
    // Handle bullet points
    text = text.replace(/^[-•]\s/gm, '<div class="ml-4">• ');
    text = text.replace(/<div class="ml-4">([^<]*?)<br \/>(?=[-•])/gm, '<div class="ml-4">$1</div><div class="ml-4">');
    
    return text;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage({
        message: input,
        workflowId: workflowId,
        conversationHistory: messages
          .filter(m => !m.isTitle && !m.isSubtitle)
          .map(m => ({
            role: m.role,
            content: m.content
          }))
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response || response.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[60vw] h-[75vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-green-600 to-teal-600 px-8 py-5 flex items-center justify-between rounded-t-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2 shadow-md">
              <MessageCircle className="text-green-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">GenAI Stack Chat</h2>
              <p className="text-green-100 text-xs">Your AI Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-2 rounded-full transition hover:scale-110"
          >
            <X size={28} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-gray-50 to-white space-y-6">
          {messages.map((msg, idx) => {
            if (msg.isTitle) {
              return (
                <div key={idx} className="flex items-center justify-center py-6">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <MessageCircle className="text-green-600" size={40} />
                  </div>
                </div>
              );
            }

            if (msg.isSubtitle) {
              return (
                <div key={idx} className="flex items-center justify-center py-4">
                  <p className="text-gray-700 text-lg font-medium">{msg.content}</p>
                </div>
              );
            }

            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className="flex gap-3 justify-start"
              >
                <div className="text-3xl pt-1 flex-shrink-0">
                  {isUser ? '👤' : '🤖'}
                </div>
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl text-base leading-relaxed font-medium shadow-md ${
                    isUser
                      ? 'bg-gradient-to-br from-green-300 to-green-400 text-gray-900'
                      : msg.isError
                      ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-900'
                      : 'bg-gradient-to-br from-blue-200 to-blue-300 text-gray-900'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.content)
                  }}
                />
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="text-3xl pt-1 flex-shrink-0">🤖</div>
              <div className="bg-gradient-to-br from-blue-200 to-blue-300 text-gray-900 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-md max-w-md">
                <Loader size={20} className="animate-spin text-blue-600 font-bold" />
                <span className="text-base font-medium">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-8 py-5 rounded-b-2xl shadow-inner">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-green-500 transition text-sm font-medium"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-2 rounded-lg transition flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100"
              title="Send message"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
