import React from "react";
import styled, { keyframes } from "styled-components";
import BackgroundImage from "../../assets/backgroundImg/Gachon_Muhan.jpg";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import CloudImage from "../../assets/backgroundImg/cloud.png";
import CloudLightImage from "../../assets/backgroundImg/cloudlight.png";
import { useTheme } from "../../context/ThemeContext";
export default function ChatList() {
  const location = useLocation(); // Get location object
  const message = location.state?.message || "수업을 클릭하여 참가해보세요."; // Default message or state-passed message
  const { theme } = useTheme();

  return (
    <AppContainer>
      <img
        src={theme.name === "light" ? CloudLightImage : CloudImage}
        alt="cloud"
      />
      {message}
    </AppContainer>
  );
}

// Define the animation using keyframes
const slideInFromLeft = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0.8;
  }
`;

// AppContainer with animation
const AppContainer = styled.div`
  display: flex;
  position: relative;
  margin-left: 25.05rem;
  height: 100vh;
  background-color: var(--background-color);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 1;
  gap : 1rem;
  color: var(--foreground-color);
  font-size: 2.5rem;
  font-weight: bold;
  transition: all 0.3s;
  padding : 0 4rem;
  animation: ${slideInFromLeft} 0.5s ease-out forwards;
  
  @media (max-width: 480px) {
    display : none;
  }
`;
