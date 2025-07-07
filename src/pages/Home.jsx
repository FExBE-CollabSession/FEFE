import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DAYS = ["월", "화", "수", "목", "금"];
const TIMES = [9, 10, 11, 12, 13, 14, 15, 16, 17];

const SEMESTERS = [
    "2025년 1학기"
];

const initialTimetables = {
    "2025년 1학기": [],
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

const cellKey = (day, time) => `${day}-${time}`;

function formatTimeToHHMM(str) {
    if (!str) return '';
    const match = str.match(/^(\d{1,2}:\d{2})/);
    return match ? match[1] : str;
}

function parseHourMinute(str) {
    if (!str) return NaN;
    str = formatTimeToHHMM(str);
    const [h, m] = str.split(":").map(Number);
    return h + (m ? m / 60 : 0);
}

function pickColor(usedColors) {
    for (let c of COLORS) {
        if (!usedColors.includes(c)) return c;
    }
    // 다 쓰면 랜덤
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function courseToBlocks(course) {
    console.log("courseToBlocks input:", course);
    const days = (course.lectureDay || "").split(",").map(d => d.trim());
    const start = parseHourMinute(course.startTime);
    const end = parseHourMinute(course.endTime);
    const startIdx = TIMES.indexOf(start);
    const endIdx = TIMES.indexOf(end);
    if (startIdx === -1 || endIdx === -1) {
        console.warn(`courseToBlocks: TIMES에 없는 시간! startTime=${start}, endTime=${end}, TIMES=`, TIMES);
        return [];
    }
    const times = TIMES.slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1);
    return days.map(day => ({
        ...course,
        day,
        times,
    }));
}

function Home() {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSemester] = useState(SEMESTERS[0]);
    const [timetables, setTimetables] = useState(initialTimetables);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [myCourseIds, setMyCourseIds] = useState(new Set()); // 내가 추가한 수업 ID들

    // API에서 전체 수업 목록을 가져오는 함수
    const fetchAllCourses = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch("/api/courses", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("전체 수업 목록 API 응답:", data); // 디버깅용 로그
                // API 응답 구조에 맞게 데이터 변환
                const courses = data.data.map(course => ({
                    id: course.id,
                    name: course.name || course.courseName,
                    professor: course.professor || course.instructor,
                    time: course.time || course.schedule,
                    room: course.room || course.classroom,
                }));
                setAvailableSubjects(courses);
            } else {
                setAvailableSubjects([]);
            }
        } catch (error) {
            setAvailableSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    // 사용자가 등록한 수업 목록을 가져오는 함수
    const fetchMyCourses = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        try {
            const response = await fetch("/api/courses/my", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                const myCourses = data.data;
                // 시간표 블록 변환
                const newTimetables = { ...initialTimetables };
                myCourses.forEach(course => {
                    const blocks = courseToBlocks(course);
                    blocks.forEach(block => {
                        const usedColors = newTimetables[selectedSemester].map(s => s.color).filter(Boolean);
                        const color = pickColor(usedColors);
                        newTimetables[selectedSemester].push({ ...block, color });
                    });
                });
                setTimetables(newTimetables);
                setMyCourseIds(new Set(myCourses.map(c => c.id)));
            }
        } catch (error) {
            console.error("내 수업 목록 조회 중 오류:", error);
        }
    };

    useEffect(() => {
        fetchAllCourses();
        fetchMyCourses(); // 사용자가 등록한 수업도 함께 로드
    }, []);

    const handleOpenAddModal = () => {
        fetchAllCourses();
        setShowAddModal(true);
    };

    // 시간표에 수업 추가 (백엔드 API 호출)
    const handleAddSubject = async (subject) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // 백엔드 API 호출하여 수업을 사용자 시간표에 추가
            const response = await fetch("/api/users/add-courses", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: subject.id
                }),
            });

            if (response.ok) {
                alert("수업이 성공적으로 추가되었습니다!");
                setShowAddModal(false);
                // 사용자의 수업 목록을 다시 불러와서 시간표 업데이트
                fetchMyCourses();
            } else {
                const errorData = await response.json();
                alert(`수업 추가 실패: ${errorData.message || "알 수 없는 오류가 발생했습니다."}`);
            }
        } catch (error) {
            console.error("수업 추가 중 오류:", error);
            alert("수업 추가 중 오류가 발생했습니다.");
        }
    };

    // 시간표에서 수업 클릭 시 해당 커뮤니티로 이동
    const handleSubjectClick = (courseId, courseName) => {
        // 클릭 효과를 위한 임시 스타일 변경
        const cell = event.target.closest('.clickable-cell');
        if (cell) {
            cell.style.transform = 'scale(0.95)';
            setTimeout(() => {
                cell.style.transform = '';
            }, 150);
        }
        
        // 커뮤니티로 이동
        navigate(`/commupage?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`);
    };

    function renderTableBody() {
        const blocks = timetables[selectedSemester];
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
                            <TableCell 
                                key={key} 
                                style={style}
                                onClick={() => handleSubjectClick(cell.id, cell.name)}
                                className="clickable-cell"
                                title={`${cell.name} 커뮤니티로 이동하기`}
                            >
                                {cell.isFirst && (
                                    <SubjectBlock>
                                        <div style={{fontSize: "1.08em", fontWeight: 600, lineHeight: 1.3}}>{cell.name}</div>
                                        <div style={{fontSize: "0.98em", marginTop: 2}}>{cell.room}</div>
                                        <div style={{fontSize: "0.8em", marginTop: 4, opacity: 0.8}}>💬 클릭하여 커뮤니티로</div>
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
                        <IconButton onClick={handleOpenAddModal} title="수업 추가">
                            <FaPlus size={24} />
                        </IconButton>
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
                        {loading ? (
                            <LoadingText>수업 목록을 불러오는 중...</LoadingText>
                        ) : (
                            <SubjectList>
                                {availableSubjects
                                    .filter(subject => !myCourseIds.has(subject.id))
                                    .map((subject, idx) => (
                                        <SubjectItem key={idx} onClick={() => handleAddSubject(subject)}>
                                            <strong>{subject.name}</strong> <span>({subject.professor})</span>
                                            <SubjectTime>{subject.time} / {subject.room}</SubjectTime>
                                        </SubjectItem>
                                    ))}
                                {availableSubjects.filter(subject => !myCourseIds.has(subject.id)).length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        추가할 수 있는 수업이 없습니다.
                                    </div>
                                )}
                            </SubjectList>
                        )}
                        <CloseButton onClick={() => setShowAddModal(false)}>닫기</CloseButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </TimetableFullWrapper>
    );
}

export default Home;

const TimetableFullWrapper = styled.div`
    margin-top: 4rem;
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
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.clickable-cell:hover {
        transform: scale(1.02);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 1;
    }
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
    max-height: 50vh;
    overflow-y: auto;
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

const LoadingText = styled.div`
    text-align: center;
    padding: 20px;
    color: #666;
    font-size: 1rem;
`;

const CloseButton = styled.button`
    margin-top: 12px;
    padding: 8px 28px;
    background: linear-gradient(90deg, #4B7BEC 60%, #45aaf2 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.08rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(75, 123, 236, 0.08);
    transition: background 0.2s, transform 0.15s;
    &:hover {
        background: linear-gradient(90deg, #3a5fc8 60%, #1e90ff 100%);
        transform: translateY(-2px) scale(1.04);
    }
`;