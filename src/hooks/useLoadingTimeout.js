import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useLoadingTimeout = (loading, timeoutDuration = 5000) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        localStorage.removeItem("token");
        alert("해당 내용을 찾을 수 없습니다. 다시 로그인해주세요.");
        navigate("/");
      }
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [loading, navigate, timeoutDuration]);
};

export default useLoadingTimeout;
