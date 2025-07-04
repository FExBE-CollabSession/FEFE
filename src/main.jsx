import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from "./App.jsx";
import "./App.css";

import RootLayout from "./layouts/RootLayout.jsx";
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from "./pages/SignupPage.jsx";

import {AuthProvider} from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout/>}>
                    <Route index element={<App/>}/>
                    <Route path="auth/login" element={<LoginPage/>}/>
                    <Route path="auth/signup" element={<SignupPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);
