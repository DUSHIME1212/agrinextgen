import React from 'react';
import Layout from '@/components/layout/Layout';

const Page: React.FC = () => {
  return (
    <Layout
      showBreadcrumb={false}
    >
      <div className="py-12">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <p className="text-muted-foreground">Your order history will be displayed here.</p>

        {/* Hardcoded order history */}
        <div className="mt-8 space-y-6">
          <div className="border p-6 rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Order ID</span>
              <span className="text-muted-foreground">ORD12345</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date</span>
              <span className="text-muted-foreground">March 20, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-muted-foreground">$34.99</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="text-muted-foreground">Shipped</span>
            </div>
            <div className="mt-4">
              <a href="/order/ORD12345" className="text-blue-600 hover:text-blue-800">View Details</a>
            </div>
          </div>

          <div className="border p-6 rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Order ID</span>
              <span className="text-muted-foreground">ORD12346</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date</span>
              <span className="text-muted-foreground">March 22, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-muted-foreground">$12.99</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="text-muted-foreground">Delivered</span>
            </div>
            <div className="mt-4">
              <a href="/order/ORD12346" className="text-blue-600 hover:text-blue-800">View Details</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
