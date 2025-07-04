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
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch('http://localhost:8000/user-service/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (res.ok) {
                const accessToken = res.headers.get('accessToken');
                const refreshToken = res.headers.get('refreshToken');


                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    const json = await res.json();
                    setAuthUser(json.data); // 상태 저장
                    await fetchUser(); // ✅ 여기서 /users/me 호출
                    navigate("/");
                }
            } else {
                setErrorMessage("아이디나 비밀번호가 일치하지 않습니다.\n입력 사항을 다시 확인해 주세요.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <UnderlayPhoto/>
            <UnderlayBlack/>
            <FormWrapper>
                <Title>로그인</Title>
                <form onSubmit={handleLogin}>
                    <Input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                    <Button type="submit" value="로그인"/>
                </form>
                <JoinButton onClick={() => navigate('/auth/signup')}>
                    회원가입하기
                </JoinButton>
            </FormWrapper>
        </>
    );
}

const hueRotate = keyframes`
    from {
        filter: grayscale(30%) hue-rotate(0deg);
    }
    to {
        filter: grayscale(30%) hue-rotate(360deg);
    }
`;

const UnderlayPhoto = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    background: url('https://31.media.tumblr.com/41c01e3f366d61793e5a3df70e46b462/tumblr_n4vc8sDHsd1st5lhmo1_1280.jpg');
    background-size: cover;
    z-index: -1;
    animation: ${hueRotate} 6s infinite;
    -webkit-filter: grayscale(30%);
`;

const UnderlayBlack = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: -1;
`;

const FormWrapper = styled.div`
    width: 90%;
    max-width: 400px;
    margin: 150px auto;
    padding: 2rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;

    @media (max-width: 600px) {
        margin: 80px auto;
        padding: 1.5rem;
    }
`;

const Title = styled.h1`
    color: white;
    margin-bottom: 2rem;
    font-size: clamp(1.6rem, 4vw, 2rem);
`;

const Input = styled.input`
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    margin: 1rem 0;
    padding: 0.5rem;
    width: 100%;
    font-size: 1rem;
    transition: 250ms background ease-in;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
        outline: none;
        background: white;
        color: black;

        &::placeholder {
            color: rgba(0, 0, 0, 0.7);
        }
    }
`;

const Button = styled.input`
    border: 1px solid white;
    background: transparent;
    color: white;
    margin-top: 20px;
    padding: 0.7rem 2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: 250ms background ease-in;

    &:hover,
    &:focus {
        background: white;
        color: black;
    }
`;

const JoinButton = styled.button`
    background: none;
    border: none;
    color: white;
    margin-top: 1rem;
    opacity: 0.6;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }
`;

const ErrorText = styled.div`
    white-space: pre-line;
    color: #ff5a5a;
    font-size: 0.9rem;
    margin-bottom: 1rem;
`;
