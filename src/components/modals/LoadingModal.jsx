import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ModalBackdrop } from "./ImageModal";

export default function LoadingModal() {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let intervalId;
    const updateProgress = () => {
      if (loadingProgress < 100) {
        setLoadingProgress((prevProgress) => prevProgress + 1);
      } else if (loadingProgress > 100) {
        setLoadingProgress(100);
      } else {
        clearInterval(intervalId);
      }
    };

    intervalId = setInterval(updateProgress, 150);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ModalBackdrop style={{ flexDirection: "column" }}>
      <Loader />
      <LoadingMessage>
        이메일 코드 전송중.....
        <LoadingProgress>{loadingProgress}%</LoadingProgress>
      </LoadingMessage>
    </ModalBackdrop>
  );
}
const LoadingMessage = styled.span`
  color: white;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
`;
const getBorderColor = (progress) => {
  const hue = progress * 2;
  return `hsl(${hue}, 100%, 50%)`;
};

const Loader = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 6px solid rgba(0, 0, 0, 0.1);
  border-left-color: #09f;
  animation: spin 2s infinite linear;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes progress {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(${(props) => props.progress * 3.6}deg);
    }
  }
`;
const LoadingProgress = styled.span`
  margin-left: 10px;
  font-weight: bold;
`;
