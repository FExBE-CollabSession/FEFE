// ./src/components/ClassCard.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const Card = styled.div`
  background-color: #f0f8ff;
  padding: 16px;
  margin: 12px 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Name = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

const Professor = styled.p`
  font-size: 1rem;
  color: #555;
`;

const Time = styled.p`
    font-size: 1rem;
    color: #555;
`;

const Room = styled.p`
    font-size: 1rem;
    color: #555;
`
const Title = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 6px;
`;

const Info = styled.p`
  font-size: 0.95rem;
  color: #444;
  margin: 2px 0;
`;


export default function ClassCard({ name, professor, time, room }) {
    const navigate = useNavigate();
  
    const handleClick = () => {
      // 수업 이름을 URL-safe하게 변환 (공백 제거)
      const path = `/class/${encodeURIComponent(name)}`;
      navigate(path);
    };
  
    return (
      <Card onClick={handleClick}>
        <Title>{name}</Title>
        <Info>👨‍🏫 교수: {professor}</Info>
        <Info>⏰ 시간: {time}</Info>
        <Info>🏫 강의실: {room}</Info>
      </Card>
    );
  }
