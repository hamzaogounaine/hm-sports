import Link from "next/link";

export default function LiveMatchCard({ match }) {
  // Format the ISO time layout nicely into local Arabic time standard style
  const fullIsoString = `2026-07-06T${match.matchTime}`;
  const date = new Date(fullIsoString);

  const matchTime = date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  function getArabicDateLabel(dateInput) {
    if (!dateInput) return "";

    // 1. Get exact current day at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Calculate exactly tomorrow at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 3. Normalize the incoming match date to midnight
    const targetDate = new Date(dateInput);
    targetDate.setHours(0, 0, 0, 0);

    // 4. Compare timestamps
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) {
      return "اليوم"; // Today
    } else if (diffDays === 1) {
      return "غداً"; // Tomorrow
    } else {
      return targetDate.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
      });
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner: Round Name & Channel */}
      <div className="flex justify-between items-center text-xs text-gray-400 mb-4 border-b border-gray-50 pb-2">
        <span className="font-medium text-gray-500">{match.round}</span>
        <span className="">
          <img
            src={match.logoUrl}
            alt={match.channelName}
            className="w-full h-5 inline-block mr-1"
          />
        </span>
      </div>

      {/* Main Container: Teams & Score */}
      <div className="flex items-center justify-between">
        {/* Right Side: Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          <img
            src={match.homeTeamFlag}
            alt={match.homeTeamName}
            className="w-12 h-8 object-cover rounded shadow-sm border border-gray-100"
          />
          <span className="font-semibold text-gray-800 text-sm md:text-base">
            {match.homeTeamName}
          </span>
        </div>

        {/* Center: Live Status / Match Time */}
        <div className="flex flex-col items-center justify-center min-w-[110px] px-2">
          {match.isLive ? (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-600 animate-pulse mb-1">
              مباشر
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 mb-1">
              {getArabicDateLabel(match.matchDate)}
            </span>
          )}

          <span className="text-sm font-bold text-gray-700 tracking-wider bg-gray-50 px-3 py-1 rounded border border-gray-100 mt-1">
            {matchTime}
          </span>
        </div>

        {/* Left Side: Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1 text-center">
          <img
            src={match.awayTeamFlag}
            alt={match.awayTeamName}
            className="w-12 h-8 object-cover rounded shadow-sm border border-gray-100"
          />
          <span className="font-semibold text-gray-800 text-sm md:text-base">
            {match.awayTeamName}
          </span>
        </div>
      </div>

      {/* Bottom Action Section: Streaming Links */}
      <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-50">
        <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition-colors">
          <Link href={`/live/${match.watchFHD}`}>FHD</Link>
        </button>
        <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition-colors">
          <Link href={`/live/${match.watchHD}`}>HD</Link>
        </button>
        <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition-colors">
          <Link href={`/live/${match.watchSD}`}>SD</Link>
        </button>
      </div>
    </div>
  );
}
