import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';

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
const PortfolioEditorPage: React.FC<MasterCalendarProps> = ({ profileData, setProfileData }) => {
    const { username } = useParams();

    const [profile, setProfile] = useState(profileData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);
    const [newImage, setNewImage] = useState({ src: '', caption: '' });
    const navigate = useNavigate(); // For navigation

    const openModal = (index: number | null = null) => {
        setEditingIndex(index);
        if (index !== null) {
            setNewImage(profileData.posts[index]);
        } else {
            setNewImage({ src: '', caption: '' });
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
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    // Handle dragging and dropping images
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedImages = [...profileData.posts];
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        [reorderedImages[sourceIndex], reorderedImages[destinationIndex]] = [
            reorderedImages[destinationIndex],
            reorderedImages[sourceIndex],
        ];

        setProfileData({ ...profileData, posts: reorderedImages });
    };

    const handleSavePortfolio = (navigateBack: boolean) => {
        const updatedProfileData = { ...profileData };
        const newPost = {
            id: updatedProfileData.posts.length,
            image: newImage.src,
            likes: 0,
            shares: 0,
            user: { avatar: profileData.profilePicture, name: profileData.username },
            description: newImage.caption,
            comments: [],
        };
        updatedProfileData.posts = [...profileData.posts, newPost];
        setProfileData(updatedProfileData);

        if (navigateBack) {
            navigate('/' + username);
            closeModal();
        }
    };

    // Delete image
    const handleDeleteImage = () => {
        const updatedProfileData = { ...profileData };
        updatedProfileData.posts = profileData.posts.filter((_, index) => index !== imageToDelete);
        setProfileData(updatedProfileData);
        setIsDeleteModalOpen(false); // Close confirmation modal
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
        <EditorContainer>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="image-grid">
                    {(provided) => (
                        <ImageGrid ref={provided.innerRef} {...provided.droppableProps}>
                            {profileData.posts.map((post, index) => (
                                <Draggable key={post.id} draggableId={String(post.id)} index={index}>
                                    {(provided) => (
                                        <ImageBox
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => openModal(index)}
                                        >
                                            <Image src={post.image} alt={`Image ${post.id}`} />
                                            <DeleteButton onClick={() => openDeleteModal(index)}>Delete</DeleteButton>
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
                        <h2>{editingIndex === null ? 'Add New Image' : 'Edit Image'}</h2>
                        {editingIndex !== null && newImage.src && (
                            <>
                                <Image src={newImage.src} alt="Current Image" />
                                <br />
                            </>
                        )}
                        <UploadInput type="file" accept="image/*" onChange={handleFileChange} />
                        <TextInput
                            type="text"
                            placeholder="Enter caption"
                            value={newImage.caption}
                            onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                        />
                        <SaveButton onClick={() => handleSavePortfolio(false)}>Save</SaveButton>
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
                            <SaveButton onClick={handleDeleteImage}>Yes</SaveButton>
                            <CancelButton onClick={closeDeleteModal}>No</CancelButton>
                        </div>
                    </ConfirmModal>
                </>
            )}

            <Footer>
                <h3>Frame</h3>
                <FrameSlider type="range" min="1" max="100" />
                <br />
                <SaveButton onClick={() => handleSavePortfolio(true)}>Save Portfolio</SaveButton>
            </Footer>
        </EditorContainer>
    );
};

export default PortfolioEditorPage;
