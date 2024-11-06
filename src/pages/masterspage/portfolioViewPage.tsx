import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AxiosCustom from "../../utils/Axios";

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
import { getImageByImageId, getPostsByUserId } from "../../hooks/useChat";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { getAvatarIdsByChatId } from "./../../utils/helpers/helperFuncs";
import { ArrowBackIos } from "@mui/icons-material";
const StyledEditButton = styled.button`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  width: 5vw;
  height: 5vw;
`;
const PortfolioViewPage: React.FC = ({}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [friend, setFriend] = useLocalStorage("friend", {});
  const [chats, setChats] = useLocalStorage("chats", null);
  const [avatars, setAvatars] = useLocalStorage("avatars", null);
  const [images, setImages] = useLocalStorage("images", null);
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
  let loggedInUser = user.name === friend.name;
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

      const chats = JSON.parse(
        window.localStorage.getItem("friendChats") || "{}"
      );
      const posts = JSON.parse(
        window.localStorage.getItem("friendPosts") || "{}"
      );

      const filteredPost =
        friend && posts ? posts[selectedPostId] : { chatId: "" };

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
        if (!chat.participants.includes(user.username)) {
          chat.participants.push(user.username);
        }
        await updateChatStraight(chat, filteredPost.chatId);

        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        const postsData = (await getPostsByUserId(friend.username)).payload;
        chats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(friend.username);

        setFriend({ ...newUserData.payload });
        setFriendChats(chats);
        setFriendPosts(postsData);
        if (newUserData.payload.username === user.username) {
          setUser(newUserData.payload);
          setChats(chats);
          setPosts(postsData);
        }
      } else if (
        !chats ||
        (chat && (!chat.messages || chat.messages.length === 0))
      ) {
        chat.messages = [
          {
            author: user.username,
            text: newComment,
            timestamp: new Date().getTime(),
          },
        ];

        await updateChatStraight(chat, filteredPost.chatId);
        const postsData = (await getPostsByUserId(friend.username)).payload;
        if (!chats[filteredPost.chatId]) {
          chats[filteredPost.chatId] = {};
        }
        chats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(friend.username);

        setFriend({ ...newUserData.payload });
        setFriendChats(chats);
        setFriendPosts(postsData);
        if (newUserData.payload.username === user.username) {
          setUser(newUserData.payload);
          setChats(chats);
          setPosts(postsData);
        }
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
      window.localStorage.getItem("friendChats") || "{}"
    );
    const avatars = JSON.parse(window.localStorage.getItem("avatars") || "{}");

    let avatarsObj = { ...avatars };

    for (let chatid of Object.keys(chats)) {
      const avatarsIds = await getAvatarIdsByChatId(chatid);
      for (let avatarId of avatarsIds) {
        const avatar = await getImageByImageId(avatarId);
        avatarsObj = { ...avatarsObj, [avatar.owner]: avatar };
      }

      //;
    }

    await setAvatars(avatarsObj);
  };
  useEffect(() => {}, [avatars]);

  return (
    <PortfolioPage
      theme={themevars}
      style={{ display: "contents", marginBottom: "20vh" }}
      onLoad={async () => await hadleGetAvatars()}
    >
      <StyledEditButton
        theme={themevars}
        style={{
          width: "100%",
          height: "6vh",
          display: "flex",
          alignItems: "stretch",
          alignContent: "flex-start",
          position: "fixed",
          marginBottom: "4vh",
          top: "0",
          zIndex: "2000",
          backdropFilter: "blur(10px)",
          background: themevars.buttonBackground + "1A",

          flexDirection: "column-reverse",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
        onClick={() => navigate("/" + friend.username)}
      >
        <div style={{ marginLeft: "15px" }}>
          <ArrowBackIos style={{ alignSelf: "start" }} />
        </div>
      </StyledEditButton>

      <Grid
        container
        key={friend.username + "gridccc"}
        style={{
          overflow: "scroll",
          marginTop: "6vh",
          height: "83vh",
        }}
        // direction="row"
      >
        {friend &&
          friendPosts &&
          Object.keys(friend.posts || {}).map((post) => (
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
                  src={images[friendPosts[post].image]?.src || ""}
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
                      src={avatars[friend.username]?.src}
                      alt={`${friend.username} avatar`}
                    />
                    <UserName onClick={() => navigate("../" + friend.username)}>
                      {friend.name}
                    </UserName>
                  </UserSection>
                  <Description>{friendPosts[post].description}</Description>
                  {/* <Caption>
                    <strong>{posts[post].user && posts[post].user.name}</strong>{" "}
                    {posts[post].description}
                  </Caption> */}

                  {friendChats && friendChats[friendPosts[post].chatId] ? (
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
                      {friendChats[friendPosts[post].chatId]?.messages
                        ?.length === 0 ? (
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
                              {friendChats[friendPosts[post].chatId].messages
                                ?.length > 0
                                ? friendChats[friendPosts[post].chatId]
                                    .messages[
                                    friendChats[friendPosts[post].chatId]
                                      .messages.length - 1
                                  ].author + ": "
                                : ""}
                            </strong>
                            <UserAvatar
                              src={
                                avatars[
                                  friendChats[friendPosts[post].chatId]
                                    .lastMessage.author
                                ].src
                              }
                            />
                          </Box>
                          <Typography
                            style={{ marginTop: "13px", marginLeft: "20px" }}
                          >
                            {
                              friendChats[friendPosts[post].chatId].messages[
                                friendChats[friendPosts[post].chatId].messages
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
                      {friendChats[friendPosts[post].chatId]?.messages
                        ?.length || 0}{" "}
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
                          height: "68vh",
                        }}
                      >
                        {friendChats[friendPosts[post].chatId]?.messages &&
                        friendChats[friendPosts[post].chatId].messages.length >
                          0 ? (
                          friendChats[friendPosts[post].chatId].messages.map(
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
                                      src={avatars[comment.author]?.src}
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
                        background: themevars.buttonBackground,
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

export async function getAvatarByUserId(username: string) {
  try {
    const headers = {
      Authorization: "Bearer " + "AIzaSyC3zvtXPRpuYYTKEJsZ6WXync_-shMPkHM",
    };

    const { data } = await AxiosCustom.post(
      "http://localhost:4000/users/getAvatarByUserId",
      { username: username },
      {
        headers,
      }
    );

    const result = data.payload;
    return result;
  } catch (error) {
    console.log("error", error);
  }
}

export default PortfolioViewPage;
