import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CommuPage from './pages/CommuPage.jsx';
import 'remixicon/fonts/remixicon.css';
import 'boxicons/css/boxicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ClassDetailPage from './pages/ClassDetailPage';
import MyPage from './pages/MyPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 메인 앱 컴포넌트
function AppContent() {
    // 로그인 여부는 localStorage에서 accessToken 존재 여부로 판별
    const isLoggedIn = !!localStorage.getItem('accessToken');

    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={
                            isLoggedIn ? <Navigate to="/main" replace /> : <LoginPage />
                        } />
                        <Route path="/signup" element={
                            isLoggedIn ? <Navigate to="/main" replace /> : <SignupPage />
                        } />
                        <Route path="/main" element={<Home />} />
                        <Route path="/commupage" element={<CommuPage />} />
                        <Route path="/class/:name" element={<ClassDetailPage />} />
                        <Route path="/mypage" element={<MyPage />} />
                    </Routes>
                </main>
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </Router>
    );
}

// 최상위 App 컴포넌트
function App() {
    return <AppContent />;
}

export default App;
