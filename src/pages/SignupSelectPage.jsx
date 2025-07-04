import {useNavigate} from "react-router-dom";
import {useState} from "react";
import styled, {keyframes} from "styled-components";
import TermsAgreement from "../pages/TermsAgreement";

export default function SignupSelectPage() {
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false);

    const handleMove = (path) => {
        if (!isAgreed) {
            return;
        }
        navigate(path);
    };

    return (
        <>
            <UnderlayPhoto/>
            <UnderlayBlack/>
            <Container>
                <Title>회원가입</Title> {/* ✅ clamp 크기 적용 */}
                <TermsAgreement onAgreeChange={(agreement) => {
                    const agreed = agreement.terms && agreement.community && agreement.personalInfo && agreement.age14;
                    setIsAgreed(agreed);
                }}/>
                <ButtonRow>
                    <Button disabled={!isAgreed} onClick={() => handleMove("/auth/signup/police")}>
                        경찰 회원가입
                    </Button>
                    <Button disabled={!isAgreed} onClick={() => handleMove("/auth/signup/general")}>
                        일반 회원가입
                    </Button>
                </ButtonRow>
            </Container>

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

const Container = styled.div`
    text-align: center;
    margin-top: 100px;
    padding: 0 1rem;
    color: white;
`;

const ButtonRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 2rem;
    padding: 0 1rem;
`;


const Button = styled.button`
    flex: 1 1 calc(50% - 12px);
    max-width: calc(50% - 12px);
    padding: 0.8rem 1rem;
    border: 1px solid white;
    background: transparent;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.25s ease;
    white-space: nowrap;
    text-align: center;

    &:hover {
        background: white;
        color: black;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;


const Title = styled.h1`
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    margin-bottom: 2rem;
`;
