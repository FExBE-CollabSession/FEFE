import React, { useState } from "react";
import styled from "styled-components";
import { FaPlus, FaBars } from "react-icons/fa";

const DAYS = ["월", "화", "수", "목", "금"];
const TIMES = [9, 10, 11, 12, 1, 2, 3, 4, 5];

const SEMESTERS = [
    "2025년 1학기",
    "2024년 2학기",
    "2024년 1학기"
];

const initialTimetables = {
    "2025년 1학기": [],
    "2024년 2학기": [],
    "2024년 1학기": [],
};

const COLORS = [
    "#F7B731", // 노랑
    "#4B7BEC", // 파랑
    "#26de81", // 연두
    "#fd9644", // 주황
    "#eb3b5a", // 빨강
    "#45aaf2", // 하늘
    "#a55eea", // 보라
    "#20bf6b", // 초록
];

const DUMMY_SUBJECTS = [
    { name: "컴퓨터아키텍처", professor: "홍길동", time: "화 9-11", room: "복-106" },
    { name: "자료구조및실습", professor: "이몽룡", time: "화 12-1", room: "복-621" },
    { name: "자바프로그래밍", professor: "성춘향", time: "수 12-1", room: "복-621" },
    { name: "웹클라이언트컴퓨팅", professor: "임꺽정", time: "월 2-3", room: "복-621" },
    { name: "경찰체력단련1", professor: "변학도", time: "화 3-4", room: "혜-301" },
    { name: "MZ세대창의력", professor: "최길동", time: "목 3-4", room: "혜-311" },
];

const cellKey = (day, time) => `${day}-${time}`;

function parseTimeString(timeStr) {
    const [day, range] = timeStr.split(" ");
    if (!day || !range) return { day: null, times: [] };
    let [start, end] = range.split("-").map(Number);
    const startIdx = TIMES.indexOf(start);
    const endIdx = TIMES.indexOf(end);
    if (startIdx === -1 || endIdx === -1) return { day, times: [] };
    const times = TIMES.slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1);
    return { day, times };
}

