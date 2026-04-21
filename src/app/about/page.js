'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  // Отправка формы на наш Бэкенд
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Жіберілуде... (Отправка...)');
    try {
      const res = await fetch('https://ifeelyou-back.onrender.com/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('Хабарлама сәтті жіберілді! (Успешно!)');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('Қате шықты. (Ошибка)');
      }
    } catch (err) {
      setStatus('Сервермен байланыс жоқ.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-10 animate-fade-in">
      
      {/* Секция: Біз жайлы ақпарат */}
      <section id="about" className="mb-20 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-brand-purple mb-6">
            Біз жайлы <span className="text-brand-yellow">ақпарат</span>
          </h2>
          <p className="text-brand-purple/80 leading-relaxed mb-4">
            Қазақстандағы алғашқы балаларға арналған Брайль жазу жүйесін тез, дұрыс және қызықты меңгеруге арналған құрылғы.
          </p>
          <p className="text-brand-purple/80 leading-relaxed">
            Біздің мақсатымыз - білім алу мүмкіндіктерін теңестіру және көру қабілеті шектеулі балалардың өмірін жақсарту.
          </p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-indigo-100 to-white p-10 rounded-[40px] shadow-lg relative h-64">
           {/* Декорация в стиле макета */}
           <div className="absolute top-4 left-4 bg-brand-yellow text-brand-dark font-bold py-2 px-4 rounded-xl rotate-[-10deg]">А</div>
           <div className="absolute bottom-10 left-10 bg-red-300 text-brand-dark font-bold py-2 px-4 rounded-xl rotate-[15deg]">Б</div>
           <div className="absolute right-10 top-20 bg-brand-yellow text-brand-dark font-bold py-2 px-4 rounded-xl rotate-[5deg]">О</div>
        </div>
      </section>

      {/* Секция: Миссия */}
      <section className="bg-[#eef0f8] rounded-3xl p-10 text-center mb-20 shadow-sm border border-indigo-50">
        <h3 className="text-2xl text-brand-purple font-medium leading-relaxed max-w-4xl mx-auto">
          <span className="text-brand-yellow font-bold">Біздің миссиямыз</span> – әр балаға Брайль жазу жүйесін үйренуге теңдей мүмкіндік беру. Ойын арқылы оқу процесін жеңілдету.
        </h3>
      </section>

      {/* Секция: Жоба мүшелері */}
      {/* Секция: Жоба мүшелері */}
      <section className="mb-20 text-center">
        <h2 className="text-3xl font-bold text-brand-purple mb-10">Жоба мүшелері</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Айымгүл Маймақова', 
              role: 'Software инженер', 
              desc: 'Айымгүл пайдаланушы интерфейсін және жалпы бағдарламалық 3D design мен 3D print әзірлеуге жауапты. Ол UI/UX дизайн принциптерін негізге ала отырып, құрылғының қолданушыға ыңғайлы болуын қамтамасыз етеді.',
              image: '/images/person1.png' // Твоя первая картинка
            },
            { 
              name: 'Чарос Юлдашбекова', 
              role: 'Project manager', 
              desc: 'Чарос жобаға стратегиялық бағыт береді және оның әртүрлі кезеңдерінде проект-менеджмент қызметін атқарады. Оның жауапкершілігіне нарық зерттеулері, қолданушылармен байланыс және серіктестік байланыстарын басқару кіреді.',
              image: '/images/person2.png' // Твоя вторая картинка
            },
            { 
              name: 'Әсем Қойшыманова', 
              role: 'Hardware инженер', 
              desc: 'Әсем жобаның аппараттық бөлігін әзірлеуге жауапты. Оның міндеті құрылғының тиімділігін және қолдану мүмкіндігін қамтамасыз ету үшін жұмыс істеуде. Қазіргі уақытта Әсем Arduino негізінде прототипті жасап, оның функционалдығын жақсартуда.',
              image: '/images/person3.png' // Твоя третья картинка
            }
          ].map((member, i) => (
            <div key={i} className="bg-white rounded-[30px] p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center border border-gray-100">
              <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 overflow-hidden flex items-center justify-center">
                {/* Теперь тут реальные фото */}
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-brand-purple mb-2">{member.name}</h3>
              <p className="text-sm font-semibold text-gray-500 mb-4">{member.role}</p>
              <p className="text-xs text-gray-400 px-4 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Секция: Бізбен байланыс (Форма) */}
      <section id="contact" className="bg-white rounded-[40px] shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-50">
        
        {/* Левая часть (Контакты) */}
        <div className="bg-brand-purple p-12 text-white flex-1 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-yellow rounded-full opacity-80"></div>
          <h2 className="text-3xl font-bold mb-2 z-10 relative">Бізбен байланыс</h2>
          <p className="text-indigo-200 mb-10 z-10 relative">Қосымша сұрақтарыңыз болса, хабарласыңыз.</p>
          
          <div className="space-y-8 z-10 relative">
            <div className="flex items-center gap-4">
              <div className="bg-white text-brand-yellow w-12 h-12 rounded-full flex items-center justify-center text-xl">✉️</div>
              <div><p className="font-bold text-lg">Электрондық пошта</p><p className="text-indigo-200">hello@ifeelyou.kz</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white text-brand-yellow w-12 h-12 rounded-full flex items-center justify-center text-xl">📞</div>
              <div><p className="font-bold text-lg">Телефон нөмірі</p><p className="text-indigo-200">+7 700 123 4567</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white text-brand-yellow w-12 h-12 rounded-full flex items-center justify-center text-xl">📍</div>
              <div><p className="font-bold text-lg">Мекенжай</p><p className="text-indigo-200">Алматы қ., Абай даңғылы 10</p></div>
            </div>
          </div>
        </div>

        {/* Правая часть (Форма ввода) */}
        <div className="p-12 flex-1 bg-white">
          <h2 className="text-3xl font-bold text-brand-purple mb-8">Хабарлама жіберу</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-brand-purple text-sm font-medium mb-2 block">Аты-жөні</label>
                <input required type="text" placeholder="Өз атыңызды енгізіңіз" className="w-full bg-[#eef0f8] p-4 rounded-xl text-sm outline-brand-purple"
                  onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} />
              </div>
              <div className="flex-1">
                <label className="text-brand-purple text-sm font-medium mb-2 block">Электрондық пошта</label>
                <input required type="email" placeholder="Поштаңызды енгізіңіз" className="w-full bg-[#eef0f8] p-4 rounded-xl text-sm outline-brand-purple"
                  onChange={e => setFormData({...formData, email: e.target.value})} value={formData.email} />
              </div>
            </div>
            <div>
              <label className="text-brand-purple text-sm font-medium mb-2 block">Тақырыбы</label>
              <input type="text" placeholder="Хабарлама тақырыбы" className="w-full bg-[#eef0f8] p-4 rounded-xl text-sm outline-brand-purple"
                onChange={e => setFormData({...formData, subject: e.target.value})} value={formData.subject} />
            </div>
            <div>
              <label className="text-brand-purple text-sm font-medium mb-2 block">Хабарлама</label>
              <textarea required placeholder="Хабарламаңызды осында жазыңыз..." rows="4" className="w-full bg-[#eef0f8] p-4 rounded-xl text-sm outline-brand-purple resize-none"
                onChange={e => setFormData({...formData, message: e.target.value})} value={formData.message}></textarea>
            </div>
            
            <button type="submit" className="bg-brand-purple text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition float-right flex items-center gap-2">
              Жіберу ✈️
            </button>
            {status && <p className="text-brand-purple text-sm font-bold mt-4 clear-both">{status}</p>}
          </form>
        </div>

      </section>
    </div>
  );
}