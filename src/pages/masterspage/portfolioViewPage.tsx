import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import useLocalStorage from "../../../src/hooks/useLocalStorage";
import { useActions } from "../../../src/hooks/useActions";
import { useTheme } from "../../state/providers/themeProvider";
import { Caption, CommentAuthor, CommentInput, CommentItem, CommentList, CommentSection, CommentSubmitButton, CommentText, CommentsContent, CommentsPopup, Description, LikeButton, LikeIcon, LikeSection, PortfolioPage, PostDetails, PostImage, PostWrapper, UserAvatar, UserName, UserSection } from "./profileVIewPageComponents";
import { EditButton } from "./masterPage";



const PortfolioViewPage: React.FC = ({

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
  const { themevars } = useTheme()
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

      const filteredPost = user && user.posts ? user.posts[selectedPostId] : [];
      const chat = chats ? chats[filteredPost.chatId] : [];
      console.log(chat, selectedPostId);
      if (chat) {
        if (chat.messages && chat.messages?.length > 0) {
          console.log("not first");
          const newPost = {
            ...filteredPost,
            comments: [
              ...filteredPost.comments,
              { author: user.username, text: newComment },
            ],
          };
          const updatedProfileData = { ...user };
          const otherPosts = user.posts.filter(
            (post) => post.id !== selectedPostId
          );
          updatedProfileData.posts = [...otherPosts, newPost];

          updateUser(updatedProfileData, setErrorMessage);

          chat.messages.push({
            author: user.username,
            text: newComment,
          });



          updatedProfileData.posts[selectedPostId];
          // setProfileData(updatedProfileData);
          updateUser(updatedProfileData, setErrorMessage);
          updateChat(chat, filteredPost.chatId, setErrorMessage);
          setUser(updatedProfileData);

          chats[filteredPost.chatId].messages = chat.messages;
          setChats(chats);
        } else if (chats && !chats.messages) {
          console.log("first");
          const newPost = {
            ...filteredPost,
            comments: [{ author: user.username, text: newComment }],
          };
          const updatedProfileData = { ...user };
          const otherPosts = user.posts.filter(
            (post) => post.id !== selectedPostId
          );
          updatedProfileData.posts = [...otherPosts, newPost];
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

              {chats && chats[user.posts[post].chatId] ? (
                <CommentSection theme={themevars} onClick={() => handleCommentsClick(post)}>
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
                  <EditButton onClick={handleCloseCommentsPopup}>
                    X
                  </EditButton>
                  <h2 style={{ color: themevars.text }}>Comments</h2>
                  <CommentList>
                    {chats && chats[user.posts[post].chatId]?.messages &&
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
