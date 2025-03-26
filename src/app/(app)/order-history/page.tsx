
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
      </div>
    </Layout>
  );
};

export default Page;
