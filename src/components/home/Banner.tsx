import React from "react";
import { Button } from "../ui/button";

const HeroBannerCta = () => {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container-custom">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Join Our Community
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight">
            Ready to Transform Your Agricultural Journey?
          </h2>

          <p className="mb-8 text-muted-foreground">
            Sign up today to access premium products, exclusive offers, and
            expert agricultural advice tailored to your specific needs.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <a href="/shop">Start Shopping</a>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <a href="/auth">Create Account</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCta;
