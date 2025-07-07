import React, { useState } from "react";
import styled from "styled-components";
import { FaPlus, FaBars } from "react-icons/fa";

const DAYS = ["월", "화", "수", "목", "금"];
const TIMES = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

const SEMESTERS = [
    "2025년 1학기",
    "2024년 2학기",
    "2024년 1학기"
];

const initialTimetables = {
    "2025년 1학기": {},
    "2024년 2학기": {},
    "2024년 1학기": {},
};

function Home() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0]);
    const [showSemesterList, setShowSemesterList] = useState(false);
    const [timetables, setTimetables] = useState(initialTimetables);

    const handleSelectSemester = (semester) => {
        setSelectedSemester(semester);
        setShowSemesterList(false);
    };

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
                            {TIMES.map(time => (
                                <tr key={time}>
                                    <TimeCell>{time}</TimeCell>
                                    {DAYS.map(day => (
                                        <TableCell key={day + time}></TableCell>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </TableBox>
            </TimetableWrapper>
            {showAddModal && (
                <ModalOverlay onClick={() => setShowAddModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3>수업 추가 (UI만)</h3>
                        <p>이곳에 수업 추가 폼이 들어갑니다.</p>
                        <button onClick={() => setShowAddModal(false)}>닫기</button>
                    </ModalContent>
                </ModalOverlay>
            )}
        </TimetableFullWrapper>
    );
}

export default Home;

const TimetableFullWrapper = styled.div`
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