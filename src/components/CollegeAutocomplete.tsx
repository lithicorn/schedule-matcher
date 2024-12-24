'use client'
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface College {
  name: string;
  location: string;
}

const CollegeAutocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [US_COLLEGES, setColleges] = useState<College[]>([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('\colleges.txt');
        if (!response.ok) {
          throw new Error(`Failed to fetch colleges. Status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Fetched Text:', text); // Log the raw text to check the contents
        const colleges = text
          .split('\n')
          .map((line) => {
            const [name, location] = line.split('%');
            return { name, location };
          })
          .filter((college) => college.name && college.location); // Only keep valid entries
        console.log('Parsed Colleges:', colleges); // Log the parsed colleges
        setColleges(colleges);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []); // Empty dependency array to run only once after the component mounts

  const handleAddCollege = () => {
    const college = US_COLLEGES.find((col) => col.name === inputValue);
    if (college && !selectedColleges.some((col) => col.name === college.name)) {
      setSelectedColleges([...selectedColleges, college]);
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddCollege();
    }
  };

  const handleRemoveCollege = (index: number) => {
    const updatedColleges = [...selectedColleges];
    updatedColleges.splice(index, 1);
    setSelectedColleges(updatedColleges);
  };

  return (
    <div className="w-[400px] mx-auto text-center">
      <div className="flex items-center justify-center mb-4">
        <Autocomplete<College>
          className="w-[400px]"
          options={US_COLLEGES}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          getOptionLabel={(college: College) => college.name} // Show only the college name in the input field
          renderOption={(props, college: College) => (
            <li {...props} className="ml-4 mr-2 mt-1 flex justify-between">
              <span>{college.name}</span>
              <span className="text-sm text-gray-500">{college.location}</span>
            </li>
          )}
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
        <Button
          onClick={handleAddCollege}
          className="bg-blue-500 text-black font-medium py-2 px-4 rounded hover:bg-blue-600 hover:text-white ml-4"
        >
          Add
        </Button>
      </div>
      <div className="mt-4 text-left text-black">
        <h3 className="font-bold mb-4">Selected Colleges:</h3>
        <ul>
          {selectedColleges.map((college, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <div className="flex flex-col">
                <strong>{college.name}</strong>
                <span className="text-sm text-gray-500">{college.location}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => alert('Feature not yet implemented!')}
                  className="bg-gray-200 text-black font-medium py-1 px-2 rounded hover:bg-gray-300"
                >
                  Hide/Show
                </Button>
                <Button
                  onClick={() => handleRemoveCollege(index)}
                  className="bg-red-500 text-white font-medium py-1 px-2 rounded hover:bg-red-600"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollegeAutocomplete;
