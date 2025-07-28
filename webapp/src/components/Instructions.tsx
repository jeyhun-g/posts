// components/InstructionCard.tsx
import React from 'react';
import InstructionCard, { InstructionCardProps } from './InstructionCard';

export interface InstructionsProps {
  instructions: InstructionCardProps[]
}

const Instructions: React.FC<InstructionsProps> = ({ instructions }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-4 my-6">
      {instructions.map((instruction) => (
        <div key={instruction.title} className="m-2 flex min-w-2xs max-w-2xs">
          <InstructionCard {...instruction} />
        </div>
      ))}
    </div>
  );
};

export default Instructions;
