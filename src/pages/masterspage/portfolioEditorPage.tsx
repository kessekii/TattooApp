import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useActions } from "../../hooks/useActions";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "../../state/providers/themeProvider";
import { PopupContent, PopupOverlay } from "./masterPage";
import {
  createChatByUsername,
  getProfileData,
} from "../../state/action-creators";
import {
  getChatsByUserId,
  getImageByImageId,
  getImageIdsByUserId,
  getPostsByUserId,
} from "../../../src/hooks/useChat";
import { s } from "vite/dist/node/types.d-aGj9QkWt";
import Resizer from "react-image-file-resizer";
import { ArrowBackIos } from "@mui/icons-material";
import useSlice from "../../hooks/useSlice";
import { useMutation, useQuery } from "@apollo/client";
import { OPEN_POST_AND_CHAT, USER_QUERY } from "../../../src/graphQL/queries";
// Styled components
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  max-width: 935px;
  margin: 0 auto;
  color: ${({ theme }) => theme.text};
`;
const StyledEditButton = styled.button`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  width: 5vw;
  height: 5vw;
`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const ImageBox = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: ${({ theme }) => theme.border};
  cursor: pointer;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AddButton = styled.div`
  width: 30vw;
  padding-bottom: 100%;
  background-color: ${({ theme }) => theme.buttonBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  border: 2px dashed ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.background};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const UploadInput = styled.input`
  margin: 20px 0;
  width: 40vw;
`;

const TextInput = styled.input`
  width: 80vw;
  padding: 10px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const CancelButton = styled.button`
  background-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.buttonText};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Footer = styled.div`
  position: fixed;
  bottom: 60px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const FrameSlider = styled.input`
  width: 100px;
`;

const DeleteButton = styled.button`
  background-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.buttonText};
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 12px;
`;

const ConfirmModal = styled(Modal)`
  width: 300px;
  text-align: center;
