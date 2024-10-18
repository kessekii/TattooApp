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
import { getChatByChatId } from "src/hooks/useChat";
import { useTheme } from "../../state/providers/themeProvider";

// ProfilePage styling with dynamic background and text color
export const ProfilePage = styled.div <({ theme }) >`
  font-family: Arial, sans-serif;
  max-width: 935px;
  margin: 0 auto;
  padding: 5px;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.background};
`;

// ProfileHeader styling
export const ProfileHeader = styled.div <({ theme }) >`
  display: flex;
  margin-top: 30px;
  margin-bottom: 44px;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
`;

// Profile Picture with dynamic border and background
export const ProfilePicture = styled.img<({ theme }) >`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 30px;
  background-color: ${(props) => props.theme.background};
`;

// Profile Info with centered text and colors
export const ProfileInfo = styled.div<({ theme }) >`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
`;

// Edit Input with dynamic border and background
export const EditInput = styled.input<({ theme }) >`
  border: 1px solid ${(props) => props.theme.border};
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
  max-width: 30vw;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

// EditButton for all buttons with dynamic background and text colors
export const EditButton = styled.button<({ theme }) >`
  background-color: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.buttonText};
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  height:50px;
  max-height: 50px;
  &:hover {
    background-color: ${(props) => props.theme.buttonText};
    color: ${(props) => props.theme.buttonBackground};
  }
`;

// SaveButton inheriting from EditButton with specific background
export const SaveButton = styled(EditButton) <({ theme }) >`
  background-color: #28a745;
`;

// CancelButton inheriting from EditButton with specific background
export const CancelButton = styled(EditButton) <({ theme }) >`
  background-color: #dc3545;
`;

// FollowButton with dynamic background based on the "following" prop
export const FollowButton = styled(EditButton) <({ following }) >`
  background-color: ${(props) => (props.following ? '#dc3545' : props.theme.buttonBackground)};
`;

// ProfilePosts for flex-wrapping posts
export const ProfilePosts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

// Single Post card with a dynamic background and color
export const Post = styled.div<({ theme }) >`
  width: 293px;
  margin-bottom: 28px;
  color: ${(props) => props.theme.text};
`;

// Post Image styling
export const PostImage = styled.img<({ theme }) >`
  width: 100%;
  height: auto;
`;

// CloseButton with fixed positioning and dynamic color
export const CloseButton = styled.button<({ theme }) >`
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
`;

// Popup content with dynamic background and text color
export const PopupContent = styled.div < ({ theme }) > `
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
export const SocialMediaLinks = styled.div<({ theme }) >`
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
  margin-top: 20px;
`;

// Friends avatar styling
export const FriendsAvatars = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 10px;
`;

// Individual friend avatar with circular borders
export const FriendAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
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
export const FriendsContent = styled.div<({ theme }) >`
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
export const FriendItem = styled.li<({ theme }) >`
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
export const FriendNickname = styled.div<({ theme }) >`
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
export const ReviewContent = styled.div<({ theme }) >`
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
export const ReviewItem = styled.li<({ theme }) >`
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
export const ReviewText = styled.div<({ theme }) >`
  flex-grow: 1;
  color: ${(props) => props.theme.text};
`;

// Review score mark styling
export const ReviewMark = styled.div<({ theme }) >`
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

// Add Review Button styling
export const AddReviewButton = styled.button<({ theme }) >`
  background-color: #28a745;
  color: ${(props) => props.theme.buttonText};
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

// New Review Form styling with column layout
export const NewReviewForm = styled.div<({ theme }) >`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

// Text area for review input with dynamic background and color
export const ReviewInput = styled.textarea<({ theme }) >`
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
export const ReviewSelect = styled.select<({ theme }) >`
  border: 1px solid ${(props) => props.theme.border};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

// Review submit button with dynamic colors
export const ReviewSubmitButton = styled.button<({ theme }) >`
  background-color: #007bff;
  color: ${(props) => props.theme.buttonText};
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

