
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Download, Calendar } from 'lucide-react';

// Sample transaction data
const transactions = [
  {
    id: "TX12345",
    date: "2023-08-15",
    amount: "$42.99",
    method: "Credit Card",
    status: "Completed",
    description: "Order #4321 - Organic Vegetable Seeds",
  },
  {
    id: "TX12346",
    date: "2023-08-10",
    amount: "$89.50",
    method: "PayPal",
    status: "Completed",
    description: "Order #4322 - Garden Tools Set",
  },
  {
    id: "TX12347",
    date: "2023-07-28",
    amount: "$14.99",
    method: "Credit Card",
    status: "Completed",
    description: "Order #4325 - Organic Fertilizer",
  },
  {
    id: "TX12348",
    date: "2023-07-15",
    amount: "$125.00",
    method: "Bank Transfer",
    status: "Completed",
    description: "Order #4328 - Premium Gardening Kit",
  },
  {
    id: "TX12349",
    date: "2023-07-05",
    amount: "$36.75",
    method: "Credit Card",
    status: "Refunded",
    description: "Order #4330 - Herb Garden Starter",
  },
];

const Page: React.FC = () => {
  return (
    <Layout
      showBreadcrumb={false}
    >
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">
              View and manage your purchase history and payment records
            </p>
          </div>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Page</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "Completed" ? "default" : "destructive"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your saved payment methods here.
              </p>
              <Button variant="link" className="p-0 mt-2">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your billing information for purchases.
              </p>
              <Button variant="link" className="p-0 mt-2">
                Edit Address
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure your payment preferences and notifications.
              </p>
              <Button variant="link" className="p-0 mt-2">
                Edit Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
