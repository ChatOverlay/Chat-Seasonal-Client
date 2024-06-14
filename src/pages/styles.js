import styled, { keyframes } from "styled-components";

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUpFromBottom = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDownToBottom = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-left: ${({ show }) => (show ? "5rem" : "25.05rem")};
  background-color: var(--background-color); // Theme applied
  transition: all 0.3s ease-in; // Apply transition only to opacity
  z-index: 21;
  height : 100vh;
  animation: ${slideInFromLeft} 0.2s ease-out forwards;
  @media (max-width: 480px) {
    margin-left: 0;
    width: 100vw;
    z-index : 30;
    animation: ${({ show }) => (!show ? slideUpFromBottom : slideDownToBottom)} 0.4s ease-in-out forwards; // Use 'forwards' to persist the end state
  }
`;
