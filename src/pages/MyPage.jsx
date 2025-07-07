import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import SwalGlobalStyle from '../styles/SwalGlobalStyle.jsx';

// JWT 디코딩 함수
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // 비밀번호 강도 체크 함수
  const checkPasswordStrength = (password) => {
    if (!password) return '';
    
    let strength = 0;
    let message = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
      case 0:
      case 1:
        message = '매우 약함';
        break;
      case 2:
        message = '약함';
        break;
      case 3:
        message = '보통';
        break;
      case 4:
        message = '강함';
        break;
      case 5:
        message = '매우 강함';
        break;
      default:
        message = '';
    }
    
    return message;
  };

  useEffect(() => {
    // accessToken에서 사용자 정보 추출
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const user = {
          id: decoded.jti || '',
          email: decoded.sub || '',
          username: decoded.username || (decoded.sub ? decoded.sub.split('@')[0] : '')
        };
        setUserInfo(user);
        setNewUsername(user.username);
      } else {
        toast.error('토큰 디코딩 오류');
        setTimeout(() => window.location.href = '/', 1500);
      }
    } else {
      toast.error('로그인이 필요합니다.');
      setTimeout(() => window.location.href = '/', 1500);
    }
  }, []);

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      toast.error('새로운 이름을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/users/update/username', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // 로컬 스토리지의 사용자 정보 업데이트
        const updatedUserInfo = { ...userInfo, username: newUsername };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setUserInfo(updatedUserInfo);
        
        setIsEditingUsername(false);
        toast.success('이름이 성공적으로 변경되었습니다.');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || '이름 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('이름 변경 오류:', error);
      toast.error('서버 연결 오류가 발생했습니다.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/users/update/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // 입력 필드 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsEditingPassword(false);
        
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      toast.error('서버 연결 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '로그아웃 하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4B7BEC',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      toast.success('로그아웃되었습니다.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '정말로 계정을 삭제하시겠습니까?',
      text: '이 작업은 되돌릴 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
      // 계정 삭제 로직 (API 엔드포인트가 있다면)
      toast.info('계정 삭제 기능은 준비 중입니다.');
    }
  };

  if (!userInfo) {
    return (
      <Container>
        <LoadingMessage>
          <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <div>사용자 정보를 불러오는 중...</div>
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <>
      <SwalGlobalStyle />
      <Container>
        <PageHeader>
          <h1>마이페이지</h1>
          <p>계정 정보를 관리하세요</p>
        </PageHeader>

        <ContentWrapper>
          <ProfileSection>
            <SectionTitle>프로필 정보</SectionTitle>
            <ProfileCard>
              <Avatar>
                <i className="bx bx-user"></i>
              </Avatar>
                             <ProfileInfo>
                 <Username>{userInfo.username || userInfo.name || '사용자'}</Username>
                 <Email>{userInfo.email || '이메일 정보 없음'}</Email>
                 <UserId>ID: {userInfo.id || 'N/A'}</UserId>
               </ProfileInfo>
            </ProfileCard>
          </ProfileSection>

          <SettingsSection>
            <SectionTitle>계정 설정</SectionTitle>
            
            {/* 이름 변경 섹션 */}
            <SettingCard>
              <SettingHeader>
                <div>
                  <SettingTitle>이름 변경</SettingTitle>
                  <SettingDescription>사용자 이름을 변경할 수 있습니다.</SettingDescription>
                </div>
                <EditButton 
                  onClick={() => setIsEditingUsername(!isEditingUsername)}
                  $isEditing={isEditingUsername}
                >
                  {isEditingUsername ? '취소' : '수정'}
                </EditButton>
              </SettingHeader>
              
              {isEditingUsername && (
                <EditForm>
                                     <InputGroup>
                     <Label>새로운 이름</Label>
                     <Input
                       type="text"
                       value={newUsername}
                       onChange={(e) => setNewUsername(e.target.value)}
                       placeholder="새로운 이름을 입력하세요"
                     />
                     <SmallText>현재 이름: {userInfo.username || userInfo.name || '설정되지 않음'}</SmallText>
                   </InputGroup>
                  <ButtonGroup>
                    <SaveButton onClick={handleUsernameUpdate}>
                      저장
                    </SaveButton>
                  </ButtonGroup>
                </EditForm>
              )}
            </SettingCard>

            {/* 비밀번호 변경 섹션 */}
            <SettingCard>
              <SettingHeader>
                <div>
                  <SettingTitle>비밀번호 변경</SettingTitle>
                  <SettingDescription>계정 보안을 위해 주기적으로 비밀번호를 변경하세요.</SettingDescription>
                </div>
                <EditButton 
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                  $isEditing={isEditingPassword}
                >
                  {isEditingPassword ? '취소' : '수정'}
                </EditButton>
              </SettingHeader>
              
              {isEditingPassword && (
                <EditForm>
                  <InputGroup>
                    <Label>현재 비밀번호</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                  </InputGroup>
                                     <InputGroup>
                     <Label>새 비밀번호</Label>
                     <Input
                       type="password"
                       value={newPassword}
                       onChange={(e) => {
                         setNewPassword(e.target.value);
                         setPasswordStrength(checkPasswordStrength(e.target.value));
                       }}
                       placeholder="새 비밀번호를 입력하세요"
                     />
                     {newPassword && (
                       <SmallText>비밀번호 강도: {passwordStrength}</SmallText>
                     )}
                   </InputGroup>
                                     <InputGroup>
                     <Label>새 비밀번호 확인</Label>
                     <Input
                       type="password"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       placeholder="새 비밀번호를 다시 입력하세요"
                     />
                     {confirmPassword && (
                       <SmallText style={{ color: newPassword === confirmPassword ? '#4CAF50' : '#f44336' }}>
                         {newPassword === confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                       </SmallText>
                     )}
                   </InputGroup>
                  <ButtonGroup>
                    <SaveButton onClick={handlePasswordUpdate}>
                      저장
                    </SaveButton>
                  </ButtonGroup>
                </EditForm>
              )}
            </SettingCard>

            {/* 로그아웃 섹션 */}
            <SettingCard>
              <SettingHeader>
                <div>
                  <SettingTitle>로그아웃</SettingTitle>
                  <SettingDescription>
                    현재 계정에서 로그아웃합니다.
                  </SettingDescription>
                </div>
                <LogoutButton onClick={handleLogout}>
                  로그아웃
                </LogoutButton>
              </SettingHeader>
            </SettingCard>

            {/* 계정 삭제 섹션 */}
            <SettingCard $danger>
              <SettingHeader>
                <div>
                  <SettingTitle $danger>계정 삭제</SettingTitle>
                  <SettingDescription $danger>
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                  </SettingDescription>
                </div>
                <DeleteButton onClick={handleDeleteAccount}>
                  삭제
                </DeleteButton>
              </SettingHeader>
            </SettingCard>
          </SettingsSection>
        </ContentWrapper>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 20px 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.1rem;
    color: #666;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4B7BEC;
`;

const ProfileSection = styled.div``;

const ProfileCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4B7BEC, #6C5CE7);
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    font-size: 2.5rem;
    color: white;
  }
`;

const ProfileInfo = styled.div``;

const Username = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const Email = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 5px;
`;

const UserId = styled.p`
  font-size: 0.9rem;
  color: #999;
  font-style: italic;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  border-left: ${props => props.$danger ? '4px solid #ff6b6b' : '4px solid #4B7BEC'};
`;

const SettingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.$isEditing ? '20px' : '0'};
`;

const SettingTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.$danger ? '#ff6b6b' : '#333'};
  margin-bottom: 5px;
`;

const SettingDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.$danger ? '#ff8e8e' : '#666'};
  line-height: 1.4;
`;

const EditButton = styled.button`
  background: ${props => props.$isEditing ? '#ff6b6b' : '#4B7BEC'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$isEditing ? '#ff5252' : '#3a5fd9'};
    transform: translateY(-1px);
  }
`;

const EditForm = styled.div`
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const SmallText = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
  font-style: italic;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4B7BEC;
    box-shadow: 0 0 0 3px rgba(75, 123, 236, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #4B7BEC, #6C5CE7);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #3a5fd9, #5a4fd1);
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(75, 123, 236, 0.3);
  }
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a6268, #343a40);
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #ff5252, #d32f2f);
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  }
`;

export default MyPage; 