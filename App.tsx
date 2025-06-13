
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageSender } from './types';
import { initChatSession, sendMessageToGemini } from './services/geminiService';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import LoadingSpinner from './components/LoadingSpinner';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const session = initChatSession();
      setChatSession(session);
      
      // Initial greeting message from bot
      setMessages([
        {
          id: Date.now().toString(),
          text: "您好！我是智能超市客服，请问有什么可以帮助您的吗？",
          sender: MessageSender.Bot,
          timestamp: new Date(),
        }
      ]);
    } catch (err) {
      console.error("初始化聊天失败:", err);
      setError("无法连接到客服机器人，请稍后再试。");
      if (err instanceof Error) {
        setError(`无法连接到客服机器人: ${err.message}. 请检查您的API密钥是否已正确配置到环境变量 process.env.API_KEY 中。`);
      } else {
        setError("无法连接到客服机器人，发生未知错误。请检查您的API密钥是否已正确配置到环境变量 process.env.API_KEY 中。");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: MessageSender.User,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    if (!chatSession) {
      setError("聊天会话未初始化。");
      setIsLoading(false);
      return;
    }

    try {
      const botResponseText = await sendMessageToGemini(chatSession, inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(), // Ensure unique ID
        text: botResponseText,
        sender: MessageSender.Bot,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("发送消息失败:", err);
      const errorMessage = err instanceof Error ? err.message : "发生未知错误";
      setError(`发送消息失败: ${errorMessage}`);
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `抱歉，我暂时无法回复。错误: ${errorMessage}`,
        sender: MessageSender.Bot,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      <ChatHeader />
      <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === MessageSender.User && (
           <div className="flex justify-start">
             <div className="flex items-center space-x-2 bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs lg:max-w-md shadow">
                <LoadingSpinner /> 
                <span className="text-sm">机器人正在输入...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 border-t border-red-200 text-sm">
          <strong>错误：</strong> {error}
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;