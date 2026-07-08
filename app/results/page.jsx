"use client"
import axios from "axios";
import MatchResultCard from "@/components/matchResultCard";
import { useEffect, useState } from "react";

const Page = () => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(`/api/results?tz=${userTimezone}&compId`);
        setData(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }

    };
    fetchResults();
  }, [userTimezone]);
  return (
    <div>
      <div className="mb-8">
        <h1 className="title">نتائج المباريات</h1>
        <p className="subtitle">مراجعة نتائج المباريات السابقة.</p>
      </div>

      <div className="space-y-10">
        {data.map((competition) => (
          <section key={competition.competitionId}>
            {/* Competition Title */}
            <div className="mb-5 flex items-center gap-3 ">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <h2 className="text-2xl font-bold">
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