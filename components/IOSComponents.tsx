import React from 'react';

// --- iOS 6 Glassy Button ---
interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const IOSButton: React.FC<IOSButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'secondary', 
  size = 'md',
  ...props 
}) => {
  const baseStyle = "font-bold rounded-lg border shadow-sm active:shadow-inner active:brightness-90 transition-all flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-to-b from-[#4a90e2] to-[#007aff] border-[#005fb8] text-white text-inset-dark-bg",
    success: "bg-gradient-to-b from-[#6ee582] to-[#4cd964] border-[#3cb853] text-white text-inset-dark-bg",
    danger: "bg-gradient-to-b from-[#ff5f5f] to-[#ff3b30] border-[#d9332a] text-white text-inset-dark-bg",
    secondary: "bg-gradient-to-b from-white to-[#f0f0f0] border-gray-400 text-gray-800 text-inset-light-bg active:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- iOS 6 Segmented Control ---
export const IOSSegmentedControl: React.FC<{
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}> = ({ options, value, onChange, className = '' }) => {
  return (
    <div className={`flex bg-gradient-to-b from-[#bdc3c7] to-[#aeb5ba] p-[2px] rounded-lg border border-[#8e959b] shadow-inner ${className}`}>
      {options.map((opt, idx) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 py-1.5 text-xs font-bold text-center transition-all
              ${idx === 0 ? 'rounded-l-md' : ''} 
              ${idx === options.length - 1 ? 'rounded-r-md' : ''}
              ${isActive 
                ? 'bg-gradient-to-b from-[#fcfcfc] to-[#e0e0e0] text-gray-800 shadow-sm border border-gray-400 z-10' 
                : 'text-gray-600 border-r border-gray-400/30 last:border-r-0 hover:bg-black/5'}
            `}
          >
            <span className={isActive ? 'text-inset-light-bg' : 'text-shadow-sm'}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- iOS 6 Inset Panel (Card) ---
export const IOSCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#f5f7fa] rounded-xl border border-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] ${className}`}>
      {children}
    </div>
  );
};

// --- iOS 6 List Item ---
export const IOSListItem: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  hasArrow?: boolean;
}> = ({ children, onClick, className = '', hasArrow = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative bg-white border-b border-gray-300 px-3 py-2 first:rounded-t-xl last:rounded-b-xl last:border-b-0
        active:bg-blue-50 cursor-pointer flex items-center justify-between
        ${className}
      `}
    >
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {hasArrow && (
        <span className="text-gray-400 font-bold ml-2 text-xl flex-none">›</span>
      )}
    </div>
  );
};

// --- iOS 6 Header ---
export const IOSHeader: React.FC<{ title: string; leftButton?: React.ReactNode; rightButton?: React.ReactNode }> = ({ title, leftButton, rightButton }) => {
  return (
    <header className="h-14 bg-gradient-to-b from-[#d6dde4] to-[#aebccf] border-b border-[#8a96a3] shadow-sm flex items-center justify-between px-2 relative z-10 shrink-0">
      <div className="w-16 flex justify-start">
        {leftButton}
      </div>
      <h1 className="text-slate-800 font-bold text-xl text-inset-light-bg truncate flex-1 text-center font-sans tracking-tight">
        {title}
      </h1>
      <div className="w-16 flex justify-end">
        {rightButton}
      </div>
    </header>
  );
};

// --- iOS 6 Toggle Switch ---
export const IOSToggle: React.FC<{ checked: boolean; onChange: (c: boolean) => void }> = ({ checked, onChange }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`
        w-14 h-8 rounded-full border border-gray-400 shadow-inner relative cursor-pointer transition-colors duration-300
        ${checked ? 'bg-[#4cd964]' : 'bg-white'}
      `}
    >
      <div 
        className={`
          absolute top-[1px] w-7 h-[28px] bg-white rounded-full border border-gray-300 shadow-md transition-transform duration-300 transform
          ${checked ? 'translate-x-6' : 'translate-x-0'}
        `}
      />
    </div>
  );
};
