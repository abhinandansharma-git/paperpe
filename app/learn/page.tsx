'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Clock, BookOpen, Trophy, ChevronRight, Star, Users, BarChart2 } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Stock Market Basics',
    description: 'Learn the fundamentals of stock markets, how they work, and key terminology.',
    duration: '45 min',
    lessons: 8,
    level: 'Beginner',
    image: '📈',
    enrolled: 2340,
  },
  {
    id: 2,
    title: 'Technical Analysis 101',
    description: 'Master candlestick patterns, support/resistance, and trend identification.',
    duration: '2 hrs',
    lessons: 15,
    level: 'Beginner',
    image: '📊',
    enrolled: 1890,
  },
  {
    id: 3,
    title: 'Options Trading Fundamentals',
    description: 'Understand calls, puts, strike prices, expiry, and basic options strategies.',
    duration: '3 hrs',
    lessons: 20,
    level: 'Intermediate',
    image: '🎯',
    enrolled: 1560,
  },
  {
    id: 4,
    title: 'Risk Management',
    description: 'Learn position sizing, stop losses, and how to protect your capital.',
    duration: '1.5 hrs',
    lessons: 10,
    level: 'Beginner',
    image: '🛡️',
    enrolled: 2100,
  },
  {
    id: 5,
    title: 'Reading Option Chain',
    description: 'Decode OI, IV, PCR, and use option chain data to predict market direction.',
    duration: '2.5 hrs',
    lessons: 12,
    level: 'Intermediate',
    image: '🔍',
    enrolled: 980,
  },
  {
    id: 6,
    title: 'Intraday Trading Strategies',
    description: 'Proven strategies for day trading including ORB, VWAP, and momentum plays.',
    duration: '4 hrs',
    lessons: 25,
    level: 'Advanced',
    image: '⚡',
    enrolled: 750,
  },
];

const articles = [
  { title: 'What is Paper Trading?', readTime: '5 min', category: 'Basics' },
  { title: 'Top 5 Mistakes New Traders Make', readTime: '8 min', category: 'Tips' },
  { title: 'How to Build a Trading Plan', readTime: '10 min', category: 'Strategy' },
  { title: 'Understanding Market Volatility', readTime: '7 min', category: 'Concepts' },
];

export default function LearnPage() {
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = selectedLevel === 'All' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/charts" className="text-slate-400 hover:text-white">Charts</Link>
              <Link href="/options" className="text-slate-400 hover:text-white">Options</Link>
              <Link href="/learn" className="text-white font-medium">Learn</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#00C076]/10 to-transparent py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-[#00C076] text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            Learning Center
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learn to Trade Like a Pro
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Free courses and articles to help you master the markets. Learn at your own pace, practice risk-free.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: BookOpen, label: 'Courses', value: '12+' },
            { icon: Users, label: 'Students', value: '5,000+' },
            { icon: Clock, label: 'Hours of Content', value: '20+' },
            { icon: Star, label: 'Avg Rating', value: '4.8' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#141820] rounded-xl p-5 border border-white/5">
              <stat.icon className="w-5 h-5 text-[#00C076] mb-3" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Courses</h2>
            <div className="flex items-center gap-2">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedLevel === level
                      ? 'bg-[#00C076] text-white'
                      : 'bg-[#0D1117]/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden group hover:border-[#00C076]/50 transition-all cursor-pointer"
              >
                <div className="h-32 bg-gradient-to-br from-[#00C076]/20 to-blue-500/20 flex items-center justify-center text-5xl">
                  {course.image}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.level === 'Beginner' ? 'bg-[#00C076]/100/20 text-[#00C076]' :
                      course.level === 'Intermediate' ? 'bg-yellow-500/100/20 text-yellow-400' :
                      'bg-red-500/100/20 text-red-400'
                    }`}>
                      {course.level}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00C076] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{course.lessons} lessons</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.enrolled.toLocaleString()}
                      </span>
                    </div>
                    <button className="p-2 rounded-full bg-[#00C076]/20 text-[#00C076] group-hover:bg-[#00C076] group-hover:text-white transition-all">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {articles.map((article, i) => (
              <div
                key={i}
                className="bg-[#141820] rounded-xl p-5 border border-white/5 flex items-center justify-between group hover:border-[#00C076]/50 transition-all cursor-pointer"
              >
                <div>
                  <span className="text-xs text-[#00C076] mb-1 block">{article.category}</span>
                  <h3 className="text-white font-medium group-hover:text-[#00C076] transition-colors">
                    {article.title}
                  </h3>
                  <span className="text-sm text-slate-500 flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    {article.readTime} read
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#00C076] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
