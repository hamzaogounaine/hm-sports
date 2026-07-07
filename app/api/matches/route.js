import axios, { toFormData } from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getChannelMap } from "@/lib/channelId";
import { convertIocCode } from "convert-country-codes"; // Cleared the CommonJS "require" mix-up

export async function GET(req) {
    try {
        const headersList = await headers();
        const baseUrl = "https://prod-cmseventmanagement.beinsports.com/w2w/getWatch";
       

        const { searchParams } = new URL(req.url);
        const clientQueryTimezone = searchParams.get('tz');
        const compId = searchParams.get('compId') || null;
        
        const clientTimezone = 
            clientQueryTimezone || 
            headersList.get('x-vercel-ip-timezone') || 
            'Africa/Casablanca'; 
        
        const todayInClientZone = new Intl.DateTimeFormat('en-CA', {
            timeZone: clientTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date()); 

        const timeInClientZone = new Date().toLocaleTimeString('en-CA', {
            timeZone: clientTimezone, 
            hour: 'numeric',
            minute: "numeric",
            second: "numeric",
            hour12: false
        })

        // Performance Optimization: Run external requests concurrently
        const [apiResult, channelMap] = await Promise.all([
            axios.get(baseUrl, {
                params: {
                    "type": "page",
                    "page": 1,
                    "pageLimit": 30,
                    "desiredLanguage": "ar-mena",
                    "timezone": clientTimezone,
                    "eventDate": todayInClientZone,
                    "eventTime": timeInClientZone,
                    "sport": "soccer_data",
                    "comp_id": compId
                },
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ... Safari/537.36"
                }
            }),
            getChannelMap() // Fetches the gist list exactly ONCE per client call
        ]);

        if (apiResult.status !== 200) {
            return NextResponse.json({ message: "Failed to fetch today's matches" }, { status: apiResult.status });
        }

        const data = apiResult.data?.result;
        if (!data) {
            return NextResponse.json({ message: "No result array data" }, { status: 404 });
        }
        const todayData = Object.values(data)[0];
        todayData && todayData.sort((a , b) => a.channelName.localeCompare(b.channelName));
        if (!Array.isArray(todayData)) {
            return NextResponse.json({ message: "No match values found for today" }, { status: 200 });
        }

        // Remove duplicates by eventExternalId, preserving first occurrence
        const seen = new Set();
        const uniqueToday = [];
        for (const el of todayData) {
            const id = el?.eventTitle?.toLowerCase()?.trim() || el?.eventExternalId;
            if (!id || !el.channelName.toLowerCase().includes("max")) continue; // skip items without id
            if (seen.has(id)) continue;
            seen.add(id);
            uniqueToday.push(el);
        }

        const cleanData = uniqueToday.map((el) => {
            const homeIso = convertIocCode(el.homeTeamCode)?.iso2?.toLowerCase() || "un";
            const awayIso = convertIocCode(el.awayTeamCode)?.iso2?.toLowerCase() || "un";

            // Instant, synchronous lookups from our pre-fetched mapping object
            const targetChannel = channelMap[el.channelName] || null;

            return {
                eventTitle: el.eventTitle,
                isLive: el.isLive,
                channelName: el.channelName,
                competitionName: el.competitionName,
                homeTeamName: el.homeTeamName,
                awayTeamName: el.awayTeamName,
                round: el.round,
                matchTime: el.matchTime,
                homeTeamFlag: `https://flagcdn.com/${homeIso}.svg`,
                awayTeamFlag: `https://flagcdn.com/${awayIso}.svg`,
                watchSD: targetChannel?.sd || null,
                watchHD: targetChannel?.hd || null,
                watchFHD: targetChannel?.fhd || null,
                logoUrl : targetChannel?.logo_url || null
            };
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