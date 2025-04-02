import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib";
import PlaceholderImage from "../ui/PlaceholderImage";

const HeroBanner = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "border-y border-border bg-gradient-to-b from-primary/20 backdrop-blur-xl to-primary-muted-foreground z-10  py-16 md:py-24",
        className,
      )}
    >
      <div className="">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden">
              <PlaceholderImage
                src="https://i.pinimg.com/736x/4b/8e/9c/4b8e9caee0ce9c64589c09476da9d86c.jpg"
                alt="Farmer harvesting crops"
                className="h-full w-full object-cover"
              />

              <div className="animate-fade-in absolute bottom-6 right-6 rounded-lg border border-border bg-background/80 p-4 shadow-md backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"></path>
                      <path d="M12 2v10l4.5 4.5"></path>
                      <path d="M18 7.42A8 8 0 0 0 12 6"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">
                      Small Scale Farming
                    </div>
                    <div className="text-muted-foreground">
                      Agricultural expertise
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Why Choose Us
            </div>

            <h1 className="font-bold text-3xl tracking-tight">
              Trusted Agricultural Partner
            </h1>

            <p className="text-muted-foreground">
              At Agri-NextGen, we combine traditional farming wisdom with modern
              innovations to deliver products that help farmers thrive. Our
              commitment to quality, sustainability, and customer satisfaction
              has made us a trusted name in the agricultural industry.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <p>
                  <span className="font-medium">
                    Direct Farmer Relationships
                  </span>{" "}
                  - We work directly with farmers to understand their needs and
                  challenges.
                </p>
              </li>

              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <p>
                  <span className="font-medium">Quality Control Standards</span>{" "}
                  - Rigorous testing ensures only the best products reach your
                  farm.
                </p>
              </li>

              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <p>
                  <span className="font-medium">Sustainable Focus</span> - We
                  prioritize products that help build a sustainable agricultural
                  future.
                </p>
              </li>

              <li className="flex items-start">
                <div className="mr-3 mt-1 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <p>
                  <span className="font-medium">Educational Resources</span> -
                  We provide guides, blogs, and support to help you succeed.
                </p>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <a href="/about">Learn My Story</a>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
