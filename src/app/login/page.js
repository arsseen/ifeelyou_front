


'use client';

import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Стучимся на наш готовый бэкенд
      const response = await fetch('https://ifeelyou-back.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: googleUser.uid,
          displayName: googleUser.displayName,
          email: googleUser.email,
          photoURL: googleUser.photoURL,
        }),
      });

      if (response.ok) {
        // Успешный вход -> переходим в меню выбора игр
        router.push('/games/select'); 
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Центрируем всё по экрану с приятным серым фоном
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      
      {/* Главная белая карточка */}
      <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-xl w-full max-w-md text-center border border-gray-50 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        
        {/* Анимация: Плавающие декоративные круги на фоне */}
        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-brand-yellow rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-brand-purple rounded-full opacity-10 animate-bounce" style={{ animationDuration: '4s' }}></div>

        {/* Заголовок и текст */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative z-10">
          Қош келдіңіз!
        </h1>
        <p className="text-gray-500 mb-10 relative z-10 text-sm md:text-base px-2">
          Оқуды бастау немесе жалғастыру үшін жүйеге кіріңіз
        </p>

        {/* Единственная кнопка Google */}
        <button 
          onClick={handleGoogleAuth} 
          disabled={loading}
          className="relative z-10 flex items-center justify-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 w-full hover:border-brand-purple hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-7 h-7"/>
          <span className="font-bold text-gray-700 text-lg tracking-wide">
            {loading ? 'Күте тұрыңыз...' : 'Google арқылы кіру'}
          </span>
        </button>

      </div>
    </div>
  );
}