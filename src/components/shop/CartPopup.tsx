
import React from 'react';
import { X, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '../ui/sonner';
import { toast } from 'sonner';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartPopup: React.FC<CartPopupProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);
  
  const handleQuantityChange = (id: string, amount: number) => {
    const item = items.find((item) => item.id === id);
    
    if (!item) return;
    
    const newQuantity = item.quantity + amount;
    
    if (newQuantity < 1) {
      onRemoveItem(id);
      return;
    }
    
    onUpdateQuantity(id, newQuantity);
  };
  
  const handleRemoveItem = (id: string, name: string) => {
    onRemoveItem(id);
    
    toast.success(`${name} has been removed from your cart.`);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center">
            <ShoppingCart size={20} className="mr-2" />
            Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <ShoppingCart size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.price);
                  
                  return (
                    <li key={item.id} className="flex space-x-4">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.id}`}
                          className="font-medium hover:text-primary truncate block"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {Object.entries(item.attributes).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: <span className="font-medium">{value}</span>
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="font-medium">
                            {formattedPrice}
                          </span>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </SheetClose>
                
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/checkout" className="flex items-center justify-center">
                      Checkout
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartPopup;