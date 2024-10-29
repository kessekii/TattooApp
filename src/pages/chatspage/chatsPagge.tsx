import useLocalStorage from "../../../src/hooks/useLocalStorage";
import {
  getChatsByUserId,
  getPrivateChatsByUserId,
} from "../../../src/hooks/useChat";
import { Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  CommentAuthor,
  CommentInput,
  CommentItem,
  CommentList,
  CommentsContent,
  CommentsPopup,
  CommentSubmitButton,
  CommentText,
} from "../masterspage/profileVIewPageComponents";
import {
  EditButton,
  FriendAvatar,
  FriendAvatarBig,
} from "../masterspage/masterPage";
import { useTheme } from "../../state/providers/themeProvider";
import { updateChatStraight } from "../../../src/state/action-creators";
import { Box, Paper, TextField } from "@mui/material";
export const ChatsPageComponent: React.FC = () => {
  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }
  const [user, setUser] = useLocalStorage("user", null);
  const [loader, setloader] = useState(false);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [newComment, setNewComment] = useState("");
  const [isMessagesPopupOpened, setIsMessagesPopupOpened] = useState(false);
  const [selectedChatId, setselectedChatId] = useState<any>({});
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

  const participants = useMemo(
    () =>
      Object.keys(privateChats || {}).map((privateChatId) => {
        const author = privateChats[privateChatId].participants.filter(
          (e) => e !== user.username
        );
        const antiauthor = privateChats[privateChatId].participants.filter(
          (e) => e === user.username
        );
        const lastMessage = privateChats[privateChatId].lastMessage.text;

        return (
          <CommentList
            style={{
              height: "10vh",
              width: "100%",
              borderRadius: "0px",
              maxHeight: "800px",
            }}
          >
            {privateChats[privateChatId].messages &&
            privateChats[privateChatId].messages.length > 0 &&
            isMessagesPopupOpened ? (
              <>
                <CommentsPopup>
                  <CommentsContent theme={themevars.popup}>
                    <EditButton
                      theme={themevars.popup}
                      onClick={() => handleOpenMessages(privateChatId)}
                    >
                      X
                    </EditButton>

                    <CommentList
                      style={{
                        borderRadius: "0px",
                        maxHeight: "800px",
                        height: "63vh",
                      }}
                    >
                      {privateChats[selectedChatId].messages.map(
                        (message: any, i: number) => {
                          console.log(message.author, user.friends);
                          let avatar = "";
                          if (message.author === user.username) {
                            avatar = user.profilePicture;
                          }
                          return (
                            <CommentItem
                              key={i + message.author}
                              style={{
                                width: "100%",
                                // display: "contents",
                                flexDirection:
                                  message.author === user.username
                                    ? "row-reverse"
                                    : "row",
                              }}
                            >
                              <Box
                                style={{
                                  height: "50px",
                                  width: "fit-content",

                                  float:
                                    message.author === user.username
                                      ? "right"
                                      : "left",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  display: "flex",
                                  borderRadius: "15px",
                                  backgroundColor:
                                    i % 2 === 0
                                      ? "rgb(242,242,242)"
                                      : "#eeeeee",
                                  flexDirection:
                                    message.author === user.username
                                      ? "row-reverse"
                                      : "row",
                                  // padding: "10px",
                                }}
                              >
                                <CommentText
                                  style={{
                                    fontSize: 15,
                                  }}
                                >
                                  {new Date().getTime() - message.timestamp >
                                  604800000
                                    ? new Date(message.timestamp)
                                        .toUTCString()
                                        .split(", ")[1]
                                        .split(" ", 2)
                                        .map((e) => e + " ")
                                    : new Date().getTime() - message.timestamp >
                                        86400000
                                      ? new Date(message.timestamp)
                                          .toUTCString()
                                          .split(",")[0]
                                      : // .split("T")[0] +

                                        new Date(message.timestamp)
                                          .toISOString()
                                          .split("T")[1]
                                          .split(":")[0] +
                                        ":" +
                                        new Date(message.timestamp)
                                          .toISOString()
                                          .split("T")[1]
                                          .split(":")[1]}
                                </CommentText>

                                <FriendAvatar
                                  theme={themevars}
                                  key={i}
                                  src={
                                    avatar !== ""
                                      ? avatar
                                      : user.friends[author].avatar
                                  }
                                  alt={message.author}
                                />
                                <CommentText style={{}}>
                                  {message.text}
                                </CommentText>
                              </Box>
                            </CommentItem>
                          );
                        }
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
                      onClick={async () =>
                        await handleCommentSubmit(selectedChatId)
                      }
                    >
                      Submit Comment
                    </CommentSubmitButton>
                  </Paper>
                </CommentsPopup>
              </>
            ) : privateChats[privateChatId].messages &&
              privateChats[privateChatId].messages.length > 0 &&
              !isMessagesPopupOpened ? (
              <CommentItem
                key={0 + author}
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",

                  display: "flex",
                  alignItems: "flex-end",
                }}
                onClick={() => handleOpenMessages(privateChatId)}
              >
                <Paper
                  style={{
                    // marginRight: "20%",

                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    display: "flex",
                    padding: "10px",
                  }}
                  onClick={() => handleOpenMessages(privateChatId)}
                >
                  <FriendAvatarBig
                    theme={themevars}
                    key={0 + "sdsdsss"}
                    src={user.friends[author].avatar}
                    alt={author}
                  />
                  <Box
                    style={{
                      flexDirection: "column",
                      display: "flex",
                      width: "50vw",
                      // background: "green",
                    }}
                  >
                    <CommentAuthor style={{ float: "left" }}>
                      {author}
                    </CommentAuthor>
                    <CommentText style={{ float: "left" }}>
                      {privateChats[privateChatId].lastMessage.text}
                    </CommentText>
                  </Box>
                  <CommentText style={{ float: "right", fontSize: 15 }}>
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
                        ? new Date(
                            privateChats[privateChatId].lastMessage.timestamp
                          )
                            .toUTCString()
                            .split(",")[0]
                        : // .split("T")[0] +

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
                  </CommentText>
                </Paper>
              </CommentItem>
            ) : (
              <CommentItem onClick={() => handleOpenMessages(privateChatId)}>
                <CommentAuthor>{author}</CommentAuthor>
              </CommentItem>
            )}
          </CommentList>
          // <CommentInput
          //   type="text"
          //   placeholder="Write a comment..."
          //   value={newComment}
          //   onChange={handleNewCommentChange}
          // />
        );
      }),
    [
      chats,
      privateChats,
      isMessagesPopupOpened,
      newComment,
      user,
      selectedChatId,
    ]
  );

  //   const chatsComponents = (async () => await handleLoadCHats(), [chats]);
  //   chatsComponents;
  return <>{participants}</>;
};
