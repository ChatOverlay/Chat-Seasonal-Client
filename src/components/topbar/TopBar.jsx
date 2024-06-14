import React, { useState, useEffect } from "react";
import styled from "styled-components";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// 스타일 컴포넌트 정의
const TopBarContainer = styled.div`
  display: flex;
  font-size: 1.8rem;
  min-height: 4rem;
  align-items: center;
  position: sticky;
  background-color: var(--secondary-color);
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  color: var(--foreground-color);
  padding: 0 1rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.2rem 0.5rem 0 0;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 3rem;
  &:hover {
    opacity: 0.6;
  }
`;

const NumberContainer = styled.div`
  padding-left: 0.5vw;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

// 컴포넌트 구현
export default function TopBar({ closeOption, setCloseOption, titleName }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <TopBarContainer>
      <IconContainer onClick={() => setCloseOption(!closeOption)}>
        {isMobile ? (
          <ArrowBackIcon />
        ) : closeOption ? (
          <KeyboardDoubleArrowRightIcon />
        ) : (
          <KeyboardDoubleArrowLeftIcon />
        )}
      </IconContainer>
      <NumberContainer>{titleName}</NumberContainer>
    </TopBarContainer>
  );
}
