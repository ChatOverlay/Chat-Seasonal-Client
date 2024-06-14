import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import Logo from "../../assets/backgroundImg/clatalk.png";

import { useNavigate } from "react-router-dom";
import LoadingModal from "../modals/LoadingModal";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // 사용자 이메일을 저장하는 상태
  const [password, setPassword] = useState(""); // 사용자 비밀번호를 저장하는 상태
  const [autoLogin, setAutoLogin] = useState(false); // 자동 로그인 상태
  const [loading, setLoading] = useState(false);

  // 로그인 함수
  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/seasonallogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, autoLogin }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        navigate("../home");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
    setLoading(false); // Hide loading spinner
  };

  return (
    <LoginContainer>
      {loading && <LoadingModal />}
      <Container>
        <StyledImgContainer>
          <StyledImg src={Logo} alt="ClaTalk Logo" />
          <StyledSlogan>수업 참여의 새 기준</StyledSlogan>
        </StyledImgContainer>
        <InputContainer>
          <TextField
            id="outlined-basic"
            label="학교 아이디"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            sx={textFieldSx}
          />
        </InputContainer>
        <InputContainer>
          <TextField
            id="outlined-basic"
            label="비밀번호"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            sx={{
              width: "100%",
              color: `${({ theme }) => theme.primaryColor}`,
              ".MuiInputLabel-root": {
                color: `${({ theme }) => theme.background}`,
                fontFamily: "Noto Sans KR",
              }, // label color
              ".MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: `${({ theme }) => theme.background}`,
                }, // border color
                "&:hover fieldset": {
                  borderColor: `${({ theme }) => theme.background}`,
                }, // hover border color
                "&.Mui-focused fieldset": {
                  borderColor: `${({ theme }) => theme.background}`,
                }, // focus border color
              },
              ".MuiInputBase-input": {
                color: `${({ theme }) => theme.primaryColor}`,
              }, // 여기에서 입력 텍스트 색상을 지정합니다.
            }}
          />
        </InputContainer>
        <FormContainer>
          <FormControlLabel
            control={
              <Checkbox
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                name="autoLogin"
              />
            }
            label="자동 로그인"
            sx={{
              ".MuiTypography-root": {
                fontFamily: "Noto Sans KR",
                marginTop: "-0.1rem",
              },
              marginRight: "0",
            }}
          />
        </FormContainer>
        <ButtonContainer>
          <LoginButton onClick={handleLogin}>로그인</LoginButton>
        </ButtonContainer>
      </Container>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: #fff;
  color: #0064d8;
  border-radius: 1rem;
  width: 50%;
  height: 30rem;
  padding: 3rem 5rem;
  opacity: 0.9;
  @media (max-width: 480px) {
    height: 25rem;
  }
`;
const StyledImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  flex-direction: column;
  gap: 0.5rem;
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const StyledSlogan = styled.div`
  font-size: 1.3rem;
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const StyledImg = styled.img`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 30rem;
  @media (max-width: 480px) {
    width: 15rem;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0%);
    opacity: 1;
  }
`;

//이메일 컨테이너
const Container = styled.div`
  will-change: transform, opacity;
  animation: ${slideInRight} 0.5s forwards;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-end; /* FormContainer를 우측으로 정렬 */
`;

//해당 입력칸
const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
`;

const textFieldSx = (theme) => ({
  marginTop: "0.1rem",
  width: "100%",
  color: theme.primaryColor,
  ".MuiInputLabel-root": {
    color: theme.background,
    fontFamily: "Noto Sans KR",
  },
  ".MuiOutlinedInput-root": {
    "& fieldset": { borderColor: theme.background },
    "&:hover fieldset": { borderColor: theme.background },
    "&.Mui-focused fieldset": { borderColor: theme.background },
  },
  ".MuiInputBase-input": { color: theme.primaryColor },
});

const FormContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-right: 0;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
`;

// const buttonSx = {
//   display: "flex",
//   justifyContent: "center",
//   marginTop: "0.1rem",
//   paddingRight: "0.1rem",
//   height: "4rem",
//   backgroundColor: "0164D8",
//   color: "var(--background-color)",
//   borderRadius: "10rem",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     opacity: "0.8",
//     transform: "scale(1.05)",
//   },
// };
const LoginButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 4rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #0164d8;
  color: var(--background-color);
  border-radius: 0.5rem;

  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;
