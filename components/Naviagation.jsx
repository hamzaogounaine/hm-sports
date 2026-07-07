"use client";
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [time, setTime] = useState('');

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
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  return (
    // 'dir="rtl"' automatically flips flex-row layout to start from the right
    <nav dir="rtl" className=" flex flex-col md:flex-row justify-between items-center bg-white px-8 py-4    w-full gap-4 md:gap-0">
      
      {/* 1. Right Side: Logo */}
      <div className="text-2xl font-bold text-gray-800 tracking-wide">
        <a href="#" className="hover:text-blue-600 transition-colors duration-200">
         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/UEFA_Champions_League_logo_no_text.svg/960px-UEFA_Champions_League_logo_no_text.svg.png" alt="logo" className="h-12 w-auto"     />
        </a>
      </div>

      {/* 2. Middle: Links */}
      <ul className="flex items-center gap-6 text-gray-600 font-medium">
        <li>
          <a href="/" className="hover:text-blue-600 transition-colors duration-200">
            الرئيسية
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-600 transition-colors duration-200">
            من نحن
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-600 transition-colors duration-200">
            الخدمات
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-600 transition-colors duration-200">
            اتصل بنا
          </a>
        </li>
      </ul>

      {/* 3. Left Side: Local Time */}
      <div className="bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-full border border-gray-200 text-sm min-w-[110px] text-center shadow-inner select-none">
        {time || '..:..:..'}
      </div>
      
    </nav>
  );
}