import React, { createContext, useContext, useEffect, useState } from 'react';
import useThemeStyles from '../hooks/useThemeStyles';

// 테마 스타일 정의
const themes = {
  default: {
    name : "default",
    foreground: "#0164D8",
    background: "#fff",
    primaryColor : "black",
    secondaryColor : "#f9f9f2",
  },
  dark: {
    name : "dark",
    foreground: "#3F93FF",
    background: "#202c39",
    primaryColor : "#FFFFFF",
    secondaryColor : "#202c45",
  },
  light : {
    name : "light",
    foreground: "#EFBC9B",
    background: "#FBF3D5",
    primaryColor: "black",
    secondaryColor : "#FFE5B4",
  },
  light2 : {
    name : "light",
    foreground: "#F0EDCC",
    background: "#02343F",
    primaryColor: "#FFFFFF",
  }
};

// Context 객체 생성
const ThemeContext = createContext();

// Provider 컴포넌트
export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    // Get the theme from localStorage or default to 'default'
    return localStorage.getItem('themeName') || 'default';
  });

  const theme = themes[themeName];
  useThemeStyles(theme); // 커스텀 훅 호출하여 스타일 적용

  // Update localStorage when themeName changes
  useEffect(() => {
    localStorage.setItem('themeName', themeName);
  }, [themeName]);

  // Provider에 제공할 값
  const value = {
    theme,
    setThemeName
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


// 테마를 사용하기 위한 커스텀 훅
export const useTheme = () => useContext(ThemeContext);
