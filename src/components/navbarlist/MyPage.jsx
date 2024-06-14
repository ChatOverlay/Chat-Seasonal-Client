import { useEffect, useRef, useState } from "react";
import "./ListBox.css";
import styled from "styled-components";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MyNavbarList from "./mypage/MyNavbarList";
import ProfileModal from "../modals/ProfileModal";
import { PulseLoader } from "react-spinners";
import useLoadingTimeout from "../../hooks/useLoadingTimeout";

export default function MyPage() {
  const [changeNameAble, setChangeNameAble] = useState(false);
  const [nickName, setNickName] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [mileage, setMileage] = useState(0); // 마일리지 상태 추가
  const [totalMileage, setTotalMileage] = useState(0); // 총 마일리지 상태 추가
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useLoadingTimeout(loading, 5000); //로딩 시간 넘을 시 Login 창으로 가게 처리

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleResetDefault = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/reset-profile-picture`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProfilePictureUrl(""); // 상태를 빈 문자열로 설정하여 UI에서 프로필 이미지를 제거
        setShowModal(false);
      } else {
        console.error("Failed to reset profile picture to default.");
      }
    } catch (error) {
      console.error("Error resetting profile picture to default:", error);
    }
  };
  //이미지 관련
  const handleChangePicture = () => {
    // 파일 입력 트리거
    fileInputRef.current.click();
    setShowModal(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    setShowModal(false);
    handleFileUpload(file); // 파일 업로드 처리 함수 호출
  };
  const handleFileUpload = async (file) => {
    // 파일 객체를 매개변수로 받도록 수정
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/upload-profile-picture`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Content-Type을 설정하지 않습니다.
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Profile picture uploaded successfully.");
        setProfilePictureUrl(data.profilePictureUrl); // 서버 응답에서 올바른 필드명 사용
      } else {
        console.error("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const updateNickName = async (newNickName) => {
    if (newNickName.length > 8) {
      alert("닉네임은 최대 8글자까지 가능합니다.");
      return; // 여기서 함수 실행을 중단합니다.
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update-nickname`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nickName: newNickName }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNickName(data.nickName);
        setChangeNameAble(false);
      } else {
        console.error("Failed to update nickname.");
      }
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setNickName(data.nickName);
            setProfilePictureUrl(data.profilePictureUrl);
          } else {
            console.error("Failed to fetch user info");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [profilePictureUrl]);

  return (
    <>
      <div className="navbar__list">
        {loading ? (
          <div className="loading-container">
            <PulseLoader size={15} color={"#123abc"} loading={loading} />
          </div>
        ) : (
          <>
            <MyContainer>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <IconContainer onClick={handleModal}>
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    style={{
                      width: "5rem",
                      height: "5rem",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <AccountCircleIcon sx={{ fontSize: "5rem" }} />
                )}
              </IconContainer>
              <NickNameContainer>
                {changeNameAble ? (
                  <InputContainer>
                    <NameInputContainer
                      onChange={(e) => setNickName(e.target.value)}
                      value={nickName}
                      placeholder="닉네임을 입력하세요.."
                    />
                    <SaveButton onClick={() => updateNickName(nickName)}>
                      닉네임 저장하기
                    </SaveButton>
                  </InputContainer>
                ) : (
                  <InputContainer>
                    <div>{nickName}</div>
                    <SaveButton onClick={() => setChangeNameAble(true)}>
                      닉네임 수정하기
                    </SaveButton>
                  </InputContainer>
                )}
              </NickNameContainer>
            </MyContainer>
            <MyNavbarList
              mileage={mileage}
              totalMileage={totalMileage}
            />
          </>
        )}
      </div>
      {showModal && (
        <ProfileModal
          onClose={handleModal}
          onResetDefault={handleResetDefault}
          onChangePicture={handleChangePicture}
        />
      )}
    </>
  );
}

//해당 내 프로필 컨테이너
const MyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3rem 0;
  border-bottom: 1px solid var(--foreground-color);
  color: var(--foreground-color);
`;

//아이콘 컨테이너
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--foreground-color);
  &:hover {
    opacity: 0.6;
  }
`;

const SaveButton = styled.button`
  padding: 0.3rem 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  border-radius: 0.5rem;
  font-weight: 700;
  font-family: "Noto Sans KR";
  background-color: var(--foreground-color); // 버튼 배경색 적용
  color: var(--background-color); // 버튼 텍스트 색상 적용
  &:hover {
    transform: scale(1.05);
    opacity: 0.8;
  }
  &:focus {
    outline: none;
  }
`;

//이름 컨테이너
const NickNameContainer = styled.div`
  display: flex;
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
`;

const NameInputContainer = styled.input`
  text-align: center;
  background-color: var(--background-color);
  color: var(--foreground-color);
  max-width: 10rem;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 5px;
  border-radius: 0.3rem;
  border: 1px solid var(--foreground-color);
  &:focus {
    outline: none;
  }
`;
