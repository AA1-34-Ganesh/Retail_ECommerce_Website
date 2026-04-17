import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FloatingChatButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/chat"
      className="fixed bottom-6 right-6 z-40 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="floating-chat-btn"
    >
      {/* Animated background pulse */}
      <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping"></div>

      {/* Main button */}
      <div className="relative w-14 h-14 rounded-full gradient-primary shadow-lg shadow-primary-500/40
        flex items-center justify-center text-white text-2xl
        hover:shadow-2xl hover:shadow-primary-500/60 hover:scale-110
        transition-all duration-300 cursor-pointer">
        🤖
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-surface-800 text-surface-100 px-3 py-2 rounded-lg
          text-sm whitespace-nowrap shadow-lg border border-surface-700/50 animate-scale-in">
          Ask SmartCart AI
          <div className="absolute -bottom-1 right-3 w-2 h-2 bg-surface-800 rotate-45"></div>
        </div>
      )}
    </Link>
  );
}
