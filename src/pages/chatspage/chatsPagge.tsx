import styled from "styled-components";
import { useTheme } from "../../state/providers/themeProvider";
import {
  getChatsByUserId,
  getPrivateChatsByUserId,
} from "../../../src/hooks/useChat";
import { Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import {

  CommentsContent,
} from "../masterspage/profileVIewPageComponents";


import { updateChatStraight } from "../../../src/state/action-creators";
import { Box, Paper, TextField } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ArrowBackIos, Send } from "@mui/icons-material";
import { FaSearch } from "react-icons/fa";


// Styled Components

const SearchBar = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  left:10%;
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
font-family: 'Arial', sans-serif;
  
  width: 100%;
  borderRadius: 25px;
 height: fit-content;
  borderradius: 25px;

  height: fit-content;
`;

const StyledCommentsPopup = styled.div`
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.popup.text};
  padding: 10px;
  position: relative;
  border-radius: 10px;
  
  z-index: 1200;
`;

const StyledEditButton = styled.button`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  width: 5vw;
  height: 5vw;
  
  
`;

const StyledCommentItem = styled.div<({ isUser }) >`
  display: flex;
  flex-direction: ${(props) =>
    props.isUser ? "row-reverse" : "row"};
  width: 100%;
  padding: 0;
  
  borderRadius: 25px;
`;

const StyledCommentText = styled.div`
  font-size: 15px;

  margin-inline: 10px;
  color: ${(props) => props.theme.text};
`;
const StyledCommentTimeText = styled.div<({ isUser }) >`
  font-size: 15px;
  align-self: ${(props) => props.isUser ? "end" : "unset"}; 
  margin-inline: 10px;
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

