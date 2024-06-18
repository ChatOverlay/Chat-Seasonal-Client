import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styled, { keyframes } from "styled-components";
import SendIcon from "@mui/icons-material/Send";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/topbar/TopBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BackgroundImage from "../../assets/backgroundImg/Gachon_Muhan2.png";
import { useSharedState } from "../../context/SharedStateContext";
import { isLectureInSession } from "../../utils/timeUtils";
import useMobileNavigate from "../../hooks/useMobileNavigate";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  query: {
    token: localStorage.getItem('token') // JWT 토큰을 query에 포함
  }
});

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.roomId;
  const [message, setMessage] = useState(""); //메시지
  const [messages, setMessages] = useState([]); //메시지 배열
  const messagesEndRef = useRef(null);
  const [closeOption, setCloseOption] = useState(false);
  const [mileage, setMileage] = useState(0); // 사용자의 마일리지 상태
  const { addNewData } = useSharedState();
  const [courseName, setCourseName] = useState("");
  const { titleName } = useParams(); // Extract roomId from URL
  const [courseTime, setCourseTime] = useState(false);
  useMobileNavigate(closeOption, "/");
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (courseTime) {
      alert("해당 수업 시간이 아닙니다.");
      navigate("/chat");
      return;
    }
    if (message) {
      const token = localStorage.getItem("token");
      const messageObject = {
        text: message,
        token: token,
      };
      socket.emit("message", messageObject, titleName);
      setMessage("");
      scrollToBottom();
      socket.emit("updateMileage", { token });
      addNewData();
    }
  };

  const handleReport = async (reportedUserId, reportedUsername, verify) => {
    const token = localStorage.getItem("token");
    console.log(reportedUserId, reportedUsername, verify);
    if (!verify) {
      if (window.confirm(`${reportedUsername}을(를) 신고하시겠습니까?`)) {
        const reason = prompt("신고 사유를 입력하세요:");
        if (reason) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/report/reportUser`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reportedUserId, reason }),
              }
            );
  
            if (!response.ok) {
              if (response.status === 400) {
                // If the response status is 400, check the message
                const data = await response.json();
                if (data.message === '오늘 이미 이 사용자를 신고했습니다.') {
                  alert("오늘 이미 이 사용자를 신고했습니다.");
                } else {
                  throw new Error(`서버 오류: ${response.status} ${data.message}`);
                }
              } else {
                const errorText = await response.text();
                throw new Error(`서버 오류: ${response.status} ${errorText}`);
              }
            } else {
              const data = await response.json();
              alert(data.message);
            }
          } catch (error) {
            console.error("사용자 신고 중 오류 발생:", error);
            alert("사용자 신고 중 오류 발생: " + error.message);
          }
        } else {
          alert("신고 사유를 입력해야 합니다.");
        }
      }
    }
  };
  
  
  
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/seasoncourses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const activeSession = isLectureInSession(data.lectureTime);
        setCourseName(data.courseName);
        setCourseTime(activeSession);
      })
      .catch((error) => {
        alert("해당 수업을 클릭해서 접속해주세요.");
        console.error("직접적인 접속을 제어합니다.", error);
      });
  }, [navigate, courseId]);

  useEffect(() => {
    setMessages([]);
    socket.emit("joinRoom", titleName);
    socket.on("message", (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      scrollToBottom();
    });

    console.log(messages);
    socket.on("mileageUpdated", (data) => {
      setMileage(data.newMileage);
    });
    socket.on("error", (error) => {
      if (error.message) {
        alert(error.message);
        navigate("/chat");
      }
    });
    return () => {
      socket.off("roomJoined");
      socket.off("message");
      socket.off("error");
      socket.off("mileageUpdated");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.emit("getInitialMileage", { token });
  }, []);

  return (
    <>
      <AppContainer show={closeOption}>
        <TopBar
          closeOption={closeOption}
          setCloseOption={setCloseOption}
          titleName={courseName}
        />
        <ChatContainer>
          <MessagesContainer>
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <MessageContainer
                  user={msg.isCurrentUser ? "me" : ""}
                  onClick={() =>
                    handleReport(
                      msg.userId,
                      msg.userName,
                      msg.isCurrentUser ? "me" : ""
                    )
                  }
                >
                  {!msg.isCurrentUser && <UserName>{msg.userName}</UserName>}
                  <ContentContainer user={msg.isCurrentUser ? "me" : ""}>
                    {msg.profilePictureUrl &&
                      !msg.isCurrentUser && (
                        <IconContainer>
                          <img
                            src={msg.profilePictureUrl}
                            alt="profile"
                            style={{
                              width: "2rem",
                              height: "2rem",
                              borderRadius: "50%",
                            }}
                          />
                        </IconContainer>
                      )}
                    {!msg.profilePictureUrl &&
                      !msg.isCurrentUser && (
                        <AccountCircleIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "  var(--primary-color)",
                          }}
                        />
                      )}
                    <Message user={msg.isCurrentUser ? "me" : ""}>
                      {msg.text}
                    </Message>
                    <MessageTime>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </MessageTime>
                  </ContentContainer>
                </MessageContainer>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <InputContainer>
            <StyledInput
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
            />
            <StyledButton onClick={sendMessage} disabled={!message.trim()}>
              <MileageContainer>{mileage} / 100</MileageContainer>
              <SendIcon />
            </StyledButton>
          </InputContainer>
        </ChatContainer>
      </AppContainer>
    </>
  );
}

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

const AppContainer = styled.div`
  display: flex;
  position: relative;
  margin-left: ${({ show }) => (show ? "5rem" : "25.05rem")};
  background-color: var(--background-color);
  flex-direction: column;
  transition: all 0.3s ease-in;
  font-family : "Noto Sans KR";
  height: 100vh;
  z-index: 25;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${BackgroundImage});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.3;
    z-index: -1;
  }
  @media (max-width: 480px) {
    margin-left: 0;
    width: 100vw;
    height: 100vh;
    position: fixed;
    animation: ${({ show }) => (!show ? slideUpFromBottom : slideDownToBottom)}
      0.4s ease-in-out forwards;
  }
`;

const ChatContainer = styled.div`
  height: 90%;
  display: flex;
  font-size: 1.3rem;
  flex-direction: column;
  z-index: 100;
`;

const InputContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  background-color: var(--background-color);
  color: var(--primary-color);
  justify-content: space-between;
  box-shadow: 0 -4px 4px 0 rgba(0, 0, 0, 0.2);
`;

const StyledInput = styled.input`
  border: none;
  padding-left: 1rem;
  border-radius: 2rem;
  color: var(--primary-color);
  background-color: var(--background-color);
  font-size: 1.2rem;
  width: 100%;
  font-family: "Noto Sans KR";
  &:focus {
    outline: none;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--foreground-color);
  border-radius: 2rem;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.8)};
  }
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const MileageContainer = styled.span`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  color: var(--foreground-color);
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  margin-right: 1rem;
  border-radius: 1.5rem;
  white-space: nowrap;
  font-family: "Noto Sans KR";
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  flex-direction: column;
  padding : 1rem;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.user === "me" ? "flex-end" : "flex-start")};
  margin-bottom: 1rem;
  cursor: ${(props) => (props.user === "me" ? "" : "pointer")};
  transition: all 0.3s;
  &:hover {
    opacity: ${(props) => (props.user === "me" ? "" : "0.6")};
  }
`;

const UserName = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.3rem;
  color: var(--primary-color);
  text-align: ${(props) => (props.user === "me" ? "right" : "left")};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--foreground-color);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.user === "me" ? "row-reverse" : "row"};
  align-items: flex-end;
  justify-content: ${(props) =>
    props.user === "me" ? "flex-end" : "flex-start"};
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  margin-left: 0.2rem;
  color: var(--primary-color);
  font-family: "Noto Sans KR";
  padding-bottom: 0.15rem;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 1.5rem;
  max-width: 85%;
  font-weight: bold;
  
  margin-left: 0.3rem;
  background-color: ${({ user }) =>
    user === "me" ? "var(--foreground-color)" : "var(--primary-color)"};
  color: var(--background-color);
  word-wrap: break-word;
  overflow-wrap: anywhere;
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;
