// components/InstructionCard.tsx
import React from 'react';

export interface InstructionCardProps {
  title: string;
  body: string;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ title, body }) => {
  return (
    <div className="flex flex-col w-full max-w-xl bg-white shadow-md border border-gray-300 rounded-2xl px-6 py-4">
      <h2 className="text-center text-lg font-semibold mb-2">{title}</h2>
      <p className="text-left text-sm text-gray-700">{body}</p>
    </div>
  );
};

export default InstructionCard;
