'use client';
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';

interface CollegeAutocompleteProps {
  onQuery: (selectedColleges: string[]) => void;
}

const CollegeAutocomplete: React.FC<CollegeAutocompleteProps> = ({ onQuery }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [visibleColleges, setVisibleColleges] = useState<string[]>([]);
  const [US_COLLEGES, setColleges] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [encryptedKey, setEncryptedKey] = useState('');

  // Reversible encryption using Base64 encoding and decoding
  const encode = (text: string) => {
    return btoa((encodeURIComponent(text))); // Ensure proper encoding with escape sequence
  };

  const decode = (text: string) => {
    try {
      return decodeURIComponent((atob(text))); // Properly decode with escaping
    } catch (error) {
      console.error("Error decoding Base64 string:", error);
      return ''; // Return empty string if decoding fails
    }
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('/colleges.txt');
        if (!response.ok) {
          throw new Error(`Failed to fetch colleges. Status: ${response.status}`);
        }
        const text = await response.text();
        const colleges = text
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean);
        setColleges(colleges);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []);

  const handleAddCollege = () => {
    const college = US_COLLEGES.find((col) => col.split('%')[0] === inputValue);
    if (college && !selectedColleges.includes(college)) {
      const updatedColleges = [...selectedColleges, college];
      const updatedVisible = [...visibleColleges, college];
      const encodedCollege = encode(JSON.stringify({ visibleColleges: updatedVisible, visibility })); // Include visibility state
      setEncryptedKey(encodedCollege);
      console.log(encodedCollege);
      setSelectedColleges(updatedColleges);
      setVisibleColleges(updatedVisible);
      setVisibility((prev) => ({ ...prev, [college]: true }));
      setInputValue('');
      onQuery(updatedVisible); // Notify parent with visible colleges only
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

    const updatedVisible = visibleColleges.filter((college) => college !== removedCollege);

    setSelectedColleges(updatedColleges);
    const encodedCollege = encode(JSON.stringify({ visibleColleges: updatedVisible, visibility })); // Encode updated visible colleges with visibility
    setEncryptedKey(encodedCollege);
    setVisibleColleges(updatedVisible);

    console.log(encodedCollege);
    setVisibility((prev) => {
      const newVisibility = { ...prev };
      delete newVisibility[removedCollege];
      return newVisibility;
    });

    onQuery(updatedVisible); // Notify parent with updated visible colleges
  };

  const toggleVisibility = (college: string) => {
    setVisibility((prev) => {
      const isVisible = prev[college];
      const updatedVisibility = { ...prev, [college]: !isVisible };

      setVisibleColleges((current) => {
        if (!isVisible) {
          // Add the college to visibleColleges if it is now visible
          return current.includes(college) ? current : [...current, college];
        } else {
          // Remove the college from visibleColleges if it is now hidden
          return current.filter((item) => item !== college);
        }
      });
      const encodedCollege = encode(JSON.stringify({ visibleColleges, visibility: updatedVisibility })); // Include updated visibility in encryption
      setEncryptedKey(encodedCollege);
      return updatedVisibility;
    });
  };

  // Handle encrypted key entry by user
  const handleEncryptedKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEncryptedKey(event.target.value);
  };

  const handleDecryptAndLoad = () => {
    try {
      const decryptedData = decode(encryptedKey);
      const { visibleColleges, visibility } = JSON.parse(decryptedData);

      setSelectedColleges(visibleColleges);
      setVisibleColleges(visibleColleges);
      setVisibility(visibility);

      onQuery(visibleColleges);
    } catch (error) {
      console.error("Invalid encrypted key:", error);
    }
  };

  // Use useEffect to notify parent component about changes
  useEffect(() => {
    const encodedCollege = encode(JSON.stringify({ visibleColleges, visibility }));
    setEncryptedKey(encodedCollege);
    onQuery(visibleColleges); // Notify parent with the updated visible colleges
  }, [visibleColleges, visibility, onQuery]);

  return (
    <div className="w-full xl:w-[600px] mx-auto text-center pt-4">
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
            const [name, location] = college.split('%');
            return (
              <li
                {...props}
                key={college}
                className="p-2 pl-5 pr-5 flex justify-between cursor-pointer hover:bg-slate-200 text-sm lg:text-base"
              >
                <span>{name}</span>
                <span className="ml-1 justify-left text-sm text-gray-500 overflow-hidden whitespace-nowrap">
                  {location}
                </span>
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

      {/* Section to enter encrypted key code */}
      <div className="flex items-center justify-center mb-4">
        <TextField
          label="Enter Code"
          variant="outlined"
          value={encryptedKey}
          onChange={handleEncryptedKeyChange}
          className="w-full"
        />
        <button
          onClick={handleDecryptAndLoad}
          className="bg-orange-500 text-white font-medium py-2 px-4 rounded hover:bg-orange-600 ml-4"
        >
          Load
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
                  <span
                    className={`text-sm ${
                      !visibility[college] ? 'text-gray-300' : 'text-gray-500'
                    } overflow-hidden whitespace-nowrap`}
                  >
                    {location}
                  </span>
                  <IconButton
                    onClick={() => { toggleVisibility(college); }}
                    className="hover:bg-gray-200"
                  >
                    {visibility[college] ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => { handleRemoveCollege(index); }}
                    className="hover:bg-red-400"
                    color="error"
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
