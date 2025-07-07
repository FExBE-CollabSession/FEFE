// ./src/pages/CommuPage.jsx
import React, { useState, useEffect } from "react";
import { Wrapper, StyledParagraph, PostContainer, PostCard, PostHeader, PostContent, PostActions, CreatePostButton, CreatePostModal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, TextArea, Button, SortButtons, EmptyState } from "./CommuPage.styles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostDetail from '../components/PostDetail';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function CommuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [sortType, setSortType] = useState('latest'); // latest, popular
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(1); // Default course ID
  const [selectedPostId, setSelectedPostId] = useState(null); // For viewing individual posts

  // Mock course data - replace with actual API call
  const [courses, setCourses] = useState([
    { id: 1, name: "컴퓨터아키텍처", professor: "홍길동" },
    { id: 2, name: "자료구조및실습", professor: "이몽룡" },
    { id: 3, name: "자바프로그래밍", professor: "성춘향" },
    { id: 4, name: "웹클라이언트컴퓨팅", professor: "임꺽정" },
    { id: 5, name: "경찰체력단련1", professor: "변학도" },
    { id: 6, name: "MZ세대창의력", professor: "최길동" }
  ]);

  // API base URL - replace with your actual backend URL
  const API_BASE_URL = 'http://localhost:8080/api';

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = sortType === 'latest' 
        ? `${API_BASE_URL}/post/${selectedCourseId}/latest`
        : sortType === 'popular'
        ? `${API_BASE_URL}/post/${selectedCourseId}/popular`
        : `${API_BASE_URL}/post/${selectedCourseId}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || []);
      } else {
        // Fallback to mock data if API fails
        setPosts(getMockPosts());
        console.warn('API call failed, using mock data');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  // Mock posts data for development
  const getMockPosts = () => [
    {
      id: 1,
      title: "자료구조 과제 질문",
      content: "연결 리스트 구현에서 헤드 포인터 관리에 대해 질문이 있습니다. 도와주실 분 계신가요?",
      author: "김학생",
      createdAt: "2024-01-15T10:30:00",
      viewCount: 25,
      likeCount: 3,
      commentCount: 2
    },
    {
      id: 2,
      title: "프로젝트 팀원 모집",
      content: "웹 프로젝트 팀원을 모집합니다. React와 Spring Boot 경험이 있으시면 연락주세요!",
      author: "박학생",
      createdAt: "2024-01-14T15:20:00",
      viewCount: 42,
      likeCount: 8,
      commentCount: 5
    },
    {
      id: 3,
      title: "시험 일정 공유",
      content: "다음 주 시험 일정을 정리해봤습니다. 확인해보시고 추가할 내용 있으면 댓글로 남겨주세요.",
      author: "이학생",
      createdAt: "2024-01-13T09:15:00",
      viewCount: 67,
      likeCount: 12,
      commentCount: 8
    }
  ];

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/post/${selectedCourseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        toast.success('게시글이 성공적으로 작성되었습니다!');
        setIsCreateModalOpen(false);
        setNewPost({ title: '', content: '' });
        fetchPosts(); // Refresh posts
      } else {
        toast.error('게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  // Handle like/unlike
  const handleLike = async (postId, isLike) => {
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = isLike ? 'like' : 'unlike';
      const response = await fetch(`${API_BASE_URL}/post/${selectedCourseId}/${postId}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(isLike ? '좋아요를 눌렀습니다!' : '좋아요를 취소했습니다!');
        fetchPosts(); // Refresh posts
      } else {
        toast.error('좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/post/${selectedCourseId}/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('게시글이 삭제되었습니다.');
        fetchPosts(); // Refresh posts
      } else {
        toast.error('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // URL 파라미터에서 courseId와 courseName 가져오기
  useEffect(() => {
    const courseIdFromUrl = searchParams.get('courseId');
    const courseNameFromUrl = searchParams.get('courseName');
    
    if (courseIdFromUrl) {
      const courseId = parseInt(courseIdFromUrl);
      setSelectedCourseId(courseId);
      
      // 해당 수업이 courses 배열에 있는지 확인하고 없으면 추가
      const courseExists = courses.find(course => course.id === courseId);
      if (!courseExists && courseNameFromUrl) {
        // Mock course 추가 (실제로는 API에서 가져와야 함)
        const newCourse = {
          id: courseId,
          name: decodeURIComponent(courseNameFromUrl),
          professor: "교수명"
        };
        setCourses(prevCourses => [...prevCourses, newCourse]);
        console.log(`수업 "${courseNameFromUrl}"의 커뮤니티로 이동합니다.`);
      }
    }
  }, [searchParams, courses]);

  useEffect(() => {
    if (!selectedPostId) {
      fetchPosts();
    }
  }, [selectedCourseId, sortType, selectedPostId]);

  // If viewing a specific post, show PostDetail component
  if (selectedPostId) {
    return (
      <Wrapper>
        <PostDetail 
          postId={selectedPostId}
          courseId={selectedCourseId}
          onBack={() => setSelectedPostId(null)}
          onPostUpdate={fetchPosts}
        />
      </Wrapper>
    );
  }

  // 현재 선택된 수업 정보
  const currentCourse = courses.find(course => course.id === selectedCourseId);

  return (
    <Wrapper>
      <StyledParagraph>
        📚 커뮤니티
        {currentCourse && (
          <span style={{ fontSize: '1.2rem', color: '#666', marginLeft: '12px' }}>
            - {currentCourse.name}
          </span>
        )}
      </StyledParagraph>
      
      {/* Course Selection */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>수업 선택:</label>
          <select 
            value={selectedCourseId} 
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} - {course.professor}
              </option>
            ))}
          </select>
        </div>
        <Button 
          onClick={() => navigate('/main')}
          style={{ backgroundColor: '#667eea', color: 'white' }}
        >
          📅 시간표로 돌아가기
        </Button>
      </div>

      {/* Sort Buttons */}
      <SortButtons>
        <Button 
          onClick={() => setSortType('latest')}
          active={sortType === 'latest'}
        >
          최신순
        </Button>
        <Button 
          onClick={() => setSortType('popular')}
          active={sortType === 'popular'}
        >
          인기순
        </Button>
      </SortButtons>

      {/* Create Post Button */}
      <CreatePostButton onClick={() => setIsCreateModalOpen(true)}>
        ✏️ 새 게시글 작성
      </CreatePostButton>

      {/* Posts Container */}
      <PostContainer>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>로딩 중...</div>
        ) : posts.length === 0 ? (
          <EmptyState>
            <p>아직 게시글이 없습니다.</p>
            <p>첫 번째 게시글을 작성해보세요!</p>
          </EmptyState>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} onClick={() => setSelectedPostId(post.id)} style={{ cursor: 'pointer' }}>
              <PostHeader>
                <div>
                  <h3>{post.title}</h3>
                  <p>작성자: {post.author} | {formatDate(post.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span>👁️ {post.viewCount}</span>
                  <span>💬 {post.commentCount}</span>
                </div>
              </PostHeader>
              
              <PostContent>
                <p>{post.content}</p>
              </PostContent>
              
              <PostActions onClick={(e) => e.stopPropagation()}>
                <Button 
                  onClick={() => handleLike(post.id, true)}
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                  👍 좋아요 ({post.likeCount})
                </Button>
                <Button 
                  onClick={() => handleLike(post.id, false)}
                  style={{ backgroundColor: '#f44336', color: 'white' }}
                >
                  👎 좋아요 취소
                </Button>
                <Button 
                  onClick={() => handleDeletePost(post.id)}
                  style={{ backgroundColor: '#ff9800', color: 'white' }}
                >
                  🗑️ 삭제
                </Button>
              </PostActions>
            </PostCard>
          ))
        )}
      </PostContainer>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal>
          <ModalContent>
            <ModalHeader>
              <h2>새 게시글 작성</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </ModalHeader>
            
            <ModalBody>
              <div style={{ marginBottom: '15px' }}>
                <label>제목:</label>
                <Input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="게시글 제목을 입력하세요"
                />
              </div>
              
              <div>
                <label>내용:</label>
                <TextArea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="게시글 내용을 입력하세요"
                  rows="6"
                />
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button 
                onClick={handleCreatePost}
                style={{ backgroundColor: '#4CAF50', color: 'white' }}
              >
                작성하기
              </Button>
              <Button 
                onClick={() => setIsCreateModalOpen(false)}
                style={{ backgroundColor: '#9e9e9e', color: 'white' }}
              >
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </CreatePostModal>
      )}
    </Wrapper>
  );
}
