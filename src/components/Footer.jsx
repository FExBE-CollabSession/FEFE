import React from "react";
import styled from "styled-components";

function Footer() {
    return (
        <FooterWrapper>
            <TextSection>
                <Address>서울특별시 성북구 서경로 124</Address>
                <Copy>COPYRIGHT© 2025 ALJALDDAGGALSAEN. ALL RIGHTS RESERVED.</Copy>
            </TextSection>
        </FooterWrapper>
    );
}

export default Footer;

const FooterWrapper = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f9f9f9;
    color: #555;
    font-size: 0.8rem;

    @media (max-width: 600px) {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
        font-size: 0.75rem;
    }
`;

const TextSection = styled.div`
    max-width: 550px;
    line-height: 1.25;

    @media (max-width: 600px) {
        max-width: 100%;
    }
`;

const Address = styled.address`
    font-style: normal;
    margin: 0 0 0.25rem 0;
`;

const Copy = styled.p`
    margin: 0;
    color: #777;
`;