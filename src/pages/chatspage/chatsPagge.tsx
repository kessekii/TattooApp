import styled from "styled-components";
import { useTheme } from "../../state/providers/themeProvider";
import {
  getChatsByUserId,
  getPrivateChatsByUserId,
} from "../../../src/hooks/useChat";
import { Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CommentsContent } from "../masterspage/profileVIewPageComponents";

import { updateChatStraight } from "../../../src/state/action-creators";
import { Box, Paper, TextField } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ArrowBackIos, BorderBottomOutlined, Send } from "@mui/icons-material";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { sq } from "date-fns/locale";
import useSlice from "../../hooks/useSlice";

// Styled Components

const SearchBar = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  left: 10%;
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 25px;
  border-color: ${({ theme }) => theme.buttonBackground};

  align-items: center;
  width: 70vw;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  border-radius: 25px;
  margin-left: 5px;
  flex-grow: 2;
  font-size: giant;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
`;

const StyledCommentList = styled.div`
  font-family: "Arial", sans-serif;

  width: 100%;

  height: 90vh;
  border-radius: 25px;

  height: fit-content;
`;

export const StyledCommentsPopup = styled.div`
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.popup.text};
  
  position: relative;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 15px;
  z-index: 1000;
`;

const StyledEditButton = styled.button`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  width: 5vw;
  height: 5vw;
`;

const StyledCommentItem = styled.div<{ isUser }>`
  display: flex;
  flex-direction: ${(props) => (props.isUser ? "column-reverse" : "column")};
  width: 100%;
  padding: 0;
  marginbottom: 1vh;
  
  borderradius: 25px;
`;

const StyledCommentText = styled.div`
  font-size: 15px;

  margin-inline: 10px;
 
  color: ${(props) => props.theme.text};
`;
const StyledCommentTimeText = styled.div<{ isUser }>`
  font-size: 10px;
  position: absolute;
  display: flex;

  align-self: ${(props) => (props.isUser ? "bottom" : "bottom")};
  margin-inline: 7px;
  transform: translateY(calc(5vh + 16px));
  opacity: 0.5;
  color: ${(props) => props.theme.text};
`;

const StyledFriendAvatar = styled.img`
  height: 50px;
  width: 50px;

  border-radius: 50%;
`;

const StyledCommentSubmitButton = styled.button`
  background: transparent;
  position: absolute;
  color: ${(props) => props.theme.text};
  border: none;
  cursor: pointer;
  width: 5vw;
  height: 5vw;
  right: 25px;

  cursor: pointer;
`;

const StyledCommentAuthor = styled.div`
  color: ${(props) => props.theme.text};
`;

export const BorderHorizontal = styled.div`
width:calc(100% - 30px);
height:1px;
opacity: 0.2;
background:${({ theme }) => theme.text};
float: end;
position: absolute;

