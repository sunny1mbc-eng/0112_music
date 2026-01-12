
import React from 'react';
import { Song } from '../types.ts';

interface SongCardProps {
  song: Song;
  index: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const searchQuery = encodeURIComponent(`${song.artist} ${song.title}`);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
          #{index + 1} {song.origin === 'Korean' ? '국내' : '해외'}
        </span>
        <a 
          href={youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="유튜브에서 듣기"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
        </a>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
        {song.title}
      </h3>
      <p className="text-gray-600 font-medium mb-3">
        {song.artist}
      </p>
      
      <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg italic">
        " {song.description} "
      </p>

      <a 
        href={youtubeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 block w-full text-center py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        감상하기
      </a>
    </div>
  );
};

export default SongCard;
