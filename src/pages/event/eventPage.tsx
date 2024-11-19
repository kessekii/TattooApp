import { styled } from "styled-components";
import useSlice from "../../hooks/useSlice";
import { Post } from "../../state/features/postsSlice";
import { Typefield } from "../masterspage/masterPage";
import { useNavigate, useParams } from "react-router";
import { useTheme } from "../../state/providers/themeProvider";
import { ArrowBackIos } from "@mui/icons-material";

export const PostWrapper = styled.div`
  width: 100%;
  max-width: 100%;

  background-color: ${({ theme }) => theme.background};

  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  size: content-fit;
  overflow: scroll;
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
const CallToAction = styled(StyledEditButton)`
    position: absolute;
    justify-content: center;
    align-self: center;
    min-width: 15vw;
`

const PosterContent = styled.div`
    position: absolute;
    display: flex;
    height: 100vw;
    width: 100%;
    justify-content: center;
    align-items: center;
    
`


export const PostImage = styled.img`
width: 100 %;
height: 100 %;
object - fit: cover;
color: ${({ theme }) => theme.text};
`;

export const PostDetails = styled.div`
padding: 10px 15px;
display: flex;
flex - direction: column;
justify - content: space - between;
align - items: flex - start;
height:
color: ${({ theme }) => theme.text};
`;

export const UserSection = styled.div`
display: flex;
align - items: center;
margin - bottom: 10px;
color: ${({ theme }) => theme.text};
`;

export const UserAvatar = styled.img`
width: 40px;
height: 40px;
display: flex;
justify - content: center;
border - radius: 50 %;
margin - right: 10px;
`;

export const UserName = styled.div`
font - family: ${({ theme }) => theme.fontFamily};
font - weight: bold;
color: ${({ theme }) => theme.text};
`;

export const Description = styled.p`
margin - top: 10px;
font - size: 14px;
color: ${({ theme }) => theme.text};
`;

export const Caption = styled.div`
font - size: 14px;
margin - top: 10px;
color: ${({ theme }) => theme.text};
`;

export const CommentSection = styled.div`
font - size: 14px;
margin - top: 10px;
cursor: pointer;
color: ${({ theme }) => theme.text};
`;

export const LikeSection = styled.div`
display: flex;
align - items: center;
justify - content: space - between;
width: 100 %;
margin - bottom: 10px;
`;
export const ProfileDescription = styled.div<{ theme }>`
padding: 6px;
flex - direction: column;
justify - content: center;
align - items: center;
color: ${(props) => props.theme.text};
`;

const EventViewComponent = () => {
    const { themevars } = useTheme()
    const { data: friend, setFriend, getFriendData } = useSlice('friend')
    const { data: user } = useSlice('user')
    const { events: events } = useSlice('news')
    const { privateChats, publicChats: publicChats, getPublicChatsAction } = useSlice('chats');
    const { data: posts, setPosts } = useSlice('posts')
    const { images: images, avatars: avatars, setAvatars } = useSlice("images")
    const { data: friendPosts, setFriendPosts } = useSlice("friendPosts");
    const { eventid } = useParams()
    const navigate = useNavigate()



    return (

        <PostWrapper key={eventid} style={{ objectFit: "contain", }}>

            <StyledEditButton
                theme={themevars}
                style={{
                    width: "100%",
                    height: "6vh",
                    display: "flex",
                    alignItems: "stretch",
                    alignContent: "flex-start",
                    position: "fixed",
                    marginBottom: "4vh",
                    top: "0",
                    zIndex: "2000",
                    backdropFilter: "blur(10px)",
                    background: themevars.buttonBackground + "1A",

                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
                onClick={() => navigate("/" + events[eventid].owner)}
            >
                <div style={{ marginLeft: "15px" }}>
                    <ArrowBackIos style={{ alignSelf: "start" }} />
                </div>
            </StyledEditButton>
            <PostImage
                src={images[friendPosts[eventid].image] ? images[friendPosts[eventid].image].src : "/blankPicture.png"}
                alt={`Post ${eventid} `}
                style={{
                    width: "100vw",
                    maxWidth: "100%",
                    height: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",

                }}
            />
            <PosterContent>

                <CallToAction>
                    CALL
                </CallToAction>
            </PosterContent>

            <PostDetails style={{ padding: "10px 7px" }} >
                <UserSection>
                    <UserAvatar
                        src={avatars[friend.username].src ? avatars[friend.username].src : '/blankPicture.png'}
                        alt={`${friend.username} avatar`}
                        style={{}}
                    />
                    <ProfileDescription style={{ marginLeft: '25px' }}>
                        <UserName theme={themevars} onClick={() => navigate("../" + friend.username)}>
                            {friend.name}
                        </UserName>
                        <Typefield style={{ overflow: "hidden", maxWidth: "60vw", lineBreak: "strict", color: themevars.text }}>
                            {friendPosts[eventid].description}
                        </Typefield>
                    </ProfileDescription>
                </UserSection>
            </PostDetails>

        </PostWrapper >

    )
}

export default EventViewComponent