import { useEffect } from 'react';

// 테마 스타일을 설정하는 커스텀 훅
function useThemeStyles(theme) {
  useEffect(() => {
    // 전역 CSS 변수 업데이트
    const root = document.documentElement;
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--foreground-color', theme.foreground);
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [theme]); // 테마 객체가 변경될 때만 업데이트
}

export default useThemeStyles;
