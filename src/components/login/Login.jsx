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
  SignupButton as LoginButton, // SignupButton을 LoginButton으로 재사용
  textFieldSx,
} from "./SignupStyles"; // SignupStyles 임포트

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
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
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken); // JWT 토큰 저장
        alert("로그인 성공");
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
            label="이메일"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            sx={textFieldSx}
          />
        </InputContainer>
        <ButtonContainer>
          <LoginButton onClick={handleLogin}>로그인</LoginButton>
        </ButtonContainer>
        <p>계정이 없으신가요? <Link to="/signup">회원가입하러가기</Link></p>
      </Container>
    </AuthContainer>
  );
}