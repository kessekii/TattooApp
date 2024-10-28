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
} from "../masterspage/profileVIewPageComponents";
import { EditButton, FriendAvatar } from "./friendPage";
import ChatComponent from "../components/chat";
import { updateChatStraight } from "../../state/action-creators";
import { getPostsByUserId, getUserById } from "../../hooks/useChat";
import { Box, Grid, Paper, TextField } from "@mui/material";

const FriendPortfolioViewPage: React.FC = ({}) => {
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [user, setUser] = useLocalStorage("user", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
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
      const friend = JSON.parse(window.localStorage.getItem("friend") || "{}");
      const friendChats = JSON.parse(
        window.localStorage.getItem("friendChats") || "{}"
      );
      const friendPosts = JSON.parse(
        window.localStorage.getItem("friendPosts") || "{}"
      );
      // Find the selected post
      // const updatedPosts = friend.friendPosts.map((post) => {
      //     post.id === selectedPostId && post.comments && post.comments.length > 0) {
      //         // Add the new comment to the selected post
      //         return {
      //             ...post,
      //             comments: [...post.comments, { author: friend.username, text: newComment }],
      //         };
      //     }
      //     return {
      //         ...post,
      //         comments: [{ author: friend.username, text: newComment }],

      //     }
      // })

      const filteredPost =
        friend && friendPosts ? friendPosts[selectedPostId] : [];

      const chat =
        friendChats && Object.keys(friendChats).length === 0
          ? {}
          : friendChats[filteredPost.chatId];

      console.log(chat, selectedPostId);

      if (chat?.messages && chat.messages?.length > 0) {
        console.log("not first");
        chat.messages.push({
          author: user.username,
          text: newComment,
          timestamp: new Date().getTime(),
        });

        await updateChatStraight(chat, filteredPost.chatId);

        if (!friendChats[filteredPost.chatId]) {
          friendChats[filteredPost.chatId] = {};
        }
        const postsData = (await getPostsByUserId(friend.username)).payload;
        friendChats[filteredPost.chatId].messages = chat.messages;
        setFriend(friend);
        setFriendChats(friendChats);
        setFriendPosts(postsData);
      } else if (
        !friendChats ||
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
        const postsData = (await getPostsByUserId(friend.username)).payload;
        if (!friendChats[filteredPost.chatId]) {
          friendChats[filteredPost.chatId] = {};
        }
        friendChats[filteredPost.chatId].messages = chat.messages;
        setFriend(friend);
        setFriendChats(friendChats);
        setFriendPosts(postsData);
      }

      console.log();

      // Update friend with the new comments

      // Clear the input and close the popup
      setNewComment("");
      handleCloseCommentsPopup();
    }
  };

  return (
    <PortfolioPage theme={themevars} style={{ display: "contents" }}>
      <Grid
        container
        style={{
          overflow: "scroll",
          justifyContent: "center",
          // display: "contents",
        }}
        direction="row"
      >
        {friend &&
          Object.keys(friend.posts || {}).map((post) => (
            <Grid
              item
              style={{
                // height: "40vh",
                width: "100vw",

                // padding: "10px 15px",
                // justifyItems: "center",
                // alignContent: "space-between",
                // alignItems: "flex-end",
                // flexWrap: "nowrap",
                // display: "contents",
                // objectFit: "contain",
              }}
            >
              <PostWrapper key={post}>
                <PostImage
                  style={{
                    width: "80vw",
                    maxWidth: "400px",
                    height: "80vw",
                    maxHeight: "400px",
                    objectFit: "contain",
                    margin: "3px",
                  }}
                  src={friendPosts[post]?.image}
                  alt={`Post ${post}`}
                />
                <PostDetails>
                  <UserSection>
                    <UserAvatar
                      src={friend.profilePicture}
                      alt={`${friend.username} avatar`}
                    />
                    <UserName onClick={() => navigate("../mastersPage")}>
                      {friend.name}
                    </UserName>
                  </UserSection>
                  <Description>{friendPosts[post]?.description}</Description>
                  <Caption>
                    <strong>
                      {friendPosts[post]?.friend &&
                        friendPosts[post]?.friend.name}
                    </strong>{" "}
                    {friendPosts[post]?.description}
                  </Caption>

                  {friendChats && friendChats[friendPosts[post]?.chatId] ? (
                    <CommentSection
                      theme={themevars}
                      onClick={() => handleCommentsClick(post)}
                    >
                      {friendChats[friendPosts[post]?.chatId]?.messages
                        ?.length === 0 ? (
                        <>No comments yet</>
                      ) : (
                        <>
                          <strong>
                            {friendChats[friendPosts[post]?.chatId].messages
                              ?.length > 0
                              ? friendChats[friendPosts[post]?.chatId].messages[
                                  friendChats[friendPosts[post]?.chatId]
                                    .messages.length - 1
                                ].author + ": "
                              : ""}
                          </strong>
                          {friendChats[friendPosts[post]?.chatId].messages
                            ?.length > 0
                            ? friendChats[friendPosts[post]?.chatId].messages[
                                friendChats[friendPosts[post]?.chatId].messages
                                  .length - 1
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
                    <>
                      View all{" "}
                      {friendChats[friendPosts[post]?.chatId]?.messages
                        ?.length || 0}{" "}
                      comments
                    </>
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
                        {friendChats[friendPosts[post]?.chatId]?.messages &&
                        friendChats[friendPosts[post]?.chatId].messages.length >
                          0 ? (
                          friendChats[friendPosts[post]?.chatId].messages.map(
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

export default FriendPortfolioViewPage;
