import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import CloseIcon from "@mui/icons-material/Close";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const ModalBackdrop = styled.div`
  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.1s ease-out
    forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 30rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  @media (max-width: 480px) {
    width: 80%;
  }
`;
const ButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-family: "Noto Sans KR";
  &:hover {
    background-color: #ccc;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid #e1e1e1;
`;
const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;
const IconContainer = styled.div`
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    opacity: 0.6;
  }
`;

function ProfileModal({ onClose, onResetDefault, onChangePicture }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 500);
  };

  return (
    <ModalBackdrop onClick={handleClose} isClosing={isClosing}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <TitleContainer>
          <Title>프로필 사진 변경</Title>
          <IconContainer onClick={handleClose}>
            <CloseIcon />
          </IconContainer>
        </TitleContainer>
        <ButtonContainer>
          <Button onClick={onResetDefault}>기본 프로필로 변경</Button>
          <Button onClick={onChangePicture}>다른 사진으로 변경</Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
}

export default ProfileModal;
