import React, { useMemo, useState } from "react";
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

const ProfilePage = styled.div`
  font-family: Arial, sans-serif;
  max-width: 935px;
  margin: 0 auto;
  color: black;
  background-color: white;
`;

const ProfileHeader = styled.div`
  display: flex;
  margin-top: 30px;
  margin-bottom: 44px;
  color: black;
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 30px;
  justify-content: center;
  color: black;
  align-items: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: black;
  align-items: center;
`;

const EditInput = styled.input`
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
  max-width: 30vw;
  color: black;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const SaveButton = styled(EditButton)`
  background-color: #28a745;
`;

const CancelButton = styled(EditButton)`
  background-color: #dc3545;
`;

const ReviewButton = styled(EditButton)`
  background-color: #007bff;
`;

const MapButton = styled(EditButton)`
  background-color: #28a745;
`;

const CalendarButton = styled(EditButton)`
  background-color: #d8a745;
`;

const LinksButton = styled(EditButton)`
  background-color: #ff4500;
`;

const FollowButton = styled(EditButton)<{ following: boolean }>`
  background-color: ${(props) => (props.following ? "#dc3545" : "#007bff")};
`;

const ProfilePosts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Post = styled.div`
  width: 293px;
  margin-bottom: 28px;
  color: black;
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const LocationPopup = styled.div`
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

const LocationContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ReviewPopup = styled.div`
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

const ReviewContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  position: relative;
`;

const SocialMediaPopup = styled.div`
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

const CalendarContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SocialMediaContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialMediaLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialMediaLink = styled.a`
  margin: 10px 0;
  color: #007bff;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FriendsSection = styled.div`
  margin-top: 20px;
`;

const FriendsAvatars = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 10px;
`;

const FriendAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const FriendsPopup = styled.div`
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

const FriendsContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  position: relative;
`;

const FriendsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FriendItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
`;

const FriendPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const FriendNickname = styled.div`
  flex-grow: 1;
`;

const FriendFollowButton = styled(FollowButton)`
  margin-left: 10px;
`;

const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReviewItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

const ReviewPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const ReviewText = styled.div`
  flex-grow: 1;
`;

const ReviewMark = styled.div`
  font-weight: bold;
`;

const AddPhotoButton = styled(EditButton)`
  background-color: #28a745;
`;

const CalendarPopup = styled.div`
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

const AddReviewButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const NewReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const ReviewInput = styled.textarea`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  height: 100px;
`;

const ReviewSelect = styled.select`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ReviewSubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;
const UploadInput = styled.input`
  margin: 20px 0;
