import React, { useState } from 'react';
import { TextField, MenuItem, Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styled from 'styled-components';

// Mock available hours (can be fetched from an API)


const CalendarContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  max-width: 400px;
  margin: 0 auto;
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

interface CalendarComponentProps {

    setClosePopup: () => void;
    availableHours: any;// Define the type for the prop
    setClientDate: any;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ setClosePopup, availableHours, setClientDate }) => {

    console.log(availableHours);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        availableHours.forEach((element: any) => {
            console.log(element);
        });
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            console.log(formattedDate);
            // Get available times for the selected date
            const times = availableHours.filter((el: any) => el.date === formattedDate);
            console.log(times);
            setAvailableTimes(times[0]["hours"]);
            setSelectedTime(null); // Reset the time when a new date is selected
        }
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setSelectedTime(event.target.value.toString());
    };
    const handleSaveDate = () => {
        setClientDate({ time: selectedTime, date: selectedDate.toISOString().split('T')[0] });
        setClosePopup();
    };

    return (
        <CalendarContainer>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* Date Picker */}
                <DatePicker
                    label="Select a Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </LocalizationProvider>

            {/* Time Picker (Only shown if there are available times) */}
            {availableTimes.length > 0 && (
                <TextField
                    select
                    label="Select a Time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    fullWidth
                    margin="normal"
                >
                    {availableTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                            {time + ":00"}
                        </MenuItem>
                    ))}
                </TextField>
            )}

            {/* Display the Save Button if a time is selected */}
            {selectedTime && (
                <SaveButton onClick={() => handleSaveDate()}>Reserve Date</SaveButton>
            )}
        </CalendarContainer>
    );
};

export default CalendarComponent;
