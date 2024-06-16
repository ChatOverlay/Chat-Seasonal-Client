import { useState, useEffect } from "react";
import { TextField, FormControl, InputLabel } from "@mui/material";
import Logo from "../../assets/backgroundImg/clatalk.png";
import { Link, useNavigate } from "react-router-dom";
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
  formControlSx,
  VerifyButton,
} from "./AuthStyles"; // 스타일 컴포넌트 임포트

export default function Signup() {
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState(""); // 학번 상태
  const [name, setName] = useState(""); // 이름 상태
  const [nickName, setNickName] = useState(""); // 별명 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [email, setEmail] = useState(""); // 이메일 상태
  const [course, setCourse] = useState(""); // 코스 상태
  const [verificationCode, setVerificationCode] = useState(""); // 인증 코드 상태
  const [courses, setCourses] = useState([]); // 모든 코스를 저장하는 상태
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 상태
  const [verificationSent, setVerificationSent] = useState(false); // 인증 코드 전송 상태
  const [isEmailButtonDisabled, setEmailButtonDisabled] = useState(true); // 이메일 확인 버튼 비활성화 상태

  useEffect(() => {
    // 모든 코스 가져오기
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/seasoncourses`
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error("코스를 가져오는 중 오류 발생:", response.statusText);
        }
      } catch (error) {
        console.error("코스를 가져오는 중 오류 발생:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // 이메일 입력 값이 변경될 때마다 버튼 비활성화 상태 업데이트
    setEmailButtonDisabled(!email.endsWith("@gachon.ac.kr") || verificationSent);
  }, [email, verificationSent]);

  const handleCheckEmail = async () => {
    if (!email.endsWith("@gachon.ac.kr")) {
      alert("이메일은 @gachon.ac.kr로 끝나야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/checkEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          alert("이미 사용 중인 이메일입니다.");
        } else {
          await sendVerificationCode(email);
          setVerificationSent(true);
          setEmailButtonDisabled(true); // 이메일 확인 버튼 비활성화
        }
      } else {
        console.error("이메일 확인 중 오류 발생:", response.statusText);
      }
    } catch (error) {
      console.error("이메일 확인 중 오류 발생:", error);
    }
    setLoading(false);
  };

  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/sendVerificationCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        alert("인증 코드가 전송되었습니다.");
      } else {
        console.error("인증 코드 전송 중 오류 발생:", response.statusText);
      }
    } catch (error) {
      console.error("인증 코드 전송 중 오류 발생:", error);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verifyEmailCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, verificationCode }),
        }
      );

      if (response.ok) {
        setEmailVerified(true);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        alert("잘못된 인증 코드입니다.");
      }
    } catch (error) {
      console.error("인증 코드 확인 중 오류 발생:", error);
    }
    setLoading(false);
  };

  // 회원가입 함수
  const handleSignup = async () => {
    if (
      !studentNumber ||
      !name ||
      !password ||
      !email ||
      !course ||
      !emailVerified
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/seasonal/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentNumber,
            name,
            password,
            email,
            course,
          }),
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
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
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
            label="학번"
            variant="outlined"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            sx={textFieldSx}
          />
        </InputContainer>
        <InputContainer>
          <TextField
            label="이름"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={textFieldSx}
          />
        </InputContainer>
        <InputContainer>
          <TextField
            label="별명 (선택사항)"
            variant="outlined"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            sx={textFieldSx}
          />
        </InputContainer>
        <InputContainer>
          <FormControl sx={formControlSx}>
            <select
              id="course-select"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              {courses.map((course) => (
                <option key={course._id} value={course.courseName}>
                  {course.courseName}-{course.courseCode}-{course.professor}
                </option>
              ))}
            </select>
          </FormControl>
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
        <InputContainer>
          <TextField
            label="학교 이메일"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={textFieldSx}
            disabled={verificationSent} // 이메일 입력 필드 비활성화
          />
          <VerifyButton
            onClick={handleCheckEmail}
            disabled={isEmailButtonDisabled} // 이메일 확인 버튼 비활성화
          >
            이메일 확인
          </VerifyButton>
        </InputContainer>
        {verificationSent && (
          <InputContainer>
            <TextField
              label="인증 코드"
              variant="outlined"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              sx={textFieldSx}
              disabled={emailVerified}
            />
              <VerifyButton onClick={handleVerifyCode}  disabled={emailVerified}>인증하기</VerifyButton>
          </InputContainer>
        )}
        <ButtonContainer>
          <SubmitButton onClick={handleSignup}>회원가입</SubmitButton>
        </ButtonContainer>
        <p>
          아이디가 있으신가요? <Link to="/">로그인하러가기</Link>
        </p>
      </Container>
    </AuthContainer>
  );
}
