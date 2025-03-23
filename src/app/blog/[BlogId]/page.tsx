"use client"

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Tag, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogBySlug, BlogPost as BlogPostType, blogPosts } from '@/lib/blogData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const BlogPost: React.FC = () => {
  const { BlogId } = useParams();
  const navigate = useRouter();
  const [post, setPost] = useState<BlogPostType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  
  useEffect(() => {
    if (BlogId) {
      // Simulate API call with setTimeout
      setLoading(true);
      setTimeout(() => {
        const foundPost = typeof BlogId === 'string' ? getBlogBySlug(BlogId) : undefined;
        setPost(foundPost);
        
        if (foundPost) {
          // Find related posts in the same category
          const related: BlogPostType[] = blogPosts
            .filter((p: BlogPostType) => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
        
        setLoading(false);
      }, 500);
    }
  }, [BlogId]);
  
  // Handle navigation between posts
const currentIndex: number = blogPosts.findIndex((p: BlogPostType) => p.id === BlogId);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container-custom px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-full max-w-md mb-2" />
            <Skeleton className="h-6 w-full max-w-sm mb-8" />
            <Skeleton className="aspect-video w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <div className="container-custom px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blog">Return to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${BlogId}` }
      ]}
    >
      <article className="container-custom px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to all articles
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <Badge className="bg-primary/10 hover:bg-primary/20 text-primary">
                {post.category}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>{post.readTime} read</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          </div>
          
          {/* Author info */}
          <div className="flex items-center gap-4 border-y py-4 mb-8">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={handleShare}
              title="Share article"
            >
              <Share2 size={20} />
            </Button>
          </div>
          
          {/* Featured Image */}
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <Tag size={18} className="text-muted-foreground" />
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Post Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8 mb-16">
            {prevPost ? (
              <div className="group">
                <Button
                  variant="ghost"
                  className="flex items-center justify-start p-0 h-auto hover:bg-transparent"
                  onClick={() => navigate.push(`/blog/${prevPost.slug}`)}
                >
                  <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                  Previous Article
                </Button>
                <h4 className="font-medium mt-2 group-hover:text-primary transition-colors">
                  {prevPost.title}
                </h4>
              </div>
            ) : (
              <div></div>
            )}
            
            {nextPost && (
              <div className="group text-right">
                <Button
                  variant="ghost"
                  className="flex items-center justify-end p-0 h-auto hover:bg-transparent ml-auto"
                  onClick={() => navigate.push(`/blog/${nextPost.slug}`)}
                >
                  Next Article
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <h4 className="font-medium mt-2 group-hover:text-primary transition-colors">
                  {nextPost.title}
                </h4>
              </div>
            )}
          </div>
          
          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="aspect-video overflow-hidden rounded-lg mb-3">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;