'use client'
import React, { useState, useEffect } from 'react';

// Utility function to generate calendar days for a given month and year
const getCalendarDays = (month: number, year: number): (number | null)[][] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the month
  const firstDay = new Date(year, month, 1).getDay(); // Get the first day of the month
  const days: (number | null)[] = [];

  // Fill in empty slots for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Group days into weeks (7 days per week)
  const weeks: (number | null)[][] = [];
  while (days.length) {
    weeks.push(days.splice(0, 7)); // Take 7 days to form a week
  }

  return weeks;
};

// Function to generate the month names for September to May
const months = [
  'September', 'October', 'November', 'December',
  'January', 'February', 'March', 'April', 'May'
];

interface CalendarGridProps {
  year: number;
}

interface CalendarData {
  month: string;
  days: (number | null)[][];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ year }) => {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);

  useEffect(() => {
    // Generate calendar data for each month from September to May
    const data = months.map((month, index) => {
      return {
        month,
        days: getCalendarDays(index + 8, year) // 8 + index to map September to May
      };
    });
    setCalendarData(data);
  }, [year]);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 text-black">
      {calendarData.map((monthData, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-md">
          <h3 className="text-center font-semibold text-lg">{monthData.month}</h3>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center">
            {/* Render Days of the Week */}
            <div className="font-semibold">Sun</div>
            <div className="font-semibold">Mon</div>
            <div className="font-semibold">Tue</div>
            <div className="font-semibold">Wed</div>
            <div className="font-semibold">Thu</div>
            <div className="font-semibold">Fri</div>
            <div className="font-semibold">Sat</div>

            {/* Render Weeks */}
            {monthData.days.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`p-2 ${day ? 'bg-white' : 'bg-transparent'} ${
                      day ? 'cursor-pointer' : ''
                    }`}
                  >
                    {day || ''}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
