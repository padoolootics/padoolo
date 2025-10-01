'use client';

import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import SortIcon from '@mui/icons-material/Sort';


// New inline component for the sorting dropdown
interface SortDropdownProps {
    onSortChange: (sortValue: string) => void;
    currentSort: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange, currentSort }) => {
    const sortOptions = [
        { value: 'default', label: 'Featured' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
    ];

    const handleChange = (event: SelectChangeEvent) => {
        onSortChange(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                    labelId="sort-label"
                    id="sort-select"
                    value={currentSort}
                    label="Sort By"
                    onChange={handleChange}
                    IconComponent={SortIcon}
                    sx={{
                        '& .MuiSelect-select': {
                            paddingRight: '32px !important',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgb(209 213 219)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f97316',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f97316',
                            borderWidth: '2px',
                        },
                    }}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};


export default SortDropdown;