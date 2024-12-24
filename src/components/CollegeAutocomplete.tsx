'use client';
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';

const CollegeAutocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [US_COLLEGES, setColleges] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('/colleges.txt');
        if (!response.ok) {
          throw new Error(`Failed to fetch colleges. Status: ${response.status}`);
        }
        const text = await response.text();
        console.log(text);
        const colleges = text
          .split('\n')
          .map(line => line.trim()).filter(Boolean);
        setColleges(colleges);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []);

  const handleAddCollege = () => {
    const college = US_COLLEGES.find((col) => col.split('%')[0] === inputValue);
    if (college && !selectedColleges.some((col) => col === college)) {
      setSelectedColleges([...selectedColleges, college]);
      setVisibility((prev) => ({...prev, [college]: true}));
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddCollege();
    }
  };

  const handleRemoveCollege = (index: number) => {
    const removedCollege = selectedColleges[index];
    const updatedColleges = [...selectedColleges];
    updatedColleges.splice(index, 1);
    setSelectedColleges(updatedColleges);

    setVisibility((prev) => {
      const newVisibility = { ...prev };
      delete newVisibility[removedCollege.split('%')[0]];
      return newVisibility;
    });
  };

  const toggleVisibility = (collegeId: string) => {
    setVisibility((prev) => ({
      ...prev,
      [collegeId]: !prev[collegeId],
    }));
  };

  return (
    <div className="w-full xl:w-[600px] mx-auto text-center pt-4">
      {/* "w-full max-w-[600px] mx-auto text-center pt-4" style={{ height: '60vh' }} */}
      <div className="flex items-center justify-center mb-4">
        <Autocomplete
          freeSolo
          className="w-full"
          options={US_COLLEGES}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue.split('%')[0]);
          }}
          renderOption={(props, college) => {
            // Split the string into name and location
            const [name, location] = college.split('%');
            return (
              <li {...props} className="p-2 pl-5 pr-5 flex justify-between cursor-pointer hover:bg-slate-200 text-sm lg:text-base">
                <span>{name}</span> {/* Display college name */}
                <span className="ml-1 justify-left text-sm text-gray-500 overflow-hidden whitespace-nowrap">
                  {location}
                </span> {/* Display college location */}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter College Name"
              variant="outlined"
              onKeyUp={handleKeyPress}
              className="w-full"
            />
          )}
        />
        <button
          onClick={handleAddCollege}
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 ml-4"
        >
          Add
        </button>
      </div>
      <div className="mt-4 text-left text-black">
        <h3 className="font-bold mb-4 text-2xl">Selected Colleges:</h3>
        <ul>
        {selectedColleges.map((college, index) => {
          const [name, location] = college.split('%');
          return (
            <li key={college} className="flex justify-between items-center mb-4">
              <div className={`w-full ${!visibility[college] ? 'text-gray-400' : ''}`}>
                <strong>{name}</strong>
              </div>
              <div className="flex items-center space-x-2 w-auto ml-2">
                {/* Align the location next to the visibility toggle button */}
                <span className={`text-sm ${!visibility[college] ? 'text-gray-300' : 'text-gray-500'} overflow-hidden whitespace-nowrap`}>
                  {location}
                </span>
                <IconButton
                  onClick={() => toggleVisibility(college)}
                  className="hover:bg-gray-200"
                >
                  {visibility[college] ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveCollege(index)}
                  className="hover:bg-red-400" color="error"
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
};

export default CollegeAutocomplete;
