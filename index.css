import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Sparkles, BookOpen, Compass, Heart, Coins, Briefcase, 
  ShieldAlert, Activity, User, Trash2, Save, ArrowRight, Info, AlertCircle,
  HelpCircle, ChevronRight, Moon, Sun, ShieldCheck, Smile, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaziChart, MonthlyFlowData, STEM_ELEMENT, BRANCH_ELEMENT } from './utils/bazi';

interface SavedProfile {
  id: string;
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  isLunar: boolean;
  gender: 'male' | 'female';
}

interface MoodCheckIn {
  id: string;
  profileName: string;
  date: string;
  score: number;
  moodLabel: string;
  note: string;
}

const DEFAULT_PROFILES: SavedProfile[] = [
  {
    id: 'sample-1',
    name: '张明（甲木身弱示例）',
    year: 1993,
    month: 10,
    day: 15,
    hour: 10,
    minute: 30,
    isLunar: false,
    gender: 'male'
  },
  {
    id: 'sample-2',
    name: '李静（丁火身强示例）',
    year: 1988,
    month: 5,
    day: 20,
    hour: 14,
    minute: 15,
    isLunar: false,
    gender: 'female'
  }
];

// Classic encouraging quotes displayed randomly during fortune calculation
const ZEN_PHRASES = [
  "天行健，君子以自强不息；地势坤，君子以厚德载物。",
  "正在测度天地干支运转，推求五行中和造化之美...",
  "冲刑合化皆有机缘，明灯高树，顺水行舟...",
  "生克变易无常，知命者不怨天，知己者不怨人。",
  "正在排演十神运律（财、官、印、比、食），寻求当月用神气场...",
  "流年大运交织，不偏不倚，心平气和即是好运之处。"
];

