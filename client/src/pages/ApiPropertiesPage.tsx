import React, { useState, useEffect } from 'react';
import HospitablePropertiesList from '@/components/HospitablePropertiesList';
import HospitableApiSetupInfo from '@/components/HospitableApiSetupInfo';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useProperties } from '@/lib/hospitable';
import CustomerLookupModal from '@/components/CustomerLookupModal';
import { useQueryClient } from '@tanstack/react-query';




export default function ApiPropertiesPage() {
  
  const [showSetupInfo, setShowSetupInfo] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(() => {
    const validated = localStorage.getItem('customerValidated');
    return validated !== 'true'; // only show modal if not validated
  });

  const { error } = useProperties(customerId);



  
  // Check if we have an API error and show the setup info
  useEffect(() => {
    if (error) {
      console.error("Error (in ApiPropertiesPage) fetching properties: ", error);
      setShowSetupInfo(true);
    } else {
      setShowSetupInfo(false);
    }
  }, [error]);

  useEffect(() => {
    const storedId = localStorage.getItem('customerId');
    const validated = localStorage.getItem('customerValidated');
    
    if (storedId && validated === 'true') {
      setCustomerId(storedId);         
      setShowModal(false);             
    } else {
      setShowModal(true);           
    }
  }, []);

  if (!customerId && !showModal) {
    return <div className="text-center py-20">Loading customer info...</div>;
  }

  
  return (
    
  <>
  {showModal && (
      <CustomerLookupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCustomerIdentified={(id) => {
          localStorage.setItem('customerId', id);
          localStorage.setItem('customerValidated', 'true');
          setCustomerId(id);
          setShowModal(false);
        }}
      />
    )}

    {/* { {customerId && (
      <HospitablePropertiesList customerId={customerId} />
    )}


    {customerId && (
      <HospitablePropertiesList customerId={customerId} />
    )}
  
  

    { Your main content below (like <HospitablePropertiesList />) }
    <div className="container mx-auto py-8">
      <HospitablePropertiesList customerId={customerId} />
    </div> } */}



    <div className="container py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">← Back to Home</Link>
        </Button>
        <Button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>
          Switch User
        </Button>

        <h1 className="text-3xl font-bold">Hospitable API Properties</h1>
        <p className="text-muted-foreground mt-2">
          Properties fetched directly from the Hospitable API integration.
        </p>
      </div>

      {showSetupInfo && <HospitableApiSetupInfo />}
      {customerId && (
        <HospitablePropertiesList customerId={customerId} />
      )}
  
    </div>
    </>
  );
}