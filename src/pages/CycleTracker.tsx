import React, { useState, useEffect, useCallback } from 'react';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import NumberScroller from '../components/NumberScroller';

interface CycleData { startDate: string; cycleLength: number; period: number; }

const PHASE_COLORS: Record<string, string> = {
  Menstrual: 'bg-peach', Follicular: 'bg-yellow', Ovulation: 'bg-orange', Luteal: 'bg-sage',
};
const PHASE_DOT: Record<string, string> = {
  Menstrual: 'bg-peach', Follicular: 'bg-yellow', Ovulation: 'bg-orange', Luteal: 'bg-sage',
};
const PHASE_TEXT: Record<string, string> = {
  Menstrual: 'text-white', Follicular: 'text-charcoal', Ovulation: 'text-white', Luteal: 'text-white',
};
const PHASE_TIPS: Record<string, string> = {
  Menstrual:  'Rest & restore. Iron-rich foods help replenish energy.',
  Follicular: 'Energy rising — great for new challenges.',
  Ovulation:  'Peak strength & confidence. Best for intense workouts.',
  Luteal:     'Steady focus. Prioritize sleep and complex carbs.',
};
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const CycleTracker: React.FC = () => {
  const [cycleData, setCycleData] = useState<CycleData>({ startDate: new Date().toISOString().split('T')[0], cycleLength: 28, period: 5 });
  const [currentDay, setCurrentDay] = useState(1);
  const [popoverDate, setPopoverDate] = useState<string | null>(null);
  const [calendarOffset, setCalendarOffset] = useState(0); // 0=current month, -1=prev

  const getPhase = useCallback((day: number, cl: number, pl: number): string => {
    if (day <= pl) return 'Menstrual';
    if (day <= pl + 8) return 'Follicular';
    if (day <= pl + 13) return 'Ovulation';
    return 'Luteal';
  }, []);

  const calcCurrentDay = useCallback((data: CycleData) => {
    const diff = Math.floor((Date.now() - new Date(data.startDate).getTime()) / 86400000);
    return (((diff % data.cycleLength) + data.cycleLength) % data.cycleLength) + 1;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('femfit-cycle');
    if (saved) {
      const data = JSON.parse(saved) as CycleData;
      setCycleData(data);
      setCurrentDay(calcCurrentDay(data));
    }
  }, [calcCurrentDay]);

  const save = (data: CycleData) => {
    setCycleData(data);
    localStorage.setItem('femfit-cycle', JSON.stringify(data));
    setCurrentDay(calcCurrentDay(data));
  };

  const getPhaseForDate = (date: Date): string => {
    const diff = Math.floor((date.getTime() - new Date(cycleData.startDate).getTime()) / 86400000);
    const day = (((diff % cycleData.cycleLength) + cycleData.cycleLength) % cycleData.cycleLength) + 1;
    return getPhase(day, cycleData.cycleLength, cycleData.period);
  };

  const buildMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= lastDate; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const grid = buildMonthGrid(viewYear, viewMonth);

  const currentPhase = getPhase(currentDay, cycleData.cycleLength, cycleData.period);
  const daysLeft = cycleData.cycleLength - currentDay;

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen">

      {/* Phase header */}
      <div className={`${PHASE_COLORS[currentPhase]} px-4 pt-5 pb-5 sm:px-6`}>
        <div className="max-w-2xl mx-auto">
          <p className={`text-sm font-bold ${PHASE_TEXT[currentPhase]} opacity-80 mb-1`}>Current Phase</p>
          <h1 className={`text-2xl font-bold ${PHASE_TEXT[currentPhase]} mb-2`}>{currentPhase} Phase</h1>
          <p className={`text-sm ${PHASE_TEXT[currentPhase]} opacity-80 mb-3`}>
            Day {currentDay} of {cycleData.cycleLength} · {daysLeft} days left
          </p>
          <div className="bg-white/30 rounded-full h-2 max-w-xs">
            <div className="bg-white h-2 rounded-full" style={{ width: `${(currentDay / cycleData.cycleLength) * 100}%` }} />
          </div>
          <p className={`text-xs mt-2 ${PHASE_TEXT[currentPhase]} opacity-75`}>{PHASE_TIPS[currentPhase]}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Quick Start + Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quick Start */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
            <h2 className="text-base font-bold text-charcoal flex items-center gap-2 mb-2">
              <Zap size={18} className="text-peach" />Quick Start
            </h2>
            <p className="text-xs text-gray-500 mb-4">Period started today? Reset Day 1.</p>
            <button
              onClick={() => save({ ...cycleData, startDate: new Date().toISOString().split('T')[0] })}
              className="w-full bg-peach hover:bg-orange active:scale-98 text-white py-3 rounded-xl font-bold text-sm transition-all"
            >
              Mark Today as Day 1
            </button>
            <div className="mt-3">
              <label className="block text-xs font-bold text-charcoal mb-1">Or pick a date</label>
              <input
                type="date"
                value={cycleData.startDate}
                onChange={e => save({ ...cycleData, startDate: e.target.value })}
                className="w-full border border-sage/30 rounded-xl px-3 py-2 text-sm focus:border-sage outline-none"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-sage/10">
            <h2 className="text-base font-bold text-charcoal mb-4">Cycle Settings</h2>
            <div className="flex justify-around">
              <NumberScroller
                label="Cycle"
                value={cycleData.cycleLength}
                min={21} max={35} unit="d"
                onChange={v => save({ ...cycleData, cycleLength: v })}
              />
              <NumberScroller
                label="Period"
                value={cycleData.period}
                min={2} max={7} unit="d"
                onChange={v => save({ ...cycleData, period: v })}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Scroll to adjust</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-sage/10">
          {/* Phase legend */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {Object.entries(PHASE_DOT).map(([phase, dot]) => (
              <div key={phase} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                <span className="text-xs text-gray-500">{phase}</span>
              </div>
            ))}
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCalendarOffset(o => o - 1)}
              className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition"
            >
              <ChevronLeft size={18} className="text-charcoal" />
            </button>
            <p className="font-bold text-charcoal text-sm">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </p>
            <button
              onClick={() => setCalendarOffset(o => Math.min(o + 1, 0))}
              className={`p-2 rounded-lg transition ${calendarOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'}`}
              disabled={calendarOffset === 0}
            >
              <ChevronRight size={18} className="text-charcoal" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {grid.map((date, i) => {
              if (!date) return <div key={i} />;
              const phase = getPhaseForDate(date);
              const isToday = date.toDateString() === today.toDateString();
              const dateStr = date.toISOString().split('T')[0];
              return (
                <div
                  key={i}
                  onClick={() => setPopoverDate(popoverDate === dateStr ? null : dateStr)}
                  className={`relative flex items-center justify-center rounded-xl cursor-pointer transition-all active:scale-95 mx-0.5 ${
                    isToday ? 'ring-2 ring-sage bg-sage/10' : 'hover:bg-gray-50'
                  }`}
                  style={{ height: 36 }}
                >
                  <span className={`text-xs ${isToday ? 'text-sage font-bold' : 'text-charcoal'}`}>
                    {date.getDate()}
                  </span>
                  <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${PHASE_DOT[phase]}`} />

                  {popoverDate === dateStr && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 bg-white rounded-xl shadow-xl border border-sage/20 p-2.5 w-36 text-center pointer-events-none">
                      <p className="text-xs font-bold text-charcoal">{phase}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{PHASE_TIPS[phase]}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">Tap any day to see its phase</p>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;
