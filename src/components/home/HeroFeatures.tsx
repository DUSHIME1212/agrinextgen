import { cn } from "@/lib";
import React from "react";


const HeroFeatures = ({ className }: { className?: string; }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-secondary md:py-32",
        className,
      )}
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="hover:shadow-glass rounded-lg border border-border bg-card p-6 transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Premium Quality</h3>
            <p className="text-muted-foreground">
              Our products undergo rigorous quality testing to ensure optimal
              performance and longevity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="hover:shadow-glass rounded-lg border border-border bg-card p-6 transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Guaranteed Fresh</h3>
            <p className="text-muted-foreground">
              Seeds and plants are carefully stored and shipped for maximum
              freshness and viability.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="hover:shadow-glass rounded-lg border border-border bg-card p-6 transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Expert Support</h3>
            <p className="text-muted-foreground">
              Access to our agricultural experts for guidance on product
              selection and usage.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="hover:shadow-glass rounded-lg border border-border bg-card p-6 transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 20a4 4 0 0 1-4 4"></path>
                <path d="M20 14a4 4 0 0 1 4 4"></path>
                <path d="M10 4a4 4 0 0 1 4-4"></path>
                <path d="M4 10a4 4 0 0 1-4-4"></path>
                <path d="M10 12v8"></path>
                <path d="M14 12V4"></path>
                <path d="M12 10h8"></path>
                <path d="M4 10h4"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Sustainable Practices
            </h3>
            <p className="text-muted-foreground">
              Commitment to eco-friendly farming methods and environmentally
              responsible products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFeatures;
