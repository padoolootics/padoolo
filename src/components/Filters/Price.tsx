'use client';

import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

// Define the props for the PriceFilter component
interface PriceFilterProps {
  onPriceChange: (min: number, max: number) => void;
  minRange: number;
  maxRange: number;
  currentMin: number;
  currentMax: number;
}

// Inline PriceFilter component
const PriceFilter: React.FC<PriceFilterProps> = ({ onPriceChange, minRange, maxRange, currentMin, currentMax }) => {
  // MUI's Slider component handles both min and max values in a single state array
  const [value, setValue] = useState<number[]>([currentMin, currentMax]);
  
  // Update the local state when the parent state changes
  useEffect(() => {
    setValue([currentMin, currentMax]);
  }, [currentMin, currentMax]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const handleCommit = (event: React.SyntheticEvent | Event) => {
    onPriceChange(value[0], value[1]);
  };

  // Helper function to render the value label above the slider thumbs
  const valueLabelFormat = (value: number) => {
    return `€${value}`;
  };

  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">PRICE</h3>
      <Box sx={{ width: '100%', padding: '0 16px' }}>
        <Slider
          getAriaLabel={() => 'Price range'}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleCommit}
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
          min={minRange}
          max={maxRange}
          sx={{
            color: '#f97316',
            '& .MuiSlider-thumb': {
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
            '& .MuiSlider-track': {
              border: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#d1d5db',
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: '#1f2937',
            },
          }}
        />
      </Box>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Min: €{value[0]}</span>
        <span>Max: €{value[1]}</span>
      </div>
    </div>
  );
};

export default PriceFilter;