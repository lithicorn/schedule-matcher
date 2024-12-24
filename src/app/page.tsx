import CollegeAutocomplete from "../components/CollegeAutocomplete";
import CalendarGrid from '../components/CalendarGrid';

const currentYear = new Date().getFullYear(); // Get the current year

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 flex flex-col gap-16 font-[family-name:var(--font-geist-sans)] bg-white">
      <div className="flex flex-row gap-8 justify-center items-start">
        {/* Left side: Calendar centered */}
        <div className="flex flex-col items-center">
          <CalendarGrid year={currentYear} />
        </div>

        {/* Right side: CollegeAutocomplete */}
        <div className="flex flex-col items-start w-80">
          <CollegeAutocomplete />
        </div>
      </div>
    </div>
  );
}
