"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function MonthlyCalendar({ exercises = [] }) {
  const [currentMonth] = useState(new Date());
  const [dailyProgress, setDailyProgress] = useState({});
  const [hasPosted, setHasPosted] = useState(false);

  const fetchProgress = async () => {
    const userId = localStorage.getItem("userId") || "demoUser";
    try {
      const res = await axios.get(`https://pcod-healthcare.onrender.com/api/progress/${userId}`);
      const newProgress = {};
      res.data.forEach((item) => {
        const formattedDate = new Date(item.date).toISOString().split("T")[0];
        newProgress[formattedDate] = item.completed ? 100 : 0;
      });
      setDailyProgress(newProgress);
    } catch (err) {
      console.error("❌ Failed to fetch progress:", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!exercises.length) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const currentDay = String(today.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${currentDay}`;

    const completedCount = exercises.filter((ex) => ex.completed).length;
    const progressPercentage = Math.round(
      (completedCount / exercises.length) * 100
    );

    setDailyProgress((prev) => ({
      ...prev,
      [dateKey]: progressPercentage,
    }));

    if (progressPercentage === 100 && !hasPosted) {
      const userId = localStorage.getItem("userId") || "demoUser";
      axios
        .post("https://pcod-healthcare.onrender.com/api/progress/complete", { userId })
        .then(() => {
          console.log("✅ Progress saved for today");
          setHasPosted(true);
          fetchProgress();
        })
        .catch((err) => console.error("❌ Error updating progress:", err));
    }
  }, [exercises]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: "", progress: -1 });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      const progress = Number(dailyProgress[dateKey]) || 0;

      days.push({
        day: i,
        progress,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getProgressColorClass = (progress) => {
    if (progress < 0) return "";
    if (progress === 0) return "bg-gray-100 text-gray-400";
    if (progress < 30) return "bg-purple-100 text-purple-800";
    if (progress < 70) return "bg-purple-300 text-purple-800";
    return "bg-purple-600 text-white font-bold border border-white shadow-md";
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300
              ${day.day ? getProgressColorClass(day.progress) : ""}`}
            title={day.progress >= 0 ? `Progress: ${day.progress}%` : ""}
          >
            {day.progress >= 100 ? (
              <span className="text-xl leading-none">✔</span>
            ) : (
              day.day
            )}
          </div>
        ))}
      </div>
    </div>
  );
}