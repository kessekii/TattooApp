import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import { useActionData, useNavigate, useParams } from "react-router-dom";
import CalendarComponent from "./calendarComponent";
import PortfolioImagePicker from "./portfolioImagePicker";
import DateHourSelector from "./masterCalendarComponent";
import { preview } from "vite";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { set } from "date-fns";
import { loginAction } from "src/state/action-creators";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import useLocalStorage from "../../hooks/useLocalStorage";
import {
  getChatByChatId,
  getChatsByUserId,
  getPostsByUserId,
  getUserById,
} from "../../../src/hooks/useChat";
import { useTheme } from "../../state/providers/themeProvider";
import {
  CalendarMonth,
  PinDrop,
  Reviews,
  Link,
  Add,
} from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";
import { useEditing } from "../../hooks/useEditing";
import AngledBackgroundComponent from "../masterspage/backgroundComponent";
import Backdrop from "../masterspage/backgroundComponent";

// ProfilePage styling with dynamic background and text color
export const ProfilePage = styled.div<{ theme }>`
  font-family: Arial, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  width: 98%;

  color: ${(props) => props.theme.text};
  background: transparent;
`;

// ProfileHeader styling
export const ProfileHeader = styled.div<{ theme }>`
  margin-top: 30px;

  min-width: 100%;
  color: ${(props) => props.theme.text};
`;

// Profile Picture with dynamic border and background
export const ProfilePicture = styled.img<{ theme }>`
  width: 90px;
  margin-left: 4%;
  height: 90px;
  border-radius: 50%;
  left: 15px;
  background-color: ${(props) => props.theme.background};
`;

// Profile Info with centered text and colors
export const ProfileInfo = styled.div<{ theme }>`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
`;
export const ProfileDescription = styled.div<{ theme }>`
  padding: 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
`;

// Edit Input with dynamic border and background
export const EditInput = styled.input<{ theme }>`
  border: 1px solid ${(props) => props.theme.border};
  margin-top: 5px;
  border-radius: 5px;

  max-width: 100%;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

// EditButton for all buttons with dynamic background and text colors
export const EditButton = styled.button<{ theme }>`
  background-color: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.text};

  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  height: 30px;
  max-height: 30px;
  &:hover {
    background-color: ${(props) => props.theme.buttonText};
    color: ${(props) => props.theme.buttonBackground};
  }
`;

export const IcoButton = styled.button<{ theme }>`
  background-color: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.text};
  padding: 2px 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  height: 30px;
  max-height: 30px;
  margin-inline: 5px;
  &:hover {
    background-color: ${(props) => props.theme.buttonBackground};
    color: ${(props) => props.theme.text};
  }
`;

// SaveButton inheriting from EditButton with specific background
export const SaveButton = styled(EditButton)<{ theme }>`
  background-color: #28a745;
  color: white;
`;

// CancelButton inheriting from EditButton with specific background
export const CancelButton = styled(EditButton)<{ theme }>`
  background-color: #dc3545;
  color: white;
`;

// FollowButton with dynamic background based on the "following" prop
export const FollowButton = styled(EditButton)<{ following }>`
  background-color: ${(props) =>
    props.following ? "#dc3545" : props.theme.buttonBackground};
`;

// ProfilePosts for flex-wrapping posts
export const ProfilePosts = styled.div`
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
  display: "contents";
  object-fit: "contain";
  justify-content: space-between;
`;

// Single Post card with a dynamic background and color
export const Post = styled.div<{ theme }>`
  width: 40vw;
  margin-bottom: 28px;
  color: ${(props) => props.theme.text};
`;

// Post Image styling
export const PostImage = styled.img<{ theme }>`
  width: 100%;
  height: auto;
`;

// CloseButton with fixed positioning and dynamic color
export const CloseButton = styled.button<{ theme }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${(props) => props.theme.text};
`;

// Popup overlay with transparency and centered layout
export const PopupOverlay = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Popup content with dynamic background and text color
export const PopupContent = styled.div<{ theme }>`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

// Map Button for triggering the map view
export const MapButton = styled(EditButton)`
  background-color: ${(props) => props.theme.buttonBackground};
`;

// Calendar Button for triggering the calendar
export const CalendarButton = styled(EditButton)`
  background-color: #d8a745;
