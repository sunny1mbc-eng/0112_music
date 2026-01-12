
import React, { useState, useEffect, useCallback } from 'react';
import { fetchCommuteSongs } from './services/geminiService.ts';
import { Song } from './types.ts';
import SongCard from './components/SongCard.tsx';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRecommend = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!theme.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await fetchCommuteSongs(theme);
      setSongs(result.songs);
      setHasSearched(true);
    } catch (err) {
      setError('추천을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [theme]);

  const handleReset = () => {
    setTheme('');
    setSongs([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Commute Beats</h1>
          </div>
          {hasSearched && !loading && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              다시 입력하기
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!hasSearched ? (
          <div className="text-center py-10 md:py-20">
            <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              오늘 출퇴근 길은<br />어떤 음악과 함께할까요?
            </h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">
              좋아하는 테마나 장르를 입력하시면, 당신만을 위한 7곡의 플레이리스트를 만들어 드립니다.
            </p>
            
            <form onSubmit={handleRecommend} className="max-w-lg mx-auto relative">
              <input 
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="예: 비 오는 날 감성, 신나는 시티팝, 퇴근길 힐링"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={loading || !theme.trim()}
                className="mt-4 w-full md:w-auto md:absolute md:right-2 md:top-2 md:mt-0 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
              >
                {loading ? '추천 생성 중...' : '추천 받기'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 gap-4">
              <div>
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-2 block">Personalized Playlist</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  '{theme}' 추천 목록
                </h2>
                <p className="text-gray-500 mt-1">오늘 당신의 출퇴근을 채워줄 7곡입니다.</p>
              </div>
              <button 
                onClick={handleRecommend}
                className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition-colors"
                disabled={loading}
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>다시 추천 받기</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-50 h-48 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song, index) => (
                  <SongCard key={`${song.title}-${index}`} song={song} index={index} />
                ))}
              </div>
            )}
            
            <div className="text-center pt-10 text-gray-400 text-sm">
              <p>추천 목록은 AI에 의해 매번 새롭게 생성됩니다.</p>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Footer Info */}
      <footer className="py-8 bg-white border-t border-gray-50 text-center">
        <p className="text-gray-400 text-xs">
          &copy; 2024 Commute Beats. 70% Korean, 30% International Music Ratio Applied.
        </p>
      </footer>
    </div>
  );
};

export default App;
