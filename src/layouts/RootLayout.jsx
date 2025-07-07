import {Outlet} from "react-router-dom";
import Header from "../components/Header.jsx";
import styled from "styled-components";

function RootLayout() {
    return (
        <Layout>
            <Header/>
            <Content>
                <Outlet/>
            </Content>
        </Layout>
    );
}

const Layout = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        overflow-x: hidden; // 모바일에서 좌우 스크롤 방지
    }
`;

const Content = styled.main`
    min-height: calc(100vh - 60px); // 전체 높이 - 헤더
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
        padding: 0 1rem; // 모바일 좌우 여백
        width: 100%;     // 전체 너비 사용
        box-sizing: border-box;
        align-items: stretch; // 콘텐츠가 꽉 차도록 정렬
    }
`;

export default RootLayout;