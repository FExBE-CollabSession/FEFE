import React, {useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const {setAuthUser, fetchUser} = useAuth();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const res = await fetch('/api/auths/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setAuthUser?.(data.data);
                await fetchUser?.();
                navigate("/main");
            } else {
                let message = "로그인 실패";
                try {
                    const data = await res.json();
                    message = data.message || message;
                } catch {
                    const text = await res.text();
                    if (text) message = text;
                }
                setErrorMessage(message);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <PageContainer>
            <BackgroundGradient />
            <LoginCard>
                <LogoSection>
                    <Subtitle>로그인</Subtitle>
                </LogoSection>

                <Form onSubmit={handleLogin}>
                    <InputGroup>
                        <Label>이메일</Label>
                        <Input
                            type="email"
                            placeholder="이메일을 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
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
                            autoComplete="current-password"
                        />
                    </InputGroup>

                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                    
                    <LoginButton type="submit">
                        로그인
                    </LoginButton>
                </Form>

                <SignupLink onClick={() => navigate('/signup')}>
                    계정이 없으신가요? 회원가입하기
                </SignupLink>
            </LoginCard>
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

const LoginCard = styled.div`
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

const LoginButton = styled.button`
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

const SignupLink = styled.button`
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

const ErrorText = styled.div`
    white-space: pre-line;
    color: #ff5a5a;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
    background: rgba(255, 90, 90, 0.1);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 90, 90, 0.2);
`;
