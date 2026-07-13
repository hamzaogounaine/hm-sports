"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // 'ar-EG' provides Eastern Arabic numerals (١٢:٣٠) 
      // Change to 'en-US' if you prefer Western numerals (12:30) with Arabic text
      setTime(
        now.toLocaleTimeString('en-CA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString('ar-EG', {
          day: 'numeric',
          month: 'long',
        })
      );
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className=" px-4">
      <nav dir="rtl" className="border-b-2 w-full flex flex-col md:flex-row justify-between items-center bg-white  py-4  mx-auto  gap-4 md:gap-0">

        {/* 1. Right Side: Logo */}
        <div className="text-2xl font-bold text-gray-800 tracking-wide">
          <a href="#" className="hover:text-blue-600 transition-colors duration-200">
            <Image src={"/hmsportslogo.png"} alt="logo" className="h-12 w-auto" width={70} height={100} />
          </a>
        </div>

        {/* 2. Middle: Links */}
        <ul className="flex items-center gap-6 text-gray-600 font-medium">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
              الرئيسية
            </Link>
          </li>
          <li>
            <Link href="/live" className="hover:text-blue-600 transition-colors duration-200">
              البت المباشر
            </Link>
          </li>

          <li>
            <Link href="/results" className="hover:text-blue-600 transition-colors duration-200">
              النتائج
            </Link>
          </li>
        </ul>

        {/* 3. Left Side: Local Time & Date */}
        <div className="border border-gray-200 shadow-sm shadow-black/20  px-4 py-2 rounded-md text-sm min-w-[140px] text-center select-none flex items-center justify-center gap-2">
          <span>{date}</span>
          <span className="text-gray-400">|</span>
          <span>{time || '..:..:..'}</span>
        </div>

      </nav>
    </div>
  );
}