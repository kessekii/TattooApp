import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { EditButton } from "./masterPage";

// Styled components
const PortfolioContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  max-width: 935px;
  margin: 0 auto;
  color: black;
`;

const SelectedImagePreview = styled(CardMedia)`
  height: 200px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid #007bff;
`;

const ConfirmButton = styled(Button)`
  background-color: #28a745;
  color: white;
  margin-top: 20px;
  &:hover {
    background-color: #218838;
  }
`;

const Image = styled.img`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageGrid = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const Post = styled.div`
  width: 293px;
  margin-bottom: 28px;
  margin-inline: auto;
  color: black;
  justify-content: center;
  align-items: center;
`;

const PostImage = styled.img`
  width: 40%;
  height: auto;
  align-items: center;
`;

interface PortfolioImagePickerProps {
  userData: any;
  onImageSelect: (image: string) => void; // Callback function to return the selected image
}

const PortfolioImagePicker: React.FC<PortfolioImagePickerProps> = ({ userData,
  onImageSelect,
}) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  // Handle image selection
  const handleImageClick = (image: string, id: number) => {
    setSelectedImage(image);
    setIndex(id);
  };

  // Handle confirm selection
  const handleConfirmClick = () => {
    if (selectedImage) {
      onImageSelect(selectedImage); // Send the selected image to the parent
      setConfirmed(true);
    }
  };

  return (
    <PortfolioContainer>
      <Typography style={{ fontSize: "12px" }}>Select image</Typography>

      {/* Show preview of selected image */}

      {/* Grid of images */}
      {!confirmed && (
        <ImageGrid container spacing={2}>
          {userData.posts &&
            Object.keys(userData.posts).map((post, i) => (
              <PostImage
                src={posts[post].image}
                onClick={() => handleImageClick(posts[post].image, i)}
                alt={`Post ${i}`}
              />
            ))}
        </ImageGrid>
      )}

      {/* Confirm selection button */}
      {selectedImage && (
        <PostImage src={selectedImage} alt={"Selected Image" + index} />
      )}
      <EditButton onClick={handleConfirmClick}>Confirm Selection</EditButton>
    </PortfolioContainer>
  );
};

export default PortfolioImagePicker;
