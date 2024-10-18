import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import useLocalStorage from "../../../src/hooks/useLocalStorage";
import { useActions } from "../../../src/hooks/useActions";

const PortfolioPage = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  overflow-y: scroll;
  background-color: #fafafa;
  color: black;
`;

const PostWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  background: white;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  size: content-fit;
  color: black;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: black;
`;

const PostDetails = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  color: black;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: black;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.div`
  font-weight: bold;
  color: black;
`;

const Description = styled.p`
  margin-top: 10px;
  font-size: 14px;
`;

const Caption = styled.div`
  font-size: 14px;
  margin-top: 10px;
  color: black;
`;

const CommentSection = styled.div`
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  color: #8e8e8e;
`;

const LikeSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #262626;
  display: flex;
  align-items: center;
`;

const LikeIcon = styled.span`
  font-size: 18px;
  margin-right: 5px;
`;

const CommentsPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentsContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  color: black;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CommentItem = styled.li`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 10px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const CommentText = styled.p`
  margin-top: 5px;
  color: black;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #dbdbdb;
`;

const CommentSubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

interface PortfolioViewProps {
  profileData: any;
  setProfileData: (data: any) => void;
}

const PortfolioViewPage: React.FC<PortfolioViewProps> = ({
  profileData,
  setProfileData,
}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const { updateUser, updateChat } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [showCommentsPopup, setShowCommentsPopup] = useState<string | null>(
    null
  );
  const [newComment, setNewComment] = useState(""); // To hold new comment input
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // Track selected post for adding comment

  const postData = useTypedSelector((state) =>
    state.profile.posts.find((post) => post.id === selectedPostId)
  );
  const navigate = useNavigate();

  const handleCommentsClick = (postId: string) => {
    setShowCommentsPopup(postId);
    setSelectedPostId(postId);
  };

  const handleCloseCommentsPopup = () => {
    setShowCommentsPopup(null);
    setNewComment(""); // Clear comment input when popup closes
  };

  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (selectedPostId !== null && newComment.trim() !== "") {
      // Find the selected post
      // const updatedPosts = user.posts.map((post) => {
      //     post.id === selectedPostId && post.comments && post.comments.length > 0) {
      //         // Add the new comment to the selected post
      //         return {
      //             ...post,
      //             comments: [...post.comments, { author: user.username, text: newComment }],
      //         };
      //     }
      //     return {
      //         ...post,
      //         comments: [{ author: user.username, text: newComment }],

      //     }
      // })

      const filteredPost = user.posts[selectedPostId];
      const chat = chats[filteredPost.chatId];
      console.log(chat, selectedPostId);
      if (chat) {
        if (chat.messages && chat.messages?.length > 0) {
          console.log("not first");

          chat.messages.push({
            author: user.username,
            text: newComment,
          });

          const updatedProfileData = { ...user };

          updatedProfileData.posts[selectedPostId];
          // setProfileData(updatedProfileData);
          updateUser(updatedProfileData, setErrorMessage);
          updateChat(chat, filteredPost.chatId, setErrorMessage);
          setUser(updatedProfileData);

          chats[filteredPost.chatId].messages = chat.messages;
          setChats(chats);
        } else if (chats && !chats.messages) {
          console.log("first");
          chat.messages = [{ author: user.username, text: newComment }];

          const updatedProfileData = { ...user };

          console.log(updatedProfileData);
          // setProfileData(updatedProfileData);
          updateUser(updatedProfileData, setErrorMessage);
          updateChat(chat, filteredPost.chatId, setErrorMessage);
          setUser(updatedProfileData);
          chats[filteredPost.chatId].messages = chat.messages;
          setChats(chats);
        }
      }
      console.log();

      // Update user with the new comments

      // Clear the input and close the popup
      setNewComment("");
      handleCloseCommentsPopup();
    }
  };

  return (
    <PortfolioPage>
      {user &&
        Object.keys(user.posts).map((post) => (
          <PostWrapper key={post}>
            <PostImage src={user.posts[post].image} alt={`Post ${post}`} />
            <PostDetails>
              <UserSection>
                <UserAvatar
                  src={user.profilePicture}
                  alt={`${user.username} avatar`}
                />
                <UserName onClick={() => navigate("../mastersPage")}>
                  {user.name}
                </UserName>
              </UserSection>
              <Description>{user.posts[post].description}</Description>
              <Caption>
                <strong>
                  {user.posts[post].user && user.posts[post].user.name}
                </strong>{" "}
                {user.posts[post].description}
              </Caption>

              {chats[user.posts[post].chatId] ? (
                <CommentSection onClick={() => handleCommentsClick(post)}>
                  {chats[user.posts[post].chatId].messages.length === 0 ? (
                    <>No comments yet</>
                  ) : (
                    <>
                      <>
                        View all{" "}
                        {chats[user.posts[post].chatId].messages?.length || 0}{" "}
                        comments
                      </>
                      <strong>
                        {chats[user.posts[post].chatId].messages.length > 0
                          ? chats[user.posts[post].chatId].messages[0].author
                          : ""}
                      </strong>
                      :{" "}
                      {chats[user.posts[post].chatId].messages.length > 0
                        ? chats[user.posts[post].chatId].messages[0].text
                        : ""}
                    </>
                  )}
                </CommentSection>
              ) : (
                <CommentSection onClick={() => handleCommentsClick(post)}>
                  <>No comments yet</>
                </CommentSection>
              )}
              <LikeSection>
                <LikeButton>
                  <LikeIcon>❤️</LikeIcon> Like
                </LikeButton>
              </LikeSection>
            </PostDetails>

            {showCommentsPopup === post && (
              <CommentsPopup>
                <CommentsContent>
                  <CloseButton onClick={handleCloseCommentsPopup}>
                    X
                  </CloseButton>
                  <h2 style={{ color: "black" }}>Comments</h2>
                  <CommentList>
                    {chats[user.posts[post].chatId]?.messages &&
                    chats[user.posts[post].chatId].messages.length > 0 ? (
                      chats[user.posts[post].chatId].messages.map(
                        (comment, index) => (
                          <CommentItem key={index}>
                            <CommentAuthor>{comment?.author}</CommentAuthor>
                            <CommentText>{comment?.text}</CommentText>
                          </CommentItem>
                        )
                      )
                    ) : (
                      <CommentItem>
                        <CommentText>No comments yet</CommentText>
                      </CommentItem>
                    )}
                  </CommentList>

                  {/* Add New Comment */}
                  <CommentInput
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={handleNewCommentChange}
                  />
                  <CommentSubmitButton onClick={handleCommentSubmit}>
                    Submit Comment
                  </CommentSubmitButton>
                </CommentsContent>
              </CommentsPopup>
            )}
          </PostWrapper>
        ))}
    </PortfolioPage>
  );
};

export default PortfolioViewPage;
