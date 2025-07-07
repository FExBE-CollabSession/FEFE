import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const PostDetailContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
`;

const PostHeader = styled.div`
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
  margin-bottom: 24px;

  h1 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 2rem;
    font-weight: 700;
  }

  .post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
  }

  .post-stats {
    display: flex;
    gap: 20px;
    align-items: center;
  }
`;

const PostContent = styled.div`
  line-height: 1.8;
  color: #444;
  font-size: 1.1rem;
  margin-bottom: 32px;
`;

const PostActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.variant === 'primary' ? '#4CAF50' : 
                       props.variant === 'danger' ? '#f44336' : 
                       props.variant === 'warning' ? '#ff9800' : '#f5f5f5'};
  color: ${props => props.variant ? 'white' : '#333'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const EditForm = styled.div`
  margin-bottom: 24px;

  input, textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 12px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const CommentsSection = styled.div`
  margin-top: 32px;
`;

const CommentForm = styled.div`
  margin-bottom: 24px;

  textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    min-height: 80px;
    resize: vertical;
    margin-bottom: 12px;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Comment = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #667eea;

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .comment-author {
    font-weight: 600;
    color: #333;
  }

  .comment-date {
    font-size: 0.8rem;
    color: #666;
  }

  .comment-content {
    color: #444;
    line-height: 1.5;
  }
`;

export default function PostDetail({ postId, courseId, onBack, onPostUpdate }) {
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId, courseId]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/post/${courseId}/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.data);
        setEditForm({ title: data.data.title, content: data.data.content });
      } else {
        // Fallback to mock data
        setPost(getMockPost());
        setEditForm({ title: getMockPost().title, content: getMockPost().content });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setPost(getMockPost());
      setEditForm({ title: getMockPost().title, content: getMockPost().content });
    } finally {
      setLoading(false);
    }
  };

  const getMockPost = () => ({
    id: postId,
    title: "자료구조 과제 질문",
    content: "연결 리스트 구현에서 헤드 포인터 관리에 대해 질문이 있습니다. 도와주실 분 계신가요? 연결 리스트의 삽입과 삭제 연산에서 헤드 포인터를 어떻게 관리해야 하는지 궁금합니다.",
    author: "김학생",
    createdAt: "2024-01-15T10:30:00",
    viewCount: 25,
    likeCount: 3,
    commentCount: 2
  });

  const fetchComments = async () => {
    // Mock comments - replace with actual API call
    setComments([
      {
        id: 1,
        content: "헤드 포인터는 항상 첫 번째 노드를 가리키도록 유지해야 합니다.",
        author: "박학생",
        createdAt: "2024-01-15T11:00:00"
      },
      {
        id: 2,
        content: "삽입할 때는 새 노드의 next가 현재 head를 가리키도록 하고, head를 새 노드로 업데이트하면 됩니다.",
        author: "이학생",
        createdAt: "2024-01-15T11:30:00"
      }
    ]);
  };

  const handleUpdatePost = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/post/${courseId}/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        toast.success('게시글이 수정되었습니다!');
        setIsEditing(false);
        fetchPost();
        if (onPostUpdate) onPostUpdate();
      } else {
        toast.error('게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/post/${courseId}/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('게시글이 삭제되었습니다.');
        onBack();
      } else {
        toast.error('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLike = async (isLike) => {
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = isLike ? 'like' : 'unlike';
      const response = await fetch(`${API_BASE_URL}/post/${courseId}/${postId}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(isLike ? '좋아요를 눌렀습니다!' : '좋아요를 취소했습니다!');
        fetchPost();
      } else {
        toast.error('좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    // Mock comment addition - replace with actual API call
    const newCommentObj = {
      id: comments.length + 1,
      content: newComment,
      author: "현재사용자",
      createdAt: new Date().toISOString()
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    toast.success('댓글이 추가되었습니다!');
  };

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

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>로딩 중...</div>;
  }

  if (!post) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <PostDetailContainer>
      <PostHeader>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <div>
            작성자: {post.author} | {formatDate(post.createdAt)}
          </div>
          <div className="post-stats">
            <span>👁️ {post.viewCount}</span>
            <span>👍 {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>
      </PostHeader>

      {isEditing ? (
        <EditForm>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
            placeholder="제목"
          />
          <textarea
            value={editForm.content}
            onChange={(e) => setEditForm({...editForm, content: e.target.value})}
            placeholder="내용"
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary" onClick={handleUpdatePost}>
              수정 완료
            </Button>
            <Button onClick={() => setIsEditing(false)}>
              취소
            </Button>
          </div>
        </EditForm>
      ) : (
        <PostContent>
          <p>{post.content}</p>
        </PostContent>
      )}

      <PostActions>
        <Button variant="primary" onClick={() => handleLike(true)}>
          👍 좋아요 ({post.likeCount})
        </Button>
        <Button variant="danger" onClick={() => handleLike(false)}>
          👎 좋아요 취소
        </Button>
        <Button onClick={() => setIsEditing(true)}>
          ✏️ 수정
        </Button>
        <Button variant="warning" onClick={handleDeletePost}>
          🗑️ 삭제
        </Button>
        <Button onClick={onBack}>
          ← 목록으로
        </Button>
      </PostActions>

      <CommentsSection>
        <h3>댓글 ({comments.length})</h3>
        
        <CommentForm>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
          />
          <Button variant="primary" onClick={handleAddComment}>
            댓글 작성
          </Button>
        </CommentForm>

        <CommentList>
          {comments.map((comment) => (
            <Comment key={comment.id}>
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </Comment>
          ))}
        </CommentList>
      </CommentsSection>
    </PostDetailContainer>
  );
} 