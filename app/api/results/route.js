import axios, { toFormData } from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getChannelMap } from "@/lib/channelId";
import { convertIocCode } from "convert-country-codes"; // Cleared the CommonJS "require" mix-up

export async function GET(req) {
    try {
        const headersList = await headers();
        const baseUrl = "https://prod-cmseventmanagement.beinsports.com/score/getScorePageList";
       

        const { searchParams } = new URL(req.url);
        const clientQueryTimezone = searchParams.get('tz');
        const compId = searchParams.get('compId') || null;
        
        const clientTimezone = 
            clientQueryTimezone || 
            headersList.get('x-vercel-ip-timezone') || 
            'Africa/Casablanca'; 
        
        // Use the date two days before in the client's timezone
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        // const todayInClientZone = new Intl.DateTimeFormat('en-CA', {
        //     timeZone: clientTimezone,
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        // }).format(twoDaysAgo);

        const todayInClientZone = '2026-06-29'

        // const timeInClientZone = new Date().toLocaleTimeString('en-CA', {
        //     timeZone: clientTimezone, 
        //     hour: 'numeric',
        //     minute: "numeric",
        //     second: "numeric",
        //     hour12: false
        // })

        const timeInClientZone = "23:00:00"

        // Performance Optimization: Run external requests concurrently
        const apiResult = await axios.get(baseUrl, {
                params: {
                    "type": "page",
                    "page": 1,
                    "pageLimit": 30,
                    "desiredLanguage": "ar-mena",
                    "timezone": clientTimezone,
                    "eventDate": todayInClientZone,
                    "eventTime": timeInClientZone,
                    // "sport": "soccer_data",
                    "comp_id": compId,
                    "favouriteTeamIds" : "",
                    "section" : "calendar"
                },
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ... Safari/537.36"
                }
            })

       

        if (apiResult.status !== 200) {
            return NextResponse.json({ message: "Failed to fetch today's results" }, { status: apiResult.status });
        }

        const data = apiResult.data;
        if (!data) {
            return NextResponse.json({ message: "No result array data" }, { status: 404 });
        }
        
        const cleanData = Object.entries(data).map(([compId , matches]) => {
            console.log("matches", matches , 'com' , compId);
            const processedMatches = Object.entries(matches).map(([, match]) => {
                const homelogo = `https://prod-media.beinsports.com/image/${match.home_team_id}.png`
                const awaylogo = `https://prod-media.beinsports.com/image/${match.away_team_id}.png`

                return {
                    competitionName : match.competition_name,
                    competitionId : match.competition_id,
                    matchId : match.match_id,
                    matchName : match.match_name,
                    homeTeamName : match.home_team_name,
                    awayTeamName : match.away_team_name,
                    homeTeamFlag : homelogo,
                    awayTeamFlag : awaylogo,
                    homeTeamGoals : match.home_team_goals,
                    awayTeamGoals : match.away_team_goals,
                    matchDate : match.match_info.match_date,
                    matchTime : match.match_info.match_time,
                    matchTtimestamp : match.match_info.match_timestamp,
                    round : match.match_info.round,
                    penalties : match.match_info?.aggregate_score.pen?.home ? true : false,
                    homePenalties : match.match_info.aggregate_score.pen?.home || null,
                    awayPenalties : match.match_info.aggregate_score.pen?.away || null,
                    extraTime : match.match_info?.aggregate_score.et?.home ? true : false,
                    homeExtraTime : match.match_info.aggregate_score.et?.home || null,
                    awayExtraTime : match.match_info.aggregate_score.et?.away || null,
                    matchStatus : match.event_status,
                    liveTime : match.match_info.live_time  || null,
                }
            })

            return { competition_id: compId, matches: processedMatches };
    });

        return NextResponse.json(cleanData);

    } catch (error) {
        console.error("Global Route Crash Handler:", error.message);
        return NextResponse.json(
            { message: "Internal server error execution wrapper", error: error.message },
            { status: 500 }
        );
    }
}