`;

interface PortfolioEditorPageProps {
  profileData: any;
  setProfileData: any;
}

// Component
const PortfolioEditorPage: React.FC = () => {
  const { data: user, setUser } = useSlice("user");
  const { data: friend, setFriend, getFriendData } = useSlice("friend");
  const { images, avatars, setAvatars, setImages } = useSlice("images");
  const userGraphQLHook = useQuery(USER_QUERY, {
    variables: { username: user.username },
  });
  const CreateChatAndPostGQLHook = useMutation(OPEN_POST_AND_CHAT, {
    variables: { username: user.username, post: {} },
  });
  const { data: posts, setPosts } = useSlice("posts");
  const {
    privateChats,
    publicChats,
    setPrivateChats,
    setPostChats,
    createChatsAction,
  } = useSlice("chats");
  const { data: friendPosts, setFriendPosts } = useSlice("friendPosts");
  const { updateUser } = useActions();
  const { themevars } = useTheme(); // Accessing the theme
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const navigate = useNavigate(); // For navigation

  const openModal = (index: number | null = null) => {
    setEditingIndex(index);
    if (index !== null) {
      setNewImage(posts[index]);
    } else {
      setNewImage({ src: "", caption: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          async (uri) => {
            if (typeof uri === "string") {
              setNewImage({ src: uri, caption: "" });
            }
          },
          "base64",
          200,
          200
        );

        setIsNewImage(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Handle dragging and dropping images
  const handleDragEnd = (result: any) => {
    // if (!result.destination) return;
    // const reorderedImages = posts;
    // const sourceIndex = result.source.index;
    // const destinationIndex = result.destination.index;
    // [reorderedImages[sourceIndex], reorderedImages[destinationIndex]] = [
    //   reorderedImages[destinationIndex],
    //   reorderedImages[sourceIndex],
    // ];
    // updateUser({ ...user, posts: reorderedImages }, setErrorMessage);
    // setUser({ ...user, posts: reorderedImages });
    // setProfile({ ...user, posts: reorderedImages });
  };

  const handleSavePortfolio = async (navigateBack: boolean) => {
    const updatedProfileData = { ...user };
    const newUuid = uuidv4();
    if (isNewImage) {
      const newPost = {
        postId: newUuid,
        image: newImage.src,
        likes: 0,
        shares: 0,

        description: newImage.caption,

        chatId: "",
        location: user.location,
        timestamp: new Date().toISOString(),
        title: newImage.caption,
      };
      updatedProfileData.posts =
        user.posts.length > 0
          ? [...user.posts, newPost] // Add new post to existing posts
          : [newPost];

      // const newUser = await createChatsAction(
      //   updatedProfileData,
      //   setErrorMessage,
      //   newPost
      // );
      const mutationData = (
        await CreateChatAndPostGQLHook[0]({
          variables: { username: user.username, post: newPost },
        })
      ).data.openPostAndChat;
      const userRefetchData = (
        await userGraphQLHook.refetch({
          username: user.username,
        })
      ).data.getProfileData;
      navigate("/" + user.username);
    }
    const userData = await getProfileData(updatedProfileData.username);

    // updateUser(updatedProfileData, setErrorMessage);
    const postsData = await getPostsByUserId(updatedProfileData.username);
    const chatsData = await getChatsByUserId(updatedProfileData.username);
    const imageData = await getImageIdsByUserId(updatedProfileData.username);
    let newImages = [];
    for (let imageId of imageData.payload) {
      const image = await getImageByImageId(imageId);
      newImages = [...newImages, image];
    }
    setIsNewImage(false);

    setUser(userData.payload);
    setFriend(userData.payload);

    //setPosts(postsData.payload);
    setFriendPosts(postsData.payload);

    setPrivateChats(chatsData.payload);
    setPostChats(chatsData.payload);
    setImages(newImages);

    navigate("/" + user.username);
    closeModal();
  };

  // Delete image
  const handleDeleteImage = () => {
    const updatedProfileData = { ...user };
    // updatedProfileData.posts = Object.keys(posts).filter(
    //   (el, index) => index !== imageToDelete
    // );

    updateUser(updatedProfileData, setErrorMessage);
    setIsDeleteModalOpen(false); // Close confirmation modal
    setUser(updatedProfileData);
  };

  // Open delete confirmation modal
  const openDeleteModal = (index: number) => {
    setImageToDelete(index);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <ThemeProvider theme={themevars}>
      <EditorContainer>
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
          onClick={() => navigate("/" + user.username)}
        >
          <div style={{ marginLeft: "15px" }}>
            <ArrowBackIos style={{ alignSelf: "start" }} />
          </div>
        </StyledEditButton>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="image-grid">
            {(provided) => (
              <ImageGrid
                style={{ marginTop: "6vh" }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {posts &&
                  posts.length > 0 &&
                  posts.map((post: any, index) => (
                    <Draggable
                      key={post.id}
                      draggableId={String(post.id)}
                      index={index}
                    >
                      {(provided) => (
                        <ImageBox
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Image
                            src={images[post.image].src}
                            alt={`Image ${post.id}`}
                            onClick={() => openModal(index)}
                          />
                          <DeleteButton onClick={() => openDeleteModal(index)}>
                            Delete
                          </DeleteButton>
                        </ImageBox>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
                <AddButton onClick={() => openModal(null)}>+</AddButton>
              </ImageGrid>
            )}
          </Droppable>
        </DragDropContext>

        {isModalOpen && (
          <>
            <PopupOverlay>
              <PopupContent theme={themevars.popup}>
                <h2>
                  {editingIndex === null ? "Add New Image" : "Edit Image"}
                </h2>
                {editingIndex !== null && newImage.src && (
                  <>
                    <Image src={newImage.src} alt="Current Image" />
                    <br />
                  </>
                )}
                <UploadInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <TextInput
                  type="text"
                  placeholder="Enter caption"
                  value={newImage.caption}
                  onChange={(e) =>
                    setNewImage({ ...newImage, caption: e.target.value })
                  }
                />
                <SaveButton
                  onClick={async () => await handleSavePortfolio(false)}
                >
                  Save
                </SaveButton>
                <CancelButton onClick={closeModal}>Cancel</CancelButton>
              </PopupContent>
            </PopupOverlay>
          </>
        )}

        {isDeleteModalOpen && (
          <>
            <ModalOverlay onClick={closeDeleteModal} />
            <ConfirmModal>
              <h2>Are you sure you want to delete this image?</h2>
              <div>
                <SaveButton onClick={() => handleDeleteImage()}>Yes</SaveButton>
                <CancelButton onClick={closeDeleteModal}>No</CancelButton>
              </div>
            </ConfirmModal>
          </>
        )}

        <Footer>
          <h3>Frame</h3>
          <FrameSlider type="range" min="1" max="100" />
          <br />
          <SaveButton onClick={() => handleSavePortfolio(true)}>
            Save Portfolio
          </SaveButton>
        </Footer>
      </EditorContainer>
    </ThemeProvider>
  );
};

export default PortfolioEditorPage;
