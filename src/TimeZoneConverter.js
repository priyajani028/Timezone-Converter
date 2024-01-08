import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


const Card = styled.div`
  width: 600px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SliderContainer = styled.div`
  width: 550px;
`;

// const CardList = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `;

const CustomSlider = styled(Slider)`
  & .MuiSlider-track {
    display: none;
  }
  
  & .MuiSlider-markLabel {
    font-size: 10px;
  }
`;

const ZoneHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const DeleteButton = styled.button`
  position: relative;
  top: 5px;
  right: 5px;
  z-index: 1;
  color: red;
  cursor: pointer;
  border: none;
  padding: 6px;
  font-size: large;
  background-color: #FFF;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
`;

const Select = styled.select`
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  width: 100px;
`;

const TimeZoneConverter = () => {
  const [timeOffsets, setTimeOffsets] = useState({
    utc: 0,
    ict: 7,
    est: -5,
    pst: -8,
  });

  const [selectedTimeZone, setSelectedTimeZone] = useState('utc');
  const [selectedTimeZoneList, setSelectedTimeZoneList] = useState([
    { id: 'utc', name: 'UTC' },
    { id: 'ict', name: 'ICT' },
  ]);

  const handleTimeChange = (zone, newValue) => {
    const newTimeOffsets = { ...timeOffsets };
    newTimeOffsets[zone] = newValue;

    newTimeOffsets.ict = newTimeOffsets.utc + 7;
    newTimeOffsets.est = newTimeOffsets.ict - 7 - 5;
    newTimeOffsets.pst = newTimeOffsets.ict - 7 - 8;

    setTimeOffsets(newTimeOffsets);
  };

  const handleTimeZoneSelect = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  const handleAddTimeZone = () => {
    const newTimeZone = {
      id: selectedTimeZone,
      name: timeZoneInfo.find((info) => info.zone === selectedTimeZone)?.label,
    };
    setSelectedTimeZoneList([...selectedTimeZoneList, newTimeZone]);
  };

  const timeZoneInfo = [
    { zone: 'utc', label: 'UTC' },
    { zone: 'ict', label: 'ICT' },
    { zone: 'est', label: 'EST' },
    { zone: 'pst', label: 'PST' },
  ];

  const sliderMarks = Array.from({ length: 24 }).map((_, hour) => {
    const label = `${hour === 0 ? '12:00' : (hour % 12)}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    if (hour % 3 === 0 && hour < 24) {
      return { value: hour - 12, label };
    }
    return { value: hour - 12, label: '' };
  });

  const handleDeleteTimeZone = (id) => {
    setSelectedTimeZoneList((prevList) => prevList.filter((zone) => zone.id !== id));
  };

  return (
    <div>
      <h2>Time Zone Converter</h2>
      <div>
        <label>Select Time Zone: </label>
        <Select value={selectedTimeZone} onChange={handleTimeZoneSelect}>
          {timeZoneInfo.map((info) => (
            <option key={info.zone} value={info.zone}>
              {info.label}
            </option>
          ))}
        </Select>
        <AddButton onClick={handleAddTimeZone}>Add Time Zone</AddButton>
      </div>
      <div>
        <h3>Selected Time Zones:</h3>
        <div className="card-list">
          {selectedTimeZoneList.map((zone, index) => {
            const offset = timeOffsets[zone.id];
            const now = new Date(); // Current UTC time
            const timeZoneTime = new Date(now.getTime() + offset * 3600000);
  
            return (
              <Card key={`${zone.id}-${index}`}>
                <ZoneHeading>
                  <h4>{zone.name} Time</h4>
                  <DeleteButton onClick={() => handleDeleteTimeZone(zone.id)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </DeleteButton>
                </ZoneHeading>
                <SliderContainer>
                  <CustomSlider
                    value={timeOffsets[zone.id]}
                    onChange={(_, newValue) => handleTimeChange(zone.id, newValue)}
                    min={-12}
                    max={12}
                    step={1}
                    marks={sliderMarks}
                    // valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}:00`}
                  />
                </SliderContainer>
                <span>{`${timeOffsets[zone.id] >= 0 ? (timeOffsets[zone.id] === 0 ? '12:00' : (timeOffsets[zone.id] % 12 === 0 ? '12' : timeOffsets[zone.id] % 12) + ':00') : (timeOffsets[zone.id] === -12 ? '12:00' : (timeOffsets[zone.id] % 12 === 0 ? '12' : 12 + timeOffsets[zone.id] % 12) + ':00')} ${timeOffsets[zone.id] >= 0 ? 'PM' : 'AM'}`}</span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
  
};

export default TimeZoneConverter;