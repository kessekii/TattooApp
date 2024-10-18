import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "../../../src/hooks/useLocalStorage";
import { useActions } from "../../../src/hooks/useActions";
import { v4 as uuidv4 } from "uuid";
import { getProfileData } from "../../../src/state/action-creators";
import { getChatByChatId } from "../../../src/hooks/useChat";
// Styled components
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: white;
  max-width: 935px;
  margin: 0 auto;
  color: black;
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
  background-color: #ddd;
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
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  border: 2px dashed #007bff;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
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
`;

const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  color: black;
`;

const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const CancelButton = styled.button`
  background-color: #dc3545;
  color: white;
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
  background-color: #eee;
  text-align: center;
`;

const FrameSlider = styled.input`
  width: 100px;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
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

// Component
const PortfolioEditorPage = ({ setProfileData }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const { updateUser, createChatByUsername } = useActions();
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const navigate = useNavigate(); // For navigation

  const openModal = (index: string | null = null) => {
    setEditingIndex(index);
    if (index !== null) {
      setNewImage(user.posts[index]);
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
        setNewImage({ ...newImage, src: reader.result as string });
        setIsNewImage(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Handle dragging and dropping images
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedImages = { ...user.posts };
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    [reorderedImages[sourceIndex], reorderedImages[destinationIndex]] = [
      reorderedImages[destinationIndex],
      reorderedImages[sourceIndex],
    ];

    setProfileData({ ...user, posts: reorderedImages });
    updateUser({ ...user, posts: reorderedImages }, setErrorMessage);
    setUser({ ...user, posts: reorderedImages });
    setProfile({ ...user, posts: reorderedImages });
  };

  const handleSavePortfolio = async (navigateBack: boolean) => {
    const updatedProfileData = { ...user };
    const newUuid = uuidv4();
    if (isNewImage) {
      const newPost = {
        id: newUuid,
        image: newImage.src,
        likes: 0,
        shares: 0,
        user: { avatar: user.profilePicture, name: user.username },
        description: newImage.caption,
        chatId: "",
      };
      console.log(user, newPost);
      updatedProfileData.posts = Object.assign({
        ...user.posts,
        [newUuid]: newPost,
      });
      createChatByUsername(
        updatedProfileData,

        setErrorMessage,
        newUuid
      );
    }
    const GetChatsObject = async () => {
      let chatsObject: any = {};
      for (let chatId of Object.keys(user.chats)) {
        const chatData = await getChatByChatId(chatId, user.username);
        chatsObject[chatId] = chatData.payload;
      }
      return chatsObject;
    };
    let chatsObject = await GetChatsObject();

    setChats(chatsObject);
    // updateUser(updatedProfileData, setErrorMessage);
    const userDataUpdated = (await getProfileData(user.username)).payload;
    setProfileData(userDataUpdated);

    setUser(userDataUpdated);

    setIsNewImage(false);
    setProfile(updatedProfileData);
    if (navigateBack) {
      navigate("/" + user.username);
      closeModal();
    }
  };

  // Delete image
  const handleDeleteImage = () => {
    const updatedProfileData = { ...user };

    delete updatedProfileData.posts[imageToDelete];

    console.log(updatedProfileData);
    setProfileData(updatedProfileData);
    updateUser(updatedProfileData, setErrorMessage);
    setIsDeleteModalOpen(false); // Close confirmation modal
    setUser(updatedProfileData);
    setProfile(updatedProfileData);
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setImageToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <EditorContainer>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-grid">
          {(provided) => (
            <ImageGrid ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(user.posts).map((postId, index) => (
                <Draggable
                  key={postId}
                  draggableId={String(postId)}
                  index={index}
                >
                  {(provided) => (
                    <ImageBox
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Image
                        src={user.posts[postId].image}
                        alt={`Image ${postId}`}
                        onClick={() => openModal(postId)}
                      />
                      <DeleteButton onClick={() => openDeleteModal(postId)}>
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
          <ModalOverlay onClick={closeModal} />
          <Modal>
            <h2>{editingIndex === null ? "Add New Image" : "Edit Image"}</h2>
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
            <SaveButton onClick={() => handleSavePortfolio(false)}>
              Save
            </SaveButton>
            <CancelButton onClick={closeModal}>Cancel</CancelButton>
          </Modal>
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
  );
};

export default PortfolioEditorPage;
