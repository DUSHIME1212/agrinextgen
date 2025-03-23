"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, Search, Tag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { blogPosts, BlogPost } from "@/lib/blogData";
import { api, cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface BlogPosts {
  data: BlogPost[];
}

const Page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPosts[]>([]);
  const postsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("api/blogs?populate=*");
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        setPosts(response.data);
      } catch (err) {
        console.log(err);
        
      }
    };

    fetchData();
  }, []);

  console.log(posts);
  

  

  // Get all unique categories
  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category)),
  );

  // Filter posts based on search term and selected category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === null || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  

  return (
    <Layout
      customBreadcrumbPaths={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]}
      className="px-8 md:px-16"
    >
      <div className="container-custom px-4 py-12">
        <div className="mb-12 max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold">Agricultural Insights</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest farming techniques, sustainability
            practices, and agricultural innovations.
          </p>
        </div>

        {/* Search and filter section */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Filter by:</span>
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog post listing */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center">
              <h3 className="mb-2 text-xl font-medium">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredPosts.length > postsPerPage && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Layout>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative min-h-72 overflow-clip bg-muted">
            <Image
              fill
              src={post.image}
              alt={post.title}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
        </div>
        <div className="md:col-span-2 h-full">
          <CardContent className="p-6">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
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

            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="mb-2 text-2xl font-bold transition-colors group-hover:text-primary">
                {post.title}
              </h2>
            </Link>

            <p className="mb-4 line-clamp-3 text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium leading-tight">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {post.author.role}
                  </p>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center font-medium text-primary hover:text-primary/80"
              >
                Read Article
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default Page;
