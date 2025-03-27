import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Globe, Shield, Award, Clock } from 'lucide-react';

const Page: React.FC = () => {
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' }
      ]}
    >
      <div className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-bold mb-4">About Agri-NextGen Rwanda</h1>
            <p className="text-lg text-muted-foreground">
              Empowering Rwandan farmers with innovative agricultural solutions since 2015
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2025 in Kigali, Rwanda, Agri-NextGen began with a simple mission: to bridge the gap between traditional farming practices and modern agricultural technology for Rwandan farmers.
                </p>
                <p>
                  What started as a small agricultural supply store has grown into Rwanda's leading agricultural technology and supply compaRW, serving thousands of farmers across all provinces of Rwanda.
                </p>
                <p>
                  Our founder , a third-generation farmer, experienced firsthand the challenges that Rwandan farmers face daily. This deep understanding of local agriculture drives our commitment to providing solutions that are not only innovative but also practical and accessible.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden h-80 bg-[url('https://images.unsplash.com/photo-1595861759560-2d8a547c55f1?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center"></div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Leaf className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    We promote farming practices that preserve Rwanda's rich natural resources for future generations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    We believe in strengthening Rwandan farming communities through knowledge sharing and collaboration
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Globe className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    We continuously seek new solutions to adapt to Rwanda's unique agricultural challenges
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <Shield className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    All our products are carefully selected and tested to ensure they meet Rwanda's agricultural standards
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Expertise</h3>
                  <p className="text-muted-foreground">
                    Our team includes agricultural experts familiar with Rwanda's diverse growing conditions
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Customer Support</h3>
                  <p className="text-muted-foreground">
                    We offer ongoing support and training in both KiRWarwanda and English
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Leaf className="w-10 h-10 text-primary mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Local Production</h3>
                  <p className="text-muted-foreground">
                    MaRW of our organic products are locally sourced, supporting Rwanda's economy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;