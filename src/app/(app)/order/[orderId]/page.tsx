"use client"
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useParams } from 'next/navigation';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  
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
      </div>
    </Layout>
  );
};

export default OrderDetails;