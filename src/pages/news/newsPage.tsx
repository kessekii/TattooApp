import React, { useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FaSearch, FaHeart, FaComment, FaShare, FaEye } from 'react-icons/fa';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Box } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useTheme } from '../../state/providers/themeProvider'; // Assuming you have a theme provider
import { EditButton, PopupContent, PopupOverlay } from '../masterspage/masterPage';

// Styled components with theme access
const NewsFeedContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  width: 100%;
  max-width: 98%;
  margin: 0 auto;
  padding: 10px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const SearchBar = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 25px;
  border-color: ${({ theme }) => theme.buttonBackground};
  padding: 5px 10px;
  align-items: center;
  width: 70%;
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
  justify-content: space-between;
  margin: 15px 0;
  color: ${({ theme }) => theme.text};
`;

const Tab = styled.div<{ active: boolean }>`
  font-size: 14px;
  padding: 5px;
  color: ${({ theme, active }) => (active ? theme.text : theme.text)};
  cursor: pointer;
  ${({ active }) => active && 'border-bottom: 2px solid;'}
`;

const NewsCard = styled.div`
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const NewsThumbnail = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const NewsTitle = styled.h3<({ theme }) >`
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
  justify-content: space-between;
  margin-top: 10px;
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

const SlideTitle = styled.div<({ theme }) >`
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



const UploadInput = styled.input`
  display: block;
  margin-inline: auto;
  margin-bottom: 15px;
`;

const DescriptionInput = styled.textarea`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  max-width: 80%;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  resize: vertical; /* allows users to resize the textarea vertically */
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const DatePickerContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  max-width: 100%;
  margin: 0 0;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTextField = styled(TextField)`
  
  .MuiOutlinedInput-root {
  
    border-radius: 16px;
    padding: 10px;
    background: white;
    border: 1px solid ${({ theme }) => theme.background};
    font-size: 16px;
  }

  .MuiOutlinedInput-input {
    background: "white";
    font-size: 18px;
    color: ${({ theme }) => theme.text};
  }

  .MuiInputAdornment-root {
    font-size: 24px;
    background: ${({ theme }) => theme.buttonBackground};
    
    color: ${({ theme }) => theme.border};
  }

  & .MuiFormLabel-root {
    color: ${({ theme }) => theme.border};
    font-size: 14px;
  }

  & .Mui-focused .MuiFormLabel-root {
    color: ${({ theme }) => theme.buttonBackground};
  }

  & .Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.buttonBackground};
  }
`;

const NewsFeed: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'Watch OS7 the difference is like day and night',
      image: 'https://via.placeholder.com/300x150',
    },
    {
      id: 2,
      title: 'At 100 Days, Joe Biden Tries to Turn Luck Into Legacy',
      image: 'https://via.placeholder.com/300x150',
    },
    {
      id: 3,
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: 'https://via.placeholder.com/300x150',
    },
  ];

  const initialNews = {
    name: '',
    username: '',
    description: '',
    title: '',
    image: '',
    time: '',
    due: '',
    views: 0,
    likes: 0,
    comments: [{ author: '', text: '' }],
    shares: 0,
  };

  const [user, setUser] = useLocalStorage('user', null);
  const news = useTypedSelector((state) => state.news);
  const { themevars } = useTheme()
  const { makeEventAction, getNewsAction } = useActions();
  const [newEvent, setNewEvent] = useState(initialNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const handleDescriptionChange = (event) => {
    setNewEvent({ ...newEvent, description: event.target.value });
  };

  const handleTitleChange = (event) => {
    setNewEvent({ ...newEvent, title: event.target.value });
  };

  const handleDueChange = (event) => {
    setNewEvent({ ...newEvent, due: event.target.value });
  };

  const handleSaveEvent = () => {
    const newEventData = [{ ...newEvent, comments: [{ author: '', text: '' }], username: user.username, name: user.name, time: new Date() }];
    makeEventAction(newEventData);
    closeModal();
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideInterval = setInterval(() => {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: 100, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <NewsFeedContainer theme={themevars}>
      {/* Header */}
      <Header>
        <SearchBar>
          <FaSearch />
          <SearchInput placeholder="Search Sketches" />
        </SearchBar>
        <IconsContainer>
          <FaSearch />
          <FaHeart />
        </IconsContainer>
      </Header>

      {/* News Slider */}
      <SliderContainer ref={sliderRef}>
        {slides.map((slide) => (
          <Slide key={slide.id}>
            <SlideImage src={slide.image} alt={slide.title} />
            <SlideTitle>{slide.title}</SlideTitle>
          </Slide>
        ))}
      </SliderContainer>

      <AddEventButton onClick={openModal}>Add Event</AddEventButton>

      {isModalOpen && (
        <>
          <PopupOverlay  >
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
                    onChange={setSelectedDate}
                    renderInput={(params) => <StyledTextField  {...params} />




                    }
                  />
                </LocalizationProvider>
              </DatePickerContainer>

              <EditButton onClick={handleSaveEvent}>Save Event</EditButton>
            </PopupContent>
          </PopupOverlay>
        </>
      )
      }

      <Tabs>
        <Tab active={true}>Events</Tab>
        <Tab active={false}>Featured</Tab>
        <Tab active={false}>Friends</Tab>
      </Tabs>

      <NewsTitle>Featured work</NewsTitle>
      <NewsCard key="featured">
        <NewsThumbnail src="https://via.placeholder.com/600x400" alt="Featured" />
        <StatsContainer>
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
      </NewsCard>

      {/* News List */}
      {
        news && news.length > 0 && news.map((article) => (
          <NewsCard key={article.id}>
            <NewsThumbnail src={article.image} alt={article.title} />
            <NewsInfo>{article.time} | {article.category}</NewsInfo>
            <NewsTitle>{article.title}</NewsTitle>
            <StatsContainer>
              <Stat><FaEye /> {article.views}</Stat>
              <Stat><FaHeart /> {article.likes}</Stat>
              <Stat><FaComment /> {article.comments.length}</Stat>
              <Stat><FaShare /> {article.shares}</Stat>
            </StatsContainer>
          </NewsCard>
        ))
      }
    </NewsFeedContainer >
  );
};

export default NewsFeed;
