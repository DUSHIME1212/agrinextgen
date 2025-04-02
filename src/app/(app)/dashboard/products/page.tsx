"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/PriceUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import DashBoardLayout from '@/components/DashBoardLayout';
import Link from 'next/link';


const sampleProducts = [
  {
    id: 1,
    name: 'Organic Tomato Seeds',
    category: 'Seeds',
    price: 4.99,
    stock: 432,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Garden Trowel Set',
    category: 'Equipment',
    price: 24.99,
    stock: 54,
    status: 'In Stock',
  },
  {
    id: 3,
    name: 'Organic Fertilizer - 5kg',
    category: 'Fertilizers',
    price: 19.99,
    stock: 132,
    status: 'In Stock',
  },
  {
    id: 4,
    name: 'Herb Garden Starter Kit',
    category: 'Seeds',
    price: 12.99,
    stock: 0,
    status: 'Out of Stock',
  },
  {
    id: 5,
    name: 'Rose Bush - Red',
    category: 'Plants',
    price: 15.99,
    stock: 23,
    status: 'Low Stock',
  },
];

const Page: React.FC = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');

  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
      <div className='p-8'>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your products, inventory, and pricing
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/add-product">
              <Plus size={16} />
              Add Product
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Badge className="px-3 py-1 cursor-pointer" variant="outline">All</Badge>
                <Badge className="px-3 py-1 cursor-pointer" variant="outline">Seeds</Badge>
                <Badge className="px-3 py-1 cursor-pointer" variant="outline">Equipment</Badge>
                <Badge className="px-3 py-1 cursor-pointer" variant="outline">Fertilizers</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            product.status === 'In Stock' 
                              ? 'default' 
                              : product.status === 'Low Stock' 
                                ? 'outline' 
                                : 'destructive'
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
};

export default Page;
