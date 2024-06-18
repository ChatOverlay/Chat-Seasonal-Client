import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListBox.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import { useSharedState } from "../../context/SharedStateContext";
import useLoadingTimeout from "../../hooks/useLoadingTimeout";

export default function HomePage() {
  const navigate = useNavigate();
  const [upcomingCourse, setUpcomingCourse] = useState(null);
  const [totalMileage, setTotalMileage] = useState(0);
  const { newAdded } = useSharedState();
  const [loading, setLoading] = useState(true);
  const [mileageLoading, setMileageLoading] = useState(true);

  useLoadingTimeout(loading, 5000); // 로딩 시간 초과 시 Login 창으로 이동

  console.log("랜더링됨");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/courses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setUpcomingCourse(data.courseDetails);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchMileage = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/mileage`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setTotalMileage(data.totalMileage);
      } catch (error) {
        console.error("Error fetching mileage data:", error);
      } finally {
        setMileageLoading(false);
      }
    };

    fetchMileage();
  }, [newAdded]);

  const handleRoomClick = (room, courseCode, activeSession) => {
    if (!activeSession) {
      navigate(`/chat/${room}`, { state: { roomId: courseCode } });
    } else {
      alert("해당 수업시간이 아닙니다.");
    }
  };

  return (
    <div className="navbar__list home">
      <div className="scrollable-list-items">
        {loading ? (
          <div className="loading-container">
            <PulseLoader
              size={15}
              color={"var(--foreground-color)"}
              loading={loading}
            />
          </div>
        ) : (
          <>
            <Section>
              <SectionTitle>수업 바로가기</SectionTitle>
              {upcomingCourse ? (
                <div
                  className={`navbar__list__item_home ${
                    upcomingCourse.inSession ? "" : "inactive"
                  }`}
                  onClick={() =>
                    handleRoomClick(
                      upcomingCourse.lectureRoom,
                      upcomingCourse.courseCode,
                      upcomingCourse.inSession
                    )
                  }
                >
                  {!upcomingCourse.inSession && (
                    <div className="overlay">수업 시작 전입니다</div>
                  )}
                  <div className="question-container">
                    <div className="question-title-container">
                      <div>
                        {upcomingCourse.courseName}
                        {upcomingCourse.inSession ? (
                          <span> 🟢</span>
                        ) : (
                          <span> ⚪</span>
                        )}
                      </div>
                    </div>
                    <div className="question-date">
                      {upcomingCourse.lectureRoom}
                    </div>
                    <div className="sub-title-container">
                      {upcomingCourse.lectureTime}
                    </div>
                  </div>
                  <div className="icon__arrow__container">
                    <ArrowForwardIcon />
                  </div>
                </div>
              ) : (
                <SectionContent>다음 수업이 없습니다.</SectionContent>
              )}
            </Section>
            <Section>
              <SectionTitle>수업 참여 포인트</SectionTitle>
              {mileageLoading ? (
                <div className="loading-container">
                  <PulseLoader
                    size={15}
                    color={"var(--foreground-color)"}
                    loading={mileageLoading}
                  />
                </div>
              ) : totalMileage > 0 ? (
                <div
                  className={`navbar__list__item_home ${"inactive"}`}
                  style={{ color: "var(--primary-color)" }}
                >
                  {totalMileage} 포인트
                </div>
              ) : (
                <SectionContent>포인트 정보가 없습니다.</SectionContent>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  margin-left: 1rem;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const SectionContent = styled.div`
  font-size: 1rem;
  color: var(--foreground-color);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
