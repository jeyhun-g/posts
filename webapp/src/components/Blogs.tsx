import React from 'react';
import BlogCard, { BlogCardProps } from './BlogCard';

export interface BlogsProps {
  blogs: BlogCardProps[]
}

const Instructions: React.FC<BlogsProps> = ({ blogs }) => {
  return (
    <div className="flex flex-col gap-4 my-6">
      <p className="text-center text-2xl">Blogs</p>
      <div className="flex flex-col justify-center lg:justify-start lg:flex-row flex-wrap">
        {blogs.map((blog) => (
          <div key={blog.title} className="m-2 flex min-w-2xs max-w-2xs">
            <BlogCard {...blog} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
