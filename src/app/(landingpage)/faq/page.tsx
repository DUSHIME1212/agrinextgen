
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Page: React.FC = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, PayPal, and bank transfers."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery typically takes 3-5 business days, depending on your location."
    }
  ];
  
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' }
      ]}
    >
      <div className="py-12 min-h-screen flex items-start flex-col justify-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full ring-none">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='hover:no-underline'>{faq.question}</AccordionTrigger>
              <AccordionContent className='text-2xl'>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
};

export default Page;