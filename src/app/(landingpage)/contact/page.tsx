"use client"

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';


const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Page: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    
    setTimeout(() => {
      console.log('Form values:', values);
      setIsSubmitting(false);
      toast.success("Message Sent: We've received your message and will get back to you soon.");
      form.reset();
    }, 1500);
  };

  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' }
      ]}
    >
      <div className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Get in touch with our team for aRW questions or support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Visit Us</h3>
                <p className="text-muted-foreground">
                  KG 123 Street, Kacyiru<br />
                  Kigali, Rwanda
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Call Us</h3>
                <p className="text-muted-foreground">+250 782 454 192</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <Mail className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Email Us</h3>
                <p className="text-muted-foreground">h.dushime@alustudent.com</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="DUSHIME Aime" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+250 788 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your inquiry..." 
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Business Hours</h2>
              <div className="mb-6 space-y-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-muted-foreground">8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-6">Our Locations</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Kigali Headquarters</p>
                    <p className="text-muted-foreground">KG 123 Street, Kacyiru, Kigali</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden h-[300px] bg-muted">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63799.41051390232!2d30.032684!3d-1.944236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42443355abf%3A0x5fac3c5f30c9094d!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1696351547117!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Agri-NextGen Rwanda Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;