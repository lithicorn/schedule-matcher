'use client';
import React, { useState, useEffect, useMemo } from 'react';

const getCalendarDays = (month: number, year: number): (number | null)[][] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days: (number | null)[] = Array(firstDay).fill(null).concat([...Array(daysInMonth).keys()].map((i) => i + 1));

  const weeks: (number | null)[][] = [];
  while (days.length) {
    weeks.push(days.splice(0, 7));
  }

  return weeks;
};

const months = [
  'September', 'October', 'November', 'December',
  'January', 'February', 'March', 'April', 'May',
];

interface CalendarGridProps {
  year: number;
  list: string[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ year, list }) => {
  const [highlightedDates, setHighlightedDates] = useState<Record<string, Record<string, string[]>>>({});

  // Memoize calendarData since it depends only on the year
  const calendarData = useMemo(() => {
    return months.map((month, index) => ({
      month,
      days: getCalendarDays((index + 8) % 12, year + Math.floor((index + 8) / 12)),
    }));
  }, [year]);

  // Fetch data whenever the list changes
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('/schedules.txt');
        if (!response.ok) throw new Error(`Failed to fetch dates. Status: ${response.status}`);

        const text = await response.text();
        const newDates: Record<string, Record<string, string[]>> = {};

        text.split('\n').forEach((line) => {
          const data = line.split('*');
          const college = data[0];
          if (list.includes(college)) {
            const datesString = data[1];
            const datePairs = datesString.split('@');
            datePairs.forEach((pair) => {
              const [start, end] = pair.split('!');
              if (start && end) {
                const startDate = new Date(start);
                startDate.setDate(startDate.getDate()+1);
                const endDate = new Date(end);
                endDate.setDate(endDate.getDate()+1);
                for (
                  let date = new Date(startDate);
                  date <= endDate;
                  date.setDate(date.getDate() + 1)
                ) {
                  const year = date.getFullYear();
                  const month = (date.getMonth() + 1).toString().padStart(2, '0');
                  const day = date.getDate().toString();
                  const key = `${year}-${month}`;

                  newDates[key] = newDates[key] || {};
                  newDates[key][day] = newDates[key][day] || [];
                  const collegeName = college.split('%')[0];
                  if (!newDates[key][day].includes(collegeName)) {
                    newDates[key][day].push(collegeName);
                  }
                }
              }
            });
          }
        });

        setHighlightedDates((prevDates) => ({...prevDates,...newDates}));
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
    };

    if (list.length > 0) {
      fetchDates();
    } else {
      setHighlightedDates({});
    }
  }, [list]);

  const isHighlighted = useMemo(() => {
    return (month: string, day: number): string[] | null => {
      const monthIndex = months.indexOf(month);
      const actualYear = year + Math.floor((monthIndex + 8) / 12);
      const actualMonth = ((monthIndex + 8) % 12 + 1).toString().padStart(2, '0');
      const key = `${actualYear}-${actualMonth}`;
      return highlightedDates[key]?.[day.toString()] || null;
    };
  }, [highlightedDates, year]);

  useEffect(() => {
    console.log("List updated:", list);
  }, [list]);  

  return (
    <div className="overflow-y-auto xl:overflow-hidden sm:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 p-3 text-black max-h-screen">
      {calendarData.map((monthData, index) => (
        <div key={index} className="border p-1 rounded-lg shadow-md mb-4 sm:mb-0 w-full sm:w-auto">
          <h3 className="text-center font-semibold text-lg">{monthData.month}</h3>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center">
            <div className="font-semibold">Sun</div>
            <div className="font-semibold">Mon</div>
            <div className="font-semibold">Tue</div>
            <div className="font-semibold">Wed</div>
            <div className="font-semibold">Thu</div>
            <div className="font-semibold">Fri</div>
            <div className="font-semibold">Sat</div>
            {monthData.days.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const colleges = day ? isHighlighted(monthData.month, day) : null;
                  const saturation = colleges ? colleges.length / (list.length || 1) : 0;

                  return (
                    <div
                      key={dayIndex}
                      className={`p-2 ${day ? 'cursor-pointer' : ''} ${colleges ? 'text-white' : 'bg-white'}`}
                      style={colleges ? { backgroundColor: `rgba(0, 128, 0, ${saturation})` } : {}}
                      title={colleges ? colleges.join(', ') : ''}
                    >
                      {day || ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
