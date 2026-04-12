'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function DailyBitesPage() {
  const [affairs, setAffairs] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [affairsRes, quizRes] = await Promise.all([
          api.get('/engagement/current-affairs').then(res => res.data),
          api.get('/engagement/daily-quiz').then(res => res.data)
        ]);
        if (Array.isArray(affairsRes)) setAffairs(affairsRes);
        if (quizRes && quizRes.questions) setQuiz(quizRes);
      } catch (err) {
        console.error('Error fetching daily bites:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const getScore = () => {
    let score = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.correctAnswer) score++;
    });
    return score;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <RefreshCw className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Daily Affairs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-end justify-between border-b border-black/10 dark:border-white/10 pb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
                Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Bites</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-2 flex items-center gap-2">
                <Calendar size={16} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold shrink-0">
              <Clock size={14} /> Read time: 5 mins
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {affairs.map((affair, i) => (
              <motion.div
                key={affair._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-black/5 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/10 group cursor-pointer"
              >
                <div className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-full mb-4">
                  {affair.category}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-3 group-hover:text-blue-500 transition-colors">
                  {affair.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3">
                  {affair.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Gamified Quiz */}
        <div className="space-y-8">
          <div className="sticky top-32">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-1 rounded-[2.5rem] shadow-2xl shadow-blue-500/20">
              <div className="bg-white dark:bg-zinc-900 rounded-[2.3rem] p-8 h-full">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tight">
                  Daily 5-Min Quiz
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8">
                  Test your current affairs knowledge
                </p>

                {!quizStarted ? (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="text-blue-600 w-10 h-10" />
                    </div>
                    <button
                      onClick={() => setQuizStarted(true)}
                      className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-xl"
                    >
                      Start Quiz
                    </button>
                  </div>
                ) : !quizCompleted ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-400 tracking-wider">
                      <span>QUESTION {currentQuestion + 1}/{quiz.questions.length}</span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                      />
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-4">
                      {quiz.questions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3 mt-6">
                      {quiz.questions[currentQuestion].options.map((option: string, index: number) => {
                        const isSelected = selectedAnswers[currentQuestion] === index;
                        return (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(currentQuestion, index)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between ${
                              isSelected 
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                : 'border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-blue-500/30'
                            }`}
                          >
                            {option}
                            {isSelected && <CheckCircle2 size={18} />}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[currentQuestion] === undefined}
                      className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all hover:-translate-y-0.5 mt-8 block"
                    >
                      {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-black text-green-600">{getScore()}/{quiz.questions.length}</span>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Quiz Complete!</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
                      Great job staying updated today.
                    </p>
                    
                    <div className="space-y-4 text-left">
                      {quiz.questions.map((q: any, i: number) => (
                        <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                          <p className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Q: {q.question}</p>
                          <p className={`text-xs font-semibold flex items-center gap-1 ${
                            selectedAnswers[i] === q.correctAnswer ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {selectedAnswers[i] === q.correctAnswer ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                            {selectedAnswers[i] === q.correctAnswer ? 'Correct' : 'Incorrect'}
                          </p>
                          <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{q.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setQuizStarted(false);
                        setQuizCompleted(false);
                        setCurrentQuestion(0);
                        setSelectedAnswers({});
                      }}
                      className="w-full mt-6 py-3 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold uppercase rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Restart Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
