import React, {useState} from "react";
import styled, {keyframes} from "styled-components";
import {useNavigate} from "react-router-dom";
import {showSignupSuccessAlert} from "../utils/alert";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/users/sign-up", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password, username: name }),
            });
            if (res.ok) {
                await showSignupSuccessAlert(navigate);
                navigate('/');
            } else {
                const data = await res.json();
                alert(data.message || "회원가입 실패");
            }
        } catch (err) {
            alert("회원가입 중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    return (
        <PageContainer>
            <BackgroundGradient />
            <SignupCard>
                <LogoSection>
                    <Subtitle>회원가입</Subtitle>
                </LogoSection>

                <Form onSubmit={handleRegister}>
                    <InputGroup>
                        <Label>이메일</Label>
                        <Input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>이름</Label>
                        <Input
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>비밀번호</Label>
                        <Input
                            type="password"
                            placeholder="비밀번호를 입력"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </InputGroup>

                    <SignupButton type="submit">
                        회원가입
                    </SignupButton>
                </Form>

                <LoginLink onClick={() => navigate("/")}>
                    이미 계정이 있으신가요? 로그인하기
                </LoginLink>
            </SignupCard>
        </PageContainer>
    );
}

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
`;

const BackgroundGradient = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: -1;
`;

const SignupCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    animation: ${fadeIn} 0.6s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.2);

    @media (max-width: 480px) {
        padding: 30px 20px;
        margin: 10px;
    }
`;

const LogoSection = styled.div`
    text-align: center;
    margin-bottom: 30px;
`;

const Logo = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 10px 0;
    letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
    color: #666;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 500;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    margin-left: 4px;
`;

const Input = styled.input`
    padding: 15px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    color: #333;

    &::placeholder {
        color: #999;
    }

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:hover {
        border-color: #b8c2cc;
    }
`;

const SignupButton = styled.button`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const LoginLink = styled.button`
    background: none;
    border: none;
    color: #667eea;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 20px;
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
        color: #764ba2;
    }
`;