"use client";
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useParams } from 'next/navigation';

const OrderDetails: React.FC = () => {
  // Hardcoding an order ID instead of using `useParams` for demonstration
  const orderId = "ORD12345";
  
  return (
    <Layout
      customBreadcrumbPaths={[
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Order History', path: '/order-history' },
        { name: 'Order Details', path: `/order/${orderId}` }
      ]}
    >
      <div className="py-12">
        <h1 className="text-3xl font-bold mb-8">Order Details</h1>
        <p className="text-muted-foreground">Order ID: {orderId}</p>

        {/* Hardcoded order details */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Product Name</span>
              <span className="text-muted-foreground">Organic Tomato Seeds</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Quantity</span>
              <span className="text-muted-foreground">2</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Price</span>
              <span className="text-muted-foreground">$4.99</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-muted-foreground">$9.98</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Full Name</span>
              <span className="text-muted-foreground">DUSHIME Aime</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Street Address</span>
              <span className="text-muted-foreground">123 Main St</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">City</span>
              <span className="text-muted-foreground">Kigali</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">State</span>
              <span className="text-muted-foreground">RW</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone Number</span>
              <span className="text-muted-foreground">+250 782 454 192</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Payment Method</span>
              <span className="text-muted-foreground">MTN Mobile Payment</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Mobile Number</span>
              <span className="text-muted-foreground">+250 782 454 192</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status</span>
              <span className="text-muted-foreground">Paid</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
