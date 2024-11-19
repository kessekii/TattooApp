import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Slider } from "@mui/material";
import styled from "styled-components";
import { addDays, eachDayOfInterval, format, isWeekend } from "date-fns";

// Styled components for the grid and buttons
const TimeGrid = styled(Grid)`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const TimeSlot = styled.div<{ selected: boolean }>`
  width: 8vw;
  height: 8vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected }) => (selected ? "#28a745" : "#f0f0f0")};
  color: ${({ selected }) => (selected ? "white" : "black")};
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#218838" : "#ddd")};
  }
`;

const SelectAllButton = styled(Button)`
  margin-top: 20px;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

const ClearAllButton = styled(Button)`
  margin-top: 10px;
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

const SaveButton = styled(Button)`
  margin-top: 20px;
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }
`;

const SliderContainer = styled(Box)`
  width: 80%;
  margin-top: 20px;
`;

const marks = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i.toString(),
}));

const hours = Array.from({ length: 24 }, (_, i) => i); // Array of hours from 0 (12 AM) to 23 (11 PM)

const daysOfWeek = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];
interface MasterCalendarProps {
  setScheduleUpdated: any; // Callback function to return the selected image
  setMasterDate: any;
}
const DateHourSelector: React.FC<MasterCalendarProps> = ({
  setScheduleUpdated,
  setMasterDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [hourRange, setHourRange] = useState<number[]>([0, 23]); // Min and Max hour
  const [hourOptions, setHourOptions] = useState<
    Array<{ value: number; label: string }>
  >([]);
  const [excludedDays, setExcludedDays] = useState<number[]>([]);

  // Handle hour selection
  const handleHourClick = (hour: number) => {
    if (hour < hourRange[0] || hour > hourRange[1]) return; // Ignore clicks outside the range
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter((h) => h !== hour)); // Deselect the hour
    } else {
      setSelectedHours([...selectedHours, hour]); // Select the hour
    }
  };

  // Handle selecting all hours within the range
  const handleSelectAllDay = () => {
    setSelectedHours(hours.map((hour: number) => hour)); // Select all hours
  };

  // Handle clearing all selections
  const handleClearAll = () => {
    setSelectedHours([]); // Clear all selections
  };

  // Handle saving the selection
  const handleSave = () => {
    if (selectedStartDate && selectedEndDate) {
      const dateRange = eachDayOfInterval({
        start: selectedStartDate,
        end: selectedEndDate,
      }).filter((date) => excludedDays.includes(date.getDay())); // Exclude days of the week

      setMasterDate({
        dates: dateRange.map((d) => d.toISOString().split("T")[0]),
        hours: selectedHours.map((hour: number) => hour.toString()),
      });


    }

    // Perform saving logic here (e.g., send data to backend)
    setScheduleUpdated(true);
  };

  const handleUpdateHours = (range: number[]) => {
    const ran = Array.from({ length: range[1] - range[0] + 1 }, (_, i) => ({
      value: i + range[0],
      label: (i + range[0]).toString(),
    }));
    return ran;
  };

  useEffect(() => {
    setHourOptions(handleUpdateHours(hourRange));
  }, [hourRange]);

  // Handle excluded days of the week
  const handleExcludedDaysChange = (day: number) => {
    if (excludedDays.includes(day)) {
      setExcludedDays(excludedDays.filter((d) => d !== day)); // Deselect day
    } else {
      setExcludedDays([...excludedDays, day]); // Select day
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <h2>Select Date Range and Available Hours</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Start and End Date Pickers */}
        <Box display="flex" flexDirection="row" alignItems="center">
          <DatePicker
            label="Start Date"
            value={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <Box sx={{ mx: 2 }}>to</Box>
          <DatePicker
            label="End Date"
            value={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>
      </LocalizationProvider>

      {/* Hour range selector */}
      <SliderContainer>
        <Typography gutterBottom>Select Hour Range</Typography>
        <Slider
          value={hourRange}
          onChange={(_, newValue) => setHourRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={23}
          marks={marks}
        />
      </SliderContainer>

      {/* Exclude days of the week */}
      <FormGroup row>
        {daysOfWeek.map((day) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={excludedDays.includes(day.value)}
                onChange={() => handleExcludedDaysChange(day.value)}
              />
            }
            label={day.label}
            key={day.value}
          />
        ))}
      </FormGroup>

      {/* Hour grid */}
      <TimeGrid container>
        {hourOptions.map((value) => (
          <TimeSlot
            key={value.label}
            selected={selectedHours.includes(value.value)}
            onClick={() => handleHourClick(value.value)}
          >
            {value.label}
          </TimeSlot>
        ))}
      </TimeGrid>

      {/* Buttons */}
      <SelectAllButton onClick={handleSelectAllDay}>
        Select All Day
      </SelectAllButton>
      <ClearAllButton onClick={handleClearAll}>Clear All</ClearAllButton>

      {selectedStartDate && selectedEndDate && (
        <SaveButton onClick={handleSave}>
          {selectedHours.length > 0
            ? "Save Available Hours"
            : "Save As Inavailble"}
        </SaveButton>
      )}
    </Box>
  );
};

export default DateHourSelector;