`;

// Sample user data and login state

// Simulating that the user is logged in on this device
interface ProfilePageProps {
  profileData: any; // Array of image URLs
  setProfileData: any; // Callback function to return the selected image
}
const ProfilePageComponent: React.FC<ProfilePageProps> = ({
  profileData,
  setProfileData,
}) => {
  const { login, profile } = useTypedSelector((state) => state);

  const [user, setUser] = useLocalStorage("user", null);
  console.log("Profile:", user);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const { username, postId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [editProfile, setEditProfile] = useState({
    name: user.name,
    username: user.username,
    description: user.description,
    profilePicture: user.profilePicture,
    location: user.location,
  });
  const [isFollowing, setIsFollowing] = useState(
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
      { photo: "new-photo.jpg", nickname: username, ...newReview },
    ];
    setProfileData((prevProfile) => ({
      ...prevProfile,
      reviews: updatedReviews,
    }));
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
    setProfileData(newProfileData);
    updateUser(newProfileData, setErrorMessage);
    setIsEditing(false);
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

    setProfileData(updatedProfileData);
  };

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
    setProfileData((prevProfile) => ({
      ...prevProfile,
      location: editProfile.location,
    }));
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
    console.log("Selected Image:", image);
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
      setProfileData(updatedProfileData);
    } else {
      // If the date doesn't exist, add it to the calendar
      console.log("Date not found, adding new date", date);

      const updatedProfileData = { ...user };
      updatedProfileData.calendar.push({ date: date.date, hours: [date.time] });
      setProfileData(updatedProfileData);
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
    setProfileData(user);
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
    const updatedFriends = isFollowing
      ? user.friends.filter((friend) => friend.username !== username)
      : [
          ...user.friends,
          {
            avatar: user.profilePicture,
            nickname: user.name,
            username: user.username,
          },
        ];
    setProfileData((prevProfile) => ({
      ...prevProfile,
      friends: updatedFriends,
    }));
  };

  const handleClose = (value: boolean) => {
    setShowFriends(!showFriends);
  };
  return (
    <ProfilePage>
      <ProfileHeader>
        <ProfileInfo>
          {isEditing ? (
            <InfoGrid>
              <ProfilePicture src={newImage.src} alt="Profile Picture" />
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <EditInput
                type="text"
                name="name"
                value={editProfile.name}
                onChange={handleInputChange}
              />
              <EditInput
                type="text"
                name="description"
                value={editProfile.description}
                onChange={handleInputChange}
              />
              <EditButton onClick={handleLocationEditClick}>
                Edit Location
              </EditButton>
            </InfoGrid>
          ) : (
            <InfoGrid>
              <ProfilePicture src={user.profilePicture} alt="Profile Picture" />
              <div>
                <h1>{user.name}</h1>

                <p style={{ color: "black" }}>{user.description}</p>
                <p style={{ color: "black" }}>Location: {user.location}</p>
              </div>
            </InfoGrid>
          )}

          <ImageGrid>
            {loggedInUser ? (
              isEditing ? (
                <>
                  <SaveButton
                    onClick={async () =>
                      await handleSaveClick(updateUser, setErrorMessage)
                    }
                  >
                    Save
                  </SaveButton>
                  <CancelButton onClick={handleCancelClick}>
                    Cancel
                  </CancelButton>
                </>
              ) : (
                <>
                  <ReviewButton onClick={() => setLoggedInUser(!loggedInUser)}>
                    master
                  </ReviewButton>
                  <EditButton onClick={handleEditClick}>
                    Edit Profile
                  </EditButton>
                  <AddPhotoButton onClick={handleAddPhotoClick}>
                    Add New Photo
                  </AddPhotoButton>
                  <MapButton onClick={handleMapClick}>Open Map</MapButton>
                  <CalendarButton onClick={handleCalendarClick}>
                    Open Calendar
                  </CalendarButton>
                  <LinksButton onClick={handleLinksClick}>
                    Social Media Links
                  </LinksButton>
                  <ReviewButton onClick={() => setShowReviews(true)}>
                    Show Reviews ({user.reviews?.length})
                  </ReviewButton>
                </>
              )
            ) : (
              <>
                <ReviewButton onClick={() => setLoggedInUser(!loggedInUser)}>
                  master
                </ReviewButton>
                <ReviewButton onClick={() => setShowReviews(true)}>
                  Show Reviews ({user.reviews?.length})
                </ReviewButton>

                <FollowButton following={isFollowing} onClick={handleFollow}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </FollowButton>
                <MapButton onClick={handleMapClick}>Open Map</MapButton>
                <CalendarButton onClick={handleCalendarClick}>
                  Open Calendar
                </CalendarButton>
                <LinksButton onClick={handleLinksClick}>
                  Social Media Links
                </LinksButton>

                <FriendsSection>
                  <h2>Friends</h2>
                  <FriendsAvatars>
                    {user.friends
                      ?.slice(0, 3)
                      .map((friend, index) => (
                        <FriendAvatar
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

      <ProfilePosts>
        {user.posts?.map((post) => (
          <Post key={post.id}>
            <PostImage
              src={post.image}
              onClick={() => {
                navigate("../" + username + "/portfolio");
              }}
              alt={`Post ${post.id}`}
            />
          </Post>
        ))}
      </ProfilePosts>

      {showReviews && (
        <ReviewPopup>
          <ReviewContent>
            <CloseButton onClick={() => setShowReviews(false)}>X</CloseButton>
            <h2>Client Reviews</h2>
            <ReviewList>
              {user.reviews.map((review, index) => (
                <ReviewItem key={index}>
                  <ReviewPhoto src={review.photo} alt={`Client ${index + 1}`} />
                  <ReviewText>{review.text}</ReviewText>
                  <ReviewMark>{review.mark}/5</ReviewMark>
                </ReviewItem>
              ))}
            </ReviewList>

            {/* Add new review button */}
            {!loggedInUser && (
              <AddReviewButton onClick={handleAddReviewClick}>
                + Add New Review
              </AddReviewButton>
            )}

            {/* New Review Form */}
            {showAddReview && (
              <NewReviewForm>
                <ReviewInput
                  name="text"
                  placeholder="Enter your review"
                  value={newReview.text}
                  onChange={handleNewReviewChange}
                />
                <ReviewSelect
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
                <ReviewSubmitButton onClick={handleReviewSubmit}>
                  Submit Review
                </ReviewSubmitButton>
              </NewReviewForm>
            )}
          </ReviewContent>
        </ReviewPopup>
      )}

      {showFriends && (
        <FriendsPopup>
          <FriendsContent>
            <CloseButton onClick={() => handleClose(false)}>X</CloseButton>
            <h2>Friends List</h2>
            <FriendsList>
              {user.friends?.map((friend, index) => (
                <FriendItem
                  key={index}
                  onClick={() => handleFriendClick(friend.username)}
                >
                  <FriendPhoto src={friend.image} alt={friend.nickname} />
                  <FriendNickname>{friend.nickname}</FriendNickname>
                  <FriendFollowButton
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
                  </FriendFollowButton>
                </FriendItem>
              ))}
            </FriendsList>
          </FriendsContent>
        </FriendsPopup>
      )}

      {showLinksPopup && (
        <SocialMediaPopup>
          <SocialMediaContent>
            <CloseButton onClick={handleCloseLinksPopup}>X</CloseButton>
            <h2>Social Media Links</h2>
            <SocialMediaLinks>
              {user.socialLinks.map((link, index) => (
                <SocialMediaLink key={index} href={link.url} target="_blank">
                  {link.platform}
                </SocialMediaLink>
              ))}
            </SocialMediaLinks>
          </SocialMediaContent>
        </SocialMediaPopup>
      )}
      {showCalendarPopup && (
        <CalendarPopup>
          <CalendarContent>
            <CloseButton onClick={() => setCalendarPopup(false)}>X</CloseButton>
            {!loggedInUser ? (
              <>
                <PortfolioImagePicker
                  profileData={profile}
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
          </CalendarContent>
        </CalendarPopup>
      )}

      {showLocationPopup && (
        <LocationPopup>
          <LocationContent>
            <CloseButton onClick={handleLocationCancelClick}>X</CloseButton>
            <h2>Edit Location</h2>
            <EditInput
              type="text"
              name="location"
              value={editProfile.location}
              onChange={handleInputChange}
            />
            <div>
              <SaveButton onClick={handleLocationSaveClick}>Save</SaveButton>
              <CancelButton onClick={handleLocationCancelClick}>
                Cancel
              </CancelButton>
            </div>
          </LocationContent>
        </LocationPopup>
      )}
    </ProfilePage>
  );
};

export default ProfilePageComponent;
