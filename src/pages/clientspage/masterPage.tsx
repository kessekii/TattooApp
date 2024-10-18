import React, { useState } from 'react';
import styled from 'styled-components';

const ProfilePage = styled.div`
    font-family: Arial, sans-serif;
    max-width: 935px;
    margin: 0 auto;
    color: black;
    backgroundColor: white;
`;

const ProfileHeader = styled.div`
    display: flex;
    margin-top: 30px;
    margin-bottom: 44px;
    color: black;
`;

const ProfilePicture = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 30px;
    color: black;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: black;
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

const ReviewButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
`;

const MapButton = styled.button`
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
`;

const FollowButton = styled.button`
    background-color: ${(props) => (props.following ? '#dc3545' : '#007bff')};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
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

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
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

const ProfilePageComponent: React.FC = () => {
    const [showReviews, setShowReviews] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [friendFollowing, setFriendFollowing] = useState(
        new Array(4).fill(false)
    );

    const reviews = [
        { photo: 'client1.jpg', text: 'Amazing photographer!', mark: 5 },
        { photo: 'client2.jpg', text: 'Loved the pictures!', mark: 4 },
        { photo: 'client3.jpg', text: 'Great experience.', mark: 5 },
    ];

    const friends = [
        { avatar: 'friend1.jpg', nickname: 'Alice', profileLink: '/friends/alice' },
        { avatar: 'friend2.jpg', nickname: 'Bob', profileLink: '/friends/bob' },
        { avatar: 'friend3.jpg', nickname: 'Charlie', profileLink: '/friends/charlie' },
        { avatar: 'friend4.jpg', nickname: 'Dave', profileLink: '/friends/dave' },
    ];

    const handleFriendClick = (profileLink: string) => {
        window.location.href = profileLink;
    };

    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
    };

    const handleFriendFollowClick = (index: number) => {
        const updatedFollowing = [...friendFollowing];
        updatedFollowing[index] = !updatedFollowing[index];
        setFriendFollowing(updatedFollowing);
    };

    const handleMapClick = () => {
        window.location.href = '/map';
    };

    return (
        <ProfilePage>
            <ProfileHeader>
                <ProfilePicture src="profile-picture.jpg" alt="Profile Picture" />
                <ProfileInfo>
                    <h1 style={{ color: "black" }}>John Doe</h1>
                    <p style={{ color: "black" }}>Photographer | Traveler</p>
                    <p style={{ color: "black" }}>Location: New York City</p>
                    <ReviewButton onClick={() => setShowReviews(true)}>
                        Show Reviews ({reviews.length})
                    </ReviewButton>
                    <FollowButton following={isFollowing} onClick={handleFollowClick}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </FollowButton>
                    <MapButton onClick={handleMapClick}>Open Map</MapButton>
                </ProfileInfo>
            </ProfileHeader>

            <FriendsSection>
                <h2>Friends</h2>
                <FriendsAvatars>
                    {friends.slice(0, 3).map((friend, index) => (
                        <FriendAvatar
                            key={index}
                            src={friend.avatar}
                            alt={friend.nickname}
                            onClick={() => setShowFriends(true)}
                        />
                    ))}
                </FriendsAvatars>
            </FriendsSection>

            <ProfilePosts>
                <Post>
                    <PostImage src="post1.jpg" alt="Post 1" />
                </Post>
                <Post>
                    <PostImage src="post2.jpg" alt="Post 2" />
                </Post>
                <Post>
                    <PostImage src="post3.jpg" alt="Post 3" />
                </Post>
            </ProfilePosts>

            {showReviews && (
                <ReviewPopup>
                    <ReviewContent>
                        <CloseButton onClick={() => setShowReviews(false)}>X</CloseButton>
                        <h2>Client Reviews</h2>
                        <ReviewList>
                            {reviews.map((review, index) => (
                                <ReviewItem key={index}>
                                    <ReviewPhoto src={review.photo} alt={`Client ${index + 1}`} />
                                    <ReviewText>{review.text}</ReviewText>
                                    <ReviewMark>{review.mark}/5</ReviewMark>
                                </ReviewItem>
                            ))}
                        </ReviewList>
                    </ReviewContent>
                </ReviewPopup>
            )}

            {showFriends && (
                <FriendsPopup>
                    <FriendsContent>
                        <CloseButton onClick={() => setShowFriends(false)}>X</CloseButton>
                        <h2>Friends List</h2>
                        <FriendsList>
                            {friends.map((friend, index) => (
                                <FriendItem
                                    key={index}
                                    onClick={() => handleFriendClick(friend.profileLink)}
                                >
                                    <FriendPhoto src={friend.avatar} alt={friend.nickname} />
                                    <FriendNickname>{friend.nickname}</FriendNickname>
                                    <FriendFollowButton
                                        following={friendFollowing[index]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFriendFollowClick(index);
                                        }}
                                    >
                                        {friendFollowing[index] ? 'Unfollow' : 'Follow'}
                                    </FriendFollowButton>
                                </FriendItem>
                            ))}
                        </FriendsList>
                    </FriendsContent>
                </FriendsPopup>
            )}
        </ProfilePage>
    );
};

export default ProfilePageComponent;