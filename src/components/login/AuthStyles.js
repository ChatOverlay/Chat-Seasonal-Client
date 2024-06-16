import styled, { keyframes } from "styled-components";

export const AuthContainer = styled.div`
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
  height: auto;
  padding: 3rem 5rem;
  opacity: 0.9;
  @media (max-width: 480px) {
    height: auto;
  }
`;

export const StyledImgContainer = styled.div`
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

export const StyledSlogan = styled.div`
  font-size: 1.3rem;
  font-family: "Noto Sans KR";
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const StyledImg = styled.img`
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

export const Container = styled.div`
  will-change: transform, opacity;
  animation: ${slideInRight} 0.5s forwards;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  justify-content: flex-end; /* FormContainer를 우측으로 정렬 */
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  gap: 1rem; /* 간격 추가 */
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
`;

export const SubmitButton = styled.div`
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

export const VerifyButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 6rem;
  font-size: 1rem;
  background-color: ${({ disabled }) => (disabled ? "#cccccc" : "#0164d8")};
  border-radius: 0.5rem;
  color: var(--background-color);
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: "Noto Sans KR";
  transition: all 0.3s ease;
  &:hover {
    opacity: ${({ disabled }) => (disabled ? "1" : "0.8")};
  }
`;

export const textFieldSx = (theme) => ({
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

export const formControlSx = {
  width: "100%",
  ".MuiInputLabel-root": {
    fontFamily: "Noto Sans KR",
  },
  ".MuiSelect-select": {
    fontFamily: "Noto Sans KR",
  },
};
