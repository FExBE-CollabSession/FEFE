import styled from "styled-components";
import {useNavigate, Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import SwalGlobalStyle from "../styles/SwalGlobalStyle.jsx";
import {useEffect, useRef, useState} from "react";

function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleMenu = () => setMenuOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "로그아웃 하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "로그아웃",
            cancelButtonText: "취소",
            customClass: {
                popup: "custom-swal-popup",
                confirmButton: "custom-swal-button",
                cancelButton: "custom-swal-button",
            }
        });

        if (result.isConfirmed) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userInfo");
            window.location.reload();
        }
    };

    // 로그인 여부는 localStorage에서 accessToken 존재 여부로 판별
    const isLoggedIn = !!localStorage.getItem('accessToken');
    
    // 사용자 정보 가져오기
    const getUserInfo = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                return JSON.parse(userInfo);
            } catch (e) {
                return null;
            }
        }
        return null;
    };
    
    const userInfo = getUserInfo();

    return (
        <>
            <SwalGlobalStyle />
            <HeaderWrapper>
                <Logo to="/main">
                    <span style={{fontWeight: 700, fontSize: "1.5rem", color: "#4B7BEC"}}>CoSession</span>
                </Logo>
                <NavBar $isOpen={menuOpen}>
                    <li><Link to="/main">시간표</Link></li>
                    <li><Link to="/commupage">커뮤니티</Link></li>
                </NavBar>
                <HeaderBtn>
                    <Link to="/mypage">마이페이지</Link>
                    <MenuIcon onClick={toggleMenu}/>
                </HeaderBtn>
            </HeaderWrapper>
        </>
    );
}

const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(8px);
    padding: 15px 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        height: 1px;
        background: linear-gradient(to right, rgba(0, 0, 0, 0.0) 0%, lightgray 25%, lightgray 75%, rgba(0, 0, 0, 0.0) 100%);
    }

    @media (max-width: 991px) {
        padding: 18px 40px;
    }

    @media (max-width: 768px) {
        padding: 12px 20px;
    }
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    overflow: visible;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const MenuIcon = styled.i.attrs({
    className: "bx bx-menu",
    id: "menu-icon",
})`
    font-size: 24px;
    cursor: pointer;
    z-index: 110;
    display: none;

    @media (max-width: 768px) {
        display: block;
        margin-left: 12px;
    }
`;

const NavBar = styled.ul.attrs({className: "navbar"})`
    display: flex;
    justify-content: center;
    flex: 1;
    gap: 5rem;
    list-style: none;

    li {
        position: relative;
    }

    a {
        font-size: 1.3rem;
        padding: 10px 0;
        font-weight: 500;
        text-decoration: none;
        position: relative;
        color: #333;
        transition: all 0.3s ease;

        &:hover {
            color: #007bff;
            transform: translateY(-2px);
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: white;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        z-index: 999;
        gap: 0;
        transform: ${({$isOpen}) => ($isOpen ? "translateX(0)" : "translateX(100%)")};
        opacity: ${({$isOpen}) => ($isOpen ? 1 : 0)};
        pointer-events: ${({$isOpen}) => ($isOpen ? "auto" : "none")};
        transition: all 0.3s ease-in-out;

        li {
            width: 100%;
            opacity: 0;
            transform: translateX(20px);
            animation: ${({$isOpen}) => $isOpen ? 'slideIn 0.3s ease forwards' : 'none'};

            &:nth-child(1) { animation-delay: 0.1s; }
            &:nth-child(2) { animation-delay: 0.2s; }
            &:nth-child(3) { animation-delay: 0.3s; }
            &:nth-child(4) { animation-delay: 0.4s; }

            a {
                display: block;
                width: 100%;
                padding: 1rem 1.5rem; /* ✅ 간격 축소 */
                font-size: 1.1rem;
                color: #333;
                border-bottom: 1px solid #eee;

                &:hover {
                    background-color: #f5f5f5;
                }

                &::after {
                    display: none;
                }
            }
        }

        @keyframes slideIn {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    }
`;

const MobileNavHeader = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;   // ✅ 좌우 정렬
        align-items: center;
        width: 100%;                      // ✅ 전체 너비 사용
        padding: 0.6rem 1rem;             // ✅ 간격 살짝 축소
        border-bottom: 1px solid #eee;

        img {
            height: 36px;
        }
    }
`;


const CloseBtn = styled.button`
    background: none;
    border: none;
    font-size: 2rem;
    color: #333;
    cursor: pointer;
`;

const LinkStyled = styled(Link)`
    font-size: 1rem;
    padding: 10px 20px;
    color: var(--text-color);
    font-weight: 500;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        color: #007bff;
        transform: translateY(-2px);
    }
`;


const HeaderBtn = styled.div.attrs({className: "header-btn"})`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @media (max-width: 768px) {
        width: auto;
    }

    a {
        padding: 10px 20px;
        color: var(--text-color);
        font-weight: 500;
        cursor: pointer;
        display: inline-block;
        user-select: none;
        text-decoration: none;
    }
`;

const LogoutButton = styled.button`
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    padding: 8px 16px;
    min-width: 80px;
    white-space: nowrap;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

    &:hover {
        background: linear-gradient(135deg, #ff5252, #d32f2f);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

const DropdownWrapper = styled.div`
    position: relative;
    display: inline-block;

    &:hover > div {
        display: block;
    }
`;

const UserIcon = styled(FontAwesomeIcon)`
    font-size: 1.6rem;
    color: black;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;

    @media (max-width: 480px) {
        font-size: 1.4rem;
    }
`;

const DropdownContent = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    z-index: 1000;
    min-width: 120px;
    animation: dropdownSlide 0.3s ease;

    @keyframes dropdownSlide {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    div {
        padding: 0.5rem 1.2rem;
        font-size: 0.9rem;
        color: #333;
        white-space: nowrap;
        transition: 0.2s;

        &:hover {
            background-color: #f2f2f2;
        }
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
    }
`;


const LogoText = styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
    
    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

export default Header;