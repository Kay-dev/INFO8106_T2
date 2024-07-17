import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import { Input } from '@mui/material';

const EventSearchForm = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ searchTerm,searchType, startDate, endDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="p-4 grid gap-4 grid-cols-5 grid-rows-1">
                <div className="mb-4 flex items-center">
                    <label htmlFor="searchTerm" className=" text-gray-700">Name:</label>
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" name="searchTerm"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="mb-4 flex items-center">
                    <label htmlFor="searchTerm" className=" text-gray-700">Type:</label>
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        name="searchType"
                        className="border rounded w-full py-2 px-3 "
                    >
                        <option value="" label="--------Select type--------" />

                        <option value="Webinars">Webinars</option>
                        <option value="Public Lectures">Public Lectures</option>
                        <option value="Educational Seminars">Educational Seminars</option>
                        <option value="Hands-on Activities">Hands-on Activities</option>
                        <option value="Exhibitions">Exhibitions</option>
                    </select>
                </div>
                <div className="mb-4 flex items-center">
                    <label htmlFor="startDate" className=" text-gray-700">Start Date:</label>
                    <DatePicker
                        name="startDate"
                        selected={startDate}
                        onChange={setStartDate}
                        placeholderText="Start Date"
                        className="w-full"
                        slotProps={{
                            field: { clearable: true, onClear: () => setStartDate(null) },
                          }}
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <label htmlFor="endDate" className=" text-gray-700">End Date:</label>
                    <DatePicker
                        name="endDate"
                        selected={endDate}
                        onChange={setEndDate}
                        placeholderText="End Date"
                        className="w-full"
                        slotProps={{
                            field: { clearable: true, onClear: () => setEndDate(null) },
                          }}
                    />
                </div>
                <div className="mb-4 flex items-center justify-center">
                    <button type="submit"
                        className="w-1/2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold">Search</button>
                </div>
            </div>
        </form>
    );
};

export default EventSearchForm;