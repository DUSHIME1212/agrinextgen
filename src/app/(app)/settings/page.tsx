"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, Edit, Lock, Info } from 'lucide-react';
import { toast } from 'sonner';

const page = () => {
    
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const currentUser={
      name: 'DUSHIME Aime',
      email: 'h.dushime@alustudent.com',
      avatar: 'https://example.com/avatar.jpg',
      role:"buyer"
    }
    const userType = currentUser.role

    const handleSaveGeneralSettings = () => {
      toast.success(
        <>
        <p>Settings saved successfully.</p>
        <p>Changes will take effect after the next login.</p>
        </>
      );
    };
  
    const handleChangePassword = () => {
      if (newPassword !== confirmPassword) {
        toast.warning(
          <>
          <p>Passwords do not match.</p>

          </>
        );
        return;
      }
      
      toast.success(
        <>
        <p>Password changed successfully.</p>
        </>
      );
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    };
  return (
    <div className='p-8 w-full'>
      <div className=" ">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings size={16} />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Info size={16} />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Update your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Avatar className="w-20 h-20 border">
                    <AvatarImage src={''} alt={'User'} />
                    <AvatarFallback className="text-xl">{('User').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      Your profile picture will be visible to other users
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Upload</Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div className="grid gap-5">
                  <div className="grid gap-2.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={'DUSHIME Aime'} />
                  </div>
                  
                  <div className="grid gap-2.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={'h.dushime@alustudent.com'} />
                  </div>
                  
                  {userType === 'seller' && (
                    <div className="grid gap-2.5">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" defaultValue="Green Gardens Ltd" />
                    </div>
                  )}
                  
                  <div className="grid gap-2.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+ 250 782 454 192" />
                  </div>
                  
                  <div className="grid gap-2.5">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="Kigali, Rwanda" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>
                  Update your password and manage security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Protect your account with two-factor authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <Button variant="outline" className="w-full sm:w-auto">Sign Out All Devices</Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleChangePassword}>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about account activity
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new products and offers
                        </p>
                      </div>
                      <Switch 
                        checked={marketingEmails} 
                        onCheckedChange={setMarketingEmails} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your orders
                        </p>
                      </div>
                      <Switch 
                        checked={orderUpdates} 
                        onCheckedChange={setOrderUpdates} 
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {userType === 'seller' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Seller Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">New Order Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive a new order
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Product Reviews</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when a customer reviews your products
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Inventory Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when products are low in stock
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveGeneralSettings}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default page