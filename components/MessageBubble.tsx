
import React from 'react';
import { Message, MessageSender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

const BotIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.451.236 2.427 1.458 2.427 2.91v3.584c0 1.452-.976 2.674-2.427 2.91a48.822 48.822 0 0 1-1.152.177c-.465.067-.87.327-1.11.71l-.821 1.317a3.25 3.25 0 0 1-2.332 1.39 49.52 49.52 0 0 1-5.312 0 3.25 3.25 0 0 1-2.332-1.39l-.821-1.317a1.75 1.75 0 0 0-1.11-.71 48.57 48.57 0 0 1-1.152-.177c-1.451-.236-2.427-1.458-2.427-2.91v-3.584c0-1.452.976-2.674 2.427-2.91L3.344 8.85c.465-.067.87-.327 1.11-.71l.821-1.317A3.25 3.25 0 0 1 7.575 5.51a49.52 49.52 0 0 1 1.769-2.439Z" clipRule="evenodd" />
  </svg>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.User;
  const timeString = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow">
          <BotIcon />
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-xs lg:max-w-md shadow ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>
          {timeString}
        </p>
      </div>
      {isUser && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow">
           <UserIcon />
         </div>
      )}
    </div>
  );
};

export default MessageBubble;