`
// Component
export const ChatsPageComponent: React.FC = () => {
  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }
  const formatDate = (timestamp) => {
    const timeDiff = new Date().getTime() - timestamp;
    if (timeDiff > 604800000) {
      return new Date(timestamp)
        .toUTCString()
        .split(", ")[1]
        .split(" ", 2)
        .join(" ");
    } else if (timeDiff > 86400000) {
      return new Date(timestamp).toUTCString().split(",")[0];
    }
    const [hours, minutes] = new Date(timestamp)
      .toISOString()
      .split("T")[1]
      .split(":");
    return `${hours}:${minutes}`;
  };
  const { chatId } = useParams();
  const { data: user, setUser } = useSlice("user"); // Replace useLocalStorage with useSlice
  const { data: friend, setFriend, getFriendData } = useSlice("friend");
  const { getNewsDataAction } = useSlice("news");
  const { data: posts,
    setPosts,
    getPostsByUserIdAction
  } = useSlice("posts");
  const { avatars: avatars, images: images, ids,
    getImagesByImageIdsAction,
    getImageIdsByUsernameAction,
    getMapImagesByUserIdAction,
    getAvatarsAction
  } = useSlice("images");
  const { data: friendPosts, setFriendPosts, getFriendPostsAction } = useSlice("friendPosts");



  const { privateChats, setPostChats, setPrivateChats, getPrivateChatsAction, getPublicChatsAction } = useSlice("chats");
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [isMessagesPopupOpened, setIsMessagesPopupOpened] = useState(
    chatId ? true : false
  );
  const [selectedChatId, setselectedChatId] = useState<any>(
    chatId ? chatId : {}
  );
  const [hideNav, setHideNav] = useLocalStorage("hideNav", false);
  const { toggleTheme, themevars } = useTheme();

  const handleLoaPrivateChats = async () => {
    const privats = await getPrivateChatsAction(user.username);

    await timeout(5000);
    return privats;
    //for 1 sec delay
  };
  const handleOpenMessages = (privateChatId: string) => {
    if (isMessagesPopupOpened) {
      setIsMessagesPopupOpened(false);
      setselectedChatId("");
      navigate("/chats");
    } else {
      setselectedChatId(privateChatId);
      setIsMessagesPopupOpened(true);
      navigate("/chats/" + privateChatId);
      setHideNav(true);
    }
  };
  const handleCommentSubmit = async (privateChatId: string) => {
    if (privateChatId !== null && newComment.trim() !== "") {
      const user = JSON.parse(window.localStorage.getItem("friend") || "{}");
      const chats = JSON.parse(
        window.localStorage.getItem("friendChats") || "{}"
      );

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

      const chat = chats[privateChatId];
      //
      if (chats && chat && chat.messages && chat.messages?.length > 0) {
        chat.messages.push({
          author: user.username,
          text: newComment,
        });

        const newChatData = (await updateChatStraight(chat, privateChatId))
          .payload;

        if (!chats[privateChatId]) {
          chats[privateChatId] = {};
        }

        chats[privateChatId] = newChatData;
        const newPrivateChats = await getPrivateChatsByUserId(user.username);

        setUser(user);
        setFriend(user);
        setPrivateChats({ ...newPrivateChats.payload });
        setPostChats(chats);
      } else if (
        !chats ||
        (chat && (!chat.messages || chat.messages.length === 0))
      ) {
        chat.messages = [
          {
            author: user.username,
            text: newComment,
          },
        ];

        const newChatData = (await updateChatStraight(chat, privateChatId))
          .payload;

        if (!chats[privateChatId]) {
          chats[privateChatId] = {};
        }
        chats[privateChatId].messages = newChatData;
        setUser(user);
        setFriend(user);

        setPostChats(chats);
        const newPrivateChats = await getPrivateChatsByUserId(user.username);
        setPrivateChats(newPrivateChats.payload);
      }

      // Update user with the new comments

      // Clear the input and close the popup
      setNewComment("");
    }
  };
  //   useEffect(() => {
  //     setPrivateChats({});
  //     return () => {
  //       await;
  //     };
  //   }, []);



  const renderMessages = (messages) => {
    return messages.map((message, i) => {
      const isUserMessage = message.author === user.username;




      return (
        <StyledCommentItem
          isUser={isUserMessage}
          key={`${i}-${message.author}`}
          style={{
            width: "100%",
            background: themevars.background,

            flexDirection: isUserMessage ? "row-reverse" : "row",
          }}
        >
          <Box
            style={{
              height: "5vh",
              display: "flex",
              alignItems: "center",
              padding: "7px",
              position: "relative",
              marginBottom: "20px",
              borderRadius: "15px",
              background: themevars.buttonBackground,
              //backgroundColor: i % 2 === 0 ? "rgb(242,242,242)" : "#eeeeee",
              flexDirection: isUserMessage ? "row-reverse" : "row",
            }}
          >
            <StyledFriendAvatar
              theme={themevars}
              src={Object.keys(avatars).includes(user.username) && Object.keys(avatars).includes(message.author) ? isUserMessage ? avatars[user['username']].src : avatars[message['author']].src : isUserMessage ? images[user['profilePicture']].src : '/blankPicture.png'}
              alt={message.author}
            />
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <StyledCommentText>{message.text}</StyledCommentText>
            </Box>
          </Box>
          <StyledCommentTimeText
            isUser={message.author == user.username}
            style={{ fontSize: 13 }}
          >
            {formatDate(message.timestamp)}
          </StyledCommentTimeText>

        </StyledCommentItem>
      );
    });
  };

  const participants = useMemo(
    () =>
      Object.keys(privateChats || {}).map((privateChatId) => {

        const chatData = privateChats[privateChatId];

        const author = chatData.participants.find((e) => e !== user.username);
        const lastMessage = chatData.lastMessage?.text || "";

        return (
          <StyledCommentList
            key={privateChatId}
            style={{
              background: themevars.background,
              border: "0",
              boxShadow: "unset",
              marginTop: "6vh",
              marginBottom: "14vh",
              borderBottom: "2px",

            }}
          >



            {chatData.messages?.length > 0 &&
              privateChatId === selectedChatId &&
              isMessagesPopupOpened ? (
              <StyledCommentsPopup
                style={{ overflow: "scroll", scrollBehavior: "smooth", boxShadow: "unset", }}
                theme={themevars}
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

                    top: "0",
                    zIndex: "2000",
                    backdropFilter: "blur(10px)",
                    background: themevars.buttonBackground + "1A",

                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                  onClick={() => handleOpenMessages(privateChatId)}
                >
                  <div style={{ marginLeft: "15px" }}>
                    <ArrowBackIos style={{ alignSelf: "start" }} />
                  </div>
                </StyledEditButton>




                {renderMessages(chatData.messages)}


                <Box
                  style={{
                    width: "100%",
                    maxWidth: "100vw",

                    position: "fixed",
                    bottom: "0",
                    left: "0",
                    display: "block",
                    background: themevars.background,
                    height: "14vh",
                    // display: "flex",
                    boxShadow: "unset",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box style={{ display: "flex", alignItems: "center", boxShadow: "unset", }}>
                    <TextField
                      style={{
                        background: themevars.background,
                        width: "100%",
                        border: "unset",
                      }}
                      value={newComment}
                      placeholder="Write a message..."
                      rows={5}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <StyledCommentSubmitButton
                      onClick={() => handleCommentSubmit(selectedChatId)}
                    >
                      <Send style={{ color: themevars.text }} />
                    </StyledCommentSubmitButton>
                  </Box>
                  <BorderHorizontal style={{ marginLeft: '15px' }} theme={themevars} />
                </Box>
              </StyledCommentsPopup>
            ) : chatData.messages?.length > 0 &&
              privateChatId !== selectedChatId &&
              isMessagesPopupOpened ? (
              <></>
            ) : (
              <StyledCommentItem
                theme={themevars}
                isUser={author == user.name}
                key={`${privateChatId}-${author}`}
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
                onClick={() => handleOpenMessages(privateChatId)}
              >
                <StyledEditButton
                  theme={themevars}
                  style={{
                    width: "100%",
                    height: "6vh",
                    display: "flex",
                    alignItems: "stretch",
                    alignContent: "center",
                    position: "fixed",
                    top: "0",
                    zIndex: "2000",
                    backdropFilter: "blur(10px)",
                    background: themevars.buttonBackground + "1A",

                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                  onClick={() => handleOpenMessages(privateChatId)}
                >
                  <SearchBar>
                    <FaSearch />
                    <SearchInput placeholder="Search Chats..." />
                  </SearchBar>
                </StyledEditButton>

                <Paper
                  style={{
                    background: "transparent",
                    // marginTop: "6vh",
                    boxShadow: "unset",
                    marginBottom: "5px",
                    display: "flex",
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  <StyledFriendAvatar
                    style={{ marginLeft: "15px" }}
                    theme={themevars}
                    src={avatars[author]?.src || '/blankPicture.png'}
                    alt={author}
                  />
                  <Box
                    style={{
                      display: "flex",
                      marginLeft: "15px",
                      flexDirection: "column",
                      width: "80vw",
                      justifyContent: "space-between",
                    }}
                  >
                    <StyledCommentAuthor
                      style={{ background: "transparent", fontWeight: "bold" }}
                      theme={themevars}
                    >
                      {author}
                    </StyledCommentAuthor>

                    <StyledCommentText
                      style={{ marginInline: "unset" }}
                      theme={themevars}
                    >
                      {
                        <p
                          style={{
                            marginInline: "unset",
                            fontWeight: "500",
                            color: themevars.accent,
                            margin: "0",
                          }}
                        >
                          {chatData.lastMessage?.author}{" "}
                          <text style={{ color: themevars.text }}>
                            {" "}
                            {lastMessage}
                          </text>
                        </p>
                      }
                    </StyledCommentText>
                  </Box>
                  <StyledCommentText
                    style={{
                      float: "right",
                      fontSize: 15,
                      color: themevars.text,
                      marginRight: "15px",
                      textAlign: "right",
                      opacity: 0.5,
                    }}
                  >
                    {new Date().getTime() -
                      privateChats[privateChatId].lastMessage.timestamp >
                      259200000
                      ? new Date(
                        privateChats[privateChatId].lastMessage.timestamp
                      )
                        .toUTCString()
                        .split(", ")[1]
                        .split(" ", 2)
                        .map((e) => e + " ")
                      : new Date().getTime() -
                      privateChats[privateChatId].lastMessage.timestamp >
                      86400000 &&
                      new Date(
                        privateChats[privateChatId].lastMessage.timestamp
                      )
                        .toUTCString()
                        .split(",")[0]
                        .split("T")[0] +
                      " " +
                      new Date(
                        privateChats[privateChatId].lastMessage.timestamp
                      )
                        .toISOString()
                        .split("T")[1]
                        .split(":")[0] +
                      ":" +
                      new Date(
                        privateChats[privateChatId].lastMessage.timestamp
                      )
                        .toISOString()
                        .split("T")[1]
                        .split(":")[1]}
                  </StyledCommentText>
                </Paper>
                <BorderHorizontal theme={themevars} />
              </StyledCommentItem>
            )
            }
          </StyledCommentList >
        );
      }),
    [privateChats, isMessagesPopupOpened, newComment, selectedChatId]
  );

  return <Box style={{}}>{participants}</Box>;
};
