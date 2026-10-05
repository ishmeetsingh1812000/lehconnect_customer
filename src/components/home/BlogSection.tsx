'use client';

import React, { useRef } from 'react';
import Link from '../Link';
import { BlogPostItem } from './types';
import { blogPostsData } from './homeData';

export interface BlogSectionProps {
  tag?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  posts?: BlogPostItem[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  tag = 'OUR BLOG',
  titlePrefix = 'Latest ',
  titleHighlight = 'News',
  posts = blogPostsData
}) => {
  const blogCarouselRef = useRef<HTMLDivElement>(null);

  const scrollBlogCarousel = (direction: 'left' | 'right') => {
    if (blogCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = blogCarouselRef.current;
      const step = 380;
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          blogCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          blogCarouselRef.current.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          blogCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          blogCarouselRef.current.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <section className="py-5 bg-white">
      <div className="container">
        {/* Header with Navigation Icons */}
        <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div className="text-start">
            <span className="fw-bold text-uppercase tracking-wider fs-9 d-block mb-1">
              {tag}
            </span>
            <h2 className="fw-bold text-dark mb-0">
              {titlePrefix}
              <span className="leh-style-auto-1112">{titleHighlight}</span>
            </h2>
          </div>
          {/* Custom Carousel Arrows */}
          <div className="d-flex gap-2">
            <button
              type="button"
              aria-label="Scroll blog left"
              onClick={() => scrollBlogCarousel('left')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              aria-label="Scroll blog right"
              onClick={() => scrollBlogCarousel('right')}
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center fw-bold leh-style-auto-1116"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Blog Carousel */}
        <div
          ref={blogCarouselRef}
          className="d-flex overflow-auto gap-4 pb-3 scroll-bar-hidden leh-style-auto-1117"
        >
          {posts.map((post) => (
            <div className="flex-shrink-0 leh-style-auto-1118" key={post.id}>
              <div className="card border shadow-sm h-100 overflow-hidden text-start leh-style-auto-1147">
                <img
                  src={post.img}
                  alt={post.title}
                  width={350}
                  height={180}
                  loading="lazy"
                  decoding="async"
                  className="leh-style-auto-1148"
                />
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="text-muted fs-9 fw-semibold d-block mb-1">{post.date}</span>
                    <h3 className="fw-bold text-dark fs-7 mb-2">{post.title}</h3>
                    <p className="text-muted fs-8 mb-0">{post.excerpt}</p>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="fw-bold fs-8 text-decoration-none mt-3"
                  >
                    Read More <i className="fa-solid fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
