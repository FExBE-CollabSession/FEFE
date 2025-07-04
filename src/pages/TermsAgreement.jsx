import React, {useState} from "react";
import styled from "styled-components";

export default function TermsAgreement({onAgreeChange}) {
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        community: false,
        personalInfo: false,
        marketing: false,
        age14: false,
    });

    const handleChange = (key) => {
        const newState = {
            ...agreements,
            [key]: !agreements[key],
        };

        if (key === "all") {
            const allValue = !agreements.all;
            newState.terms = allValue;
            newState.community = allValue;
            newState.personalInfo = allValue;
            newState.marketing = allValue;
            newState.age14 = allValue;
        } else {
            newState.all = ["terms", "community", "personalInfo", "marketing", "age14"]
                .every((k) => k === key ? !agreements[key] : agreements[k]);
        }

        setAgreements(newState);
        onAgreeChange?.(newState);
    };

    return (
        <Wrapper>
            <Title>약관 동의</Title>

            <Checkbox>
                <input
                    type="checkbox"
                    checked={agreements.all}
                    onChange={() => handleChange("all")}
                />
                <span>아래 약관에 모두 동의합니다.</span>
            </Checkbox>

            {renderAgreement(
                "terms",
                "서비스이용약관 동의 (필수)",
                `본 서비스는 사용자의 편의를 위해 다양한 기능을 제공합니다. 사용자는 이를 선의로 이용해야 하며, 부정한 방식으로 시스템을 악용하는 경우 제재를 받을 수 있습니다.`
            )}

            {renderAgreement(
                "community",
                "커뮤니티 이용규칙 확인 (필수)",
                `커뮤니티 이용 시 타인을 존중하며 비방, 욕설, 혐오 표현 등의 행위를 금지합니다. 운영정책을 위반할 경우 글 삭제 및 계정 제재가 이루어질 수 있습니다.`
            )}

            {renderAgreement(
                "personalInfo",
                "개인정보 수집 및 이용 동의 (필수)",
                `본 서비스는 회원가입 및 서비스 제공을 위해 최소한의 개인정보를 수집합니다. 수집된 정보는 회원 식별, 고객 응대, 서비스 품질 개선 등의 목적으로만 사용됩니다.`
            )}

            {renderAgreement(
                "marketing",
                "광고성 정보 수신 동의 (선택)",
                `이벤트, 프로모션, 새로운 기능 안내 등을 위해 이메일이나 SMS를 통해 광고성 정보를 수신하실 수 있습니다.`
            )}

            {renderAgreement(
                "age14",
                "만 14세 이상입니다. (필수)",
                `만 14세 미만 아동은 보호자의 동의 없이 본 서비스에 가입할 수 없습니다. 귀하가 14세 이상임을 확인해 주세요.`
            )}
        </Wrapper>
    );

    function renderAgreement(key, label, content) {
        return (
            <CheckboxBlock key={key}>
                <Checkbox>
                    <input
                        type="checkbox"
                        checked={agreements[key]}
                        onChange={() => handleChange(key)}
                    />
                    <span>{label}</span>
                </Checkbox>
                {!agreements[key] && (
                    <TermsBox>
                        <strong>{label}</strong>
                        <p>{content}</p>
                    </TermsBox>
                )}
            </CheckboxBlock>
        );
    }
}

const Wrapper = styled.div`
    background: white;
    color: black;
    padding: 1.5rem;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    @media (max-width: 600px) {
        padding: 1rem;
    }
`;

const Title = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 1rem;
`;

const Checkbox = styled.label`
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    gap: 0.5rem;

    input {
        transform: scale(1.2);
    }

    span {
        font-size: clamp(0.9rem, 2vw, 1rem);
    }
`;

const TermsBox = styled.div`
    background-color: #f7f7f7;
    padding: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    max-height: 150px;
    overflow-y: auto;
    font-size: 0.9rem;
    line-height: 1.4;
`;

const CheckboxBlock = styled.div`
    margin-bottom: 1rem;
`;
