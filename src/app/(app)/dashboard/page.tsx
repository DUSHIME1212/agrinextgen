"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package
} from 'lucide-react';
import DashBoardLayout from '@/components/DashBoardLayout';
import { useAppSelector } from '@/redux/hooks';
interface User {
  id: string;
  name?: string;
  email: string;
  businessName?: string;
  contactPerson?: string;
  role: string;
}
const Dashboard: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user) as User | null;
  const isSeller = Boolean(currentUser?.businessName);
  const userRole = isSeller ? 'seller' : 'buyer';
  

  const [userType, setUserType] = useState<'seller' | 'buyer'>(
    userRole === 'seller' ? 'seller' : 'buyer'
  );
  
  useEffect(() => {
    setUserType(userRole === 'seller' ? 'seller' : 'buyer');
  }, [userRole]);


  const handleViewChange = (value: string) => {
    if (userRole !== 'seller' && value === 'seller') {
      return; 
    }
    setUserType(value as 'seller' | 'buyer');
  };


  const salesData = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 1900 },
    { name: 'Mar', amount: 3000 },
    { name: 'Apr', amount: 2500 },
    { name: 'May', amount: 2800 },
    { name: 'Jun', amount: 3200 },
    { name: 'Jly', amount: 1200 },
    { name: 'Aug', amount: 1900 },
    { name: 'Sept', amount: 3000 },
    { name: 'Oct', amount: 2500 },
    { name: 'Nov', amount: 2800 },
    { name: 'Dev', amount: 3200 },
  ];

  const productData = [
    { name: 'Seeds', value: 30 },
    { name: 'Tools', value: 25 },
    { name: 'Fertilizers', value: 20 },
    { name: 'Organic', value: 25 },
  ];

  const COLORS = ['#0B9F61', '#108F4D', '#0A6E3C', '#17C36B'];


  const renderSellerDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard
          title="Total Sales"
          value="$12,543"
          description="+12% from last month"
          icon={<DollarSign className="text-green-500" />}
        />
        <DashboardCard
          title="Orders"
          value="342"
          description="+8% from last month"
          icon={<ShoppingBag className="text-blue-500" />}
        />
        <DashboardCard
          title="Customers"
          value="2,431"
          description="+5.2% from last month"
          icon={<Users className="text-orange-500" />}
        />
        <DashboardCard
          title="Products"
          value="78"
          description="4 added this month"
          icon={<Package className="text-purple-500" />}
        />
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="products">Product Distribution</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );


  const renderBuyerDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <DashboardCard
          title="Total Spent"
          value="$2,872"
          description="Lifetime purchases"
          icon={<DollarSign className="text-green-500" />}
        />
        <DashboardCard
          title="Orders"
          value="24"
          description="4 pending delivery"
          icon={<ShoppingBag className="text-blue-500" />}
        />
        <DashboardCard
          title="Active Subscriptions"
          value="2"
          description="Seeds & Equipment"
          icon={<Package className="text-purple-500" />}
        />
      </div>

      <Card className='min-h-[512px]'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">View your recent orders and transactions in the Order History and Transactions sections.</p>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div 
      className='p-8 w-full'
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Tabs 
          value={userType} 
          onValueChange={handleViewChange}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="seller">Seller View</TabsTrigger>
            <TabsTrigger value="buyer">Buyer View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {userType === 'seller' ? renderSellerDashboard() : renderBuyerDashboard()}
    </div>
  );
};


const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode 
}) => (
  <Card >
    <CardContent className="flex flex-row items-center justify-between pt-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;