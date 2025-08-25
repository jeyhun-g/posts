'use client';
import React, { useEffect, useState } from 'react';
import Blogs from '@app/components/Blogs'

interface BloInfo {
  title: string
  url: string
  date: string
  imageUrl: string
  keywords: {
    name: string
    level: string
  }[]
}

export default function View() {
  const [blogs, setBlogs] = useState<BloInfo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/data.json');
      const data: BloInfo[] = await res.json();
      setBlogs(data);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
      <Blogs blogs={blogs} />
    </div>
  );
}
