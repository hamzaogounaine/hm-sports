"use client";
import { LeagueTabsCarousel } from '@/components/leaguesCarousel';
import LiveMatchCard from '@/components/matchLiveCard';
import axios from 'axios';
import Link from 'next/link';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';


export default function FootballDashboard() {
  const [activeTab, setActiveTab] = useState('');
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaguesData, setLeaguesData] = useState([]);

  useEffect(() => {
    const fetchLeagues = async () => {
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_LEAGUES_GIST_URL);
      const data = res.data;
      console.log(data);
      setLeaguesData(data);
      if (data && data.length > 0) {
        setActiveTab(data[0].id); // Set the first league as active by default
      }
    }
    catch (err) {
      alert("فشل في جلب بيانات البطولات. يرجى التحقق من الاتصال بالإنترنت أو إعادة تحميل الصفحة.");
    }
  }
  fetchLeagues();
  },[])

  // 1. Fetch data from your API
  useEffect(() => {
    setAllMatches([]); // Clear previous matches when switching tabs
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await fetch(`/api/matches?tz=${userTimezone}&compId=${activeTab}`);
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات من الخادم');
        }
        const data= await response.json();
        setAllMatches(data);
      } catch (err) {
        setError(err.message || 'حدث خطأ ما');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [activeTab]);

  

  return (
    
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="title">جدول المباريات الحية</h1>
          <p className="subtitle">تحديث مباشر من خادم المباريات الخاص بك.</p>
        </div>

        {/* Navigation Tabs */}
       <LeagueTabsCarousel leagues={leaguesData} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Error State View */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 mb-6">
            {error}
          </div>
        )}

        {/* Match Cards View Grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : allMatches.length > 0 ? (
            allMatches.map((match, idx) => (
              <LiveMatchCard key={idx} match={match} />
            ))
          ) : (
            <div className="col-span-full bg-white text-center py-12 rounded-xl border border-gray-100 text-gray-400">
              لا توجد مباريات جارية أو مجدولة لهذه البطولة حالياً.
            </div>
          )}
        </div>
        {/* <Script id="hpf-options" dangerouslySetInnerHTML={{ __html: `var atOptions = { 'key': 'ee49a8835202837a363d4973801d4936', 'format': 'iframe', 'height': 90, 'width': 728, 'params': {} };` }} />
        <Script src="https://www.highperformanceformat.com/ee49a8835202837a363d4973801d4936/invoke.js" strategy="afterInteractive" /> */}


      </div>
  );
}

/* --- Components --- */

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-12 h-8 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 px-4 min-w-[120px]">
        <div className="h-3 bg-gray-200 rounded w-12"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-12 h-8 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
      </div>
    </div>
  );
}