// Component
export const ChatsPageComponent: React.FC = () => {
  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }
  const formatDate = (timestamp) => {
    const timeDiff = new Date().getTime() - timestamp;
    if (timeDiff > 604800000) {
      return new Date(timestamp).toUTCString().split(", ")[1].split(" ", 2).join(" ");
    } else if (timeDiff > 86400000) {
      return new Date(timestamp).toUTCString().split(",")[0];
    }
    const [hours, minutes] = new Date(timestamp).toISOString().split("T")[1].split(":");
    return `${hours}:${minutes}`;
  };
  const [user, setUser] = useLocalStorage("user", null);
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [loader, setloader] = useState(false);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [newComment, setNewComment] = useState("");
  const [isMessagesPopupOpened, setIsMessagesPopupOpened] = useState(false);
  const [selectedChatId, setselectedChatId] = useState<any>({});
  const [hideNav, setHideNav] = useLocalStorage('hideNav', false)
  const { toggleTheme, themevars } = useTheme();
  const [privateChats, setPrivateChats] = useState<any>({});
  const handleLoadCHats = async () => {
    const data = (await getPrivateChatsByUserId(user.username)).payload;
    console.log(data);
    setPrivateChats({ ...data });
    await timeout(5000);
    return data;
    //for 1 sec delay
  };
  const handleOpenMessages = (privateChatId: string) => {
    setselectedChatId(privateChatId);
    setIsMessagesPopupOpened(!isMessagesPopupOpened);
    setHideNav(true)
  };
  const handleCommentSubmit = async (privateChatId: string) => {
    console.log(privateChatId, "dfsdfdsf", newComment);

    if (privateChatId !== null && newComment.trim() !== "") {
      const user = JSON.parse(window.localStorage.getItem("user") || "{}");
      const chats = JSON.parse(window.localStorage.getItem("chats") || "{}");

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
      //   console.log("not first", chat);
      if (chat.messages && chat.messages?.length > 0) {
        console.log("not first");
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
        setPrivateChats({ ...newPrivateChats.payload });
        setUser(user);
        setChats(chats);
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

        const newChatData = (await updateChatStraight(chat, privateChatId))
          .payload;

        if (!chats[privateChatId]) {
          chats[privateChatId] = {};
        }
        chats[privateChatId].messages = newChatData;
        setUser(user);
        setChats(chats);
        const newPrivateChats = await getPrivateChatsByUserId(user.username);
        setPrivateChats(newPrivateChats.payload);
      }

      console.log(selectedChatId);

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

  useEffect(() => {
    let isSubscribed = true;

    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const data = await handleLoadCHats();
      // convert the data to json
      //   const json = await response.json();

      // set state with the result if `isSubscribed` is true
      if (isSubscribed) {
        setPrivateChats(data);
        setloader(!loader);
        return (isSubscribed = false);
      }
    };

    // call the function
    fetchData().catch(console.error);

    // cancel any future `setData`
    return () => privateChats;
  }, [loader]);

  const renderMessages = (messages) => {
    return messages.map((message, i) => {
      const isUserMessage = message.author === user.username;
      const avatar = isUserMessage ? user.profilePicture : user.friends[message.author]?.avatar;

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
              padding: '7px',
              position: 'relative',
              marginBottom: '5px',
              borderRadius: "15px",
              background: themevars.buttonBackground,
              //backgroundColor: i % 2 === 0 ? "rgb(242,242,242)" : "#eeeeee",
              flexDirection: isUserMessage ? "row-reverse" : "row",
            }}
          >
            <StyledFriendAvatar theme={themevars} src={avatar || ""} alt={message.author} />
            <Box style={{ display: "flex", flexDirection: "column", }}>

              <StyledCommentText>{message.text}</StyledCommentText>
              <StyledCommentTimeText isUser={message.author == user.username} style={{ fontSize: 15 }}>{formatDate(message.timestamp)}</StyledCommentTimeText>
            </Box>
          </Box>
        </StyledCommentItem >
      );
    });
  };

  const participants = useMemo(
    () =>
      Object.keys(privateChats || {}).map((privateChatId) => {
        console.log('eededed' + privateChats, privateChatId)
        const chatData = privateChats[privateChatId];

        const author = chatData.participants.find((e) => e !== user.username);
        const lastMessage = chatData.lastMessage?.text || "";

        return (
          <StyledCommentList key={privateChatId} style={{ background: themevars.background, border: "0", borderBottom: '2px', height: "fit-content", }}>
            {isMessagesPopupOpened && <>

              <StyledEditButton theme={themevars} style={{
                width: '100%', height: '6vh', display: 'flex',
                alignItems: "stretch",
                alignContent: "flex-start",
                position: 'fixed',
                top: '0',
                zIndex: '2000',
                backdropFilter: 'blur(10px)',
                background: themevars.buttonBackground + '1A',

                flexDirection: "column-reverse",
                justifyContent: "center",
                flexWrap: "wrap"
              }} onClick={() => handleOpenMessages(privateChatId)}>
                <div style={{ marginLeft: '15px' }}>
                  <ArrowBackIos style={{ alignSelf: 'start' }} />
                </div>
              </StyledEditButton>
              <StyledEditButton theme={themevars} style={{
                width: '100%', height: '6vh', display: 'flex',
                alignItems: "stretch",
                alignContent: "flex-start",
                position: 'relative',
                top: '0',
                visibility: 'hidden',

                flexDirection: "column-reverse",
                justifyContent: "center",
                flexWrap: "wrap"
              }}></StyledEditButton>
            </>

            }

            {
              chatData.messages?.length > 0 &&
                privateChatId === selectedChatId && isMessagesPopupOpened ? (
                <StyledCommentsPopup style={{}} theme={themevars}>

                  <CommentsContent style={{ background: 'transparent' }} theme={themevars}>

                    <StyledCommentList style={{ height: "100%" }}>
                      {renderMessages(chatData.messages)}
                    </StyledCommentList>
                  </CommentsContent>
                  <Box
                    style={{
                      width: "100%",
                      maxWidth: "100vw",
                      boxShadow: "unset",
                      position: 'fixed',
                      bottom: '0',
                      left: '0',
                      background: themevars.background,
                      height: "min-content",
                      display: "flex",

                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TextField
                      style={{ background: themevars.background, width: "100%", border: 'unset', }}
                      value={newComment}
                      placeholder="Write a message..."
                      rows={5}
                      onChange={(e) => setNewComment(e.target.value)}

                    />
                    <StyledCommentSubmitButton onClick={() => handleCommentSubmit(selectedChatId)}>
                      <Send style={{ color: themevars.text }} />
                    </StyledCommentSubmitButton>
                  </Box>
                </StyledCommentsPopup>
              ) : (
                <StyledCommentItem theme={themevars} isUser={author == user.name} key={`${privateChatId}-${author}`} style={{ flexDirection: "row", display: "flex", alignItems: "flex-end", justifyContent: 'center' }} onClick={() => handleOpenMessages(privateChatId)}>
                  <StyledEditButton theme={themevars} style={{
                    width: '100%', height: '6vh', display: 'flex',
                    alignItems: "stretch",
                    alignContent: "center",
                    position: 'fixed',
                    top: '0',
                    zIndex: '2000',
                    backdropFilter: 'blur(10px)',
                    background: themevars.buttonBackground + '1A',

                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    flexWrap: "wrap"
                  }} onClick={() => handleOpenMessages(privateChatId)}>

                    <SearchBar>
                      <FaSearch />
                      <SearchInput placeholder="Search Chats..." />
                    </SearchBar>

                  </StyledEditButton>

                  <Paper style={{ background: 'transparent', marginTop: "6vh", marginBottom: "5px", display: "flex", padding: "10px", width: '100%', }}>
                    <StyledFriendAvatar style={{ marginLeft: '15px' }} theme={themevars} src={user.friends[author]?.avatar} alt={author} />
                    <Box style={{ display: "flex", marginLeft: "15px", flexDirection: "column", width: "80vw", justifyContent: 'space-between' }}>
                      <StyledCommentAuthor style={{ background: 'transparent', fontWeight: 'bold' }} theme={themevars}>{author}</StyledCommentAuthor>

                      <StyledCommentText style={{ marginInline: 'unset' }} theme={themevars}>{<p style={{ marginInline: 'unset', fontWeight: '500', color: themevars.accent, margin: '0' }}>{chatData.lastMessage?.author} <text style={{ color: themevars.text }}> {lastMessage}</text></p>}
                      </StyledCommentText>
                    </Box>
                    <StyledCommentText style={{ float: "right", fontSize: 15, color: themevars.text }}>
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
                        86400000
                        && new Date(
                          privateChats[privateChatId].lastMessage.timestamp
                        )
                          .toUTCString()
                          .split(",")[0]

                          .split("T")[0] + " " +

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
                          .split(":")[1]
                      }
                    </StyledCommentText>
                  </Paper>
                </StyledCommentItem>
              )
            }
          </StyledCommentList >
        );
      }),
    [privateChats, isMessagesPopupOpened, newComment, user, selectedChatId]
  );

  return <>{participants}</>;
};

