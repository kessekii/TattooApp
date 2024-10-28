import { styled } from "styled-components";

export const PortfolioPage = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  justify-content: center;
  overflow: scroll;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

export const PostWrapper = styled.div`
  width: 100%;
  max-width: 100%;

  background-color: ${({ theme }) => theme.background};
  border-bottom: 1px solid #dbdbdb;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  size: content-fit;
  overflow: scroll;
  color: ${({ theme }) => theme.text};
`;

export const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: ${({ theme }) => theme.text};
`;

export const PostDetails = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 
  color: ${({ theme }) => theme.text};
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  margin-right: 10px;
`;

export const UserName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export const Description = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export const Caption = styled.div`
  font-size: 14px;
  margin-top: 10px;
  color: ${({ theme }) => theme.text};
`;

export const CommentSection = styled.div`
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

export const LikeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #262626;
  display: flex;
  align-items: center;
`;

export const LikeIcon = styled.span`
  font-size: 18px;
  margin-right: 5px;
`;

export const CommentsPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CommentsContent = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 20px;
  border-radius: 10px;

  max-height: 80vh;

  overflow-y: auto;
  position: relative;
  color: ${({ theme }) => theme.text};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

export const CommentItem = styled.li`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

export const CommentAuthor = styled.span<{ theme }>`
  font-weight: bold;
  margin-right: 5px;
  color: ${(props) => props.theme.text};
`;

export const CommentText = styled.p`
  color: ${({ theme }) => theme.text};
`;

export const CommentInput = styled.input`
  width: 95%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #dbdbdb;
`;

export const CommentSubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: ${({ theme }) => theme.backgroundButton};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  cursor: pointer;
`;
