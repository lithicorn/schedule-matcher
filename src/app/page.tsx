'use client'
import CollegeAutocomplete from "../components/CollegeAutocomplete";
import CalendarGrid from '../components/CalendarGrid';
import React, { useRef } from 'react';
import ActionMenu from '../components/ActionMenu';

const currentYear = new Date().getFullYear(); // Get the current year

export default function Home() {
  const calendarRef = useRef<HTMLDivElement | null >(null);
  return (
    <div className="min-h-screen pt-6 px-2 sm:px-4 lg:px-8 bg-white overflow-y-auto">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-4 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col gap-4 justify-center items-start lg:flex-row-reverse">
          {/* Right side: CollegeAutocomplete with proper spacing */}
          <div className="flex flex-col items-center sm:items-start w-full lg:w-1/3">
            <CollegeAutocomplete />
          </div>
          <div className="flex flex-col items-center">
            <ActionMenu toPic={calendarRef} />
          </div>
          {/* Left side: Calendar centered */}
          <div className="flex flex-col items-center w-full lg:w-full">
            {/* Ensure no scrolling, make calendar content fit and responsive */}
            <div ref={calendarRef} className="w-full h-full sm:max-h-[80vh]">
              <CalendarGrid year={currentYear} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
