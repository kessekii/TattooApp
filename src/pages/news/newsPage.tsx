import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { FaSearch, FaHeart, FaComment, FaShare, FaEye } from "react-icons/fa";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Box, Button } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useTheme } from "../../state/providers/themeProvider"; // Assuming you have a theme provider
import {
  EditButton,
  ImageGrid,
  PopupContent,
  PopupOverlay,
} from "../masterspage/masterPage";
import { getChatsByChatId, getNewsAction, getPostByPostId, getPostImageByPostId, makeEventAction } from "../../state/action-creators";
import { ProfilePage } from "../masterspage/masterPage";
import { useNavigate } from "react-router-dom";
import {
  getChatsByUserId,
  getPostsByUserId,
  getUserById,
} from "../../hooks/useChat";
import PullToRefresh from 'react-pull-to-refresh';
import useSlice from "../../hooks/useSlice";
// Styled components with theme access
const NewsFeedContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  width: 100%;

  color: ${(props) => props.theme.text};
  background: transparent;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: ${({ theme }) => theme.buttonBackground};
`;

const SearchBar = styled.div`
  display: flex;
  position: absolute;
  left: 10%;
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 25px;
  border-color: ${({ theme }) => theme.buttonBackground};

  align-items: center;
  width: 25%;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 5px;
  flex-grow: 1;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px 0 0 0;
  height: 40px;
  background: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.text};
`;

const Tab = styled.div<{ active: boolean }>`
  font-size: 14px;
  padding: 5px;

  margin-inline: 5%;
  color: ${({ theme, active }) => (active ? theme.text : theme.text)};
  cursor: pointer;
  ${({ active }) => active && "border-bottom: 2px solid;"}
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

const FeedImageContainer = styled.div`
  justify-content: center;
  display: flex;
`;

const NewsThumbnail = styled.img<any>`
  display: block;
  max-width: 44vw;
  max-height: 48vh;
  width: auto;
  height: auto;
  padding: 5px;
`;

const NewsTitle = styled.h3<{ theme }>`
  font-size: 16px;
  margin: 10px 0;
  color: ${(props) => props.theme.text};
`;

const NewsInfo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text};
`;

const StatsContainer = styled.div`
  display: flex;
  position: relative;
  background-color: ${({ theme }) => theme.buttonBackground};
  justify-content: space-evenly;
  align-items: center;
  height: 100%;

  font-size: 14px;
  color: ${({ theme }) => theme.border};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SliderContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  padding: 10px 0;
  width: 100%;
  scroll-behavior: smooth;
`;

const Slide = styled.div`
  flex: none;
  width: 300px;
  margin-right: 20px;
  scroll-snap-align: start;
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 10px;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const SlideTitle = styled.div<{ theme }>`
  padding: 10px;
  font-size: 14px;
  color: ${(props) => props.theme.text};
`;

const AddEventButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const NewsPageImageGrid = styled.div`
  display: grid;
  gap: 9px;
  grid-template-columns: repeat(2, 1fr);
`;

