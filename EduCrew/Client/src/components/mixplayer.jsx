import React from 'react';
import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2 } from 'lucide-react';

const MusicPlayer = () => {
  return (
    <footer className="h-16 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src="/api/placeholder/40/40" alt="Album Art" className="w-10 h-10 rounded" />
        <div>
          <div className="text-sm font-medium">Study Focus Mix</div>
          <div className="text-xs text-gray-400">Lo-fi Beats</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white">
          <Shuffle className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <SkipBack className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center hover:bg-fuchsia-600">
          <Play className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <SkipForward className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <Repeat className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <div className="w-24 h-1 bg-gray-800 rounded-full">
          <div className="w-3/4 h-full bg-fuchsia-500 rounded-full" />
        </div>
      </div>
    </footer>
  );
};

export default MusicPlayer;