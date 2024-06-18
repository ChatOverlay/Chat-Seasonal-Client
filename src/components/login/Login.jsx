import { useState } from "react";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/backgroundImg/clatalk.png";
import LoadingModal from "../modals/LoadingModal";
import {
  AuthContainer,
  StyledImgContainer,
  StyledSlogan,
  StyledImg,
  Container,
  InputContainer,
  ButtonContainer,
  SubmitButton,
  textFieldSx,
} from "./AuthStyles"; // SignupStyles 임포트

export default function Login() {
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!studentNumber || !password) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/seasonal/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentNumber, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken); // JWT 토큰 저장
        navigate("/home");
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <AuthContainer>
      {loading && <LoadingModal />}
      <Container>
        <StyledImgContainer>
          <StyledImg src={Logo} alt="ClaTalk Logo" />
          <StyledSlogan>수업 참여의 새 기준</StyledSlogan>
        </StyledImgContainer>
        <InputContainer>
          <TextField
            label="학번"
            variant="outlined"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={textFieldSx}
          />
        </InputContainer>
        <InputContainer>
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={textFieldSx}
          />
        </InputContainer>
        <ButtonContainer>
          <SubmitButton onClick={handleLogin}>로그인</SubmitButton>
        </ButtonContainer>
        <p>계정이 없으신가요? <Link to="/signup">회원가입하러가기</Link></p>
      </Container>
    </AuthContainer>
  );
}
