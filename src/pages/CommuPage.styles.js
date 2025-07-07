// ./src/pages/CommuPage.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 40px;
  background-color: #fffefc;
  min-height: 100vh;
`;

export const StyledParagraph = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

export const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  h3 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1.3rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }

  span {
    font-size: 0.85rem;
    color: #888;
  }
`;

export const PostContent = styled.div`
  margin-bottom: 20px;
  
  p {
    margin: 0;
    line-height: 1.6;
    color: #444;
    font-size: 1rem;
  }
`;

export const PostActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? '#2196F3' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SortButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

export const CreatePostButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CreatePostModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #e0e0e0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  p {
    margin: 8px 0;
    font-size: 1.1rem;
  }

  p:first-child {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
  }
`;
