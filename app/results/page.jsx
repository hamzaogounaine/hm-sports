"use client"
import axios from "axios";
import MatchResultCard from "@/components/matchResultCard";
import { useEffect, useState } from "react";

const Page = () => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const dayToFetch = new Date(selectedDay);
        dayToFetch.setDate(dayToFetch.getDate() - 1);
        const { data } = await axios.get(
          `/api/results?tz=${userTimezone}&day=${dayToFetch.toLocaleDateString('en-CA', { timeZone: userTimezone, day: '2-digit', month: '2-digit', year: 'numeric' })}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }

    };
    fetchResults();
  }, [userTimezone, selectedDay]);

  if (loading) {
    return (
      <CardSkeleton />
    );
  }
  return (
    <div>
      <div className="mb-8">
        <h1 className="title">نتائج المباريات</h1>
        <p className="subtitle">مراجعة نتائج المباريات السابقة.</p>
      </div>


      <div className="mb-6 grid grid-cols-5 gap-4 text-center">
        {Array.from({ length: 5 }, (_, index) => {
          const day = new Date();
          day.setDate(day.getDate() - Math.floor(5 / 2) + index);
          const isSelected = selectedDay.getDate() === day.getDate();
          const isToday = new Date().getDate() === day.getDate();

          return (
            <div
              key={index}
              onClick={() => setSelectedDay(day)}
              className={`text-center rounded-lg p-2 cursor-pointer hover:bg-blue-100 transition-colors ${isSelected ? 'bg-blue-200 ' : 'bg-gray-100'}`}
            >
              <div className="text-xs">{day.toLocaleDateString('ar-EG', { timeZone: userTimezone, weekday: 'long' })}</div>
              <p className="text-lg font-bold">{isToday ? "اليوم" : day.toLocaleDateString('ar-EG', { timeZone: userTimezone, day: '2-digit', month: 'long' })}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-10">
        {data && data.length === 0 && (
          <div className="text-center">
            <p className="text-lg">لا توجد مباريات في هذا اليوم</p>
          </div>
        )}
        {data.map((competition) => (
          <section key={competition.competitionId}>
            {/* Competition Title */}
            <div className="mb-5 flex items-center gap-3 ">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <h2 className="text-lg font-bold">
                {competition.matches[0]?.competitionName}
              </h2>
            </div>

            {/* Matches */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
              {competition.matches.map((match) => (
                <MatchResultCard
                  key={match.match_id}
                  match={match}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Page;


const CardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1 rounded-full bg-gray-300" />
      <div className="h-6 w-1/4 rounded-full bg-gray-300" />
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 rounded-lg bg-gray-300" />
        ))}
      </div>
    </div>
  );
};