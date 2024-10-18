import React, { useState } from 'react';
import styled from 'styled-components';

const PortfolioPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background-color: #fafafa;
    color: black;
`;

const PostWrapper = styled.div`
    width: 100%;
    max-width: 600px;
    height: 100vh;
    background: white;
    border-bottom: 1px solid #dbdbdb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    color: black;
`;

const PostImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    color: black;
`;

const PostDetails = styled.div`
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    color: black;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const UserAvatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
`;

const UserName = styled.div`
    font-weight: bold;
    color: black;
`;

const Description = styled.p`
    margin-top: 10px;
    font-size: 14px;
`;

const Caption = styled.div`
    font-size: 14px;
    margin-top: 10px;
    color: black;
`;

const CommentSection = styled.div`
    font-size: 14px;
    margin-top: 10px;
    cursor: pointer;
    color: #8e8e8e;
`;

const LikeSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const LikeButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #262626;
    display: flex;
    align-items: center;
`;

const LikeIcon = styled.span`
    font-size: 18px;
    margin-right: 5px;
`;

const CommentsPopup = styled.div`
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

const CommentsContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    color: black;
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

const CommentList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const CommentItem = styled.li`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 10px;
`;

const CommentAuthor = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;

const CommentText = styled.p`
    margin-top: 5px;
     color: black;
`;

const PortfolioViewPage: React.FC = () => {
    const [showCommentsPopup, setShowCommentsPopup] = useState<number | null>(null);

    const posts = [
        {
            id: 1,
            image: 'post1.jpg',
            user: { avatar: 'avatar1.jpg', name: 'john_doe' },
            description: 'Exploring the beauty of the city.',
            comments: [
                { author: 'user123', text: 'Amazing view!' },
                { author: 'travel_guru', text: 'I’ve been there, it’s incredible!' },
                { author: 'photo_master', text: 'Beautiful shot!' },
            ],
        },
        {
            id: 2,
            image: 'post2.jpg',
            user: { avatar: 'avatar2.jpg', name: 'jane_smith' },
            description: 'A perfect sunset view.',
            comments: [
                { author: 'sunset_lover', text: 'Such a peaceful moment.' },
                { author: 'nature_enthusiast', text: 'Perfect capture!' },
                { author: 'wanderer', text: 'I miss sunsets like this!' },
            ],
        },
        {
            id: 3,
            image: 'post3.jpg',
            user: { avatar: 'avatar3.jpg', name: 'michael_ross' },
            description: 'Nature at its best.',
            comments: [
                { author: 'nature_fan', text: 'Wow, so green and beautiful!' },
                { author: 'forest_lover', text: 'This is so refreshing to see.' },
                { author: 'mountain_goat', text: 'Nature never disappoints.' },
            ],
        },
    ];

    const handleCommentsClick = (postId: number) => {
        setShowCommentsPopup(postId);
    };

    const handleCloseCommentsPopup = () => {
        setShowCommentsPopup(null);
    };

    return (
        <PortfolioPage>
            {posts.map((post) => (
                <PostWrapper key={post.id}>
                    <PostImage src={post.image} alt={`Post ${post.id}`} />
                    <PostDetails>
                        <UserSection>
                            <UserAvatar src={post.user.avatar} alt={`${post.user.name} avatar`} />
                            <UserName>{post.user.name}</UserName>
                        </UserSection>
                        <Description>{post.description}</Description>
                        <Caption>
                            <strong>{post.user.name}</strong> {post.description}
                        </Caption>
                        <CommentSection onClick={() => handleCommentsClick(post.id)}>
                            View all {post.comments.length} comments ·{' '}
                            <strong>{post.comments[0].author}</strong>: {post.comments[0].text}
                        </CommentSection>
                        <LikeSection>
                            <LikeButton>
                                <LikeIcon>❤️</LikeIcon> Like
                            </LikeButton>
                        </LikeSection>
                    </PostDetails>

                    {showCommentsPopup === post.id && (
                        <CommentsPopup>
                            <CommentsContent>
                                <CloseButton onClick={handleCloseCommentsPopup}>X</CloseButton>
                                <h2 style={{ color: "black"}}>Comments</h2>
                                <CommentList>
                                    {post.comments.map((comment, index) => (
                                        <CommentItem key={index}>
                                            <CommentAuthor>{comment.author}</CommentAuthor>
                                            <CommentText>{comment.text}</CommentText>
                                        </CommentItem>
                                    ))}
                                </CommentList>
                            </CommentsContent>
                        </CommentsPopup>
                    )}
                </PostWrapper>
            ))}
        </PortfolioPage>
    );
};

export default PortfolioViewPage;
