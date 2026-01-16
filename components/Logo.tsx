
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Premium Gold Gradient for the text */}
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        
        {/* Subtle shadow for depth */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>

      <g transform="translate(100, 100)" filter="url(#logoShadow)">
        {/* "فطاطرى" - Compact and elegant at the top */}
        <text 
          x="0" 
          y="-15" 
          textAnchor="middle" 
          fill="url(#logoGold)"
          style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          فطاطرى
        </text>

        {/* "أطياب" - Large and bold as the main brand */}
        <text 
          x="0" 
          y="50" 
          textAnchor="middle" 
          fill="url(#logoGold)"
          style={{ 
            fontSize: '68px', 
            fontWeight: '900', 
            fontFamily: 'Cairo, sans-serif',
            letterSpacing: '-1px'
          }}
        >
          أطياب
        </text>
      </g>
    </svg>
  );
};

export default Logo;
