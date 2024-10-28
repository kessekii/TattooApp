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
import {
  getProfileData,
  updateChatStraight,
} from "../../state/action-creators";
import { getPostsByUserId } from "../../hooks/useChat";
import { Box, Grid, Paper, TextField } from "@mui/material";

const PortfolioViewPage: React.FC = ({}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
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
          timestamp: new Date().getTime(),
        });

        const newChatData = (
          await updateChatStraight(chat, filteredPost.chatId)
        ).payload;

        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        const postsData = (await getPostsByUserId(user.username)).payload;
        chats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(user.username);
        setUser({ ...newUserData.payload });

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
            timestamp: new Date().getTime(),
          },
        ];

        await updateChatStraight(chat, filteredPost.chatId);
        const postsData = (await getPostsByUserId(user.username)).payload;
        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        chats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(user.username);
        setUser({ ...newUserData.payload });
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
    <PortfolioPage theme={themevars} style={{ display: "contents" }}>
      <Grid
        container
        key={user.username + "gridccc"}
        style={{
          justifyContent: "center",
          width: "100vw",
          overflow: "scroll",
          // height: "40vh",
          // width: "40vh",
          // display: "contents",
        }}
        // direction="row"
      >
        {user &&
          Object.keys(posts || {}).map((post) => (
            <Grid
              item
              style={{
                width: "100vw",
                // height: "40vh",
                // width: "40vh",
                // padding: "10px 15px",
                // justifyItems: "center",
                // alignContent: "space-between",
                // alignItems: "flex-end",
                // flexWrap: "nowrap",
                // display: "contents",
                // objectFit: "contain",
              }}
            >
              <PostWrapper key={post} style={{ objectFit: "contain" }}>
                <PostImage
                  src={posts[post].image}
                  alt={`Post ${post}`}
                  style={{
                    width: "80vw",
                    maxWidth: "400px",
                    height: "80vw",
                    maxHeight: "400px",
                    objectFit: "contain",
                    margin: "3px",
                  }}
                />
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
                          <strong>
                            {chats[posts[post].chatId].messages?.length > 0
                              ? chats[posts[post].chatId].messages[
                                  chats[posts[post].chatId].messages.length - 1
                                ].author + ": "
                              : ""}
                          </strong>
                          {chats[posts[post].chatId].messages?.length > 0
                            ? chats[posts[post].chatId].messages[
                                chats[posts[post].chatId].messages.length - 1
                              ].text
                            : ""}
                          :{" "}
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
                    <Box onClick={() => handleCommentsClick(post)}>
                      View all{" "}
                      {chats[posts[post].chatId]?.messages?.length || 0}{" "}
                      comments
                    </Box>
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
                              <CommentItem
                                key={index + comment.author}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  display: "flex",
                                }}
                              >
                                <Box
                                  style={{
                                    // marginRight: "20%",
                                    width: "60vw",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    display: "flex",
                                    padding: "10px",
                                  }}
                                >
                                  <Box
                                    style={{
                                      flexDirection: "column",
                                      display: "flex",
                                    }}
                                  >
                                    <CommentAuthor
                                      style={{
                                        float: "left",
                                        marginRight: "20px",
                                      }}
                                    >
                                      {comment.author}
                                    </CommentAuthor>
                                    {/*  */}
                                  </Box>

                                  <CommentText style={{ float: "left" }}>
                                    {comment.text}
                                  </CommentText>
                                </Box>
                                <CommentText
                                  style={{ float: "right", fontSize: 12 }}
                                >
                                  {comment.timestamp
                                    ? new Date(comment.timestamp)
                                        .toISOString()
                                        .split("T")[0] +
                                      ", " +
                                      new Date(comment.timestamp)
                                        .toISOString()
                                        .split("T")[1]
                                        .split(":")[0] +
                                      ":" +
                                      new Date(comment.timestamp)
                                        .toISOString()
                                        .split("T")[1]
                                        .split(":")[1]
                                    : ""}
                                </CommentText>
                              </CommentItem>
                            )
                          )
                        ) : (
                          <CommentItem>
                            <CommentText>No comments yet</CommentText>
                          </CommentItem>
                        )}
                      </CommentList>
                    </CommentsContent>
                    <Paper style={{}}>
                      <TextField
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></TextField>
                      <CommentSubmitButton
                        onClick={async () => await handleCommentSubmit("", "")}
                      >
                        Submit Comment
                      </CommentSubmitButton>
                    </Paper>
                  </CommentsPopup>
                )}
              </PostWrapper>
            </Grid>
          ))}
      </Grid>
    </PortfolioPage>
  );
};

export default PortfolioViewPage;