export default function App() {
  // Input fields state
  const [profileName, setProfileName] = useState('访客命盘');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthYear, setBirthYear] = useState<number>(1995);
  const [birthMonth, setBirthMonth] = useState<number>(6);
  const [birthDay, setBirthDay] = useState<number>(18);
  const [birthHour, setBirthHour] = useState<number>(10);
  const [birthMinute, setBirthMinute] = useState<number>(0);
  const [isLunar, setIsLunar] = useState(false);

  // Target Year and Month to calculate forecast
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [targetMonth, setTargetMonth] = useState<number>(4); // Default to April 2026 (yellow calendar video reference!)

  // UI state
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'fortune' | 'dictionary'>('fortune');
  const [dictCategory, setDictCategory] = useState<'five-elements' | 'ten-gods' | 'clashes' | 'muku'>('five-elements');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  
  // Storage State
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Results state
  const [baziChart, setBaziChart] = useState<BaziChart | null>(null);
  const [monthlyFlow, setMonthlyFlow] = useState<MonthlyFlowData | null>(null);
  const [fortuneReport, setFortuneReport] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Daily check-in state
  const [checkInDate, setCheckInDate] = useState('2026-06-16');
  const [checkInScore, setCheckInScore] = useState<number>(80);
  const [checkInLabel, setCheckInLabel] = useState('温和舒适');
  const [checkInNote, setCheckInNote] = useState('');
  const [allCheckIns, setAllCheckIns] = useState<MoodCheckIn[]>([]);

  // Load profile list on mount
  useEffect(() => {
    const list = localStorage.getItem('bazi_profiles');
    if (list) {
      setSavedProfiles(JSON.parse(list));
    } else {
      setSavedProfiles(DEFAULT_PROFILES);
      localStorage.setItem('bazi_profiles', JSON.stringify(DEFAULT_PROFILES));
    }

    const checkinsGroup = localStorage.getItem('bazi_checkins');
    if (checkinsGroup) {
      try {
        setAllCheckIns(JSON.parse(checkinsGroup));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Automatically perform a calculation for the current input
    handlePerformCalculate();

    // Setup default date
    setCheckInDate(getTodayString());
  }, []);

  // Set randomized quote shifts during loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % ZEN_PHRASES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const selectProfile = (p: SavedProfile) => {
    setProfileName(p.name);
    setGender(p.gender);
    setBirthYear(p.year);
    setBirthMonth(p.month);
    setBirthDay(p.day);
    setBirthHour(p.hour);
    setBirthMinute(p.minute);
    setIsLunar(p.isLunar);

    // Auto-calculate immediately on select
    setTimeout(() => {
      triggerFormCalculate(p);
    }, 100);
  };

  const handleCreateProfile = () => {
    if (!profileName.trim()) {
      alert("请输入缘主姓名以保存盘面");
      return;
    }
    const newProfile: SavedProfile = {
      id: `profile-${Date.now()}`,
      name: profileName,
      gender,
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      hour: birthHour,
      minute: birthMinute,
      isLunar
    };
    const updated = [...savedProfiles.filter(p => p.id !== 'sample-1' && p.id !== 'sample-2'), newProfile];
    // Keep standard samples
    const fullList = [...DEFAULT_PROFILES, ...updated];
    setSavedProfiles(fullList);
    localStorage.setItem('bazi_profiles', JSON.stringify(fullList));
    alert(`盘面 [${profileName}] 保存成功！`);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === 'sample-1' || id === 'sample-2') {
      alert("内置科研命例不可删除");
      return;
    }
    const filtered = savedProfiles.filter(p => p.id !== id);
    setSavedProfiles(filtered);
    localStorage.setItem('bazi_profiles', JSON.stringify(filtered));
  };

  const getTodayString = () => {
    try {
      const d = new Date();
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - (offset * 60 * 1000));
      if (local.getFullYear() === 2026) {
        return local.toISOString().split('T')[0];
      }
    } catch (e) {}
    return "2026-06-16";
  };

  const handleAddCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInNote.trim()) {
      alert("请输入今日运势感悟/内心笔记！");
      return;
    }

    const newEntry: MoodCheckIn = {
      id: `checkin-${profileName || '访客'}-${checkInDate}`,
      profileName: profileName || '访客命盘',
      date: checkInDate,
      score: checkInScore,
      moodLabel: checkInLabel,
      note: checkInNote
    };

    let updated = allCheckIns.filter(
      item => !(item.profileName === newEntry.profileName && item.date === newEntry.date)
    );
    updated = [...updated, newEntry].sort((a, b) => b.date.localeCompare(a.date));

    setAllCheckIns(updated);
    localStorage.setItem('bazi_checkins', JSON.stringify(updated));
    setCheckInNote('');
    alert(`📅 ${checkInDate} 心境记录成功！`);
  };

  const handleDeleteCheckIn = (id: string) => {
    if (confirm("确定要删除这篇心境随记吗？")) {
      const updated = allCheckIns.filter(item => item.id !== id);
      setAllCheckIns(updated);
      localStorage.setItem('bazi_checkins', JSON.stringify(updated));
    }
  };

  const triggerFormCalculate = async (customP?: SavedProfile) => {
    setLoading(true);
    setErrorMessage(null);
    setWarningMessage(null);
    setPhraseIndex(0);

    const py = customP ? customP.year : birthYear;
    const pm = customP ? customP.month : birthMonth;
    const pd = customP ? customP.day : birthDay;
    const ph = customP ? customP.hour : birthHour;
    const pmin = customP ? customP.minute : birthMinute;
    const pl = customP ? customP.isLunar : isLunar;

    try {
      const response = await fetch('/api/bazi/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: py,
          month: pm,
          day: pd,
          hour: ph,
          minute: pmin,
          isLunar: pl,
          targetYear,
          targetMonth
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "获取批算报告失败，请检查服务设置");
      }

      setBaziChart(data.chart);
      setMonthlyFlow(data.flow);
      setFortuneReport(data.fortune);
      if (data.warning) {
        setWarningMessage(data.warning);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "请求服务器出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handlePerformCalculate = () => {
    triggerFormCalculate();
  };

  // Chinese standard hour names mapping (十二时辰)
  const getShichenLabel = (h: number) => {
    if (h >= 23 || h < 1) return '子时 (23:00-01:00) - 属于水';
    if (h >= 1 && h < 3) return '丑时 (01:00-03:00) - 属于土';
    if (h >= 3 && h < 5) return '寅时 (03:00-05:00) - 属于木';
    if (h >= 5 && h < 7) return '卯时 (05:00-07:00) - 属于木';
    if (h >= 7 && h < 9) return '辰时 (07:00-09:00) - 属于土';
    if (h >= 9 && h < 11) return '巳时 (09:00-11:00) - 属于火';
    if (h >= 11 && h < 13) return '午时 (11:00-13:00) - 属于火';
    if (h >= 13 && h < 15) return '未时 (13:00-15:00) - 属于土';
    if (h >= 15 && h < 17) return '申时 (15:00-17:00) - 属于金';
    if (h >= 17 && h < 19) return '酉时 (17:00-19:00) - 属于金';
    if (h >= 19 && h < 21) return '戌时 (19:00-21:00) - 属于土';
    return '亥时 (21:00-23:00) - 属于水';
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-[#fbf9f1] via-[#f7f3e8] to-[#eedfb9]/30 text-gray-800 selection:bg-gold-200">
      
      {/* Visual Header Banner - Anti-AI-slop design: clean borders, professional typography, transparent grid */}
      <header className="border-b border-gold-200/50 bg-white/60 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-black shadow-lg">
              卦
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-gold-900 flex items-center gap-2">
                八字流月运势祥批大本营
                <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded font-sans font-medium">100% 传统命理引擎</span>
              </h1>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                结合四柱原局、喜用神倾向、天干地支刑冲破害精细排算 · AI心理学赋能解析 ☯
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fortune')}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all ${
                activeTab === 'fortune' 
                  ? 'bg-gold-500 text-white shadow-md' 
                  : 'hover:bg-gold-100 text-gray-600'
              }`}
            >
              <span className="flex items-center gap-1.5"><Compass className="w-4 h-4"/> 命盘测算 & 月运</span>
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all ${
                activeTab === 'dictionary' 
                  ? 'bg-gold-500 text-white shadow-md' 
                  : 'hover:bg-gold-100 text-gray-600'
              }`}
            >
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4"/> 八字入门自学课堂</span>
            </button>
          </div>
        </div>
      </header>

      {/* Warning Disclaimer Box strictly placed as required for client-safe guidelines */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-white/80 border border-gold-200/60 rounded-xl px-4 py-2.5 flex items-start gap-2.5 text-xs text-gold-700 font-sans shadow-sm">
          <Info className="w-4.5 h-4.5 text-gold-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">【传统命理文化说明档】</span>
            四柱八字（八字学）是源于我国五代时期徐子平先师的传统哲学统计学科，旨在通过五行干支运转评估个人心态趋势和身心倾向。分析结果仅作生活建议和心态管理规划参考，并非绝对宿命论，请理性理性对待生活，相信自我奋斗的力量。
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {activeTab === 'fortune' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT SIDEBAR: Birthday input and list of saved profiles */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Profile Selection & Create */}
              <div id="birth-profile-card" className="bg-white/90 border border-gold-200/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between border-b border-gold-100 pb-3 mb-4">
                  <h3 className="font-serif font-black text-gold-900 flex items-center gap-2 text-md">
                    <User className="w-5 h-5 text-gold-600"/> 生辰盘面设置
                  </h3>
                  <span className="text-xs text-gray-400">支持公历农历转换</span>
                </div>

                {/* Profile List */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 block mb-2">已存盘面（可点击快速加载）：</span>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
                    {savedProfiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectProfile(p)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-gold-200/40 bg-gold-50/50 hover:bg-gold-100 hover:border-gold-300 transition-all text-gray-700 flex items-center gap-1.5 group font-medium"
                      >
                        <User className="w-3 h-3 text-gold-500 shrink-0"/>
                        <span className="truncate max-w-[110px]">{p.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">({p.gender === 'male' ? '乾' : '坤'})</span>
                        <span 
                          onClick={(e) => handleDeleteProfile(p.id, e)}
                          className="text-red-300 hover:text-red-500 shrink-0 font-bold ml-1 text-[11px]"
                          title="删除盘面"
                        >
                          ×
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">缘主姓名 / 盘名：</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gold-500 focus:outline-none text-sm transition-all"
                        placeholder="输入盘面拥有者姓名"
                      />
                      <button
                        onClick={handleCreateProfile}
                        className="absolute right-1.5 top-1.5 bg-gold-100 hover:bg-gold-200 text-gold-700 px-2 py-0.5 rounded-md text-[11px] font-sans font-semibold transition-all flex items-center gap-0.5"
                        title="将当前出生数据存入列表"
                      >
                        <Save className="w-3 h-3"/> 存盘
                      </button>
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">性别（乾造/坤造区分）：</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`py-2 rounded-lg border text-xs font-sans font-medium transition-all flex items-center justify-center gap-1.5 ${
                          gender === 'male' 
                            ? 'bg-gold-500 text-white border-gold-600' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5"/> 乾造（男命）
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`py-1.5 rounded-lg border text-xs font-sans font-medium transition-all flex items-center justify-center gap-1.5 ${
                          gender === 'female' 
                            ? 'bg-gold-500 text-white border-gold-600' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5"/> 坤造（女命）
                      </button>
                    </div>
                  </div>

                  {/* Calendar type switch */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">日历模式：</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsLunar(false)}
                        className={`py-1.5 rounded-lg border text-xs font-sans font-medium transition-all ${
                          !isLunar 
                            ? 'bg-gold-950 text-gold-100 border-gold-900' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        公历（太阳历）
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLunar(true)}
                        className={`py-1.5 rounded-lg border text-xs font-sans font-medium transition-all ${
                          isLunar 
                            ? 'bg-gold-950 text-gold-100 border-gold-900' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 font-medium'
                        }`}
                      >
                        农历（太阴阴阳历）
                      </button>
                    </div>
                  </div>

                  {/* Date Input Selectors */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">出生年 (Y)：</label>
                      <input 
                        type="number" 
                        min="1920" 
                        max="2100"
                        value={birthYear}
                        onChange={(e) => setBirthYear(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-gold-500 text-sm font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">出生月 (M)：</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="12"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-gold-500 text-sm font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">出生日 (D)：</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="31"
                        value={birthDay}
                        onChange={(e) => setBirthDay(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-gold-500 text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Time Input Selectors */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">出生小时 (H)：</label>
                      <select 
                        value={birthHour}
                        onChange={(e) => setBirthHour(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-gold-500 text-xs focus:outline-none bg-white font-sans"
                      >
                        {Array.from({ length: 24 }).map((_, h) => (
                          <option key={h} value={h}>{h} 点 ({h === 23 || h === 0 ? '子时' : h === 1 || h === 2 ? '丑时' : h === 3 || h === 4 ? '寅时' : h === 5 || h === 6 ? '卯时' : h === 7 || h === 8 ? '辰时' : h === 9 || h === 10 ? '巳时' : h === 11 || h === 12 ? '午时' : h === 13 || h === 14 ? '未时' : h === 15 || h === 16 ? '申时' : h === 17 || h === 18 ? '酉时' : h === 19 || h === 20 ? '戌时' : '亥时'})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">分钟 (Min)：</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="59"
                        value={birthMinute}
                        onChange={(e) => setBirthMinute(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 focus:border-gold-500 text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Hour Name display helper */}
                  <div className="text-[11px] text-gold-600 bg-gold-50 p-2 rounded border border-gold-200/30 font-serif flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0"/>
                    排定出生：{getShichenLabel(birthHour)}
                  </div>
                </div>

                <div className="mt-5 border-t border-gold-100 pt-4">
                  <h4 className="text-xs font-semibold text-gray-500 block mb-3">🎯 选择你要推算的流月（大运与流星交汇）：</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">测算流年：</label>
                      <select 
                        value={targetYear}
                        onChange={(e) => setTargetYear(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:border-gold-500 text-xs focus:outline-none"
                      >
                        <option value={2026}>2026 丙午年 (马)</option>
                        <option value={2027}>2027 丁未年 (羊)</option>
                        <option value={2028}>2028 戊申年 (猴)</option>
                        <option value={2100}>2100 庚申年</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">测算流月：</label>
                      <select 
                        value={targetMonth}
                        onChange={(e) => setTargetMonth(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:border-gold-500 text-xs focus:outline-none"
                      >
                        {Array.from({ length: 12 }).map((_, i) => {
                          const m = i + 1;
                          // Standard Monthly references matching YouTube list inside prompt
                          let tag = '';
                          if (m === 3) tag = ' (黄历3月·惊蛰更气)';
                          if (m === 4) tag = ' (黄历4月·清明更气)';
                          if (m === 5) tag = ' (黄历5月·立夏更气)';
                          return (
                            <option key={m} value={m}>{m}月{tag}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handlePerformCalculate}
                    disabled={loading}
                    className="w-full mt-4 bg-gold-600 hover:bg-gold-700 disabled:bg-gold-300 text-white py-3 rounded-xl font-serif font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin text-lg">☯</span> 正在推求气运轨迹...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-md">
                        <Sparkles className="w-5 h-5"/> 排演命盘 · 开启月运祥批
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* FIVE ELEMENTS CHECKSHEETS */}
              {baziChart && (
                <div className="bg-white/90 border border-gold-200/50 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-serif font-black text-gold-900 border-b border-gold-100 pb-3 mb-4 flex items-center justify-between">
                    <span>☯ 五行平衡分布图</span>
                    <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded font-sans font-medium">能量配比</span>
                  </h3>

                  {/* Dynamic Custom elements progress graphs - Zero-dependency visuals */}
                  <div className="space-y-3 font-sans">
                    {[
                      { name: '木 (Wood)', key: 'wood', color: 'bg-emerald-500 text-emerald-800 border-emerald-200', score: baziChart.elementStats.wood },
                      { name: '火 (Fire)', key: 'fire', color: 'bg-red-500 text-red-800 border-red-200', score: baziChart.elementStats.fire },
                      { name: '土 (Earth)', key: 'earth', color: 'bg-amber-600 text-amber-800 border-amber-200', score: baziChart.elementStats.earth },
                      { name: '金 (Metal)', key: 'metal', color: 'bg-zinc-400 text-zinc-800 border-zinc-200', score: baziChart.elementStats.metal },
                      { name: '水 (Water)', key: 'water', color: 'bg-blue-500 text-blue-800 border-blue-200', score: baziChart.elementStats.water },
                    ].map((item) => {
                      const total = baziChart.elementStats.wood + baziChart.elementStats.fire + baziChart.elementStats.earth + baziChart.elementStats.metal + baziChart.elementStats.water;
                      const percentage = Math.round((item.score / total) * 100);
                      return (
                        <div key={item.key}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="flex items-center gap-1.5 text-gray-700">
                              <span className={`w-2.5 h-2.5 rounded-full ${item.color.split(' ')[0]}`}/>
                              {item.name}
                            </span>
                            <span className="text-gray-500 font-mono font-bold">{percentage}% ({item.score.toFixed(1)}分)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/50">
                            <div 
                              className={`h-full rounded-full ${item.color.split(' ')[0]} transition-all duration-1000`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Character Diagnostics */}
                  <div className="mt-5 bg-gold-50/70 border border-gold-200/40 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-gold-100/40 pb-1.5 font-sans">
                      <span className="text-gray-500">日元日主：</span>
                      <strong className="text-gold-900">{baziChart.dayOwner}（{baziChart.dayOwnerElement}主）</strong>
                    </div>
                    <div className="flex justify-between border-b border-gold-100/40 pb-1.5 font-sans">
                      <span className="text-gray-500">命局格局：</span>
                      <strong className="text-gold-900">{baziChart.strengthState}</strong>
                    </div>
                    <div className="flex justify-between border-b border-gold-100/40 pb-1.5 font-sans">
                      <span className="text-gray-500">喜用五行（补运核心）：</span>
                      <strong className="text-emerald-700 font-semibold">{baziChart.favorableElements.join('、')}</strong>
                    </div>
                    <div className="flex justify-between font-sans">
                      <span className="text-gray-500">忌神五行（重叠压力）：</span>
                      <strong className="text-red-700 font-semibold">{baziChart.unfavorableElements.join('、')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR: Primary display area - loader, bazi matrices, AI reports */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Error Alert Display */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex gap-3 text-sm font-sans shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">计算生成出现阻碍：</span>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Loading animation with quote loop */}
              {loading && (
                <div className="bg-white/90 border border-gold-200 border-dashed rounded-3xl p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[450px]">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-gold-100 border-t-gold-600 animate-spin flex items-center justify-center">
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-gold-600 font-serif font-black text-2xl">
                      卦
                    </div>
                  </div>
                  <h3 className="font-serif font-black text-lg text-gold-900 mt-6 animate-pulse">
                    正在拨盘占算：{birthYear}年{birthMonth}月{birthDay}日生人
                  </h3>
                  <div className="max-w-md mx-auto mt-4 px-4">
                    <span className="text-xs text-amber-700/80 uppercase font-mono block tracking-wider mb-2">--- 命书占演词库 ---</span>
                    <p className="text-sm font-serif italic text-gold-800 bg-gold-50/50 p-4 rounded-xl border border-gold-200/20 shadow-inner">
                      “ {ZEN_PHRASES[phraseIndex]} ”
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 mt-8 font-sans">
                    流月大运推算需要 5 - 10 秒。正在排解刑冲合害神煞...
                  </span>
                </div>
              )}

              {/* SUCCESSFUL CONTENT */}
              {!loading && baziChart && (
                <div className="space-y-6">
                  
                  {/* METRIC CHINESE CHARTS - FOUR PILLARS */}
                  <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-serif font-black text-gold-900 text-sm border-b border-gold-100 pb-3 mb-4 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-gold-600"/>
                      缘主「{profileName}」· 四柱八字排盘盘面 ({gender === 'male' ? '男命乾造' : '女命坤造'})
                    </h3>

                    {/* Highly polished 4 blocks for 4 pillars */}
                    <div className="grid grid-cols-4 gap-2.5 md:gap-4 text-center">
                      {[
                        { title: '年柱 (官基)', pillar: baziChart.yearPillar, desc: '祖上、长辈、少年运' },
                        { title: '月柱 (限业)', pillar: baziChart.monthPillar, desc: '父母、兄弟、青年运' },
                        { title: '日柱 (命主)', pillar: baziChart.dayPillar, desc: '自身、配偶、中年运' },
                        { title: '时柱 (果息)', pillar: baziChart.hourPillar, desc: '子孙、晚辈、晚年运' }
                      ].map((col, index) => {
                        const isDayOwner = index === 2;
                        return (
                          <div 
                            key={col.title}
                            className={`rounded-xl border p-2 md:p-4 font-serif flex flex-col items-center justify-between transition-all ${
                              isDayOwner 
                                ? 'bg-gold-50 border-gold-400/50 ring-2 ring-gold-200/50' 
                                : 'bg-white border-gold-100'
                            }`}
                          >
                            <span className="text-[10px] md:text-xs text-gray-400 font-sans mb-1 block font-medium">{col.title}</span>
                            
                            {/* Stem row */}
                            <div className="mt-1 flex flex-col items-center">
                              <span className="text-[10px] md:text-xs text-gold-700 font-sans font-semibold mb-0.5">
                                {isDayOwner ? '日主 (元)' : col.pillar.tenShenGanId}
                              </span>
                              <span className="text-xl md:text-2xl font-serif text-gray-900 font-black block leading-none">
                                {col.pillar.gan}
                              </span>
                              <span className="text-[9px] md:text-[10px] text-gray-400 font-sans mt-0.5 font-medium">
                                {col.pillar.yinYangGan}{col.pillar.elementGan}
                              </span>
                            </div>

                            {/* Divider line representing Earth-Heaven Connection */}
                            <div className="w-5 border-t border-gold-200/50 my-1 py-0.5"></div>

                            {/* Branch row */}
                            <div className="flex flex-col items-center">
                              <span className="text-xl md:text-2xl font-serif text-gray-900 font-black block leading-none">
                                {col.pillar.zhi}
                              </span>
                              <span className="text-[9px] md:text-[10px] text-gray-400 font-sans mt-0.5 font-medium">
                                {col.pillar.yinYangZhi}{col.pillar.elementZhi}
                              </span>
                            </div>

                            {/* Nayin description */}
                            <div className="mt-2 text-[8px] md:text-[11px] bg-gold-50 text-gold-700 px-1 py-1 rounded w-full line-clamp-1 border border-gold-100 text-center font-sans">
                              {col.pillar.naYin}
                            </div>

                            {/* Hidden Stems & Their Ten Gods */}
                            <div className="mt-2.5 pt-2 border-t border-gold-100/50 w-full text-left space-y-1">
                              <span className="text-[8px] md:text-[9px] text-gray-400 font-sans font-semibold block text-center mb-1">地支藏干</span>
                              {col.pillar.hideGan.map((hg, idx) => (
                                <div key={hg} className="flex items-center justify-between text-[9px] bg-gray-50 rounded px-1 py-0.5 text-gray-600 font-sans">
                                  <span>{hg}({STEM_ELEMENT[hg]})</span>
                                  <span className="text-[8px] text-gold-600 font-semibold">{col.pillar.tenShenZhi[idx]}</span>
                                </div>
                              ))}
                            </div>

                            {/* Life stages */}
                            <div className="mt-2 text-[8px] md:text-[10px] font-sans text-gray-400 border border-gray-100 rounded px-1.5 py-0.5">
                              {col.pillar.shiErChangSheng}
                            </div>

                            <span className="text-[8px] text-gray-400 mt-2 block font-sans font-medium">{col.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DAILY MINDFULNESS CHECK-IN & 7D TREND */}
                  <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold-100 pb-3 mb-5 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gold-100 flex items-center justify-center text-gold-700">
                          <Activity className="w-4.5 h-4.5"/>
                        </div>
                        <div>
                          <h3 className="font-serif font-black text-gold-900 text-sm">
                            每日心境探针 & 运势比对走势
                          </h3>
                          <p className="text-[10px] text-gray-400 font-sans">
                            记录每天的运势印证，跟踪您最近7天的阴阳感应走势
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gold-50/50 px-2.5 py-1 rounded-md border border-gold-200/20 text-xs">
                        <TrendingUp className="w-3.5 h-3.5 text-gold-600"/>
                        <span className="font-sans text-gray-500">当前排演日干：<strong>{baziChart?.dayOwner}</strong>（{baziChart?.dayOwnerElement}）</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: 7-day trend chart (8 columns) */}
                      <div className="lg:col-span-8 flex flex-col justify-between">
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-gray-500 block mb-1">📉 「{profileName || '访客命盘'}」最近7天心境波动：</span>
                          <span className="text-[10px] text-gray-400 block font-sans">
                            折线值代表您打卡时在「40（受阻） - 100（圆满）」之间的主观感知；金色虚线为AI原局批算的本月大趋势水准。
                          </span>
                        </div>

                        {/* Chart Render Block */}
                        <div className="relative border border-gold-100/60 bg-gold-50/10 rounded-xl p-2.5 min-h-[250px] flex flex-col justify-center">
                          {(() => {
                            const curCheckIns = allCheckIns.filter(item => item.profileName === (profileName || '访客命盘'));
                            const todayStr = getTodayString();
                            
                            // Calculate last 7 dates ending today
                            const dates = [];
                            const baseDate = new Date(todayStr);
                            for (let i = 6; i >= 0; i--) {
                              const d = new Date(baseDate);
                              d.setDate(baseDate.getDate() - i);
                              const yyyy = d.getFullYear();
                              const mm = String(d.getMonth() + 1).padStart(2, '0');
                              const dd = String(d.getDate()).padStart(2, '0');
                              dates.push(`${yyyy}-${mm}-${dd}`);
                            }

                            const chartPoints = dates.map((dateStr, idx) => {
                              const match = curCheckIns.find(item => item.date === dateStr);
                              return {
                                date: dateStr,
                                label: dateStr.substring(5), // "MM-DD"
                                score: match ? match.score : null,
                                moodLabel: match ? match.moodLabel : null,
                                note: match ? match.note : null,
                                hasData: !!match,
                                index: idx
                              };
                            });

                            const hasAnyData = chartPoints.some(p => p.hasData);

                            const plotX = (idx: number) => 55 + idx * 88.33;
                            const plotY = (score: number) => 195 - ((score - 40) / 60) * 165;

                            const activePoints = chartPoints
                              .map(p => ({ ...p, x: plotX(p.index), y: p.score ? plotY(p.score) : null }))
                              .filter(p => p.y !== null);

                            const dPathString = activePoints.reduce((acc, p, i) => {
                              return acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
                            }, "");

                            const monthlyBaseScore = fortuneReport?.score || 72;
                            const baselineY = plotY(monthlyBaseScore);

                            return (
                              <div className="w-full">
                                <svg viewBox="0 0 600 240" className="w-full h-auto text-gray-400 font-sans">
                                  {/* Y Axis Grid Lines */}
                                  {[40, 60, 80, 100].map((score) => {
                                    const yVal = plotY(score);
                                    return (
                                      <g key={score} className="opacity-40">
                                        <line x1="50" y1={yVal} x2="585" y2={yVal} stroke="#e5d5b7" strokeWidth="1" strokeDasharray={score === 40 ? "0" : "3 3"} />
                                        <text x="15" y={yVal + 4} fill="#846532" className="text-[10px] font-mono font-bold">{score}</text>
                                      </g>
                                    );
                                  })}

                                  {/* Monthly Fortune Score Baseline (Calculated by backend API) */}
                                  {fortuneReport && (
                                    <g>
                                      <line x1="50" y1={baselineY} x2="585" y2={baselineY} stroke="#b8975a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" />
                                      <text x="55" y={baselineY - 5} fill="#9e7d43" className="text-[10px] font-serif font-bold italic">
                                        本月AI祥批月势基准线 ({monthlyBaseScore}分)
                                      </text>
                                    </g>
                                  )}

                                  {/* If no data recorded yet */}
                                  {!hasAnyData && (
                                    <g>
                                      <text x="320" y="115" textAnchor="middle" fill="#846532" className="text-xs font-serif font-bold opacity-80">
                                        ☯ 暂无本轮7天打卡感知记录
                                      </text>
                                      <text x="320" y="135" textAnchor="middle" fill="#9c9c94" className="text-[10px]">
                                        请在右侧随笔记下当日心境，绘制您的金光运势轨迹
                                      </text>
                                    </g>
                                  )}

                                  {/* Line paths */}
                                  {hasAnyData && activePoints.length >= 1 && (
                                    <g>
                                      {/* Background outer neon shadow */}
                                      {activePoints.length >= 2 && (
                                        <path d={dPathString} fill="none" stroke="#b8975a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
                                      )}
                                      {/* Solid line */}
                                      {activePoints.length >= 2 && (
                                        <path d={dPathString} fill="none" stroke="#b8975a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                      )}

                                      {/* Circles & detailed labels */}
                                      {chartPoints.map((p) => {
                                        const cx = plotX(p.index);
                                        const hasVal = p.score !== null;
                                        const cy = hasVal ? plotY(p.score!) : 195;

                                        return (
                                          <g key={p.date}>
                                            {/* X axis labels */}
                                            <text x={cx} y="225" textAnchor="middle" fill="#2c2c28" className="text-[10px] font-semibold font-mono">
                                              {p.label}
                                            </text>
                                            
                                            {hasVal ? (
                                              <g>
                                                {/* Outer golden halo */}
                                                <circle cx={cx} cy={cy} r="8" fill="#b8975a" opacity="0.2" className="cursor-pointer" />
                                                {/* Solid marker center */}
                                                <circle cx={cx} cy={cy} r="4.5" fill="#9e7d43" stroke="#fff" strokeWidth="1.5" className="cursor-pointer transition-all hover:scale-125" />
                                                
                                                {/* Score annotation */}
                                                <text x={cx} y={cy - 12} textAnchor="middle" fill="#49391f" className="text-[10px] font-mono font-black">
                                                  {p.score}分
                                                </text>

                                                {/* Sentiment emoji mapping */}
                                                <text x={cx} y={cy + 17} textAnchor="middle" className="text-[10px] select-none">
                                                  {p.moodLabel === '非常顺遂' ? '😇' : p.moodLabel === '温和舒适' ? '😊' : p.moodLabel === '平常普通' ? '😐' : p.moodLabel === '略有波折' ? '😟' : '😰'}
                                                </text>
                                              </g>
                                            ) : (
                                              /* Empty date placeholder dot */
                                              <circle cx={cx} cy={cy} r="2.5" fill="#e5d5b7" opacity="0.6" />
                                            )}
                                          </g>
                                        );
                                      })}
                                    </g>
                                  )}
                                </svg>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Right: Daily check-in form (4 columns) */}
                      <div className="lg:col-span-4 flex flex-col justify-between">
                        <form onSubmit={handleAddCheckIn} className="space-y-4">
                          <h4 className="font-serif font-black text-gold-900 text-xs flex items-center gap-1.5">
                            <Smile className="w-4.5 h-4.5 text-gold-600" />
                            心灵打卡 · 印证气场
                          </h4>

                          <div className="space-y-3">
                            {/* Date Picker */}
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 mb-1">打卡日期：</label>
                              <input 
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:border-gold-500 text-xs focus:outline-none focus:ring-1 focus:ring-gold-200"
                                required
                              />
                            </div>

                            {/* Feeling Select Grid */}
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">今日自感：</label>
                              <div className="grid grid-cols-2 gap-1.5 text-xs">
                                {[
                                  { label: '非常顺遂', score: 95, emoji: '😇' },
                                  { label: '温和舒适', score: 80, emoji: '😊' },
                                  { label: '平常普通', score: 65, emoji: '😐' },
                                  { label: '略有波折', score: 50, emoji: '😟' },
                                  { label: '焦躁受阻', score: 40, emoji: '😰' }
                                ].map((lvl) => {
                                  const isSelected = checkInLabel === lvl.label;
                                  return (
                                    <button
                                      key={lvl.label}
                                      type="button"
                                      onClick={() => {
                                        setCheckInLabel(lvl.label);
                                        setCheckInScore(lvl.score);
                                      }}
                                      className={`px-1.5 py-1.5 rounded-lg border transition-all text-[11px] font-sans font-medium flex items-center gap-1 justify-center cursor-pointer ${
                                        isSelected 
                                          ? 'bg-gold-500 text-white border-gold-600 font-bold shadow-sm' 
                                          : 'bg-white hover:bg-gold-50/50 border-gray-200 text-gray-600'
                                      }`}
                                    >
                                      <span>{lvl.emoji}</span>
                                      <span className="truncate">{lvl.label}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Fine grain score adjust slider */}
                              <div className="mt-2.5 bg-white p-2 border border-gold-100 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[9px] text-gray-400 font-sans">细化感知值：</span>
                                  <span className="text-[11px] font-mono font-bold text-gold-700">{checkInScore} 分</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="40" 
                                  max="100" 
                                  value={checkInScore}
                                  onChange={(e) => {
                                    const score = Number(e.target.value);
                                    setCheckInScore(score);
                                    if (score >= 90) setCheckInLabel('非常顺遂');
                                    else if (score >= 75) setCheckInLabel('温和舒适');
                                    else if (score >= 60) setCheckInLabel('平常普通');
                                    else if (score >= 45) setCheckInLabel('略有波折');
                                    else setCheckInLabel('焦躁受阻');
                                  }}
                                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gold-500"
                                />
                              </div>
                            </div>

                            {/* Feeling Details Checkin text */}
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 mb-1">心境/运感备忘录：</label>
                              <textarea
                                value={checkInNote}
                                onChange={(e) => setCheckInNote(e.target.value)}
                                rows={2}
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-gold-500 bg-white"
                                placeholder="记下今天遇上的事或心境，例如：今天工作虽然有点琐碎，但有贵人暗合帮扶，进展很顺利！"
                                required
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gold-600 hover:bg-gold-700 text-white font-serif font-black text-xs py-2.5 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 mt-2 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> 登记当期感知气场
                          </button>
                        </form>
                      </div>

                    </div>

                    {/* Historical logs detail board if checkins exist */}
                    {(() => {
                      const curCheckIns = allCheckIns.filter(item => item.profileName === (profileName || '访客命盘'));
                      if (curCheckIns.length === 0) return null;

                      return (
                        <div className="mt-5 pt-4 border-t border-gold-100">
                          <span className="text-xs font-semibold text-gold-800 block mb-2.5 font-serif">📋 最近记录的五行契合自省篇目：</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {curCheckIns.slice(0, 3).map((item) => (
                              <div key={item.id} className="bg-gold-50/20 border border-gold-200/40 p-3 rounded-xl flex flex-col justify-between text-xs transition-all hover:bg-gold-50/50">
                                <div>
                                  <div className="flex items-center justify-between font-mono text-[10px] text-gray-400 mb-1.5 pb-1 border-b border-gold-200/10">
                                    <span className="font-semibold">{item.date}</span>
                                    <span className="bg-gold-100 text-gold-800 px-1.5 py-0.2 rounded font-sans scale-90">
                                      {item.moodLabel} ({item.score}分)
                                    </span>
                                  </div>
                                  <p className="text-gray-600 leading-relaxed font-sans italic line-clamp-2">
                                    “ {item.note} ”
                                  </p>
                                </div>
                                <div className="mt-2.5 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCheckIn(item.id)}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-sans font-medium flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3"/> 删除本篇
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* HIGH VALUE STREAM FORTUNE OUTPUT */}
                  {fortuneReport && monthlyFlow && (
                    <div className="space-y-6">
                      
                      {/* Visual warning of Dummy setup inside server if key was missing */}
                      {warningMessage && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs font-sans shadow-inner flex gap-2">
                          <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5"/>
                          <div>
                            <strong>提示：</strong>{warningMessage}
                          </div>
                        </div>
                      )}

                      {/* Header core: Score & poetic summary */}
                      <div className="bg-white/95 border border-gold-200 rounded-3xl p-6 shadow-md glow-gold relative overflow-hidden">
                        {/* Background traditional stamp silhouette */}
                        <div className="absolute right-6 bottom-6 opacity-[0.03] text-[180px] pointer-events-none font-serif select-none">
                          运
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
                          <div className="text-center md:text-left">
                            <span className="text-xs font-semibold uppercase font-sans text-gold-600 tracking-wider">
                              丙午流动气象 & 流月气运祥批
                            </span>
                            <h2 className="text-2xl font-serif font-black text-gray-900 mt-1">
                              {targetYear}年第{targetMonth}月 运势推演专报
                            </h2>
                            <p className="text-sm font-serif italic text-gold-800 mt-1">
                              “ {fortuneReport.summary} ”
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs text-gray-500 font-sans">
                              <span className="bg-gold-50 text-gold-700 border border-gold-200/50 px-2.5 py-1 rounded-md">
                                流年干支：<strong>{monthlyFlow.flowYearName}</strong>（{monthlyFlow.flowYearGanTenShen}）
                              </span>
                              <span className="bg-gold-50 text-gold-700 border border-gold-200/50 px-2.5 py-1 rounded-md">
                                流月干支：<strong>{monthlyFlow.flowMonthName}</strong>（{monthlyFlow.flowMonthGanTenShen}）
                              </span>
                              <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gold-500" />
                                节令范围：{monthlyFlow.solarTermRange}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-center flex flex-col items-center">
                            <div className="relative w-28 h-28 rounded-full border-4 border-gold-100 flex flex-col items-center justify-center bg-gold-50/50 shadow-inner">
                              <span className="text-[10px] font-sans font-bold text-gold-600 block mb-0.5">流月得分</span>
                              <span className="text-4xl font-serif font-black text-gold-900 leading-none">
                                {fortuneReport.score}
                              </span>
                              <span className="text-[10px] font-sans text-gray-400 mt-1 block">满分 100</span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-sans mt-2">
                              {fortuneReport.score >= 80 ? '🎯 气势高昂 · 多寻突破' : fortuneReport.score >= 70 ? '💪 气象中和 · 宜行守成' : '🧘 气弱藏神 · 守正防过'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Overall Text Report */}
                      <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-serif font-black text-gold-900 text-md border-b border-gold-100 pb-3 mb-4 flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-gold-600" /> 本月气运总论 (合参评判)
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed font-sans first-letter:text-xl first-letter:font-serif first-letter:font-bold first-letter:text-gold-700">
                          {fortuneReport.overview}
                        </p>
                      </div>

                      {/* 2. SPECIFIC INTERACTIVE GENERATIONAL ALERTS (刑冲破害合) */}
                      {monthlyFlow.interactions.length > 0 && (
                        <div id="bazi-interaction-board" className="bg-white/95 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
                          <h4 className="font-serif font-black text-amber-900 text-md border-b border-amber-100 pb-3 mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0"/>
                            流月干支与您八字原局相互作用（冲合神煞看板）
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {monthlyFlow.interactions.map((inter, i) => (
                              <div 
                                key={i}
                                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                                  inter.type === 'clash' 
                                    ? 'bg-red-50/50 border-red-200 text-red-900' 
                                    : inter.type === 'harm' 
                                      ? 'bg-orange-50/50 border-orange-200 text-orange-900' 
                                      : inter.type === 'punishment' 
                                        ? 'bg-yellow-50/50 border-yellow-200 text-yellow-900' 
                                        : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2 font-serif font-black text-sm">
                                  <span className={`w-2.5 h-2.5 rounded-full ${
                                    inter.type === 'clash' 
                                      ? 'bg-red-500' 
                                      : inter.type === 'harm' 
                                        ? 'bg-orange-500' 
                                        : inter.type === 'punishment' 
                                          ? 'bg-yellow-500' 
                                          : 'bg-emerald-500'
                                  }`}/>
                                  {inter.title}
                                </div>
                                <div className="font-sans text-gray-700 mb-1">
                                  <span className="font-semibold">{inter.source}</span> 冲突联动您的原局：
                                  <span className="bg-white/90 border px-1.5 py-0.5 rounded ml-1 font-semibold text-gold-900">
                                    {inter.natalPillar}
                                  </span>
                                </div>
                                <p className="font-sans text-gray-600 leading-relaxed mt-1">{inter.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dynamic Bento grid representing categories */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Career Module */}
                        <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                            <Briefcase className="w-5 h-5"/>
                          </div>
                          <div className="space-y-1.5">
                            <h5 className="font-serif font-black text-gray-900 text-sm">💼 事业发展与突破</h5>
                            <p className="text-xs text-gray-600 leading-relaxed font-sans">{fortuneReport.career}</p>
                          </div>
                        </div>

                        {/* Wealth Module */}
                        <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                            <Coins className="w-5 h-5"/>
                          </div>
                          <div className="space-y-1.5">
                            <h5 className="font-serif font-black text-gray-900 text-sm">💰 财源财气与消费</h5>
                            <p className="text-xs text-gray-600 leading-relaxed font-sans">{fortuneReport.wealth}</p>
                          </div>
                        </div>

                        {/* Love Module */}
                        <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                            <Heart className="w-5 h-5"/>
                          </div>
                          <div className="space-y-1.5">
                            <h5 className="font-serif font-black text-gray-900 text-sm">💑 桃花感情与家和</h5>
                            <p className="text-xs text-gray-600 leading-relaxed font-sans">{fortuneReport.relationship}</p>
                          </div>
                        </div>

                        {/* Health Module */}
                        <div className="bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
                            <Activity className="w-5 h-5"/>
                          </div>
                          <div className="space-y-1.5">
                            <h5 className="font-serif font-black text-gray-900 text-sm">🧘 脏腑健康与调心</h5>
                            <p className="text-xs text-gray-600 leading-relaxed font-sans">{fortuneReport.health}</p>
                          </div>
                        </div>

                      </div>

                      {/* Auspicious and Inauspicious Days */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/95 border border-gold-200/50 rounded-2xl p-5 shadow-sm">
                        
                        {/* Lucky Days */}
                        <div>
                          <h5 className="font-serif font-black text-emerald-800 text-sm border-b border-emerald-100 pb-2 mb-3 flex items-center gap-1.5">
                            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                            本月上吉突破之日 (宜重点安排)
                          </h5>
                          <ul className="space-y-2 text-xs text-gray-700 font-sans">
                            {fortuneReport.luckyDays.map((ld: string, i: number) => (
                              <li key={i} className="bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100/50 flex gap-2">
                                <span className="text-emerald-700 font-serif font-black shrink-0 mt-0.5">✦</span>
                                <span>{ld}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Unlucky Days */}
                        <div>
                          <h5 className="font-serif font-black text-amber-800 text-sm border-b border-amber-100 pb-2 mb-3 flex items-center gap-1.5">
                            <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
                            本月减速守成之日 (忌口舌争执)
                          </h5>
                          <ul className="space-y-2 text-xs text-gray-700 font-sans">
                            {fortuneReport.unluckyDays.map((ud: string, i: number) => (
                              <li key={i} className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/50 flex gap-2">
                                <span className="text-amber-700 font-serif font-bold shrink-0 mt-0.5">⚠</span>
                                <span>{ud}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Yearly outline */}
                      <div className="bg-gold-900 border border-gold-950 text-gold-100 rounded-2xl p-5 text-xs font-sans shadow-md flex items-center gap-4">
                        <Compass className="w-10 h-10 text-gold-200 shrink-0"/>
                        <div>
                          <span className="font-serif block font-bold text-gold-200 mb-1">【岁运总复盘】此月份对庚马流年转折提示：</span>
                          {fortuneReport.yearlyOverview}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* EMPTY STATE */}
              {!baziChart && !loading && (
                <div className="bg-white/90 border border-gold-200/50 rounded-2xl p-12 text-center shadow-sm min-h-[400px] flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 text-3xl mb-4 shadow-inner">
                    ☯
                  </div>
                  <h3 className="font-serif font-black text-lg text-gold-900 mb-2">未测命局气运</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                    阴阳五行，运转不息。请在左侧配置您的出生日期，我们将结合传统八字公式与先进大模型，立即为您排出完整的四柱命盘并计算精细的流月运势。
                  </p>
                  <button
                    onClick={handlePerformCalculate}
                    className="bg-gold-600 hover:bg-gold-700 text-white font-serif font-black text-sm px-6 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
                  >
                    立即排盘推演 ➔
                  </button>
                </div>
              )}

            </div>

          </div>
        ) : (
          
          /* DICTIONARY / LEARNING ROOM SIDE */
          <div className="bg-white/95 border border-gold-200/50 rounded-3xl p-6 shadow-sm min-h-[600px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gold-100 pb-4 mb-6 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 font-mono block">传统术数基础自学大辞典</span>
                <h2 className="text-2xl font-serif font-black text-gold-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-gold-500" />
                  八字入门至中级大讲堂库 📚
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  对应黄历系列培训视频的知识归纳：从五行到四墓库，零基础小白快速看懂命盘
                </p>
              </div>

              {/* Dict cat switcher */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: 'five-elements', label: '五行生克', icon: Activity },
                  { id: 'ten-gods', label: '十神心法', icon: Heart },
                  { id: 'clashes', label: '天干冲合·地支刑冲害', icon: ShieldAlert },
                  { id: 'muku', label: '辰戌丑未四墓库详解', icon: Compass }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setDictCategory(cat.id as any);
                      setSelectedTerm(null);
                    }}
                    className={`px-3 py-2 rounded-lg border font-sans font-semibold transition-all flex items-center gap-1 ${
                      dictCategory === cat.id 
                        ? 'bg-gold-500 text-white border-gold-600 shadow'
                        : 'bg-white hover:bg-gold-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left wordlist */}
              <div className="md:col-span-4 bg-gold-50/30 rounded-2xl border border-gold-200/30 p-4 max-h-[450px] overflow-y-auto">
                <span className="text-xs font-semibold text-gray-400 block mb-3 px-1 uppercase tracking-widest font-mono">--- 条目词典 ---</span>
                <div className="space-y-1.5 font-serif">
                  {DICT_CONTENT[dictCategory].map((item) => (
                    <button
                      key={item.term}
                      onClick={() => setSelectedTerm(item.term)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between text-sm ${
                        selectedTerm === item.term 
                          ? 'bg-gold-100/80 border-gold-300 text-gold-950 font-black scale-[1.01]' 
                          : 'bg-white hover:bg-gold-50 border-gold-100 text-gray-700'
                      }`}
                    >
                      <span>{item.term}</span>
                      <ChevronRight className="w-4 h-4 text-gold-500 shrink-0"/>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Definition Board */}
              <div className="md:col-span-8 bg-white/50 rounded-2xl border border-gold-200/30 p-5 min-h-[300px] flex flex-col justify-between">
                <div>
                  {selectedTerm ? (
                    <div className="space-y-4">
                      
                      {/* Title block */}
                      <div className="border-b border-gold-100 pb-3 flex items-center justify-between">
                        <h3 className="text-xl font-serif font-black text-gold-950">
                          {selectedTerm}
                        </h3>
                        <span className="text-xs bg-gold-100 text-gold-800 px-2.5 py-1 rounded-full font-serif font-medium">
                          {DICT_CONTENT[dictCategory].find(i => i.term === selectedTerm)?.tag || '名词释义'}
                        </span>
                      </div>

                      {/* Content block */}
                      <p className="text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-line bg-gold-50/20 p-4 rounded-xl border border-gold-200/20">
                        {DICT_CONTENT[dictCategory].find(i => i.term === selectedTerm)?.definition}
                      </p>

                      {/* Video correlation notes */}
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-900 font-sans flex gap-2 items-start mt-4">
                        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>视频讲授大纲要点对应：</strong>
                          {DICT_CONTENT[dictCategory].find(i => i.term === selectedTerm)?.videoCorrelate || '在培训课程中，导师强调了观察此项干支相互生克对身强、财格评级时的全局支点作用。'}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <BookOpen className="w-12 h-12 text-gold-300 mx-auto mb-4" />
                      <h4 className="font-serif font-black text-gray-900 text-md mb-2">请从左侧选择词条</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        点击左侧任意词条，即可在右侧展开中国传统命理学术语的精细解析、生肖生克原理、以及对应讲座课程的要点浓缩总结。
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer dictionary summary */}
                <div className="border-t border-gold-100 pt-4 mt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 font-sans gap-2">
                  <span>命理学自学大讲堂 · 每日更新词条库 </span>
                  <span>推荐阅读：五行生克制化五诀 ☯ 简明干支表</span>
                </div>

              </div>

            </div>
          </div>

        )}
      </main>
    </div>
  );
}

// Complete rich-defined dictionary static database representing professional video references
interface DictionaryItem {
  term: string;
  tag: string;
  definition: string;
  videoCorrelate: string;
}

const DICT_CONTENT: { [key: string]: DictionaryItem[] } = {
  'five-elements': [
    {
      term: '五行生克法则',
      tag: '核心根基',
      definition: '物理与宇宙观的核心学问。五行为“木、火、土、金、水”。\n\n【五行相生】：木生火（燃烧）、火生土（化灰）、土生金（矿物）、金生水（熔物或托露）、水生木（灌溉）。\n\n【五行相克】：木克土（破土）、土克水（土掩）、水克火（灭火）、火克金（熔金）、金克木（砍伐）。\n\n在八字分析中，五行并不是越多越好，而是“中和”为贵（平衡无缺）。',
      videoCorrelate: '【90分钟学会看八字视频】中强调：学会八字第一步，就是把五行生克倒背如流。日主（日柱天干）在这个生克大网中的位置，决定了其终身基本生命趋向。'
    },
    {
      term: '日主 (日元 / 命主)',
      tag: '核心词条',
      definition: '日元，指的是“出生日的天干”（日柱的第一个字）。它是八字测算真正的【我】，即八字的核心主体。\n\n其他七个字（年柱干支、月柱干支、日支、时柱干支）都围绕日元来判定相互作用。\n\n例如：若您于“甲子”日出生，属于“甲”木命人，甲就是您的日元，五行为木。庚金克甲木就是您的官杀（压力/地位），葵水生甲木就是您的印星（养护/长辈）。',
      videoCorrelate: '【90分钟入门】重点申明：同年同月同日生的人，若时辰不同（即日柱之下的时柱不同，或者日干的秉受生旺强弱不同），其格局大不相同。这充分说明日主核心的重要地位。'
    },
    {
      term: '身强、身弱与中和',
      tag: '格局心法',
      definition: '指日元所处能量气场强弱状态。\n\n【身强（身旺）】：周围帮扶日主的元素过多（印星和比劫过重），命主精力充沛，抗压性强。身强最喜：克泄（喜官星克、食伤泄、财星耗，即拿走我多余的能量）。\n\n【身弱】：周围克制消耗日主的元素过多（官杀、食伤、才财极旺），导致本尊显得根苗不实。身弱最喜：帮扶（喜印星生旺、比劫帮身，即需要靠山和同伴支持）。\n\n【中和】：最理想状态，阴阳五行非常均衡，一生通常波澜惊险较少。',
      videoCorrelate: '【自学八字中级课程】的核心要点：身强身弱不代表好坏！不是身强就好、身弱就差。很多大富豪正是身弱“财旺生官”或身强“食伤泄精”完美走大运而达成的。大运喜用神才是决定性要素。'
    }
  ],
  'ten-gods': [
    {
      term: '印星 (正印 与 偏印)',
      tag: '生我者 (Resource)',
      definition: '生扶日主，代表母亲、学问、靠山、长辈、契约、房子与安全感。\n\n【正印】：阴阳属性与日元相反（如同性生克：甲木逢癸水）。多为正统护养，代表踏实沉稳、善心、长辈。最利求学深造。\n\n【偏印 (枭神)】：阴阳属性与日元相同（如：甲木逢壬水）。代表非传统的才华、敏感、孤独感、灵性。偏印格人第六感极强，适合钻研命理或奇门宗教。',
      videoCorrelate: '【自学中级课首尾】说明了“印多的苦恼”：印太多（特别是偏印夺食），人容易想得多、行动力迟缓（枭印夺食），需要流月出现财星克制印（财克印）方能豁然清醒。'
    },
    {
      term: '官杀 (正官 与 七杀)',
      tag: '克我者 (Power / Status)',
      definition: '制衡和约束日元的五行，代表事业岗位、领导、规矩、压力。在女命八字里代表配偶；在男命中也代表子女。\n\n【正官】：合理的制度、主流的事业、公职职务。人多守序规矩。\n\n【七杀 (偏官)】：高强度压迫、挑战、威严、突发状况。七杀得制（如食神制杀）主掌大权，无制则内心常感到危机，身弱最怕七杀流月。',
      videoCorrelate: '【黄历4月流月会商】提醒：当月正值七杀旺，身弱不胜克，工作易现高强任务卡死点，宜借助五行水（印星）来化引七杀，使七杀生印、印生我，形成“杀印相生”解围。'
    },
    {
      term: '食伤 (食神 与 伤官)',
      tag: '我生者 (Expression)',
      definition: '我输出宣泄的才智，代表表达、才智、创造力、演说、口才。在女命八字里代表儿女。\n\n【食神】：温和健康的输出，代表衣食无忧、口福、心态平和。“食神生财”是富豪八字的标配。\n\n【伤官】：激进刚烈的自我主张，极具颠覆性的才华与高傲。伤官克官（伤官见官，为祸百端），通常流月逢伤官，说话易冲撞权威引发口舌官非。',
      videoCorrelate: '视频中说，凡是演艺界、艺术策划、创意设计能手，其原局八字多数伤官叠重或者身强食神透干。这类人在此种流月做策划、路演会十分亮眼。'
    }
  ],
  'clashes': [
    {
      term: '天干五合 (天合)',
      tag: '天干联动',
      definition: '天干之间由于阴阳相吸而发生的化学化合反应：\n- 甲己合化土\n- 乙庚合化金\n- 丙辛合化水\n- 丁壬合化木\n- 戊癸合化火\n\n流月逢合代表关系靠近、人际交往舒缓、桃花交好、事情有了归宿和联络人。',
      videoCorrelate: '【中级八字基础】讲过，合化成功与否，需要看流月的地支是否具有化神的五行强气（月令生扶）。'
    },
    {
      term: '地支六冲 (最剧烈碰撞)',
      tag: '地支对抗',
      definition: '地支空间方位上180度正面对抗 clash，主冲动、走动、变迁：\n- 子午冲 (水火战)\n- 丑未冲 (湿燥土战)\n- 寅申冲 (金木战)\n- 卯酉冲 (金木战)\n- 辰戌冲 (四库冲开)\n- 巳亥冲 (水火交克)\n\n在流月测算中，地支犯六冲并不意味着血光灾祸，多意味着计划生变、地理变动（搬家、出差）、或情感情绪容易和配偶拉扯吵架。',
      videoCorrelate: '【黄历4月测算】重点指出：卯酉逢冲的日子特别容易感觉头部、四肢疲惫、筋骨发酸，应当避免深夜赶路，情绪烦闷时切勿强求争辩。'
    },
    {
      term: '地支六害 (穿害妨害)',
      tag: '地支倾轧',
      definition: '六害即地支由于“合方被拆散”而产生的小怨愤斗争，穿害性质偏向于心神不宁、内部小问题、小人拆台：\n- 子未害、丑午害、寅巳害、卯辰害、申亥害、酉戌害。\n\n例如：卯辰相害。辰本来想合酉，却被卯冲去（卯酉冲），所以辰讨厌卯。相穿在流月最容易出现的事情就像：明明是好意，却在沟通中产生心病。',
      videoCorrelate: '【自学中级核心：害的秘密】视频提到，月逢穿害，主要注意“不要做非必要的担保、不听街谈野议”，退一步安坐本职，则其害无立锥之地。'
    }
  ],
  'muku': [
    {
      term: '辰戌丑未「四墓库」定义',
      tag: '墓库神学',
      definition: '地支“辰、戌、丑、未”在传统八字上被称为【四墓库】（也就是四个五行土的大收集容器）。\n\n【辰】：水之墓库（温湿之土）\n【戌】：火之墓库（干燥之土）\n【丑】：金之墓库（寒冷之湿土）\n【未】：木之墓库（燥热之土）\n\n【墓】与【库】的区别：命局强而有根为“库”（财富、人才、实力的收容存储库）；命局弱而无气入此支则为“墓”（藏匿、尘封、压制不能施展）。',
      videoCorrelate: '【辰戌丑未四墓库详解视频】主旨：四库最喜“冲”！正所谓“土不冲不旺，库不冲不发”。当流年流月发生辰戌相冲、丑未相冲，正是土库之门被踢开，隐藏在里面的金、火、水、木五行宝藏被释放出来之时，往往在财运上会产生非同寻常的的横发（或大动作改组）表现！'
    },
    {
      term: '土不冲不旺，库不冲不发',
      tag: '墓库爆发',
      definition: '当八字中“土”是您的财星，并且有墓库。在平时，财气尘封在内，进账艰难。一旦流年流月（如：您是壬/癸水月元，戌火库为财，逢流月辰土来相冲），发生辰戌相冲，这就把土库的大门砸开了（暗藏天干激荡而出）。\n\n这往往意味着：本月会有突破常规赚大钱的机会，或者是处理大块资产、物业、获得退税和长线理财套现。',
      videoCorrelate: '【墓库解析】大课叮嘱：冲冲也看身强身弱。如果日元本就身极弱，不耐折腾，这时候开库反而容易出现“因财生灾”或资产缩水（扛不住土的激荡），此时开库宜静不宜动，唯有身强力气足者才能稳稳接住这波泼天大财运。'
    }
  ]
};
