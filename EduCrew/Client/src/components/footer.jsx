import React from 'react';
import { Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="h-16 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl px-4">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/api/placeholder/40/40" alt="Music thumbnail" className="w-10 h-10 rounded" />
          <div>
            <div className="text-sm font-medium">Study Music</div>
            <div className="text-xs text-gray-400">Lo-fi Beats</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SkipBack className="w-4 h-4 text-gray-400" />
          <Play className="w-4 h-4 text-gray-400" />
          <SkipForward className="w-4 h-4 text-gray-400" />
          <Volume2 className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
