'use client';

import React from 'react';
import Image from 'next/image';

export interface BlogCardProps {
  url: string;
  title: string;
  date: string;
  imageUrl: string;
  keywords: {
    name: string;
    level: string;
  }[]
}

const BlogCard: React.FC<BlogCardProps> = ({ url, title, date, imageUrl, keywords }) => {
  const grouped = keywords?.reduce(
    (acc, item) => {
      if(!acc[item.level]){
        acc[item.level] = []
      }
      acc[item.level].push(item.name);
      return acc;
    },
    {} as {[key:string]:string[]}
  ) ?? {};

  return (
    <div
      className="flex flex-col w-full max-w-sm bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden cursor-pointer transition hover:shadow-lg"
      onClick={() => window.open(url, '_blank')}
    >
      <div className="relative w-full h-48 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No image available
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{new Date(date).toDateString()}</p>
        {Object.entries(grouped).map(([key, value]) => (
          <div key={key} className="mb-2">
            <p className="text-sm font-medium mb-2">{key}</p>
            <div className="flex flex-wrap gap-2">
              {value.map((keyword) => (
                <div
                  key={keyword}
                  className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-full"
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;
