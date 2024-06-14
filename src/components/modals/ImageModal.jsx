import React from "react";
import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 25;
`;

const ModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  @media (max-width: 480px) {
    padding : 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  color: black;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.5;
  }
`;

const StyledImg = styled.img`
  width: auto;
  max-width: 80vw;
  max-height: 80vh;
  @media (max-width: 480px) {
    width: auto;
    height : auto;
    max-width: 80vw;
  }
`;

export default function ImageModal({ src, onClose }) {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <StyledImg src={src} alt="Enlarged" />
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ModalContent>
    </ModalBackdrop>
  );
}
