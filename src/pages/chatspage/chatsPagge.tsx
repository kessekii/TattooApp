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
import { EditButton } from "../masterspage/masterPage";
import { useTheme } from "../../state/providers/themeProvider";
import { updateChatStraight } from "../../../src/state/action-creators";
import { TextField } from "@mui/material";
export const ChatsPageComponent: React.FC = () => {
  const [user, setUser] = useLocalStorage("user", null);
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
  };
  const handleOpenMessages = async (privateChatId: string) => {
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
  useEffect(() => {
    handleLoadCHats();
  }, []);

  const participants = useMemo(
    () =>
      Object.keys(privateChats).map((privateChatId) => {
        console.log(
          privateChats[privateChatId].messages,
          user.username,
          privateChatId
        );
        const author = privateChats[privateChatId].participants.filter(
          (e) => e !== user.username
        );
        const lastMessage = privateChats[privateChatId].lastMessage.text;

        return (
          <CommentList>
            {privateChats[privateChatId].messages &&
            privateChats[privateChatId].messages.length > 0 &&
            isMessagesPopupOpened ? (
              <CommentsPopup>
                <CommentsContent theme={themevars.popup}>
                  <EditButton
                    theme={themevars.popup}
                    onClick={async () =>
                      await handleOpenMessages(privateChatId)
                    }
                  >
                    X
                  </EditButton>
                  <h2 style={{ color: themevars.text }}>Comments</h2>

                  <CommentList>
                    {privateChats[privateChatId].messages.map((e, i) => (
                      <CommentItem key={i + e?.author}>
                        <CommentAuthor>{e?.author}</CommentAuthor>
                        <CommentText>{e?.text}</CommentText>
                      </CommentItem>
                    ))}
                  </CommentList>
                  <TextField
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></TextField>
                  <CommentSubmitButton
                    onClick={async () =>
                      await handleCommentSubmit(privateChatId)
                    }
                  >
                    Submit Comment
                  </CommentSubmitButton>
                </CommentsContent>
              </CommentsPopup>
            ) : privateChats[privateChatId].messages &&
              privateChats[privateChatId].messages.length > 0 &&
              !isMessagesPopupOpened ? (
              <CommentItem
                onClick={async () => await handleOpenMessages(privateChatId)}
              >
                <CommentAuthor>{author}</CommentAuthor>
                <CommentText>{lastMessage}</CommentText>
              </CommentItem>
            ) : (
              <CommentItem
                onClick={async () => await handleOpenMessages(privateChatId)}
              >
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
    [chats, privateChats, isMessagesPopupOpened, newComment, user]
  );

  //   const chatsComponents = (async () => await handleLoadCHats(), [chats]);
  //   chatsComponents;
  return <>{participants}</>;
};