const NewsFeed = () => {
  const initialNews = {
    name: "",
    username: "",
    description: "",
    title: "",
    image: "",
    time: "",
    due: "",
    views: 0,
    likes: 0,
    comments: [{ author: "", text: "" }],
    shares: 0,
  };





  const navigate = useNavigate();
  const { themevars } = useTheme();
  const { events: events, posts: posts, setEvents, setNews } = useSlice("news");
  const { data: user, setUser } = useSlice("user");
  const [newEvent, setNewEvent] = useState(initialNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { publicChats: publicChats, setPostChats } = useSlice("chats");
  const { data: friendPosts, setFriendPosts } = useSlice("friendPosts");
  const [newsPosts, setNewsPosts] = useState<any>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewEvent({ ...newEvent, image: reader.result.toString() });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const handleFriendClick = async (name) => {
    try {
      if (name) {
        navigate("/" + name + "/portfolio");
      }
    } catch (e) {

    }
  };

  const handleDescriptionChange = (event) => {
    setNewEvent({ ...newEvent, description: event.target.value });
  };

  const handleTitleChange = (event) => {
    setNewEvent({ ...newEvent, title: event.target.value });
  };

  const handleDueChange = (event) => {
    setNewEvent({ ...newEvent, due: event.target.value });
  };

  // const handleSaveEvent = (userData: any = user) => {
  //   const newEventData = { ...newEvent, comments: [{ author: '', text: '' }], username: userData.username, name: userData.name, time: new Date() };
  //   makeEventAction(newEventData);
  //   closeModal();
  // };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideInterval = setInterval(() => {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 100, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(slideInterval);
  }, []);



  const sliderComponent = useMemo(() => Object.entries(events).map((value: [string, any]) => {

    return (
      < Slide key={value[0] + value[1].data.name} >
        <SlideImage src={value[1].data.icon} alt={value[1].data.desc} />
        <SlideTitle>{value[1].data.name}</SlideTitle>
      </Slide >)

  }), [events])
  const getImageData = async (id: string) => {
    const data = await getPostByPostId(id);
    const imageData = await getPostImageByPostId(id);

    const commentsData = await getChatsByChatId(data.chatId);

    const allData = Object.assign(
      {},
      {
        ...data,
        comments: commentsData.payload.messages.length,
        image: imageData.src,
      }
    );

    return { id: id, data: { ...allData } };
  };

  const handlePosts = async (posts: any) => {
    try {
      if (posts) {
        let arr = [];
        for (const pst of posts.comments) {

          const postsFull = await getImageData(pst);

          arr.push(postsFull);
        }

        setNewsPosts(arr);
        return arr;
      }
    } catch (e) {

    }
  };

  const handleRefresh = async () => {
    try {
      // Refetch the news data
      const refreshedNews = await getNewsAction(user.location) // You need to implement this function
      setNews(refreshedNews);

      // Refetch posts
      await handlePosts(refreshedNews);

      // Resolve the promise when refresh is complete
    } catch (error) {
      console.error("Error refreshing data:", error);
      // Resolve even if there's an error, to reset the pull-to-refresh state
    }
  }

  useEffect(() => {
    handlePosts(posts);
  }, []);

  useEffect(() => {

  }, [newsPosts]);

  const postsFeed = useMemo(
    () =>
      Object.values(newsPosts || {}).map((post: any) => (
        <NewsCard
          key={post.data.id}
          onClick={async (event) =>
            await handleFriendClick(post.data.user.name)
          }
        >
          <div
            style={{
              position: "relative",
              height: "90%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FeedImageContainer>
              <NewsThumbnail
                src={post.data.image}
                alt={post.data.description}
              />
            </FeedImageContainer>
          </div>

          <div
            style={{
              position: "relative",
              height: "10%",
              backgroundColor: themevars.buttonBackground,
            }}
          >
            <StatsContainer>
              <Stat>
                <FaComment /> {post.data.comments}
              </Stat>
              <Stat>
                <FaHeart /> {post.data.likes}
              </Stat>

              <Stat>
                <FaShare /> {post.data.shares}
              </Stat>
            </StatsContainer>
          </div>
        </NewsCard>
      )),
    [newsPosts]
  );

  return (
    <NewsFeedContainer theme={themevars}>
      <PullToRefresh onRefresh={async (): Promise<void> => handleRefresh()}>
        {/* Header */}
        <Header theme={themevars}>
          <SearchBar>
            <FaSearch />
            <SearchInput placeholder="Search Sketches" />
          </SearchBar>
          <IconsContainer>
            <FaSearch />
            <FaHeart />
          </IconsContainer>
        </Header>

        <SliderContainer ref={sliderRef}>
          {sliderComponent}
        </SliderContainer>

        {/* <AddEventButton onClick={openModal}>Add Event</AddEventButton> */}

        {isModalOpen && (
          <>
            {/* <PopupOverlay  >
            <PopupContent theme={themevars.popup}>
              <EditButton onClick={closeModal}>X</EditButton>
              <h3>Add New Event</h3>
              <UploadInput type="file" accept="image/*" onChange={handleFileChange} />
              <DescriptionInput
                rows={1}
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={handleTitleChange}
              />
              <DescriptionInput
                rows={4}
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={handleDescriptionChange}
              />
              <DatePickerContainer theme={themevars}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDueChange}
                    renderInput={(params) => <StyledTextField  {...params} />




                    }
                  />
                </LocalizationProvider>
              </DatePickerContainer>

              {/* <EditButton onClick={handleSaveEvent}>Save Event</EditButton> */}
            {/* </PopupContent>
    </PopupOverlay> * /} */}
          </>
        )}

        <Tabs theme={themevars}>
          <Tab active={true}>Events</Tab>
          <Tab active={false}>Featured</Tab>
          <Tab active={false}>Friends</Tab>
        </Tabs>



        {/* <NewsTitle>Featured work</NewsTitle>
      <NewsCard key="featured">
        {/* <NewsThumbnail
          src="https://via.placeholder.com/600x400"
          alt="Featured"
        /> */}
        {/* <StatsContainer>
          <Stat>
            <FaEye /> 0
          </Stat>
          <Stat>
            <FaHeart /> 0
          </Stat>
          <Stat>
            <FaComment /> 0
          </Stat>
          <Stat>
            <FaShare /> 0
          </Stat>
        </StatsContainer>
      </NewsCard> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NewsPageImageGrid>

            {postsFeed}
          </NewsPageImageGrid>
        </div>
      </PullToRefresh>
    </NewsFeedContainer>
  );
};

export default NewsFeed;