// Image grid layout for portfolio photos
export const ImageGrid = styled.div<({ theme }) >`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

// Info grid layout for two-column display
export const InfoGrid = styled.div<({ theme }) >`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

// Upload Input for uploading files
export const UploadInput = styled.input<({ theme }) >`
  margin: 20px 0;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.background};
`;


// Sample user data and login state

// Simulating that the user is logged in on this device

const ProfilePageComponent: React.FC<any> = ({ theme
}) => {
  const { toggleTheme, themevars } = useTheme();
  const [user, setUser] = useLocalStorage("user", null);
  const [chats, setChats] = useLocalStorage("chats", null);

  const [loggedInUser, setLoggedInUser] = useState(false);
  const { username, postId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [editProfile, setEditProfile] = useState(user ? {
    name: user.name,
    username: user.username,
    description: user.description,
    profilePicture: user.profilePicture,
    location: user.location,
  } : {
    name: "",
    username: "",
    description: "",
    profilePicture: "",
    location: "",
  });
  const [isFollowing, setIsFollowing] = useState<boolean>(
    user.friends?.filter((friend) => friend.username === username).length > 0
  );
  const [friendFollowing, setFriendFollowing] = useState(
    new Array(user.friends?.length).fill(false)
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
  const [isSettingsPopup, setSettingsPopup] = useState(false)
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
    const updatedReviews = [
      ...user.reviews,
      { photo: user.image, nickname: user.username, ...newReview },
    ];
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
  const handleEditClick = () => {
    setIsEditing(true);
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
    updateUser(newProfileData, setErrorMessage);
    setIsEditing(false);
    setUser(newProfileData);

    setChats(newProfileData.chats);
  };

  // Cancel editing
  const handleCancelClick = () => {
    setEditProfile({
      name: user.name,
      username: username,
      description: user.description,
      profilePicture: user.profilePicture,
      location: user.location,
    });
    setIsEditing(false);
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
    follow: boolean
  ) => {
    const updatedFollowing = [...friendFollowing];
    updatedFollowing[index] = !updatedFollowing[index];
    setFriendFollowing(updatedFollowing);

    console.log("Friend Following:", friend, friendFollowing);

    const newPost = {
      avatar: friend.profilePicture,
      nickname: friend.name,
      username: friend.username,
    };

    console.log("New Post:", friend, user.friends, username, friend.username);
    const updatedProfileData = { ...user };
    const filteredFriends = user.friends.filter(
      (frie) => frie.username !== friend.username
    );
    if (filteredFriends == user.friends) {
      updatedProfileData.friends = [...user.friends, newPost];
    } else {
      updatedProfileData.friends = filteredFriends;
    }
    console.log("Filtered Friends:", filteredFriends);
    updatedProfileData.friends = follow
      ? [...user.friends, newPost]
      : filteredFriends;

    // setProfileData(updatedProfileData);
    updateUser(updatedProfileData, setErrorMessage);
    setUser(updatedProfileData);
  };
  const posts = useMemo(
    () =>
      Object.keys(user.posts).map((post) => (
        <Post key={post}>
          <PostImage
            src={user.posts[post].image}
            onClick={() => {
              navigate("../" + username + "/portfolio");
            }}
            alt={`Post ${post}`}
          />
        </Post>
      )),
    [user]
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

  const handleFriendClick = (profileLink: string) => {
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

  const setMasterDate = (calendar: { dates; hours }) => {
    let index = -1;

    console.log("Selected Date:", calendar.dates);
    let finalDates = calendar.dates.map((d) => ({
      date: d,
      hours: calendar.hours,
    }));

    // If the date exists, add the new time to the hours array

    console.log("Date already found in calendar", finalDates);

    user.calendar = finalDates;
    // setProfileData(user);

    updateUser(user, setErrorMessage);
    setUser(user);
    setIsEditing(false);

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
    setIsFollowing(!isFollowing);
    const updatedFriends = isFollowing ? user.friends.filter((friend) => friend.username !== username)
      : [
        ...user.friends,
        {
          avatar: user.profilePicture,
          nickname: user.name,
          username: user.username,
        },
      ];

    // setProfileData((prevProfile) => ({
    //   ...prevProfile,
    //   friends: updatedFriends,
    // }));

    updateUser((prevProfile) => ({
      ...prevProfile,
      friends: updatedFriends,
    }), setErrorMessage);
    setUser((prevProfile) => ({
      ...prevProfile,
      friends: updatedFriends,
    }));;
  };

  const handleClose = (value: boolean) => {
    setShowFriends(!showFriends);
  };


  return (
    <ProfilePage theme={themevars}>
      <ProfileHeader theme={themevars}>
        <ProfileInfo theme={themevars}>
          {isEditing ? (
            <InfoGrid>
              <ProfilePicture theme={themevars} src={newImage.src} alt="Profile Picture" />
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
            </InfoGrid>
          ) : (
            <InfoGrid>
              <ProfilePicture theme={themevars} src={user.profilePicture} alt="Profile Picture" />
              <div>
                <h1>{user.name}</h1>

                <p style={{ color: "black" }}>{user.description}</p>
                <p style={{ color: "black" }}>Location: {user.location}</p>
              </div>
            </InfoGrid>
          )}

          <ImageGrid theme={themevars}>
            {loggedInUser ? (
              isEditing ? (
                <>
                  <SaveButton theme={themevars}
                    onClick={async () =>
                      await handleSaveClick(updateUser, setErrorMessage)
                    }
                  >
                    Save
                  </SaveButton>
                  <CancelButton theme={themevars} onClick={handleCancelClick}>
                    Cancel
                  </CancelButton>
                </>
              ) : (
                <>
                  <EditButton theme={themevars} onClick={() => setLoggedInUser(!loggedInUser)}>
                    master
                  </EditButton>
                  <EditButton theme={themevars} onClick={handleEditClick}>
                    Edit Profile
                  </EditButton>
                  <EditButton theme={themevars} onClick={handleAddPhotoClick}>
                    Add New Photo
                  </EditButton>
                  <EditButton theme={themevars} onClick={handleMapClick}>Open Map</EditButton>
                  <EditButton theme={themevars} onClick={handleCalendarClick}>
                    Open Calendar
                  </EditButton>
                  <EditButton theme={themevars} onClick={handleLinksClick}>
                    Social Media Links
                  </EditButton>
                  <EditButton theme={themevars} onClick={() => setShowReviews(true)}>
                    Show Reviews ({user.reviews?.length})
                  </EditButton>
                </>
              )
            ) : (
              <>
                <EditButton theme={themevars} onClick={() => setLoggedInUser(!loggedInUser)}>
                  master
                </EditButton>
                <EditButton theme={themevars} onClick={() => setShowReviews(true)}>
                  Show Reviews ({user.reviews?.length})
                </EditButton>

                <FollowButton theme={themevars} following={isFollowing} onClick={handleFollow}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </FollowButton>
                <EditButton theme={themevars} onClick={handleMapClick}>Open Map</EditButton>
                <EditButton theme={themevars} onClick={handleCalendarClick}>
                  Open Calendar
                </EditButton>
                <EditButton theme={themevars} onClick={handleLinksClick}>
                  Social Media Links
                </EditButton>

                <FriendsSection theme={themevars} >
                  <h2>Friends</h2>
                  <FriendsAvatars theme={themevars}>
                    {user.friends
                      ?.slice(0, 3)
                      .map((friend, index) => (
                        <FriendAvatar
                          theme={themevars}
                          key={index}
                          src={friend.avatar}
                          alt={friend.nickname}
                          onClick={() => setShowFriends(true)}
                        />
                      ))}
                  </FriendsAvatars>
                </FriendsSection>
              </>
            )}
          </ImageGrid>
        </ProfileInfo>
      </ProfileHeader>

      <ProfilePosts>{posts}</ProfilePosts>



      {/* Add new review button */}


      {/* New Review Form */}
      {showReviews && (
        <PopupOverlay >
          <PopupContent theme={themevars.popup}>
            {showReviews && (

              <ReviewContent>
                <EditButton theme={themevars} onClick={() => setShowReviews(false)}>X</EditButton>
                <h2>Client Reviews</h2>
                <ReviewList>
                  {user.reviews && user.reviews.length > 0 && user.reviews.map((review, index) => (
                    <ReviewItem key={index}>
                      <ReviewPhoto src={review.photo} alt={`Client ${index + 1}`} />
                      <ReviewText>{review.text}</ReviewText>
                      <ReviewMark>{review.mark}/5</ReviewMark>
                    </ReviewItem>
                  ))}
                </ReviewList>
                {!loggedInUser && (
                  <CalendarButton theme={themevars} onClick={handleAddReviewClick}>
                    + Add New Review
                  </CalendarButton>
                )}
              </ReviewContent>
            )}

            {showAddReview && <NewReviewForm theme={themevars}>
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
              <ReviewSubmitButton theme={themevars} onClick={handleReviewSubmit}>
                Submit Review
              </ReviewSubmitButton>
            </NewReviewForm>}
          </PopupContent>
        </PopupOverlay>
      )
      }


      {
        showFriends && (
          <FriendsPopup>
            <FriendsContent theme={themevars}>
              <EditButton theme={themevars} onClick={() => handleClose(false)}>X</EditButton>
              <h2>Friends List</h2>
              <FriendsList theme={themevars}>
                {user.friends?.map((friend, index) => (
                  <FriendItem theme={themevars}
                    key={index}
                    onClick={() => handleFriendClick(friend.username)}
                  >
                    <FriendPhoto theme={themevars} src={friend.image} alt={friend.nickname} />
                    <FriendNickname theme={themevars}>{friend.nickname}</FriendNickname>
                    <FollowButton theme={themevars}
                      following={friendFollowing[index]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFriendFollowClick(
                          index,
                          friend,
                          friendFollowing[index] ? true : false
                        );
                      }}
                    >
                      {friendFollowing[index] ? "Unfollow" : "Follow"}
                    </FollowButton>
                  </FriendItem>
                ))}
              </FriendsList>
            </FriendsContent>
          </FriendsPopup>
        )
      }

      {
        showLinksPopup && (
          <PopupOverlay >
            <PopupContent theme={themevars.popup}>
              <EditButton theme={themevars} onClick={() => handleCloseLinksPopup()}>X</EditButton>
              <h2>Social Media Links</h2>
              <SocialMediaLinks theme={themevars.popup}>

                {user && user.socialLinks && user.socialLinks.map((link, index) => (
                  <SocialMediaLink key={index} href={link.url} target="_blank">
                    {link.platform}
                  </SocialMediaLink>
                ))}
              </SocialMediaLinks>
            </PopupContent>
          </PopupOverlay>
        )
      }
      {
        showCalendarPopup && (
          <PopupOverlay >
            <PopupContent theme={themevars.popup}>
              <EditButton theme={themevars} onClick={() => setCalendarPopup(false)}>X</EditButton>
              {!loggedInUser ? (
                <>
                  <PortfolioImagePicker

                    onImageSelect={handleImageSelect}
                  />{" "}
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
        )
      }


      {
        showLocationPopup && (
          <PopupOverlay>
            <PopupContent theme={themevars.popup}>
              <CloseButton theme={themevars} onClick={handleLocationCancelClick} />
              <h2>Edit Location</h2>
              <EditInput
                theme={themevars}
                type="text"
                name="location"
                value={editProfile.location}
                onChange={handleInputChange}
              />
              <div>
                <SaveButton theme={themevars} onClick={handleLocationSaveClick}>Save</SaveButton>
                <CancelButton theme={themevars} onClick={handleLocationCancelClick}>
                  Cancel
                </CancelButton>
              </div>
            </PopupContent>
          </PopupOverlay>
        )
      }
    </ProfilePage >
  );
};

export default ProfilePageComponent;
