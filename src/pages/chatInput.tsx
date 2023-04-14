import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

type InputProps = {
    newMessage: string,
    handleInputChange: ChangeEventHandler<HTMLInputElement>,
    handleSendMessage: MouseEventHandler<HTMLButtonElement>,
    clearMessages: MouseEventHandler<HTMLButtonElement>,
    handleKeyDown: KeyboardEventHandler<HTMLInputElement>,
}

/**
 * メッセージ入力欄
 * @param 
 * @returns 
 */
const InputArea: React.FC<InputProps> = ({
    newMessage,
    handleInputChange,
    handleSendMessage,
    clearMessages,
    handleKeyDown,
}) => {
    
    return (
        <InputContainer>
            <Input isMobile={isMobile} type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} />
            <Button onClick={handleSendMessage}>送信</Button>
            <ClearButton isMobile={isMobile} onClick={clearMessages}>クリア</ClearButton>
        </InputContainer>
    )
}

const InputContainer = styled.div`
  display: flex;
  margin: 16px auto;
`;

const Input = styled.input<{isMobile: boolean}>`
  flex: 1;
  margin-right: ${({isMobile}) => isMobile ? '4px' : '8px'};
  padding: 8px;
  border: solid #afeeee;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #20b2aa;
  color: white;
  cursor: pointer;
`;

const ClearButton = styled.button<{isMobile: boolean}>`
  border: none;
  background-color: #c0c0c0;
  color: #fff;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  margin-left: ${({isMobile}) => isMobile ? '4px' : '8px'};
`;

export default InputArea;