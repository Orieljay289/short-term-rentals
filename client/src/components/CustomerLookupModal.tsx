import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface CustomerLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerIdentified: (customerId: string) => void;
}

export default function CustomerLookupModal({
  isOpen,
  onClose,
  onCustomerIdentified,
}: CustomerLookupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email) return toast({ title: 'Name and email are required.' });

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/customer-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const result = await res.json();

      if (res.ok && result.customer_id) {
        localStorage.setItem('customerId', result.customer_id); 
        localStorage.setItem('customerValidated', 'true'); 
        
        console.log('Customer ID put in lcal storage:', result.customer_id); // ← Add this
        toast({ title: 'Customer matched successfully!' });
        onCustomerIdentified(result.customer_id);
        onClose();
      } else {
        toast({ title: 'No match found', description: result.message || 'Please check your info or register.' });
      }
    } catch (err) {
      toast({ title: 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Customer Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Checking...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
