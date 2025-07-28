// components/InstructionCard.tsx
import React from 'react';

export interface ResultCardProps {
  name: string;
  level: string;
}

const levelBgColor: Record<ResultCardProps['level'], string> = {
  'beginner': 'bg-blue-200',
  'intermediate': 'bg-indigo-200',
  'advanced': 'bg-slate-200',
};


const ResultCard: React.FC<ResultCardProps> = ({ name, level }) => {
  const bgColor = levelBgColor[level.toLowerCase()];

  return (
    <div className={`flex flex-col items-center w-full max-w-xs shadow-md border border-gray-300 rounded-md px-2 py-1 ${bgColor}`}>
      <p className="text-base font-medium text-center">{name}</p>
      <p className="text-sm text-gray-500 text-center mt-1">{level}</p>
    </div>
  );
};

export default ResultCard;
