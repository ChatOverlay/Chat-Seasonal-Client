import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useMobileNavigate(closeOption, path, delay = 400) {
  const navigate = useNavigate();

  useEffect(() => {
    if (closeOption && window.innerWidth <= 480) {
      const timer = setTimeout(() => {
        navigate(path);
      }, delay);

      return () => clearTimeout(timer); 
    }
  }, [closeOption, navigate, path, delay]);
}
