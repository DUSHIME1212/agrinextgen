import { cn } from "@/lib";
import Link from "next/link";
import PlaceholderImage from "../ui/PlaceholderImage";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "../ui/button";


interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  className?: string;
}

// Mock data
const latestBlogs = [
  {
    id: "1",
    title: "10 Sustainable Farming Practices to Implement This Year",
    excerpt: "Discover eco-friendly farming methods that increase productivity while preserving natural resources for future generations.",
    image: "https://i.pinimg.com/736x/17/33/07/173307c34c2c33ee2fbdbaa77c1aedd4.jpg",
    date: "June 15, 2023",
    readTime: "6 min",
    category: "Sustainability",
    slug: "sustainable-farming-practices",
  },
  {
    id: "2",
    title: "Understanding Soil Health: A Comprehensive Guide",
    excerpt: "Learn how to analyze and improve your soil quality for better crop yields and plant health.",
    image: "https://i.pinimg.com/736x/bd/80/06/bd800671ba8d66c99c1068b6aafb57d6.jpg",
    date: "May 28, 2023",
    readTime: "8 min",
    category: "Soil Management",
    slug: "understanding-soil-health",
  },
  {
    id: "3",
    title: "The Future of AgTech: Innovations Changing Farming Forever",
    excerpt: "Explore cutting-edge agricultural technologies that are revolutionizing how we grow food.",
    image: "https://i.pinimg.com/736x/e8/32/7c/e8327c5ec6826da6ef4bf3515f8f65c3.jpg",
    date: "May 10, 2023",
    readTime: "5 min",
    category: "Technology",
    slug: "future-of-agtech",
  },
];

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  image,
  date,
  readTime,
  category,
  slug,
  className,
}) => {
  return (
    <article 
      className={cn(
        "group flex flex-col h-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-glass",
        className
      )}
    >
      <Link href={`/blog/${slug}`} className="block overflow-hidden">
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          <PlaceholderImage
            src={image}
            alt={title}
            className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {category}
          </span>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock size={14} className="mr-1" />
            <span>{readTime}</span>
          </div>
        </div>
        
        <Link href={`/blog/${slug}`} className="block mb-3">
          <h3 className="font-semibold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>
        
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium mt-auto pt-2"
        >
          Read Article
          <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

interface LatestBlogsProps {
  className?: string;
}

const LatestBlogs: React.FC<LatestBlogsProps> = ({ className }) => {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Latest from Our Blog</h2>
            <p className="text-muted-foreground max-w-xl">
              Stay updated with the latest agricultural insights, farming tips, and industry news.
            </p>
          </div>
          
          <Link 
            href="/blog" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium mt-4 md:mt-0"
          >
            View All Articles
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              excerpt={blog.excerpt}
              image={blog.image}
              date={blog.date}
              readTime={blog.readTime}
              category={blog.category}
              slug={blog.slug}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">
              Browse All Articles
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
