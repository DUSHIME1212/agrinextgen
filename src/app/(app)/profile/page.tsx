"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Mail, Phone, Calendar, Edit, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

const page = () => {
    
    const navigate = useRouter();

    const profileData = {
      name: 'DUSHIME Don',
      email:'h.dushime@alustudent.com',
      role: 'customer',
      avatar: '',
      phone: '+250 782 454 192',
      address: 'Kigali, Rwanda',
      joinedDate: 'January 2023',
      bio: "I'm passionate about agriculture and sustainable farming practices. I believe in growing healthy, organic produce that's good for people and the planet.",
      stats: {
        orders: 12,
        reviews: 5,
        wishlist: 8,
      },
      businessName: 'Green Gardens Ltd',
      businessType: 'Organic Farming',
      productsListed: 24,
      totalSales: 156,
      rating: 4.8,
    };
  return (
    <div className='p-8'>
        <div className="py-12 w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 border-4 border-primary/10">
                    <AvatarImage src={profileData.avatar} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mt-4">{profileData.name}</h2>
                  
                  <Badge variant="outline" className="mt-2">
                    {profileData.role === 'seller' ? 'Seller' : 'Customer'}
                  </Badge>
                  
                  {profileData.role === 'seller' && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-sm font-medium">{profileData.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(profileData.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-muted-foreground text-sm mt-2">{profileData.bio}</p>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{profileData.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{profileData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{profileData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-sm text-muted-foreground">{profileData.joinedDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => navigate.push('/settings')}
                  >
                    <Settings size={16} />
                    <span>Edit Profile</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {profileData.role === 'customer' ? (
                    <>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{profileData.stats.orders}</p>
                        <p className="text-sm text-muted-foreground">Orders</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{profileData.stats.reviews}</p>
                        <p className="text-sm text-muted-foreground">Reviews</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{profileData.stats.wishlist}</p>
                        <p className="text-sm text-muted-foreground">Wishlist</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Returns</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{profileData.productsListed}</p>
                        <p className="text-sm text-muted-foreground">Products</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{profileData.totalSales}</p>
                        <p className="text-sm text-muted-foreground">Sales</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">{profileData.rating}</p>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold">87%</p>
                        <p className="text-sm text-muted-foreground">Response</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Your personal information and preferences</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit size={14} />
                    <span>Edit</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{profileData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{profileData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{profileData.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Business Info for Sellers */}
                  {profileData.role === 'seller' && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Business Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground">Business Name</p>
                            <p className="font-medium">{profileData.businessName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Business Type</p>
                            <p className="font-medium">{profileData.businessType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Products Listed</p>
                            <p className="font-medium">{profileData.productsListed}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Seller Since</p>
                            <p className="font-medium">{profileData.joinedDate}</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  {/* Account Details */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <p className="font-medium">English</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <p className="font-medium">RWF (Rwandan Franc)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Notifications</p>
                        <p className="font-medium">Email, In-app</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Two-Factor Auth</p>
                        <p className="font-medium">Disabled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {profileData.role === 'customer' ? (
                    <>
                      <div className="flex items-start gap-4 p-3 rounded-md border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                          A
                        </div>
                        <div>
                          <h6 className="font-medium">New Order Placed</h6>
                          <p className="text-sm text-muted-foreground">You placed an order for Organic Seeds</p>
                          <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-3 rounded-md border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            A
                        </div>
                        <div>
                          <h6 className="font-medium">Account Updated</h6>
                          <p className="text-sm text-muted-foreground">You updated your profile information</p>
                          <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-3 rounded-md border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                         B
                        </div>
                        <div>
                          <h6 className="font-medium">Review Submitted</h6>
                          <p className="text-sm text-muted-foreground">You gave 5 stars to Organic Fertilizer</p>
                          <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-4 p-3 rounded-md border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                          A </div>
                        <div>
                          <h4 className="font-medium">New Sale Completed</h4>
                          <p className="text-sm text-muted-foreground">Someone purchased your Organic Seeds</p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-3 rounded-md border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Product Added</h4>
                          <p className="text-sm text-muted-foreground">You added a new product: Organic Fertilizer</p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-3 rounded-md border">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" /><polygon points="18 2 22 6 12 16 8 16 8 12 18 2" /></svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Store Updated</h4>
                          <p className="text-sm text-muted-foreground">You updated your store information</p>
                          <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page