`;

// Links Button with dynamic styling for social media links
export const LinksButton = styled(EditButton)`
  background-color: #ff4500;
`;

// Social Media Links List with dynamic styling
export const SocialMediaLinks = styled.div<{ theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50vw;
  min-height: 50vh;
  color: ${(props) => props.theme.text};
`;

// Single social media link with hover effect
export const SocialMediaLink = styled.a`
  margin: 10px 0;
  color: #007bff;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// Friends section containing avatars of friends
export const FriendsSection = styled.div`
  display: grid;
  gap: 10px;
  align-items: bottom;
  padding-inline: 5px;

  justify-content: space-between;
  grid-template-columns: repeat(2, 1fr);
`;

// Friends avatar styling
export const FriendsAvatars = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 10px;
  align-items: center;
`;
export const FriendsAvatarsBackdrop = styled.div`
  justify-content: start;
  margin-top: 10px;
  width: fit-content;
  height: fit-content;
  border-radius: 25px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};

  align-items: center;
`;

// Individual friend avatar with circular borders
export const FriendAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 7px;
  padding: 5px;
  cursor: pointer;
`;

// Popup for showing the friends list
export const FriendsPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Friends list content with centered layout
export const FriendsContent = styled.div<{ theme }>`
  background: ${(props) => props.theme.background};
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  position: relative;
`;

// List of friends with no default list styling
export const FriendsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Single friend item layout with dynamic color
export const FriendItem = styled.li<{ theme }>`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: ${(props) => props.theme.text};
`;

// Friend photo thumbnail in the friend list
export const FriendPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

// Friend nickname display next to avatar
export const FriendNickname = styled.div<{ theme }>`
  flex-grow: 1;
  color: ${(props) => props.theme.text};
`;

// ReviewPopup container styling
export const ReviewPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Content section within the ReviewPopup
export const ReviewContent = styled.div<{ theme }>`
  background: ${(props) => props.theme.background};
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  position: relative;
  color: ${(props) => props.theme.text};
`;

// Review List styling
export const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Review item with dynamic styling
export const ReviewItem = styled.li<{ theme }>`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  padding-bottom: 10px;
  color: ${(props) => props.theme.text};
`;

// Individual review photo
export const ReviewPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

// Review text content styling
export const ReviewText = styled.div<{ theme }>`
  flex-grow: 1;
  color: ${(props) => props.theme.text};
`;

// Review score mark styling
export const ReviewMark = styled.div<{ theme }>`
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

// Add Review Button styling
export const AddReviewButton = styled.button<{ theme }>`
  background-color: #28a745;
  color: ${(props) => props.theme.buttonText};
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

// New Review Form styling with column layout
export const NewReviewForm = styled.div<{ theme }>`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

// Text area for review input with dynamic background and color
export const ReviewInput = styled.textarea<{ theme }>`
  border: 1px solid ${(props) => props.theme.border};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  height: 100px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

// Review dropdown select for rating
export const ReviewSelect = styled.select<{ theme }>`
  border: 1px solid ${(props) => props.theme.border};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

// Review submit button with dynamic colors
export const ReviewSubmitButton = styled.button<{ theme }>`
  background-color: #007bff;
  color: ${(props) => props.theme.buttonText};
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

// Image grid layout for portfolio photos
export const ImageGrid = styled.div<{ theme }>`
  display: grid;
  gap: 9px;
  grid-template-columns: repeat(2, 1fr);
`;

const NewsCard = styled.div`
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 10px;

  align-items: stretch;
  justify-content: space-between;
  align-content: stretch;

  display: flex;
  flex-direction: column;
  max-width: 48vw;

  padding-top: 3px;
`;

// Info grid layout for two-column display
export const InfoGrid = styled.div<{ theme }>`
  display: grid;
  grid-template-columns: repeat(2 ,1fr);
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  justify-items; start;
`;

export const ProfileGrid = styled.div<{ theme }>`
  display: grid;
  grid-template-columns: 50% 50%;

  margin-right: 5px;
  
  justify-content: center;
  align-items: center;
  justify-items; start;
`;

export const GridCell = styled.div<{ theme }>`
  display: grid;
  flex-direction: row;
  padding: 5px;

  justify-content: start;
  margin-left: -17vw;
  align-items: center;
