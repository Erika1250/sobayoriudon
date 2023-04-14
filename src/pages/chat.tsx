import React, { useEffect, useCallback, useRef, useState, memo } from 'react';
import styled from 'styled-components';
import { getForecast, getRandomArticle, getRandomCat, getRandomDog } from './chatApi';
import ChatContainer from './chatContainer';
import InputArea from './chatInput';
import { isMobile } from 'react-device-detect';

export type ChatMessage = {
  id: number;
  sender: string;
  message1: string;
  message2?: string;
  icon?: string;
  url?: string | null;
  img?: string | null;
  timestamp: string;
}

type Message = {
    message1: string;
    message2?: string;
    icon?: string;
    url?: string | null;
    img?: string | null;
};

/**
 * チャット画面
 */
const Chat: React.FC = memo(() => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [messageArrState, setMessageArrState] = useState<ChatMessage[]>([]);

    /**
     * 入力内容が空白の場合、処理を行わない。
     * それ以外の場合、配列に新しいメッセージを追加して画面に表示する。
     * @returns 
     */
    const handleSendMessage = () => {
        if (inputMessage.trim() === "") {
            return;
        }
        const message: Message = {
            message1: inputMessage,
        }
        addMessage(message, 'me');
    };

    /**
     * 新しいメッセージが送信されたら、返信を作成する
     */
    useEffect(() => {
        createReplyMessage();
    }, [messageArrState])

    /**
     * メッセージを追加する
     * @param newMessage 
     * @param sender 
     */
    const addMessage = (newMessage: Message, sender: string) => {
        const timestamp = new Date().toLocaleString();
        const newChatMessage: ChatMessage = {
          id: messageArrState.length + 1,
          sender: sender,
          message1: newMessage.message1,
          message2: newMessage.message2,
          icon: newMessage.icon,
          url: newMessage.url,
          img: newMessage.img,
          timestamp: timestamp,
        };
        setInputMessage('');
        setMessageArrState([...messageArrState, newChatMessage]);
    }

    /**
     * 1秒後に返信する
     * @param reply 
     * @param sender 
     */
    const replyMessage = (reply: Message) => {
        setTimeout(() => {
            addMessage(reply, 'other');
        }, 1000);
    }

    /**
     * 返信メッセージを作成する
     */
    const createReplyMessage = () => {
        const reply: Message = {
            message1: "",
        };
        const latestMessage = messageArrState[messageArrState.length - 1]?.message1;
        switch(latestMessage) {
            case "今日の天気":
                getForecast(130010).then(res => {
                    const { data, status } = res;
                    const weather = data.forecasts[0];
                    reply.message1 = `今日の天気は${weather.telop}です`;
                    reply.message2 = `\r\n詳細：${weather.detail.weather.replaceAll(/\s+/g, '')}\r\n風の強さ：${weather.detail.wind.replaceAll(/\s+/g, '')}\r\n降水確率：${weather.chanceOfRain.T00_06}　${weather.chanceOfRain.T06_12}　${weather.chanceOfRain.T12_18}　${weather.chanceOfRain.T18_24}`;
                    reply.icon = weather.image.url;
                    replyMessage(reply);
                })
                break;
            case "明日の天気":
                getForecast(130010).then(res => {
                    const { data, status } = res;
                    const weather = data.forecasts[1];
                    reply.message1 = `明日の天気は${weather.telop}です`;
                    reply.message2 = `\r\n詳細：${weather.detail.weather.replaceAll(/\s+/g, '')}\r\n風の強さ：${weather.detail.wind.replaceAll(/\s+/g, '')}\r\n降水確率：${weather.chanceOfRain.T00_06}　${weather.chanceOfRain.T06_12}　${weather.chanceOfRain.T12_18}　${weather.chanceOfRain.T18_24}`;
                    reply.icon = weather.image.url;
                    replyMessage(reply);
                })
                break;
            case "おはよう":
                reply.message1 = greetingReplies[0];
                replyMessage(reply);
                break;
            case "おやすみ":
                reply.message1 = greetingReplies[1];
                replyMessage(reply);
                break;
            case "今日の記事":
                getRandomArticle().then(res => {
                    const { data, status } = res;
                    const pageID = data.query.pageids;
                    reply.message1 = `今日の記事は「${data.query.pages[pageID].title}」です🔍`;
                    reply.url = data.query.pages[pageID].fullurl;
                    replyMessage(reply);
                });
                break;
            case "犬":
                getRandomDog().then(res => {
                    const { data, status } = res;
                    reply.message1 = "今日の犬です🐕";
                    reply.img = data.message;
                    replyMessage(reply);
                });
                break;
            case "猫":
                getRandomCat().then(res => {
                    const { data, status } = res;
                    reply.message1 = "今日の猫です🐈";
                    reply.img = data[0].url;
                    replyMessage(reply);
                })
            default:
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
        setInputMessage(event.target.value);
    };

  return (
    <Container isMobile={isMobile}>
        <ChatContainer messageArrState={messageArrState}/>
        <InputArea newMessage={inputMessage}
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
