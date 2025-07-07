import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header.jsx';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Footer from './components/Footer.jsx';
import CommuPage from './pages/CommuPage.jsx';
import 'remixicon/fonts/remixicon.css';
import 'boxicons/css/boxicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ClassDetailPage from './pages/ClassDetailPage';


// 로그인이 필요한 컴포넌트를 감싸는 래퍼
function ProtectedRoute({ children }) {
    const { authUser } = useAuth();
    
    if (!authUser) {
        return <Navigate to="/" replace />;
    }
    
    return children;
}

// 메인 앱 컴포넌트
function AppContent() {
    const { authUser } = useAuth();

    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={
                            authUser ? <Navigate to="/main" replace /> : <LoginPage />
                        } />
                        <Route path="/signup" element={
                            authUser ? <Navigate to="/main" replace /> : <SignupPage />
                        } />
                        <Route path="/main" element={<Home />} />
                        <Route path="/commupage" element={<CommuPage />} />
                        <Route path="/class/:name" element={<ClassDetailPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}


// 최상위 App 컴포넌트
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