`;

export const GridTwo = styled.div<{ theme }>`
  display: grid;
  flex-direction: row;

  background: ${(props) => props.theme.background};
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
`;

// Upload Input for uploading files
export const UploadInput = styled.input<{ theme }>`
  margin: 20px 0;
  max-width: fit-content;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.buttonBackground};
`;

export const IcButton = styled(IconButton)<{ theme }>`
  
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.backgroundButton} !important;
  display: flex;
  border: 1px solid #000000,
  align-items: center;
  justify-content: center;
  padding: 5px;
  background: ${(props) => props.theme.background};
  border-radius: 50%;
  .MuiButtonBase-root {
    background: ${(props) => props.theme.background};
  }
`;

export const Typefield = styled(Typography)<{ theme; bold? }>`
  font-weight: ${(props) => (props.bold ? "700" : "500")};
  color: ${(props) => props.theme.text};
`;

// Sample user data and login state

// Simulating that the user is logged in on this device

const ProfilePageComponent: React.FC<any> = ({ theme }) => {
  const { toggleTheme, themevars } = useTheme();
  const [user, setUser] = useLocalStorage("user", null);
  const [friend, setFriend] = useLocalStorage("friend", null);
  const [posts, setPosts] = useLocalStorage("posts", null);
  const [chats, setChats] = useLocalStorage("chats", null);
  const [friendPosts, setFriendPosts] = useLocalStorage("friendPosts", null);
  const [friendChats, setFriendChats] = useLocalStorage("friendChats", null);
  const [openedUser, setOpenedUser] = useLocalStorage("openedUser", null);

  const loggedInUser = user.username === friend.username;
  const { username, postId } = useParams();
  const { isEditing, setIsEditingProfile } = useEditing();

  const [editProfile, setEditProfile] = useState(
    user
      ? {
          name: user.name,
          username: user.username,
          description: user.description,
          profilePicture: user.profilePicture,
          location: user.location,
        }
      : {
          name: "",
          username: "",
          description: "",
          profilePicture: "",
          location: "",
        }
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(
    user && user.friends && Object.keys(user.friends).length > 0
      ? user.friends[username]
      : false
  );
  const [friendFollowing, setFriendFollowing] = useState(
    user && user.friends && Object.keys(user.friends).length > 0
      ? user.friends[username]
      : false
  );

  const { updateUser } = useActions();
  const [showReviews, setShowReviews] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showLinksPopup, setShowLinksPopup] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showCalendarPopup, setCalendarPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [calendarUpdated, setCalendarUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const [isSettingsPopup, setSettingsPopup] = useState(false);
  const portfolioImages = [
    "https://via.placeholder.com/150/0000FF", // Replace these placeholders with actual portfolio images
    "https://via.placeholder.com/150/FF0000",
    "https://via.placeholder.com/150/00FF00",
    "https://via.placeholder.com/150/FFFF00",
    "https://via.placeholder.com/150/00FFFF",
    "https://via.placeholder.com/150/FF00FF",
  ];

  const [showAddReview, setShowAddReview] = useState(false); // To handle new review form
  const [newReview, setNewReview] = useState({ text: "", mark: 5 }); // New review state

  const handleAddReviewClick = () => {
    setShowAddReview(true);
  };

  const handleNewReviewChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleReviewSubmit = () => {
    const updatedReviews =
      user.reviews && user.reviews.length > 0
        ? [
            ...user.reviews,
            { photo: user.image, nickname: user.username, ...newReview },
          ]
        : [{ photo: user.image, nickname: user.username, ...newReview }];
    // setProfileData({
    //   ...user,
    //   reviews: updatedReviews,
    // });

    updateUser(
      {
        ...user,
        reviews: updatedReviews,
      },
      setErrorMessage
    );
    setUser({
      ...user,
      reviews: updatedReviews,
    });
    setNewReview({ text: "", mark: 5 }); // Reset form
    setShowAddReview(false); // Close form
  };

  const navigate = useNavigate();
  // Toggle edit mode
  const handleEditClick = async () => {
    await setIsEditingProfile();
  };

  // Save changes
  const handleSaveClick = async (updateUser: any, setErrorMessage: any) => {
    const newProfileData = {
      ...user,
      name: editProfile.name,
      //   username: username,
      description: editProfile.description,
      profilePicture: newImage.src !== "" ? newImage.src : user.profilePicture,
      location: editProfile.location,
    };
    // setProfileData(newProfileData);
    await updateUser(newProfileData, setErrorMessage);
    await setIsEditingProfile();
    setUser(newProfileData);

    setChats(newProfileData.chats);
  };

  // Cancel editing
  const handleCancelClick = async () => {
    setEditProfile({
      name: user.name,
      username: username,
      description: user.description,
      profilePicture: user.profilePicture,
      location: user.location,
    });
    await setIsEditingProfile();
  };

  // Handle input changes for editable fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value,
    });
  };

  const friendsFilter = (friend: any) => {
    console.log(friend.username, username);
    return friend.username === username;
  };

  // Toggle follow button for friends
  const handleFriendFollowClick = (
    index: number,
    friend: any,
    isFollowing: boolean
  ) => {
    const updatedFollowing = [...friendFollowing];
    updatedFollowing[index] = !updatedFollowing[index];
    setFriendFollowing(updatedFollowing);

    console.log("Friend Following:", friend, friendFollowing);

    const newFriend = {
      avatar: friend.profilePicture,
      nickname: friend.name,
      username: friend.username,
    };

    console.log("New Post:", friend, user.friends, username, friend.username);
    const updatedProfileData = { ...user };

    if (updatedProfileData.friends[user.username]) {
      delete updatedProfileData.friends[user.username];
    }

    if (!isFollowing) {
      updatedProfileData.friends[username] = newFriend;
    }

    // setProfileData(updatedProfileData);
    updateUser(updatedProfileData, setErrorMessage);
    setUser(updatedProfileData);
  };
  const postsComponents = useMemo(
    () =>
      user && posts && Object.keys(posts).length > 0 ? (
        Object.keys(posts).map((post) => (
          <Grid
            item
            style={{
              justifyItems: "center",
              alignContent: "space-between",
              justifyContent: "flex-end",
              flexWrap: "nowrap",
              display: "flex",
              objectFit: "contain",
            }}
            xs={6}
          >
            <Post key={post}>
              <PostImage
                src={posts[post].image}
                onClick={() => {
                  navigate("../" + username + "/portfolio");
                }}
                alt={`Post ${post}`}
                style={{ width: "30vw", height: "30vw", objectFit: "contain" }}
              />
            </Post>
          </Grid>
        ))
      ) : (
        <></>
      ),
    [user, posts]
  );
  const handleMapClick = () => {
    window.location.href = "/map";
  };

  const handleLinksClick = () => {
    setShowLinksPopup(true);
  };

  const handleCloseLinksPopup = () => {
    setShowLinksPopup(false);
  };

  const handleFriendClick = async (profileLink: string) => {
    const firned = (await getUserById(profileLink)).payload;
    setFriend(firned);
    setFriendPosts((await getPostsByUserId(profileLink)).payload);
    setFriendChats((await getChatsByUserId(profileLink)).payload);
    window.location.href = profileLink;
  };

  const handleLocationEditClick = () => {
    setShowLocationPopup(true);
  };

  const handleLocationSaveClick = () => {
    const newUserData = {
      ...user,
      location: editProfile.location,
    };
    // setProfileData(newUserData);
    updateUser(newUserData, setErrorMessage);
    setUser(newUserData);
    setShowLocationPopup(false);
  };

  const handleLocationCancelClick = () => {
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      location: user.location,
    }));
    setShowLocationPopup(false);
  };

  const handleAddPhotoClick = () => {
    navigate("/" + username + "/portfolioeditor"); // Assuming /portfolio-editor is the route to the editor page
  };

  const handleCalendarClick = () => {
    setCalendarPopup(!showCalendarPopup);
  };

  const handleImageSelect = (image: string) => {
    setSelectedImage(image); // Save the selected image
    // console.log("Selected Image:", image);
  };

  const setClientDate = (date: any) => {
    let index = -1;

    // Check if the date already exists in the calendar
    const filteredDates = user.calendar.filter((d, i) => {
      if (d.date === date.date) {
        index = i;
        return true;
      }
      return false;
    });

    if (index !== -1) {
      // If the date exists, remove the selected time if it exists, otherwise, add it
      const existingHours = user.calendar[index].hours;

      // Check if the selected time exists in the hours array
      const hourIndex = existingHours.indexOf(date.time);

      if (hourIndex !== -1) {
        // Remove the hour if it exists
        user.calendar[index].hours = existingHours.filter(
          (hour) => hour !== date.time
        );
        console.log(
          `Time ${date.time} removed from the existing date`,
          user.calendar[index].hours
        );
      } else {
        // Add the new hour if it doesn't exist
        user.calendar[index].hours.push(date.time);
        console.log(
          `Time ${date.time} added to the existing date`,
          user.calendar[index].hours
        );
      }

      // Update the state
      const updatedProfileData = { ...user };
      updatedProfileData.calendar[index].hours = [
        ...user.calendar[index].hours,
      ];
      // setProfileData(updatedProfileData);
      updateUser(updatedProfileData, setErrorMessage);
      setUser(updatedProfileData);
    } else {
      // If the date doesn't exist, add it to the calendar
      console.log("Date not found, adding new date", date);

      const updatedProfileData = { ...user };
      updatedProfileData.calendar.push({ date: date.date, hours: [date.time] });
      // setProfileData(updatedProfileData);
      updateUser(updatedProfileData, setErrorMessage);
      setUser(updatedProfileData);
    }
  };

  const setMasterDate = async (calendar: { dates; hours }) => {
    const index = -1;

    console.log("Selected Date:", calendar.dates);
    const finalDates = calendar.dates.map((d) => ({
      date: d,
      hours: calendar.hours,
    }));

    // If the date exists, add the new time to the hours array

    console.log("Date already found in calendar", finalDates);

    user.calendar = finalDates;
    // setProfileData(user);

    updateUser(user, setErrorMessage);
    setUser({ ...user });
    await setIsEditingProfile();

    console.log("Updated Calendar:", user);
    return user.calendar;
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

  const handleFollow = () => {
    if (user && user.friends && Object.keys(user.friends).length > 0) {
      setIsFollowing(!user.friends[username]);
    } else {
      setIsFollowing(false);
    }

    const updatedFriends = user.friends;
    if (!isFollowing && user.friends) {
      updatedFriends[username] = {
        avatar: user.profilePicture,
        nickname: user.name,
        username: user.username,
      };
    }
    // setProfileData((prevProfile) => ({
    //   ...prevProfile,
    //   friends: updatedFriends,
    // }));

    updateUser(
      (prevProfile) => ({
        ...prevProfile,
        friends: updatedFriends,
      }),
      setErrorMessage
    );
    setUser((prevProfile) => ({
      ...prevProfile,
      friends: updatedFriends,
    }));
  };

  const handleClose = (value: boolean) => {
    setShowFriends(!showFriends);
  };

  return (
    <ProfilePage theme={themevars}>
      <Backdrop screen />
      <ProfileHeader theme={themevars}>
        <ProfileInfo theme={themevars}>
          {isEditing ? (
            <ProfileGrid>
              <ProfilePicture
                theme={themevars}
                src={newImage.src}
                alt="Profile Picture"
              />
              <GridCell>
                <UploadInput
                  theme={themevars}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <EditInput
                  theme={themevars}
                  type="text"
                  name="name"
                  value={editProfile.name}
                  onChange={handleInputChange}
                />
                <EditInput
                  theme={themevars}
                  type="text"
                  name="description"
                  value={editProfile.description}
                  onChange={handleInputChange}
                />

                <EditButton theme={themevars} onClick={handleLocationEditClick}>
                  Edit Location
                </EditButton>
              </GridCell>
            </ProfileGrid>
          ) : (
            <ProfileGrid>
              <div>
                <ProfilePicture
                  theme={themevars}
                  src={user && user.profilePicture ? user.profilePicture : ""}
                  alt="Profile Picture"
                />
              </div>

              <GridCell>
                {user && user.name && user.description && user.location && (
                  <div style={{ justifyContent: "start" }}></div>
                )}
              </GridCell>
            </ProfileGrid>
          )}

          <ProfileDescription>
            {user && user.name && user.description && user.location && (
              <div style={{ justifyContent: "start" }}>
                <Typefield style={{ fontWeight: "700" }}>
                  {user && user.name}
                </Typefield>
                <Typefield style={{ fontWeight: "400", opacity: "0.5" }}>
                  {user.location}
                </Typefield>
                <Typefield style={{ color: themevars.text }}>
                  {user.description}
                </Typefield>
              </div>
            )}
          </ProfileDescription>

          {isEditing ? (
            <GridTwo>
              <SaveButton
                theme={themevars}
                onClick={async () =>
                  await handleSaveClick(updateUser, setErrorMessage)
                }
              >
                Save
              </SaveButton>
              <CancelButton theme={themevars} onClick={handleCancelClick}>
                Cancel
              </CancelButton>
            </GridTwo>
          ) : loggedInUser ? (
            <GridTwo theme={themevars}>
              <IcoButton theme={themevars} onClick={handleCalendarClick}>
                <CalendarMonth style={{ color: themevars.icons.color }} />
              </IcoButton>
              <IcoButton theme={themevars} onClick={() => setShowReviews(true)}>
                <Reviews style={{ color: themevars.icons.color }} />
              </IcoButton>

              <IcoButton theme={themevars} onClick={handleAddPhotoClick}>
                <Add style={{ color: themevars.icons.color }} />
              </IcoButton>
              <IcoButton theme={themevars} onClick={handleMapClick}>
                <PinDrop style={{ color: themevars.icons.color }} />
              </IcoButton>

              <IcoButton theme={themevars} onClick={handleLinksClick}>
                <Link style={{ color: themevars.icons.color }} />
              </IcoButton>
            </GridTwo>
          ) : (
            <GridTwo theme={themevars}>
              <IcoButton theme={themevars} onClick={handleCalendarClick}>
                <CalendarMonth style={{ color: themevars.icons.color }} />
              </IcoButton>
              <IcoButton theme={themevars} onClick={() => setShowReviews(true)}>
                <Reviews style={{ color: themevars.icons.color }} />
              </IcoButton>

              <IcoButton theme={themevars} onClick={handleMapClick}>
                <PinDrop style={{ color: themevars.icons.color }} />
              </IcoButton>
              <IcoButton theme={themevars} onClick={handleLinksClick}>
                <Link style={{ color: themevars.icons.color }} />
              </IcoButton>
            </GridTwo>
          )}
        </ProfileInfo>
      </ProfileHeader>
      <FriendsSection theme={themevars}>
        <FriendsAvatarsBackdrop theme={themevars}>
          <FriendsAvatars style={{ marginTop: "unset" }} theme={themevars}>
            <Typefield
              style={{ fontWeight: "700", marginLeft: "10px", padding: "5px" }}
            >
              Friends
            </Typefield>
            {user &&
              user.reviews &&
              user.reviews?.length &&
              user.friends &&
              Object.keys(user.friends).map((friendKey, index) => (
                <FriendAvatar
                  theme={themevars}
                  key={index}
                  src={user.friends[friendKey].avatar}
                  alt={user.friends[friendKey].nickname}
                  onClick={() => setShowFriends(true)}
                />
              ))}
          </FriendsAvatars>
        </FriendsAvatarsBackdrop>
        {/* <FollowButton
          style={{ justifyItems: "end" }}
          theme={themevars}
          following={isFollowing}
          onClick={handleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </FollowButton> */}
      </FriendsSection>

      <ProfilePosts style={{ display: "contents" }}>
        <Grid
          container
          style={{ overflow: "scroll", marginTop: "24px" }}
          xs={12}
        >
          {postsComponents}
        </Grid>
      </ProfilePosts>

      {showReviews && (
        <PopupOverlay>
          <PopupContent theme={themevars.popup}>
            {showReviews && (
              <ReviewContent>
                <EditButton
                  theme={themevars}
                  onClick={() => setShowReviews(false)}
                >
                  X
                </EditButton>
                <h2>Client Reviews</h2>
                <ReviewList>
                  {user.reviews &&
                    user.reviews.length > 0 &&
                    user.reviews.map((review, index) => (
                      <ReviewItem key={index}>
                        <ReviewPhoto
                          src={review.photo}
                          alt={`Client ${index + 1}`}
                        />
                        <ReviewText>{review.text}</ReviewText>
                        <ReviewMark>{review.mark}/5</ReviewMark>
                      </ReviewItem>
                    ))}
                </ReviewList>
                {!loggedInUser && (
                  <CalendarButton
                    theme={themevars}
                    onClick={handleAddReviewClick}
                  >
                    + Add New Review
                  </CalendarButton>
                )}
              </ReviewContent>
            )}

            {showAddReview && (
              <NewReviewForm theme={themevars}>
                <ReviewInput
                  theme={themevars}
                  name="text"
                  placeholder="Enter your review"
                  value={newReview.text}
                  onChange={handleNewReviewChange}
                />
                <ReviewSelect
                  theme={themevars}
                  name="mark"
                  value={newReview.mark}
                  onChange={handleNewReviewChange}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </ReviewSelect>
                <ReviewSubmitButton
                  theme={themevars}
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </ReviewSubmitButton>
              </NewReviewForm>
            )}
          </PopupContent>
        </PopupOverlay>
      )}

      {showFriends && (
        <FriendsPopup>
          <FriendsContent theme={themevars}>
            <EditButton theme={themevars} onClick={() => handleClose(false)}>
              X
            </EditButton>
            <h2>Friends List</h2>
            <FriendsList theme={themevars}>
              {Object.keys(user.friends)?.map((friend, index) => (
                <FriendItem
                  theme={themevars}
                  key={index}
                  onClick={async () =>
                    await handleFriendClick(user.friends[friend].username)
                  }
                >
                  <FriendPhoto
                    theme={themevars}
                    src={user.friends[friend].avatar}
                    alt={user.friends[friend].nickname}
                  />
                  <FriendNickname theme={themevars}>
                    {user.friends[friend].nickname}
                  </FriendNickname>

                  {/* <FollowButton
                    theme={themevars}
                    following={user.friends[friend]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFriendFollowClick(
                        index,
                        user.friends[friend],
                        user.friends[friend] ? true : false
                      );
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </FollowButton> */}
                </FriendItem>
              ))}
            </FriendsList>
          </FriendsContent>
        </FriendsPopup>
      )}

      {showLinksPopup && (
        <PopupOverlay>
          <PopupContent theme={themevars.popup}>
            <EditButton
              theme={themevars}
              onClick={() => handleCloseLinksPopup()}
            >
              X
            </EditButton>
            <h2>Social Media Links</h2>
            <SocialMediaLinks theme={themevars.popup}>
              {user &&
                user.socialLinks &&
                user.socialLinks.map((link, index) => (
                  <SocialMediaLink key={index} href={link.url} target="_blank">
                    {link.platform}
                  </SocialMediaLink>
                ))}
            </SocialMediaLinks>
          </PopupContent>
        </PopupOverlay>
      )}
      {showCalendarPopup && (
        <PopupOverlay>
          <PopupContent theme={themevars.popup}>
            <EditButton
              theme={themevars}
              onClick={() => setCalendarPopup(false)}
            >
              X
            </EditButton>
            {!loggedInUser ? (
              <>
                <PortfolioImagePicker onImageSelect={handleImageSelect} />{" "}
                <CalendarComponent
                  setClosePopup={handleCalendarClick}
                  availableHours={user.calendar}
                  setClientDate={setClientDate}
                />{" "}
              </>
            ) : (
              <DateHourSelector
                setScheduleUpdated={setCalendarUpdated}
                setMasterDate={setMasterDate}
              />
            )}

            <div>
              <CancelButton onClick={() => setCalendarPopup(false)}>
                {calendarUpdated ? "Back" : "Cancel"}
              </CancelButton>
            </div>
          </PopupContent>
        </PopupOverlay>
      )}

      {showLocationPopup && (
        <PopupOverlay>
          <PopupContent theme={themevars.popup}>
            <CloseButton
              theme={themevars}
              onClick={handleLocationCancelClick}
            />
            <h2>Edit Location</h2>
            <EditInput
              theme={themevars}
              type="text"
              name="location"
              value={editProfile.location}
              onChange={handleInputChange}
            />
            <div>
              <SaveButton theme={themevars} onClick={handleLocationSaveClick}>
                Save
              </SaveButton>
              <CancelButton
                theme={themevars}
                onClick={handleLocationCancelClick}
              >
                Cancel
              </CancelButton>
            </div>
          </PopupContent>
        </PopupOverlay>
      )}
    </ProfilePage>
  );
};

export default ProfilePageComponent;