function pickColor(usedColors) {
    for (let c of COLORS) {
        if (!usedColors.includes(c)) return c;
    }
    // 다 쓰면 랜덤
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function Home() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0]);
    const [showSemesterList, setShowSemesterList] = useState(false);
    const [timetables, setTimetables] = useState(initialTimetables);

    // 시간표에 수업 추가 (병합 블록)
    const handleAddSubject = (subject) => {
        const { day, times } = parseTimeString(subject.time);
        if (!day || times.length === 0) return;
        setTimetables(prev => {
            const current = prev[selectedSemester];
            // 중복 방지: 이미 같은 과목이 있으면 추가 X
            if (current.some(s => s.name === subject.name && s.day === day && s.times[0] === times[0])) return prev;
            // 색상 중복 방지
            const usedColors = current.map(s => s.color).filter(Boolean);
            const color = pickColor(usedColors);
            const newSubject = { ...subject, day, times, color };
            return { ...prev, [selectedSemester]: [...current, newSubject] };
        });
        setShowAddModal(false);
    };

    const handleSelectSemester = (semester) => {
        setSelectedSemester(semester);
        setShowSemesterList(false);
    };

    // 시간표 렌더링: 병합 블록 → 각 셀별 렌더링으로 변경
    function renderTableBody() {
        const blocks = timetables[selectedSemester];
        // 각 셀에 어떤 블록이 들어가는지 매핑
        const cellMap = {};
        blocks.forEach((block, idx) => {
            block.times.forEach((time, i) => {
                cellMap[cellKey(block.day, time)] = {
                    ...block,
                    isFirst: i === 0,
                    isLast: i === block.times.length - 1,
                    idx,
                };
            });
        });
        return TIMES.map(time => (
            <tr key={time}>
                <TimeCell>{time}</TimeCell>
                {DAYS.map(day => {
                    const key = cellKey(day, time);
                    const cell = cellMap[key];
                    if (cell) {
                        let style = {};
                        if (cell.isLast) {
                            style.background = `linear-gradient(to bottom, ${cell.color} 75%, #fff 75%)`;
                            style.color = "#fff";
                        } else {
                            style.background = cell.color;
                            style.color = "#fff";
                        }
                        style.fontWeight = 500;
                        style.verticalAlign = "top";
                        style.border = "none";
                        style.position = "relative";
                        return (
                            <TableCell key={key} style={style}>
                                {cell.isFirst && (
                                    <SubjectBlock>
                                        <div style={{fontSize: "1.08em", fontWeight: 600, lineHeight: 1.3}}>{cell.name}</div>
                                        <div style={{fontSize: "0.98em", marginTop: 2}}>{cell.room}</div>
                                    </SubjectBlock>
                                )}
                            </TableCell>
                        );
                    } else {
                        return <TableCell key={key}></TableCell>;
                    }
                })}
            </tr>
        ));
    }

    return (
        <TimetableFullWrapper>
            <TimetableWrapper>
                <TimetableHeader>
                    <Semester>{selectedSemester}</Semester>
                    <Title>시간표</Title>
                    <HeaderIcons>
                        <IconButton onClick={() => setShowAddModal(true)} title="수업 추가">
                            <FaPlus size={24} />
                        </IconButton>
                        <IconButton title="메뉴" onClick={() => setShowSemesterList(v => !v)}>
                            <FaBars size={24} />
                        </IconButton>
                        {showSemesterList && (
                            <SemesterDropdown>
                                {SEMESTERS.map(sem => (
                                    <SemesterItem
                                        key={sem}
                                        onClick={() => handleSelectSemester(sem)}
                                        $selected={sem === selectedSemester}
                                    >
                                        {sem}
                                    </SemesterItem>
                                ))}
                            </SemesterDropdown>
                        )}
                    </HeaderIcons>
                </TimetableHeader>
                <TableBox>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th></th>
                                {DAYS.map(day => (
                                    <th key={day}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableBody()}
                        </tbody>
                    </StyledTable>
                </TableBox>
            </TimetableWrapper>
            {showAddModal && (
                <ModalOverlay onClick={() => setShowAddModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3>수업 추가</h3>
                        <SubjectList>
                            {DUMMY_SUBJECTS.map((subject, idx) => (
                                <SubjectItem key={idx} onClick={() => handleAddSubject(subject)}>
                                    <strong>{subject.name}</strong> <span>({subject.professor})</span>
                                    <SubjectTime>{subject.time} / {subject.room}</SubjectTime>
                                </SubjectItem>
                            ))}
                        </SubjectList>
                        <button onClick={() => setShowAddModal(false)}>닫기</button>
                    </ModalContent>
                </ModalOverlay>
            )}
        </TimetableFullWrapper>
    );
}

export default Home;

const TimetableFullWrapper = styled.div`
    margin-top: 2rem;
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafbfc;
`;

const TimetableWrapper = styled.div`
    width: 700px;
    max-width: 95vw;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    padding: 48px 32px 32px 32px;
`;

const TimetableHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
`;

const Semester = styled.div`
    color: #b71c1c;
    font-size: 1.2rem;
    font-weight: 500;
`;

const Title = styled.h2`
    font-size: 2.3rem;
    font-weight: 700;
    margin: 0 20px 0 0;
`;

const HeaderIcons = styled.div`
    margin-left: auto;
    display: flex;
    gap: 16px;
    position: relative;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    &:hover { opacity: 0.7; }
`;

const SemesterDropdown = styled.ul`
    position: absolute;
    top: 120%;
    right: 0;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    min-width: 140px;
    z-index: 10;
    padding: 4px 0;
`;

const SemesterItem = styled.li`
    padding: 10px 18px;
    font-size: 1.05rem;
    color: ${({$selected}) => $selected ? '#fff' : '#b71c1c'};
    background: ${({$selected}) => $selected ? '#b71c1c' : 'transparent'};
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.15s;
    &:hover {
        background: #f5eaea;
        color: #b71c1c;
    }
`;

const TableBox = styled.div`
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 18px;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td {
        border: 1px solid #eee;
        text-align: center;
        min-width: 60px;
        height: 60px;
        font-size: 1.15rem;
    }
    th {
        background: #fafafa;
        font-weight: 600;
        font-size: 1.1rem;
        width: 100px;
        max-width: 100px;
    }
    td {
        width: 100px;
        max-width: 100px;
    }
`;

const TimeCell = styled.td`
    background: #fafafa;
    font-weight: 500;
    color: #bdbdbd;
`;

const TableCell = styled.td`
    background: #fff;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 32px 24px;
    min-width: 280px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    text-align: center;
`;

const SubjectList = styled.ul`
    margin: 24px 0 16px 0;
    padding: 0;
    list-style: none;
`;
const SubjectItem = styled.li`
    padding: 12px 0 8px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1.08rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
    strong { color: #333; }
    span { color: #888; font-size: 0.98em; margin-left: 4px; }
    cursor: pointer;
    &:hover { background: #f5eaea; }
`;
const SubjectTime = styled.div`
    color: #b71c1c;
    font-size: 0.98em;
    margin-top: 2px;
`;

const SubjectBlock = styled.div`
    padding: 8px 0 8px 0;
    min-height: 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 0.98rem;
    line-height: 1.25;
    word-break: break-all;
    white-space: normal;
    text-align: left;
    width: 100%;
    strong, div {
        font-size: 0.98em;
        font-weight: 500;
        text-align: left;
        word-break: break-all;
        white-space: normal;
    }
`;