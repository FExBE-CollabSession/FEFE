import React, { useEffect } from "react";
import styled from "styled-components";
import ScrollReveal from "scrollreveal";

function Home() {
    useEffect(() => {
        ScrollReveal().reveal('.home-content', {
            delay: 200,
            distance: '50px',
            origin: 'bottom',
            duration: 1000,
            easing: 'ease-in-out'
        });
    }, []);

    return (
        <HomeContainer>
            <HomeContent className="home-content">
                <Title>CoSession에 오신 것을 환영합니다</Title>
                <Subtitle>함께하는 세션, 함께하는 성장</Subtitle>
                <Description>
                    CoSession은 사용자들이 함께 학습하고 성장할 수 있는 플랫폼입니다.
                </Description>
                <FeatureGrid>
                    <FeatureCard>
                        <FeatureIcon>📰</FeatureIcon>
                        <FeatureTitle>개발중</FeatureTitle>
                        <FeatureDesc>~~ 확인하세요</FeatureDesc>
                    </FeatureCard>
                    <FeatureCard>
                        <FeatureIcon>📅</FeatureIcon>
                        <FeatureTitle>개발중</FeatureTitle>
                        <FeatureDesc>~~ 관리하세요</FeatureDesc>
                    </FeatureCard>
                    <FeatureCard>
                        <FeatureIcon>👥</FeatureIcon>
                        <FeatureTitle>서비스 소개</FeatureTitle>
                        <FeatureDesc>CoSession의 다양한 기능을 알아보세요</FeatureDesc>
                    </FeatureCard>
                </FeatureGrid>
            </HomeContent>
        </HomeContainer>
    );
}

export default Home;

const HomeContainer = styled.div`
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
`;

const HomeContent = styled.div`
    text-align: center;
    max-width: 1200px;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: bold;
    
    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const Subtitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    font-weight: 300;
    
    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

const Description = styled.p`
    font-size: 1.1rem;
    margin-bottom: 3rem;
    opacity: 0.8;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
`;

const FeatureCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
`;

const FeatureIcon = styled.div`
    font-size: 3rem;
    margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
`;

const FeatureDesc = styled.p`
    opacity: 0.8;
    line-height: 1.5;
`;