import Link from "next/link";

export default function MatchResultCard({ match }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-2 py-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:shadow-md">
      {/* Competition */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
        <span className="text-sm font-medium text-gray-500">{match.round}</span>

        <span className="text-sm font-medium text-gray-500">
          {match.competitionName || "[اسم البطولة]"}
        </span>
      </div>

      {/* Teams + Result */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Home */}
        <div className="flex flex-col items-center text-center">
          <img
            src={match.homeTeamFlag}
            alt={match.homeTeamName}
            className="w-10 h-10 object-cover rounded"
          />

          <h3 className="mt-2 font-semibold text-gray-800">
            {match.homeTeamName}
          </h3>
        </div>

        {/* Score */}
        {match.matchStatus === "Played" ? (
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold tracking-wider text-gray-900">
              {match.awayTeamGoals}
              <span className="mx-2 text-gray-400">-</span>
              {match.homeTeamGoals}

            </span>

            {match.extraTime && (
              <span className="mt-2 text-xs  rounded-full text-center">
                وقت إضافي 
                <br />
                {match.homeExtraTime} - {match.awayExtraTime}
              </span>
            )}

            {match.penalties && (
              <span className="mt-2 text-xs  rounded-full text-center">
                ركلات الترجيح 
                <br />
                {match.homePenalties} - {match.awayPenalties}
              </span>
            )}


            {/* <span className="mt-3 text-xs text-gray-500">
              {match.matchDate} - {match.stadium}
            </span> */}
          </div>
        ) : (
          <div>{new Date(match.matchTtimestamp).toLocaleTimeString('ar-EG' , {hour: '2-digit', minute: '2-digit'})}</div>
        )}

        {/* Away */}
        <div className="flex flex-col items-center text-center">
          <img
            src={match.awayTeamFlag}
            alt={match.awayTeamName}
            className="w-10 h-10 object-cover rounded border border-gray-100 shadow-sm"
          />

          <h3 className="mt-2 font-semibold text-gray-800">
            {match.awayTeamName}
          </h3>
        </div>
      </div>

      {/* Extra Info */}
      {/* <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{match.matchDate}</span>

        <span>{match.stadium}</span>
      </div> */}

      {/* Match Details */}
      {/* <Link
        href={`/results/${match.id}`}
        className="mt-5 block w-full text-center rounded-lg bg-gray-900 hover:bg-black text-white py-2.5 font-medium transition"
      >
        تفاصيل المباراة
      </Link> */}
    </div>
  );
}
