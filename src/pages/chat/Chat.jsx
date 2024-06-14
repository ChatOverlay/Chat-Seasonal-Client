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

const socket = io(`${import.meta.env.VITE_API_URL}`); // 여러분의 서버 주소로 변경하세요

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
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
    if (!courseTime) {
      alert("해당 수업 시간이 아닙니다.");
      navigate("/chatlist");
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
    if (!verify) {
      if (window.confirm(`${reportedUsername}을(를) 신고하시겠습니까?`)) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/reportUser`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reportedUserId }),
            }
          );

          const data = await response.json();
          alert(data.message);
        } catch (error) {
          console.error("Error reporting user:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/course/${roomId}`, {
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
        const activeSession = isLectureInSession(data.courseTime); // Set the course name received from the server
        setCourseName(data.courseName);
        setCourseTime(activeSession);
      })
      .catch((error) => {
        alert("해당 수업을 클릭해서 접속해주세요."); // Custom alert message
        console.error("직접적인 접속을 제어합니다.", error);
      });
  }, [navigate, courseTime]);
  
  useEffect(() => {
    setMessages([]);
    socket.emit("joinRoom", titleName);
    socket.on("message", (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      scrollToBottom();
    });

    // 마일리지 정보 갱신 리스너
    socket.on("mileageUpdated", (data) => {
      setMileage(data.newMileage);
    });
    socket.on("error", (error) => {
      if (error.message) {
        alert(error.message); // Display error message
        navigate("/chatlist"); // Redirect if the course is not found
      }
    });
    return () => {
      socket.off("roomJoined");
      socket.off("message");

      socket.off("error");
      socket.off("mileageUpdated");
    };
  }, [navigate, titleName]);

  useEffect(() => {
    scrollToBottom(); // 메시지 목록이 업데이트 될 때마다 스크롤
  }, [messages]); // messages 배열이 변경될 때마다 실행

  // 여기서 초기 마일리지 로드 및 업데이트 로직 구현
  useEffect(() => {
    const token = localStorage.getItem("token");
    // 서버로부터 초기 마일리지 정보를 요청합니다.
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
                      !msg.isCurrentUser && ( // 여기에 조건을 추가
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
                      !msg.isCurrentUser && ( // 여기에 조건을 추가
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
//App 컨테이너
const AppContainer = styled.div`
  display: flex;
  position: relative;
  margin-left: ${({ show }) => (show ? "5rem" : "25.05rem")};
  background-color: var(--background-color);
  flex-direction: column;
  transition: all 0.3s ease-in; // Apply transition only to opacity
  height: 100vh;
  z-index: 25;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${BackgroundImage}); // Set the background image
    background-size: cover; // Cover the entire container
    background-repeat: no-repeat; // Prevent repeating the background image
    background-position: center; // Center the background image
    opacity: 0.3; // Set the opacity for the background image only
    z-index: -1; // Ensure the pseudo-element is behind the content
  }
  @media (max-width: 480px) {
    margin-left: 0;
    width: 100vw;
    height: 100vh;
    position: fixed; //이걸 해야 해당 스크롤하면서 올라올 때 자연스럽게 올라옴
    animation: ${({ show }) => (!show ? slideUpFromBottom : slideDownToBottom)}
      0.4s ease-in-out forwards;
  }
`;

//채팅 컨테이너
const ChatContainer = styled.div`
  height: 90%;
  display: flex;
  font-size: 1.3rem;
  flex-direction: column; // 메시지를 아래에서 위로 쌓도록 설정
  z-index: 100;
`;

//입력 컨테이너
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

//입력 칸
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

// 제출 버튼 컴포넌트
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


// 마일리지 정보와 전송 아이콘을 포함하는 별도의 컨테이너를 생성합니다.
const MileageContainer = styled.span`
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  color: var(--foreground-color);
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  margin-right: 1rem;
  border-radius: 1.5rem;
  white-space: nowrap; // 텍스트가 줄바꿈 되지 않도록 설정
  font-family: "Noto Sans KR";
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto; // 여기서 스크롤이 발생하도록 설정
  scrollbar-width: none; // 파이어폭스용 스크롤바 숨김
  -ms-overflow-style: none; // IE, 엣지용 스크롤바 숨김
  &::-webkit-scrollbar {
    display: none; // 웹킷(크롬, 사파리 등) 브라우저용 스크롤바 숨김
  }
  display: flex;
  flex-direction: column; // 메시지를 위에서 아래로 쌓음
  margin: 1rem;
`;

// 메시지 컨테이너에 이름을 표시하는 부분을 추가합니다.
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

// 사용자 이름을 표시하는 스타일 컴포넌트입니다.
const UserName = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.3rem;
  color: var(--primary-color);
  text-align: ${(props) => (props.user === "me" ? "right" : "left")};
`;
//아이콘 컨테이너
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--foreground-color);
`;

// 메시지 및 시간을 포함하는 ContentContainer에 적용할 스타일을 업데이트합니다.
const ContentContainer = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.user === "me"
      ? "row-reverse"
      : "row"}; // 사용자 본인이 보낸 메시지인 경우 시간을 왼쪽에, 아닌 경우 오른쪽에 위치시킵니다.
  align-items: flex-end; // 메시지와 시간을 같은 선상에 놓습니다.
  justify-content: ${(props) =>
    props.user === "me" ? "flex-end" : "flex-start"};
`;

// MessageTime 스타일 컴포넌트에 margin-left를 추가하여 메시지와 시간 사이 간격을 조정합니다.
const MessageTime = styled.div`
  font-size: 0.7rem;
  margin-left: 0.2rem;
  color: var(--primary-color);
  font-family: "Noto Sans KR";
  padding-bottom: 0.15rem;
`;

// Message 스타일 컴포넌트의 스타일을 조금 조정합니다.
const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 1.5rem;
  max-width : 85%;
  font-weight: bold;
  margin-left: 0.3rem;
  background-color: ${({ user }) =>
    user === "me" ? "var(--foreground-color)" : "var(--primary-color)"};
  color: var(--background-color);
  word-wrap: break-word;
  overflow-wrap: anywhere;
  @media (max-width: 480px) {
    font-size: 1.2rem;
    font-weight: 500;
  }
`;
