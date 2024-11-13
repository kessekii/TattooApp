import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../utils/Axios";

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
  StyledLikeButton,
  LikeIcon,
  LikeSection,
  PortfolioPage,
  PostDetails,
  PostImage,
  PostWrapper,
  UserAvatar,
  UserName,

} from "./profileVIewPageComponents";
import { EditButton, IcoButton, ProfileDescription, Typefield } from "./masterPage";
import ChatComponent from "../components/chat";
import {
  getPostByPostId,
  getProfileData,
  updateChatStraight,
  updatePost,
} from "../../state/action-creators";
import { getImageByImageId, getPostsByUserId } from "../../hooks/useChat";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { getAvatarIdsByChatId } from "./../../utils/helpers/helperFuncs";
import { ArrowBackIos, Chat } from "@mui/icons-material";
import { Dict } from "styled-components/dist/types";
import { ChatIcon } from "../../assets/icons/ChatIcon";
import { BorderHorizontal } from "../chatspage/chatsPagge";
import useSlice from "../../hooks/useSlice";

const StyledEditButton = styled.button`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  width: 5vw;
  height: 5vw;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.text};
`;

const PortfolioViewPage: React.FC = ({ }) => {
  const { data: friend, setFriend, getFriendData } = useSlice('friend')
  const { data: user } = useSlice('user')

  const { privateChats, publicChats: publicChats, getPublicChatsAction } = useSlice('chats');
  const { data: posts, setPosts } = useSlice('posts')
  const { images: images, avatars: avatars, setAvatars } = useSlice("images")



  const { data: friendPosts, setFriendPosts } = useSlice("friendPosts");

  const { updateUser, updateChat } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [showCommentsPopup, setShowCommentsPopup] = useState<string | null>(
    null
  );
  const [datagrid, setDatagrid] = useState<any>()
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


  const handleCommentSubmit = async () => {
    if (selectedPostId !== null && newComment.trim() !== "") {


      const filteredPost =
        friend && friendPosts ? friendPosts[selectedPostId] : { chatId: "" };

      const chat =
        publicChats && Object.keys(publicChats).length === 0
          ? {}
          : publicChats[filteredPost.chatId];

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

        if (!publicChats[filteredPost.chatId]) {
          publicChats[filteredPost.chatId] = {};
        }
        const postsData = (await getPostsByUserId(friend.username));
        publicChats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(friend.username);

        setFriend({ ...newUserData.payload });
        getPublicChatsAction(publicChats);
        setFriendPosts(postsData.payload);
        if (newUserData.payload.username === user.username) {
          setFriend(newUserData.payload);
          getPublicChatsAction(publicChats);
          setFriendPosts(postsData.payload);
        }
      } else if (
        !publicChats ||
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
        const postsData = await getPostsByUserId(friend.username);
        if (!publicChats[filteredPost.chatId]) {
          publicChats[filteredPost.chatId] = {};
        }
        publicChats[filteredPost.chatId].messages = chat.messages;
        const newUserData = await getProfileData(friend.username);

        setFriend({ ...newUserData.payload });
        await getPublicChatsAction(publicChats);
        setFriendPosts(postsData.payload);
        if (newUserData.payload.username === user.username) {
          setFriend(newUserData.payload);
          await getPublicChatsAction(publicChats);
          setFriendPosts(postsData.payload);
        }
      }



      // Update user with the new comments

      // Clear the input and close the popup
      setNewComment("");
      handleCloseCommentsPopup();
    }
  };

  const hadleGetAvatars = async () => {


    let avatarsObj = { ...avatars };

    for (let chatid of Object.keys(publicChats)) {
      const avatarsIds = await getAvatarIdsByChatId(chatid);
      for (let avatarId of avatarsIds) {
        const avatar = await getImageByImageId(avatarId);
        avatarsObj = { ...avatarsObj, [avatar.owner]: avatar };
      }

      //;
    }

    await setAvatars(avatarsObj);
  };


  const handleUpdatePost = async (post_id: string, oldPostData: any, field: string, datagridObj: any) => {
    try {

      const datagrid = datagridObj[post_id]
      const postdata = oldPostData[post_id]

      if (datagrid == true) {
        const newPostData = { ...postdata, [field]: postdata[field].filter((username) => username !== user.username) };


        const updatedPost = await updatePost(post_id, newPostData);


        setDatagrid((prev) => ({ ...prev, [post_id]: false }))
        setFriendPosts(({ ...friendPosts, [post_id]: updatedPost }));

      } else if (datagrid == false) {
        if (postdata[field].length === 0) {
          const newPostData = { ...postdata, [field]: [user.username] };

          await updatePost(post_id, newPostData);
          setDatagrid(({ ...datagrid, [post_id]: true }))

          setFriendPosts(({ ...friendPosts, [post_id]: newPostData }));

        } else {
          const newPostData = { ...postdata, [field]: [...postdata[field], user.username] };

          await updatePost(post_id, newPostData);
          setDatagrid(({ ...datagrid, [post_id]: true }))
          setFriendPosts(({ ...friendPosts, [post_id]: newPostData }));
        }
      }


    } catch (error) {

      setErrorMessage("Failed to update post");

    }
  };





  useEffect(() => {
    if (Object.keys(friendPosts).length > 0) {


      initdataGrid()
    }
  }, [friendPosts]);

  const initdataGrid = () => {
    let datagrid = {};


    Object.values(friendPosts).forEach((post: any) => {


      datagrid[post.id] = (post.likes as any).includes(user.username);
    });




    setDatagrid(datagrid);
  }



  return (
    <PortfolioPage
      theme={themevars}
      style={{ display: "contents", background: themevars.background }}
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
        onClick={() => { !showCommentsPopup ? navigate("/" + friend.username) : handleCloseCommentsPopup() }}
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
          marginBottom: "9vh",
        }}
      // direction="row"
      >
        {friend &&
          friendPosts &&
          images &&
          Object.keys(friendPosts || {}).map((post) => (
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
              <PostWrapper key={post} style={{ objectFit: "contain", }}>
                <PostImage
                  src={images[friendPosts[post].image] ? images[friendPosts[post].image].src : "/blankPicture.png"}
                  alt={`Post ${post}`}
                  style={{
                    width: "80vw",
                    maxWidth: "400px",
                    height: "80vw",
                    maxHeight: "400px",
                    objectFit: "contain",

                  }}
                />
                <>
                  <PostDetails style={{ padding: "10px 7px" }} >
                    <UserSection>
                      <UserAvatar
                        src={avatars[friend.username].src ? avatars[friend.username].src : '/blankPicture.png'}
                        alt={`${friend.username} avatar`}
                        style={{}}
                      />
                      <ProfileDescription style={{ marginLeft: '25px' }}>
                        <UserName onClick={() => navigate("../" + friend.username)}>
                          {friend.name}
                        </UserName>
                        <Typefield style={{ overflow: "hidden", maxWidth: "60vw", lineBreak: "strict", color: themevars.text }}>
                          {friendPosts[post].description}
                        </Typefield>
                      </ProfileDescription>
                    </UserSection>
                  </PostDetails>
                  {/* <Description>{friendPosts[post].description}</Description> */}
                  {/* <Caption>
                    <strong>{posts[post].user && posts[post].user.name}</strong>{" "}
                    {posts[post].description}
                  </Caption> */}

                  {publicChats && friendPosts[post].chatId && publicChats[friendPosts[post].chatId] && publicChats[friendPosts[post].chatId] ? (
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
                      {publicChats[friendPosts[post].chatId]?.messages
                        ?.length === 0 ? (
                        <>No comments yet</>
                      ) : (
                        <>
                          {/* <Box
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
                          :{" "} */}
                        </>
                      )}
                    </CommentSection>
                  ) : (
                    <CommentSection onClick={() => handleCommentsClick(post)}>
                      <>No comments yet</>
                    </CommentSection>
                  )}
                  <LikeSection>
                    {friendPosts && datagrid && <StyledLikeButton theme={themevars} liked={datagrid[post] ? true : false}
                      onClick={() => handleUpdatePost(post, friendPosts, "likes", datagrid)}>
                      <svg viewBox="0 0 24 24">
                        <path d="M16.5 3C14.4 3 12.7 4.2 12 5.3 11.3 4.2 9.6 3 7.5 3 4.5 3 2 5.5 2 8.5c0 5 6 8.8 10 12.5 4-3.7 10-7.5 10-12.5C22 5.5 19.5 3 16.5 3z"></path>
                      </svg>
                    </StyledLikeButton>}

                    <IcoButton
                      style={{ marginInline: 'unset', paddingInline: '40px', marginTop: 'unset', display: 'flex', color: themevars.icons.color, justifySelf: "right", alignItems: "center", justifyContent: "right", }}
                      theme={themevars}
                      onClick={() => handleCommentsClick(post)}
                    >
                      <Typography style={{ marginLeft: '10px', color: themevars.icons.color }}>
                        View all{" "}
                        {publicChats[friendPosts[post].chatId]?.messages
                          ?.length || 0}{" "}
                        comments

                      </Typography>

                      <Chat style={{ marginLeft: '8px', color: themevars.icons.color }} />
                    </IcoButton>


                  </LikeSection>

                </>

                {showCommentsPopup === post && (
                  <CommentsPopup style={{ background: themevars.background }}>
                    <CommentsContent theme={themevars}>


                      <CommentList
                        style={{
                          borderRadius: "0px",
                          alignItems: "center",
                          display: "grid",
                          height: 'auto',
                          marginTop: "6vh",
                          paddingBottom: "19vh",
                          background: themevars.background,
                        }}
                      >
                        <PostImage
                          src={images[friendPosts[post].image]?.src || ""}
                          alt={`Post ${post}`}
                          style={{
                            width: "80vw",
                            maxWidth: "400px",
                            height: "80vw",
                            maxHeight: "400px",
                            objectFit: "contain",
                            margin: "auto",
                          }}
                        />
                        <PostDetails >
                          <UserSection>
                            <UserAvatar
                              src={avatars[friend.username] ? avatars[friend.username].src : '/blankPicture.png'}
                              alt={`${friend.username} avatar`}
                              style={{ marginLeft: "25px" }}
                            />
                            <ProfileDescription style={{ marginLeft: '25px' }}>
                              <UserName onClick={() => navigate("../" + friend.username)}>
                                {friend.name}
                              </UserName>
                              <Typefield style={{ overflow: "hidden", maxWidth: "60vw", lineBreak: "strict", color: themevars.text }}>
                                {friendPosts[post].description}
                              </Typefield>
                            </ProfileDescription>
                          </UserSection>
                        </PostDetails>
                        {publicChats[friendPosts[post].chatId]?.messages &&
                          publicChats[friendPosts[post].chatId].messages.length >
                          0 ? (
                          publicChats[friendPosts[post].chatId].messages.map(
                            (comment, index) => (
                              <CommentItem
                                key={index + comment.author}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  display: "flex",
                                  paddingInline: "30px",

                                  backgroundColor: themevars.navbar.background,
                                  borderRadius: "25px",
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
                                    paddingBottom: "unset",
                                  }}
                                >
                                  <Box
                                    style={{
                                      flexDirection: "column",
                                      display: "flex",
                                    }}
                                  >
                                    <UserAvatar
                                      src={avatars[comment.author] ? avatars[comment.author].src : '/blankPicture.png'}
                                    ></UserAvatar>

                                    {/*  */}
                                  </Box>
                                  <CommentAuthor
                                    style={{
                                      float: "left",
                                      marginRight: "20px",
                                    }}
                                  >
                                    {comment.author}
                                  </CommentAuthor>

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
                        marginBottom: "9vh",
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
                        onClick={async () => await handleCommentSubmit()}
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
    </PortfolioPage >
  );
};

export async function getAvatarByUserId(username: string) {
  try {
    //
    const response = await fetch(
      baseURL + "users/getAvatarByUserId",
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
    return result.payload;
  } catch (error) {

  }
}

export default PortfolioViewPage;
