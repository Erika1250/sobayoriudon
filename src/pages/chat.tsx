import React, { useEffect, useCallback, useRef, useState, memo } from 'react';
import styled from 'styled-components';
import { getRandomArticle, getRandomCat, getRandomDog } from './chatApi';
import ChatContainer from './chatContainer';
import InputArea from './chatInput';
import { isMobile } from 'react-device-detect';

export type ChatMessage = {
  id: number;
  sender: string;
  message: string;
  url?: string | null;
  img?: string | null;
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
        addMessage(newMessage, null, null, 'me');
    };
    useEffect(() => {
        handleReplyMessage();
    }, [messageArrState])

    const addMessage = (message: string, url: string | null, img: string | null, sender: string) => {
        const timestamp = new Date().toLocaleString();
        const newChatMessage: ChatMessage = {
          id: messageArrState.length + 1,
          sender: sender,
          message: message,
          url: url,
          img: img,
          timestamp: timestamp,
        };
        setNewMessage('');
        setMessageArrState([...messageArrState, newChatMessage]);
    }

    const handleReplyMessage = () => {
        let replies: string[] = [];
        let reply = "";
        let randomIndex = 0;
        let imgUrl = "";
        const latestMessage = messageArrState[messageArrState.length - 1]?.message;
        switch(latestMessage) {
            case "今日の天気":
                replies = weatherReplies;
                randomIndex = Math.floor(Math.random() * replies.length);
                reply = replies[randomIndex];
                setTimeout(() => {
                    
                    addMessage(reply, null, null, 'other');
                }, 1000);
                break;
            case "明日の天気":
                replies = weatherTomorrowReplies;
                randomIndex = Math.floor(Math.random() * replies.length);
                reply = replies[randomIndex];
                setTimeout(() => {
                    addMessage(reply, null, null, 'other');
                }, 1000);
                break;
            case "おはよう":
                reply = greetingReplies[0];
                setTimeout(() => {
                    addMessage(reply, null, null, 'other');
                }, 1000);
                break;
            case "おやすみ":
                reply = greetingReplies[1];
                setTimeout(() => {
                    addMessage(reply,null, null, 'other');
                }, 1000);
                break;
            case "今日の記事":
                getRandomArticle().then(res => {
                    const { data, status } = res;
                    const pageID = data.query.pageids;
                    const url = data.query.pages[pageID].fullurl;
                    reply = `今日の記事は「${data.query.pages[pageID].title}」です🔍`;
                    setTimeout(() => {
                        addMessage(reply, url, null, 'other');
                    }, 1000);
                });
                break;
            case "犬":
                getRandomDog().then(res => {
                    const { data, status } = res;
                    imgUrl = data.message;
                    reply = "今日の犬です🐕";
                    setTimeout(() => {
                        addMessage(reply, null, imgUrl, 'other');
                    }, 1000);
                });
                break;
            case "猫":
                getRandomCat().then(res => {
                    const { data, status } = res;
                    imgUrl = data[0].url;
                    reply = "今日の猫です🐈";
                    setTimeout(() => {
                        addMessage(reply, null, imgUrl, 'other');
                    }, 1000);
                })
            default:
                console.log("error");
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
    <Container isMobile={isMobile}>
        <ChatContainer messageArrState={messageArrState}/>
        <InputArea newMessage={newMessage}
            handleInputChange={handleInputChange}
            handleSendMessage={handleSendMessage}
            clearMessages={clearMessages}
            handleKeyDown={handleKeyDown} />
    </Container>
  );
});

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

const Container = styled.div<{isMobile: boolean}>`
    height: 85vh;
    width: ${({isMobile}) => isMobile ? '100%' : '80%' };
    margin: ${({isMobile}) => isMobile ? 'auto' : '80px auto' };
`
export default Chat;
