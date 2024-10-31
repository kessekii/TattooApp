import React, { useEffect, useState } from "react";
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
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";

const PortfolioViewPage: React.FC = ({}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [friend, setFriend] = useLocalStorage("friend", {});
  const [chats, setChats] = useLocalStorage("chats", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [avatars, setAvatars] = useState({});
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
  let loggedInUser = user.name === friend.name;
  let userShown = loggedInUser ? user : friend;
  let chatsShown = loggedInUser ? chats : friendChats;
  let postsShown = loggedInUser ? posts : friendPosts;
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
      const friend = JSON.parse(window.localStorage.getItem("friend") || "{}");
      let loggedInUser = user.name === friend.name;
      let userShown = loggedInUser ? user : friend;
      const chats = JSON.parse(
        window.localStorage.getItem(loggedInUser ? "chats" : "friendChats") ||
          "{}"
      );
      const posts = JSON.parse(
        window.localStorage.getItem(loggedInUser ? "posts" : "friendPosts") ||
          "{}"
      );

      const filteredPost =
        userShown && posts ? posts[selectedPostId] : { chatId: "" };
      console.log("Selected Post Id:", selectedPostId);
      const chat =
        chats && Object.keys(chats).length === 0
          ? {}
          : chats[filteredPost.chatId];

      if (chat?.messages && chat.messages?.length > 0) {
        chat.messages.push({
          author: user.username,
          text: newComment,
          timestamp: new Date().getTime(),
        });

        await updateChatStraight(chat, filteredPost.chatId);

        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        const postsData = (await getPostsByUserId(userShown.username)).payload;
        chats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(userShown.username);
        loggedInUser
          ? setUser({ ...newUserData.payload })
          : setFriend({ ...newUserData.payload });
        loggedInUser ? setChats(chats) : setFriendChats(chats);
        loggedInUser ? setPosts(postsData) : setFriendPosts(postsData);
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
        const postsData = (await getPostsByUserId(userShown.username)).payload;
        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        chats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(userShown.username);
        loggedInUser
          ? setUser({ ...newUserData.payload })
          : setFriend({ ...newUserData.payload });
        loggedInUser ? setChats(chats) : setFriendChats(chats);
        loggedInUser ? setPosts(postsData) : setFriendPosts(postsData);
      }

      console.log();

      // Update user with the new comments

      // Clear the input and close the popup
      setNewComment("");
      handleCloseCommentsPopup();
    }
  };

  const hadleGetAvatars = async () => {
    const chats = JSON.parse(
      window.localStorage.getItem(loggedInUser ? "chats" : "friendChats") ||
        "{}"
    );
    let allTouchedUsers = {};

    for (let chatid of Object.keys(chats)) {
      chats[chatid].participants.map((e, index) => {
        allTouchedUsers[chats[chatid].participants[index]] = "";
      });
      // console.log(touchedPart);
    }
    console.log(allTouchedUsers);
    for (let userTouchedId of Object.keys(allTouchedUsers)) {
      const avatar = await getAvatarByUserId(userTouchedId);
      allTouchedUsers[userTouchedId] = avatar.payload;
    }
    setAvatars(allTouchedUsers);
  };
  useEffect(() => {
    console.log(avatars);
  }, [avatars]);

  return (
    <PortfolioPage
      theme={themevars}
      style={{ display: "contents" }}
      onLoad={async () => await hadleGetAvatars()}
    >
      <Grid
        container
        key={userShown.username + "gridccc"}
        style={{
          overflow: "scroll",
        }}
        // direction="row"
      >
        {userShown &&
          postsShown &&
          Object.keys(userShown.posts || {}).map((post) => (
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
                  src={postsShown[post].image}
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
                      src={userShown.profilePicture}
                      alt={`${userShown.username} avatar`}
                    />
                    <UserName
                      onClick={() => navigate("../" + userShown.username)}
                    >
                      {userShown.name}
                    </UserName>
                  </UserSection>
                  <Description>{postsShown[post].description}</Description>
                  {/* <Caption>
                    <strong>{posts[post].user && posts[post].user.name}</strong>{" "}
                    {posts[post].description}
                  </Caption> */}

                  {chatsShown && chatsShown[postsShown[post].chatId] ? (
                    <CommentSection
                      theme={themevars}
                      onClick={() => handleCommentsClick(post)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {chatsShown[postsShown[post].chatId]?.messages?.length ===
                      0 ? (
                        <>No comments yet</>
                      ) : (
                        <>
                          <Box
                            style={{
                              flexDirection: "column",
                              display: "flex",
                            }}
                          >
                            <strong>
                              {chatsShown[postsShown[post].chatId].messages
                                ?.length > 0
                                ? chatsShown[postsShown[post].chatId].messages[
                                    chatsShown[postsShown[post].chatId].messages
                                      .length - 1
                                  ].author + ": "
                                : ""}
                            </strong>
                            <UserAvatar
                              src={
                                avatars[
                                  chatsShown[postsShown[post].chatId].messages[
                                    chatsShown[postsShown[post].chatId].messages
                                      .length - 1
                                  ].author
                                ]
                              }
                            />
                          </Box>
                          <Typography
                            style={{ marginTop: "13px", marginLeft: "20px" }}
                          >
                            {
                              chatsShown[postsShown[post].chatId].messages[
                                chatsShown[postsShown[post].chatId].messages
                                  .length - 1
                              ].text
                            }
                          </Typography>
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
                      {chatsShown[postsShown[post].chatId]?.messages?.length ||
                        0}{" "}
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

                      <CommentList
                        style={{
                          borderRadius: "0px",
                          maxHeight: "800px",
                          height: "63vh",
                        }}
                      >
                        {chatsShown[postsShown[post].chatId]?.messages &&
                        chatsShown[postsShown[post].chatId].messages.length >
                          0 ? (
                          chatsShown[postsShown[post].chatId].messages.map(
                            (comment, index) => (
                              <CommentItem
                                key={index + comment.author}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  display: "flex",
                                  paddingInline: "30px",
                                  width: "80vw",
                                  backgroundColor:
                                    index % 2 === 0
                                      ? "rgb(242,242,242)"
                                      : "#eeeeee",
                                }}
                              >
                                <Box
                                  style={{
                                    // marginRight: "20%",

                                    padding: "10px",
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    display: "flex",
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
                                    <UserAvatar
                                      src={avatars[comment.author]}
                                    ></UserAvatar>

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
                    <Paper
                      style={{
                        width: "100%",
                        maxWidth: "870px",
                        background: "lightgray",
                        height: "8vh",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <TextField
                        style={{
                          background: "white",
                          width: "60vw",
                          margin: "auto",
                        }}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></TextField>
                      <CommentSubmitButton
                        style={{ margin: "auto" }}
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
async function getAvatarByUserId(username: string) {
  try {
    // console.log("id", chatId, username);
    const response = await fetch(
      "http://localhost:4000/users/getAvatarByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
}
