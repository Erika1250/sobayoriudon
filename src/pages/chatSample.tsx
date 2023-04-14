import React, { useEffect, useCallback, useRef, useState, memo } from 'react';
import styled from 'styled-components';
import { getRandomArticle } from './chatApi';
import ChatContainer from './chatContainer';
import InputArea from './chatInput';

export type ChatMessage = {
  id: number;
  sender: string;
  message: string;
  url?: string | null;
  timestamp: string;
}

/**
 * チャット画面
 */
const Chat: React.FC = memo(() => {
    const [newMessage, setNewMessage] = useState<string>('');
    const [messageArrState, setMessageArrState] = useState<ChatMessage[]>([]);

    /**
     * 入力内容が空白の場合、処理を行わない。
     * それ以外の場合、配列に新しいメッセージを追加して画面に表示する。
     * @returns 
     */
    const handleSendMessage = () => {
        if (newMessage.trim() === "") {
            return;
        }
        addMessage(newMessage, null, 'me');
    };
    useEffect(() => {
        handleReplyMessage();
    }, [messageArrState])

    const addMessage = (message: string, url: string | null, sender: string) => {
        const timestamp = new Date().toLocaleString();
        const newChatMessage: ChatMessage = {
          id: messageArrState.length + 1,
          sender: sender,
          message: message,
          url: url,
          timestamp: timestamp,
        };
        setNewMessage('');
        setMessageArrState([...messageArrState, newChatMessage]);
    }

    const handleReplyMessage = () => {
        let replies: string[] = [];
        const latestMessage = messageArrState[messageArrState.length - 1]?.message;
        if(latestMessage === "今日の天気") {
            replies = weatherReplies;
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * replies.length);
                const message = replies[randomIndex];
                addMessage(message, null, 'other');
            }, 1000);
        } else if(latestMessage === "明日の天気") {
            replies = weatherTomorrowReplies;
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * replies.length);
                const message = replies[randomIndex];
                addMessage(message, null, 'other');
            }, 1000);
        } else if (latestMessage === "おはよう") {
            const reply = greetingReplies[0];
            console.log(new Date().toLocaleString());
            setTimeout(() => {
                addMessage(reply, null, 'other');
            }, 1000);
        } else if (latestMessage === "おやすみ") {
            const reply = greetingReplies[1];
            console.log(new Date().toLocaleString());
            setTimeout(() => {
                addMessage(reply,null, 'other');
            }, 1000);
        } else if (latestMessage === "今日の記事") {
            let reply = "";
            let url = "";
            getRandomArticle().then(res => {
                const { data, status } = res;
                const pageID = data.query.pageids;
                url = data.query.pages[pageID].fullurl;
                reply = `今日の記事は「${data.query.pages[pageID].title}」です🔍`;
            });
            setTimeout(() => {
                addMessage(reply, url, 'other');
            }, 1000);
        }
    }

    const clearMessages = () => {
        setMessageArrState([]);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          // Enterキーが押されたらメッセージを送信
          handleSendMessage();
        }
      };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewMessage(event.target.value);
    };

  return (
    <Container>
        <ChatContainer messageArrState={messageArrState}/>
        <InputArea newMessage={newMessage}
            handleInputChange={handleInputChange}
            handleSendMessage={handleSendMessage}
            clearMessages={clearMessages}
            handleKeyDown={handleKeyDown} />
    </Container>
  );
});

export const sampleData: ChatMessage[] = [
//   { id: 1, sender: 'me', message: 'Hello!', timestamp: '2022-04-13 10:00' },
//   { id: 2, sender: 'other', message: 'Hi there!', timestamp: '2022-04-13 10:01' },
//   { id: 3, sender: 'me', message: 'How are you?', timestamp: '2022-04-13 10:02' },
//   { id: 4, sender: 'other', message: 'I am doing well, thank you!', timestamp: '2022-04-13 10:03' },
//   { id: 5, sender: 'me', message: 'Hello!', timestamp: '2022-04-13 10:04' },
//   { id: 6, sender: 'other', message: 'Hi there!', timestamp: '2022-04-13 10:05' },
//   { id: 7, sender: 'me', message: 'How are you?', timestamp: '2022-04-13 10:06' },
//   { id: 8, sender: 'other', message: 'I am doing well, thank you!', timestamp: '2022-04-13 10:07' },
];

const weatherReplies = [
    "今日の天気は晴れです🌞",
    "今日の天気は曇りです☁",
    "今日の天気は雨です☔",
];

const weatherTomorrowReplies = [
    "明日の天気は晴れです🌞",
    "明日の天気は曇りです☁",
    "明日の天気は雨です☔",
];

const greetingReplies = [
    "おはようございます、ご主人様💖\r\n今日も一日がんばりましょう🍭",
    "おやすみなさい、ご主人様💤\r\n今日も一日お疲れさまでした🍵",
];

const Container = styled.div`
    width: 80%;
    margin: 80px auto;
`
export default Chat;
