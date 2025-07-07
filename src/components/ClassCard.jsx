// ./src/components/ClassCard.jsx
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: #f0f8ff;
  padding: 16px;
  margin: 12px 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

export default function ClassCard({ name, professor, time, room }) {
  return (
    <Card>
      <Name>{name}</Name>
      <Professor>{professor}</Professor>
      <Time>{time}</Time>
      <Room>{room}</Room>
    </Card>
  );
}
