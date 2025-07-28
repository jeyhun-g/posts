// components/InstructionCard.tsx
import React from 'react';
import ResultCard, { ResultCardProps } from './ResultCard';

export interface ResultsProps {
  results: ResultCardProps[]
}

const Instructions: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="flex flex-col justify-center gap-4 my-6">
      {results.map((result, idx) => (
        <div key={idx} className="flex min-w-2xs max-w-2xs">
          <ResultCard {...result} />
        </div>
      ))}
    </div>
  );
};

export default Instructions;
