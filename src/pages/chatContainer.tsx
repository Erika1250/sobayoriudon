import { memo, useEffect, useRef } from "react"
import styled from "styled-components"
import { ChatMessage } from "./chatSample";

type ChatContainerProps = {
    messageArrState: ChatMessage[];
}

/**
 * メッセージ表示エリア
 */
const ChatContainer: React.FC<ChatContainerProps> = memo(({ messageArrState }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /**
     * 最新のメッセージ位置を表示する
     */
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
            console.log(messagesEndRef);
        }
    }, [messageArrState]);

    
    return (
        <SContainer ref={messagesEndRef}>
            {messageArrState.map((message) => (
                <>
                    <SChatBubble isMe={message.sender === 'me'}>
                        <SMessage>{message.message}</SMessage>
                        <SLink href={message.url ?? ''} target="_blank">{message.url}</SLink>
                    </SChatBubble>
                    <STimestamp isMe={message.sender === 'me'}>{message.timestamp}</STimestamp>
                </>
            ))}
            <div ref={messagesEndRef}></div>
        </SContainer>
    )
});

const SContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 500px;
    margin: auto;
    padding: 16px;

`

const SChatBubble = styled.div<{ isMe: boolean }>`
    display: inline-block;
    margin-bottom: 3px;
    padding: 8px 16px;
    border-radius: 16px;
    color: ${({ isMe }) => (isMe ? 'white' : 'black')};
    background-color:${({ isMe }) => (isMe ? '#9370db' : '#e6e6fa')};
    align-self: ${({ isMe }) => (isMe ? 'flex-end': 'flex-start')};
    max-width: 70%;
    text-align: left;
`
const SMessage = styled.p`
    margin: 0;
    white-space: pre-wrap;
`
const SLink = styled.a`
    margin: 0;
    word-wrap: break-word;
    color: #4169e1;
    text-decoration:underline;
    text-align: left;
`

const STimestamp = styled.span<{ isMe: boolean }>`
    font-size: 12px;
    color: 'black'
    margin-left: 8px;
    margin-bottom: 16px;
    align-self: ${({ isMe }) => (isMe ? 'flex-end': 'flex-start')};
`

export default ChatContainer;