'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProgressPage() {
  const [selectedStage, setSelectedStage] = useState('1');
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Слушаем юзера и скачиваем его реальную историю из MongoDB
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const res = await fetch(`https://ifeelyou-back.onrender.com/api/progress/${currentUser.uid}`);
          const data = await res.json();
          setHistory(data);
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-purple text-2xl animate-pulse">Деректер жүктелуде...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-brand-purple">Кіру қажет (Пожалуйста, войдите)</div>;

  // ================= АНАЛИТИКА ДАННЫХ =================

  // 2. Считаем общую статистику для Круговой диаграммы (PieChart)
  let totalCorrect = 0;
  let totalWrong = 0;
  history.forEach(game => {
    totalCorrect += game.correct;
    totalWrong += (game.total - game.correct);
  });

  const pieData = [
    { name: 'Дұрыс', value: totalCorrect > 0 ? totalCorrect : 1, color: '#5c6bc0' }, 
    { name: 'Қате', value: totalWrong, color: '#eef0f8' }
  ];

  // 3. Подготавливаем данные для Линейного графика (Группируем игры по дням)
  const activityMap = {};
  history.forEach(game => {
    const dateObj = new Date(game.createdAt);
    // Формат "ДД.ММ" (например 10.04)
    const dayString = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!activityMap[dayString]) activityMap[dayString] = 0;
    activityMap[dayString] += 1; // Считаем количество сыгранных игр в этот день
  });

  const activityData = Object.keys(activityMap).map(day => ({
    day,
    score: activityMap[day]
  }));

  // 4. Фильтруем историю по выбранному Кезең (Для левой нижней карточки)
  const stageHistory = history.filter(game => game.stage === parseInt(selectedStage));

  // 5. ЛОГИКА АЧИВОК (Разблокируются автоматически на основе реальных данных!)
  const checkAchievement = (stageNum, needPerfect) => {
    const games = history.filter(g => g.stage === stageNum);
    if (games.length === 0) return false;
    if (needPerfect) {
      return games.some(g => g.correct === g.total); // Ищет хотя бы одну игру без ошибок
    }
    return true; // Просто прошел этап
  };

  const achievements = [
    { id: 1, title: 'Шапшаң қоян', desc: '1-Кезең: Ойынды аяқтау', icon: '🐇', unlocked: checkAchievement(1, false) },
    { id: 2, title: 'Ақылды түлкі', desc: '1-Кезең: Қатесіз жауаптар', icon: '🦊', unlocked: checkAchievement(1, true) },
    { id: 3, title: 'Жүйрік жылқы', desc: '2-Кезең: Ойынды аяқтау', icon: '🐎', unlocked: checkAchievement(2, false) },
    { id: 4, title: 'Дана үкі', desc: '2-Кезең: Жоғары концентрация', icon: '🦉', unlocked: checkAchievement(2, true) },
    { id: 5, title: 'Жылдам леопард', desc: '3-Кезең: Сөздерді аяқтау', icon: '🐆', unlocked: checkAchievement(3, false) },
    { id: 6, title: 'Күшті айдаһар', desc: '3-Кезең: Максималды деңгей', icon: '🐉', unlocked: checkAchievement(3, true) },
    { id: 7, title: 'Арыстан лидер', desc: 'Барлық кезеңді аяқтау', icon: '🦁', unlocked: (checkAchievement(1, false) && checkAchievement(2, false) && checkAchievement(3, false)) },
  ];
  const handleNextStage = () => setSelectedStage(prev => prev === '3' ? '1' : String(Number(prev) + 1));
  const handlePrevStage = () => setSelectedStage(prev => prev === '1' ? '3' : String(Number(prev) - 1));

  return (
    <div className="max-w-7xl mx-auto px-10 py-10 animate-fade-in">
      
      {/* ВЕРХНИЙ БЛОК: Графики */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        
        {/* График активности */}
        <div className="flex-[2] bg-[#f2f4fa] rounded-[40px] p-10 shadow-sm border border-indigo-50 relative">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-brand-purple">Ойындарға қатысу жиілігі</h2>
            <span className="text-brand-purple font-semibold tracking-wider text-sm uppercase">Ойналған ойындар саны</span>
          </div>
          <div className="h-64 w-full">
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#5c6bc0', fontSize: 12, fontWeight: 600}} dy={10} />
                  <Tooltip cursor={{ stroke: '#e0e7ff', strokeWidth: 40 }} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="score" stroke="#5c6bc0" strokeWidth={5} dot={{r: 6, fill: '#5c6bc0', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Әзірге статистика жоқ (Пока нет данных)</div>
            )}
          </div>
        </div>

        {/* Круговая диаграмма */}
        <div className="flex-1 bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 flex flex-col items-center justify-center relative">
          <h3 className="text-xl font-bold text-brand-purple absolute bottom-10">Жалпы нәтиже</h3>
          <div className="h-56 w-56 relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={100} dataKey="value" stroke="none" cornerRadius={10}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className="text-3xl font-bold text-brand-purple">{totalCorrect}</span>
               <span className="text-xs text-gray-400">Дұрыс</span>
            </div>
          </div>
        </div>

      </div>

      {/* НИЖНИЙ БЛОК: Статистика по этапам и Ачивки */}
      <h2 className="text-4xl font-bold text-brand-purple mb-8">Кезеңдер бойынша жетістігіңіз</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Левая часть: История выбранного этапа */}
        <div className="flex-[2] bg-[#f2f4fa] rounded-[40px] p-10 shadow-sm border border-indigo-50 overflow-hidden">
          
          {/* КРАСИВЫЙ СЛАЙДЕР ВМЕСТО SELECT */}
          <div className="flex justify-between items-center mb-10 bg-white p-2 rounded-full shadow-sm">
            <button onClick={handlePrevStage} className="w-10 h-10 bg-[#eef0f8] rounded-full flex items-center justify-center text-brand-purple font-bold hover:bg-brand-purple hover:text-white transition-colors duration-300">
              {"<"}
            </button>
            <h3 className="text-xl font-bold text-brand-purple w-48 text-center transition-all duration-300">
              {selectedStage === '1' && '1-Кезең: Дыбыстар'}
              {selectedStage === '2' && '2-Кезең: Буындар'}
              {selectedStage === '3' && '3-Кезең: Сөздер'}
            </h3>
            <button onClick={handleNextStage} className="w-10 h-10 bg-[#eef0f8] rounded-full flex items-center justify-center text-brand-purple font-bold hover:bg-brand-purple hover:text-white transition-colors duration-300">
              {">"}
            </button>
          </div>
          
          {/* Анимация переключения key={selectedStage} */}
          <div key={selectedStage} className="space-y-6 overflow-y-auto max-h-80 pr-4 custom-scrollbar animate-fade-in">
            {stageHistory.length > 0 ? stageHistory.map((game, index) => {
               const percentage = Math.round((game.correct / game.total) * 100);
               return (
                <div key={index} className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm">
                  <span className="text-gray-500 font-medium w-24">
                    {new Date(game.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <div className="flex-1 bg-[#eef0f8] h-3 rounded-full overflow-hidden relative">
                    <div className="bg-brand-purple h-full rounded-full transition-all duration-1000" style={{width: `${percentage}%`}}></div>
                  </div>
                  <span className="text-brand-purple font-bold w-12 text-right">{percentage}%</span>
                </div>
               )
            }) : (
              <div className="text-center py-10">
                <p className="text-gray-400 font-medium">Бұл кезеңді әлі ойнаған жоқсыз.</p>
                <p className="text-xs text-gray-300 mt-2">(История игр пока пуста)</p>
              </div>
            )}
          </div>
        </div>

        {/* Правая часть: Ачивки */}
        <div className="flex-1 bg-[#f2f4fa] rounded-[40px] p-8 shadow-sm border border-indigo-50">
          <h3 className="text-2xl font-bold text-brand-purple mb-6">Жетістіктер</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`p-4 rounded-[20px] flex items-center gap-4 transition-all duration-300 ${
                  ach.unlocked ? 'bg-brand-purple text-white shadow-md transform hover:scale-105' : 'bg-[#e0e4f5] text-brand-purple/50 grayscale'
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-white shadow-inner ${ach.unlocked ? '' : 'opacity-50'}`}>
                  {ach.unlocked ? ach.icon : '🔒'}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{ach.title}</h4>
                  <p className={`text-xs mt-1 ${ach.unlocked ? 'text-indigo-200' : 'text-brand-purple/40'}`}>{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}