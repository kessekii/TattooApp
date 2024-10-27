import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "../../hooks/useLocalStorage";
import { useActions } from "../../hooks/useActions";
import { useTheme } from "../../state/providers/themeProvider";
import {
  Caption,
  CommentAuthor,
  CommentInput,
  CommentItem,
  CommentList,
  CommentSection,
  CommentSubmitButton,
  CommentText,
  CommentsContent,
  CommentsPopup,
  Description,
  LikeButton,
  LikeIcon,
  LikeSection,
  PortfolioPage,
  PostDetails,
  PostImage,
  PostWrapper,
  UserAvatar,
  UserName,
  UserSection,
} from "./profileVIewPageComponents";
import { EditButton } from "./masterPage";
import ChatComponent from "../components/chat";
import { updateChatStraight } from "../../state/action-creators";
import { getPostsByUserId } from "../../hooks/useChat";

const PortfolioViewPage: React.FC = ({}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const { updateUser, updateChat } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [showCommentsPopup, setShowCommentsPopup] = useState<string | null>(
    null
  );
  const [newComment, setNewComment] = useState(""); // To hold new comment input
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // Track selected post for adding comment
  const { themevars } = useTheme();

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

  const handleCommentSubmit = async (chatss: any, users: any) => {
    if (selectedPostId !== null && newComment.trim() !== "") {
      const user = JSON.parse(window.localStorage.getItem("user") || "{}");
      const chats = JSON.parse(window.localStorage.getItem("chats") || "{}");
      const posts = JSON.parse(window.localStorage.getItem("posts") || "{}");
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

      const filteredPost = user && posts ? posts[selectedPostId] : [];

      const chat =
        chats && Object.keys(chats).length === 0
          ? {}
          : chats[filteredPost.chatId];

      console.log(chat, selectedPostId);

      if (chat?.messages && chat.messages?.length > 0) {
        console.log("not first");
        chat.messages.push({
          author: user.username,
          text: newComment,
        });

        const newChatData = (
          await updateChatStraight(chat, filteredPost.chatId)
        ).payload;

        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        const postsData = (await getPostsByUserId(user.username)).payload;
        chats[filteredPost.chatId].messages = chat.messages;
        setUser(user);
        setChats(chats);
        setPosts(postsData);
      } else if (
        !chats ||
        (chat && (!chat.messages || chat.messages.length === 0))
      ) {
        console.log("first");

        chat.messages = [
          {
            author: user.username,
            text: newComment,
          },
        ];

        await updateChatStraight(chat, filteredPost.chatId);
        const postsData = (await getPostsByUserId(user.username)).payload;
        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        chats[filteredPost.chatId].messages = chat.messages;
        setUser(user);
        setChats(chats);
        setPosts(postsData);
      }

      console.log();

      // Update user with the new comments

      // Clear the input and close the popup
      setNewComment("");
      handleCloseCommentsPopup();
    }
  };

  return (
    <PortfolioPage theme={themevars}>
      {user &&
        Object.keys(user.posts || {}).map((post) => (
          <PostWrapper key={post}>
            <PostImage src={posts[post].image} alt={`Post ${post}`} />
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
              <Description>{posts[post].description}</Description>
              <Caption>
                <strong>{posts[post].user && posts[post].user.name}</strong>{" "}
                {posts[post].description}
              </Caption>

              {chats && chats[posts[post].chatId] ? (
                <CommentSection
                  theme={themevars}
                  onClick={() => handleCommentsClick(post)}
                >
                  {chats[posts[post].chatId]?.messages?.length === 0 ? (
                    <>No comments yet</>
                  ) : (
                    <>
                      <>
                        View all{" "}
                        {chats[posts[post].chatId]?.messages?.length || 0}{" "}
                        comments
                      </>
                      <strong>
                        {chats[posts[post].chatId].messages?.length > 0
                          ? chats[posts[post].chatId].messages[0].author
                          : ""}
                      </strong>
                      :{" "}
                      {chats[posts[post].chatId].messages?.length > 0
                        ? chats[posts[post].chatId].messages[0].text
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
                <CommentsContent theme={themevars.popup}>
                  <EditButton
                    theme={themevars.popup}
                    onClick={handleCloseCommentsPopup}
                  >
                    X
                  </EditButton>
                  <h2 style={{ color: themevars.text }}>Comments</h2>

                  <CommentList>
                    {chats[posts[post].chatId]?.messages &&
                    chats[posts[post].chatId].messages.length > 0 ? (
                      chats[posts[post].chatId].messages.map(
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
                  <CommentInput
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={handleNewCommentChange}
                  />

                  <CommentSubmitButton
                    onClick={async () => handleCommentSubmit(chats, user)}
                  >
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
