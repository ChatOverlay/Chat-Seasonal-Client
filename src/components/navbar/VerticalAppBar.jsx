import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// import FilterFramesIcon from "@mui/icons-material/FilterFrames";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home"; // 홈 아이콘 추가

import HomePage from "../navbarlist/Homepage";
import MyPage from "../navbarlist/MyPage";
import Setting from "../setting/Setting";


import CloudDefaultImg from "../../assets/backgroundImg/cloud.png";
import CloudLightImg from "../../assets/backgroundImg/cloudlight.png";
import { useTheme } from "../../context/ThemeContext";

// const ChatIcon = () => (
//   <svg
//     width="1em"
//     height="1em"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <g clipPath="url(#clip0_14_38)">
//       <path
//         d="M3 20L4.29899 16.1052C1.97679 12.6727 2.8741 8.24358 6.39736 5.74489C9.92063 3.2472 14.9807 3.45193 18.2332 6.22426C21.4856 8.99758 21.9253 13.4806 19.2614 16.7114C16.5974 19.9421 11.6523 20.9208 7.69635 19.0013L3 20Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <circle cx="8" cy="12" r="1" fill="currentColor" />
//       <circle cx="12" cy="12" r="1" fill="currentColor" />
//       <circle cx="16" cy="12" r="1" fill="currentColor" />
//     </g>
//   </svg>
// );

export default function VerticalAppBar() {
  const navigate = useNavigate();
  const [section, setSection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState(0);
  const { theme } = useTheme();
  const sectionTitles = {
    0: "클라톡",
    1: "MY",
  };

  let cloudImg;
  switch (theme.name) {
    case "light":
      cloudImg = CloudLightImg;
      break;
    default:
      cloudImg = CloudDefaultImg;
  }

  const sectionComponents = {
    0: <HomePage />,
    1: <MyPage />,
  };

  const renderSectionComponent = (section) =>
    sectionComponents[section] || null;

  const setSectionAndActiveIcon = (section, icon) => {
    setSection(section);
    setActiveIcon(icon);
    localStorage.setItem("activeSection", section);
  };

  const handleOption = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("activeSection");
      alert("성공적으로 로그아웃 되었습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection !== null) {
      setSectionAndActiveIcon(Number(savedSection), Number(savedSection));
    } else {
      setSectionAndActiveIcon(0, 0);
    }
  }, [location.pathname]);


  return (
    <>
      <Footer>
        <FooterTitle>
          {sectionTitles[section]}{" "}
          <img
            src={cloudImg}
            alt="cloud"
            style={{ paddingTop: "0.3rem", width: "1.5rem" }}
          />
        </FooterTitle>
        <FooterIconContainer>
          <IconContainer style={{ opacity: 1 }} onClick={handleOption}>
            <SettingsIcon />
          </IconContainer>
          {activeIcon === 3 && (
            <IconContainer onClick={handleLogout} style={{ opacity: 1 }}>
              <LogoutIcon />
            </IconContainer>
          )}
        </FooterIconContainer>
      </Footer>
      <AppBar>
        <FirstIconWrapper>
          <IconContainer
            onClick={() => setSectionAndActiveIcon(0, 0)}
            active={activeIcon === 0}
          >
            <HomeIcon />
            <span>홈</span>
          </IconContainer>
          <IconContainer
            onClick={() => setSectionAndActiveIcon(1, 1)}
            active={activeIcon === 1}
          >
            <AccountCircleIcon />
            <span>MY</span>
          </IconContainer>
        </FirstIconWrapper>
        <SecondIconWrapper>
          <IconContainer onClick={handleOption}>
            <SettingsIcon />
            <span>설정</span>
          </IconContainer>
          <IconContainer onClick={handleLogout}>
            <LogoutIcon />
            <span>로그아웃</span>
          </IconContainer>
        </SecondIconWrapper>
      </AppBar>
      {renderSectionComponent(section)}
      {isModalOpen && <Setting handleOption={handleOption} />}
    </>
  );
}

const AppBar = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  background-color: var(--background-color);
  color: var(--primary-color);
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 5rem;
  z-index: 23;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.9);
  @media (max-width: 480px) {
    width: 100%;
    height: 6%;
    top: auto;
    bottom: 0;
    justify-content: space-between;
  }
`;

const FirstIconWrapper = styled.div`
  @media (max-width: 480px) {
    display: flex;
    width: 80%;
    height: 100%;
    justify-content: space-between;
  }
`;

const SecondIconWrapper = styled.div`
  margin-bottom: 2rem;
  @media (max-width: 480px) {
    display: none;
  }
`;

const IconContainer = styled.div`
  margin-top: 3vh;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.active ? "1" : "0.6")};

  box-shadow: none;
  -webkit-tap-highlight-color: transparent;
  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:hover {
    opacity: 1;
    span {
      visibility: visible;
      opacity: 1;
    }
  }
  svg {
    font-size: 2.5rem; /* 기본 크기 */
    margin-bottom: 0.5rem;

    @media (max-width: 480px) {
      font-size: 1.6rem; /* 모바일에서의 크기 */
      margin-bottom: 0;
    }
  }
  span {
    transition: visibility 0s, opacity 0.1s linear;
    font-size: 0.9rem;
    @media (max-width: 480px) {
      font-size: 0.7rem;
      font-weight: bold;
    }
  }

  @media (max-width: 480px) {
    margin-top: 0;
    flex-direction: column;
  }
`;

const Footer = styled.div`
  display : flex;
  background-color: var(--background-color);
  color: var(--foreground-color);
  @media (min-width: 480px) {
    height: 3rem;
    margin-left: 5rem;
    position : fixed;
    border-bottom: 1px solid var(--foreground-color);
    border-right: 1px solid var(--foreground-color);
    width: 20rem;
    svg {
      display: none;
    }
  }
  @media (max-width: 480px) {
    width: 100%;
    height: 6%;
    align-items: center;
    position: fixed;
    left: 0;
    z-index: 20;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 1rem;
  display : flex;
  gap : 0.2rem;
  align-items: center;
  margin-top : 0.5rem;
`;

const FooterIconContainer = styled.div`
  display: flex;
  margin-right: 1rem;
  margin-top : 0.4rem;
  gap: 1rem;
  transition: all 0.3s;
`;
