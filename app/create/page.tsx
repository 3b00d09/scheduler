// // app/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { generateStudyPlan } from '@/app/lib/actions';
// import { getApiKey, saveApiKey, savePlan, checkWeeklyReset } from '@/app/lib/utils';
// import { ApiKeyInput } from '@/app/lib/components/ApiKeyInput';
// import { ScheduleInput } from '@/app/lib/components/ScheduleInput';
// import { FeaturesList } from '@/app/lib/components/FeaturesList';

// const EXAMPLE_TEXT = `My weekly nursing university schedule:

// CLASSES:
// - Monday: Nursing Fundamentals 9:00-12:00, Anatomy Lab 14:00-17:00
// - Tuesday: Pharmacology lecture 10:00-12:00, Clinical Skills 14:00-17:00  
// - Wednesday: Pathophysiology 9:00-11:00, Patient Care Workshop 13:00-16:00
// - Thursday: FREE DAY (no classes)
// - Friday: Community Health 9:00-12:00, then I have a project presentation at 15:00

// WORK (Hotel night shifts):
// - Friday 22:00 to Saturday 06:00
// - Saturday 22:00 to Sunday 06:00

// COMMUTE: 
// - Train ride is 45 minutes each way
// - I leave home around 7:30 AM to arrive by 8:30 AM

// URGENT DEADLINES:
// - Care plan assignment due Thursday 23:59
// - Pharmacology quiz next Tuesday during class
// - Clinical reflection report due in 10 days

// FINAL EXAMS COMING UP:
// - Anatomy: December 15
// - Pharmacology: December 18  
// - Patient Care: December 20

// PERSONAL NOTES:
// - I'm completely exhausted after night shifts and need good sleep
// - I wake up around 6:00 AM on class days
// - I prefer studying in the morning when I'm fresh
// - Need time for meals and family
// - Thursday is my power day since no classes!`;

// export default function Home() {
//   const router = useRouter();
//   const [apiKey, setApiKey] = useState('');
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     checkWeeklyReset();
//     setApiKey(getApiKey());
//   }, []);

//   const handleApiKeyChange = (key: string) => {
//     setApiKey(key);
//     saveApiKey(key);
//   };

//   const handleGenerate = async () => {
//     if (!inputText.trim()) {
//       alert('Please enter your schedule information');
//       return;
//     }

//     if (!apiKey || !apiKey.startsWith('sk-')) {
//       alert('Please add your OpenAI API key');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const result = await generateStudyPlan(inputText, apiKey);

//       if (!result.success) {
//         throw new Error(result.error);
//       }

//       savePlan(result.plan);
//       router.push('/result');
//     } catch (error: any) {
//       alert(error.message || 'Failed to generate plan');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-violet-600 flex flex-col items-center justify-center text-white">
//         <div className="w-30 h-30 rounded-full bg-white/20 flex items-center justify-center mb-8">
//           <div className="w-15 h-15 border-4 border-white/30 border-t-white rounded-full animate-spin" />
//         </div>
//         <h2 className="text-3xl font-black mb-2.5">Creating Your Plan</h2>
//         <p className="text-base opacity-80 font-semibold">
//           AI is analyzing your schedule...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//         <ApiKeyInput value={apiKey} onChange={handleApiKeyChange} />
//         <ScheduleInput
//           value={inputText}
//           onChange={setInputText}
//           onLoadExample={() => setInputText(EXAMPLE_TEXT)}
//         />
//         <FeaturesList />
//         <button
//           onClick={handleGenerate}
//           disabled={isLoading}
//           className="w-full bg-violet-600 text-white rounded-2xl p-5 text-lg font-extrabold shadow-lg shadow-violet-600/40 hover:bg-violet-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/50 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           ✨ Create My Plan →
//         </button>
//     </div>
//   );
// }

export default function Page(){
  return(
    <div>TODO</div>
  )
}