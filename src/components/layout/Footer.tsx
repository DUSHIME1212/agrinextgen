import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Logo from "../home/Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-border lg:px-32 border-t p-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="mb-6 inline-flex gap-2 items-center">
            <Logo className="size-9"/>
              <span className="text-primary text-2xl font-bold">
                AgriNextGen
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Empowering farmers and agricultural enthusiasts with the latest
              tools, products, and knowledge to grow sustainably.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin
                  size={20}
                  className="text-primary mr-3 mt-1 flex-shrink-0"
                />
                <p className="text-muted-foreground">
                  Kigali, Rwanda
                </p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-primary mr-3 flex-shrink-0" />
                <p className="text-muted-foreground">+250 782 454 192</p>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-primary mr-3 flex-shrink-0" />
                <p className="text-muted-foreground">
                  h.dushime@alustudent.com
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop/seeds"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Seeds & Plants
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/equipment"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Equipment & Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/fertilizers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Fertilizers
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/organic"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Organic Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/livestock"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Livestock Supplies
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/irrigation"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Irrigation Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest agricultural news and
              exclusive offers.
            </p>
            <div className="mb-6 flex">
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                variant="default"
                className="rounded-l-none"
              >
                <Send size={16} />
              </Button>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background hover:bg-primary text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background hover:bg-primary text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background hover:bg-primary text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background hover:bg-primary text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-border mt-10 flex flex-col items-center justify-between border-t pt-6 md:flex-row">
          <p className="text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AgriNextGen. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
