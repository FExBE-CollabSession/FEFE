// ./src/pages/CommuPage.jsx
import React from "react";
import { Wrapper, StyledParagraph } from "./CommuPage.styles";
import ClassCard from "../components/ClassCard"; 
export default function CommuPage() {
  const classes = [
    {
      name: "컴퓨터아키텍처",
      professor: "홍길동",
      time: "화 9-11",
      room: "복-106"
    },
    {
      name: "자료구조및실습",
      professor: "이몽룡",
      time: "화 12-1",
      room: "복-621"
    },
    {
        name: "자바프로그래밍",
        professor: "성춘향",
        time: "수 12-1", 
        room: "복-621" 
    },
    {
        name: "웹클라이언트컴퓨팅", 
        professor: "임꺽정", 
        time: "월 2-3", 
        room: "복-621" 
    },
    {
        name: "경찰체력단련1", 
        professor: "변학도", 
        time: "화 3-4", 
        room: "혜-301" 
    },
    {
        name: "MZ세대창의력", 
        professor: "최길동", 
        time: "목 3-4", 
        room: "혜-311" 
    }
  ];

  return (
    <Wrapper>
      <StyledParagraph>📚 이번 주 개설된 수업</StyledParagraph>
      {classes.map((c, i) => (
        <ClassCard key={i} name={c.name} professor={c.professor} time={c.time} room={c.room} />
      ))}
    </Wrapper>
  );
}
