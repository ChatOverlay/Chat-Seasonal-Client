import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { SharedStateProvider } from "./context/SharedStateContext";
import Chat from "./pages/chat/Chat";
import VerticalAppBar from "./components/navbar/VerticalAppBar";
import ChatList from "./pages/chat/ChatList";
import ProtectedRoute from "./routes/ProtectedRoute";
import RegisterPage from "./pages/login/RegisterPage";
import LoginPage from "./pages/login/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SharedStateProvider>
          <VerticalAppBar />
          <Routes>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<ChatList />} />
            
              <Route path="/chat/:titleName" element={<Chat />} />
            </Route>
          </Routes>
        </SharedStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
