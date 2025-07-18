import { keyframes, styled } from "styled-components";

export const PortfolioPage = styled.div`
  font-family: Arial, sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;

  align-items: center;
  width: 100%;
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

export const PostWrapper = styled.div`
  width: 100%;
  max-width: 100%;

  background-color: ${({ theme }) => theme.background};

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
  margin-bottom: 10px;
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
  height: 100vh;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CommentsContent = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 8px;
  border-radius: 0px;
  width: calc(100% - 18px);
  max-height: 100vh;

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
  border-bottom: 0px solid #dbdbdb;
  padding-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

export const CommentAuthor = styled.span<{ theme }>`
  font-weight: bold;
  font-size: 18px;
  color: ${(props) => props.theme.text};
`;

export const CommentText = styled.p`
  margin-inline: 7px;
  margin-top: 7px;
  margin-bottom: 7px;
  color: ${({ theme }) => theme.text};
`;

export const CommentInput = styled.input`
  width: 95%;
  paddingInline: 10px;
  margin-top: 10px;
  border-radius: 0px;
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

const pop = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

const breatheAnimation = keyframes`
 0% { height: 100px; width: 100px; }
 30% { height: 400px; width: 400px; opacity: 1 }
 40% { height: 405px; width: 405px; opacity: 0.3; }
 100% { height: 100px; width: 100px; opacity: 0.6; }

interface LikeButtonProps {
  liked: boolean;
  onClick: () => void;

}`

// Styled component for the like button
export const StyledLikeButton = styled.button <({ liked, theme }) > `
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    fill: ${({ liked, theme }) => (liked ? '#ed4956' : theme.buttonBackground)};
    stroke: ${({ liked }) => (liked ? '#ed4956' : '#262626')};
    transition: fill 0.2s, stroke 0.2s;
    animation: ${({ liked }) => (liked ? `pop 0.3s ease-in-out` : 'none')};
  }

  &:hover svg {
    stroke: ${({ liked }) => (liked ? '#ed4956' : '#8e8e8e')};
  }
`;