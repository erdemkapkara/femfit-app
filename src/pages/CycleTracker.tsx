import React, { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import NumberScroller from '../components/NumberScroller';

interface CycleData {
  startDate: string;
  cycleLength: number;
  period: number;
}

const PHASE_COLORS: Record<string, string> = {
  Menstrual:  'bg-peach',
  Follicular: 'bg-yellow',
  Ovulation:  'bg-orange',
  Luteal:     'bg-sage',
};

const PHASE_DOT: Record<string, string> = {
  Menstrual:  'bg-peach',
  Follicular: 'bg-yellow',
  Ovulation:  'bg-orange',
  Luteal:     'bg-sage',
};

const PHASE_TIPS: Record<string, string> = {
  Menstrual:  'Rest & restore. Iron-rich foods help replenish energy.',
  Follicular: 'Energy rising — great for new challenges and social plans.',
  Ovulation:  'Peak strength & confidence. Ideal for high-intensity workouts.',
  Luteal:     'Steady focus. Prioritize sleep and complex carbs.',
};

const CycleTracker: React.FC = () => {
  const [cycleData, setCycleData] = useState<CycleData>({
    startDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    period: 5,
  });
  const [currentDay, setCurrentDay] = useState(1);
  const [popoverDate, setPopoverDate] = useState<string | null>(null);

  const getPhase = useCallback((day: number, cl: number, pl: number): string => {
    if (day <= pl) return 'Menstrual';
    if (day <= pl + 8) return 'Follicular';
    if (day <= pl + 13) return 'Ovulation';
    return 'Luteal';
  }, []);

  const calcCurrentDay = useCallback((data: CycleData) => {
    const start = new Date(data.startDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
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

  const handleQuickStart = () => {
    save({ ...cycleData, startDate: new Date().toISOString().split('T')[0] });
  };

  const getPhaseForDate = (date: Date): string => {
    const start = new Date(cycleData.startDate);
    const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const day = (((diff % cycleData.cycleLength) + cycleData.cycleLength) % cycleData.cycleLength) + 1;
    return getPhase(day, cycleData.cycleLength, cycleData.period);
  };

  // Build calendar data for a given year/month
  const buildMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay(); // 0=Sun
    const cells: (Date | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const prevYear  = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const currMonth = today.getMonth();
  const currYear  = today.getFullYear();

  const prevGrid = buildMonthGrid(prevYear, prevMonth);
  const currGrid = buildMonthGrid(currYear, currMonth);

  const MONTH_NAMES = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const currentPhase = getPhase(currentDay, cycleData.cycleLength, cycleData.period);
  const daysLeft = cycleData.cycleLength - currentDay;

  const renderMonthGrid = (grid: (Date | null)[], label: string, dimPast: boolean) => (
    <div className="flex-1 min-w-0">
      <p className="text-center text-sm font-bold text-charcoal mb-2">{label}</p>
      <div className="grid grid-cols-7 gap-px">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
        {grid.map((date, i) => {
          if (!date) return <div key={i} />;
          const phase = getPhaseForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          const dateStr = date.toISOString().split('T')[0];
          const isPast = dimPast && date < new Date(today.getFullYear(), today.getMonth(), 1);
          return (
            <div
              key={i}
              onClick={() => setPopoverDate(popoverDate === dateStr ? null : dateStr)}
              className={`relative flex items-center justify-center rounded-md cursor-pointer transition
                ${isToday ? 'ring-2 ring-sage bg-sage/10 font-bold' : 'hover:bg-gray-50'}
                ${isPast ? 'opacity-40' : ''}`}
              style={{ height: 36 }}
            >
              <span className={`text-xs ${isToday ? 'text-sage font-bold' : 'text-charcoal'}`}>
                {date.getDate()}
              </span>
              <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${PHASE_DOT[phase]}`} />
              {popoverDate === dateStr && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 bg-white rounded-lg shadow-lg border border-sage/20 p-2 w-36 text-center pointer-events-none">
                  <p className="text-xs font-bold text-charcoal">{phase}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{PHASE_TIPS[phase]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-6">Cycle Tracker</h1>

        {/* Compact current-day pill */}
        <div className={`rounded-2xl p-4 mb-6 ${PHASE_COLORS[currentPhase]}`}>
          <p className="text-white font-bold text-sm">
            Day {currentDay} of {cycleData.cycleLength} · {currentPhase} Phase · {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
          </p>
          <div className="mt-2 bg-white/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${(currentDay / cycleData.cycleLength) * 100}%` }}
            />
          </div>
          <p className="text-white/80 text-xs mt-1">{PHASE_TIPS[currentPhase]}</p>
        </div>

        {/* Quick Start + Settings side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Start */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-2">
                <Zap className="text-peach" size={20} />
                Quick Start
              </h2>
              <p className="text-gray-500 text-sm mb-4">Started your period today? Tap below to reset Day 1 to today.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleQuickStart}
                className="w-full bg-peach hover:bg-orange text-white px-6 py-3 rounded-xl font-bold transition text-sm"
              >
                Mark Today as Day 1
              </button>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Or pick a date</label>
                <input
                  type="date"
                  value={cycleData.startDate}
                  onChange={e => save({ ...cycleData, startDate: e.target.value })}
                  className="w-full border-2 border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cycle Settings */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-charcoal mb-4">Cycle Settings</h2>
            <div className="flex justify-around gap-4">
              <NumberScroller
                label="Cycle Length"
                value={cycleData.cycleLength}
                min={21}
                max={35}
                unit="d"
                onChange={v => save({ ...cycleData, cycleLength: v })}
              />
              <NumberScroller
                label="Period Length"
                value={cycleData.period}
                min={2}
                max={7}
                unit="d"
                onChange={v => save({ ...cycleData, period: v })}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">Scroll to adjust · saves automatically</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow p-6">
          {/* Phase legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-5">
            {Object.entries(PHASE_DOT).map(([phase, dotClass]) => (
              <div key={phase} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${dotClass}`} />
                <span className="text-xs text-gray-500">{phase}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-6 overflow-x-auto">
            {renderMonthGrid(prevGrid, `${MONTH_NAMES[prevMonth]} ${prevYear}`, true)}
            <div className="w-px bg-sage/20 self-stretch" />
            {renderMonthGrid(currGrid, `${MONTH_NAMES[currMonth]} ${currYear}`, false)}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">Click any day to see its phase</p>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;
