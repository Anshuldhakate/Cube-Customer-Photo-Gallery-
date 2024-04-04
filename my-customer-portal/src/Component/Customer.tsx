import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API_URL = 'https://random-image-pepebigotes.vercel.app/api/random-image';

interface Customer {
  id: number;
  name: string;
  title: string;
  address: string;
  description: string;
} 

const CustomerPortalContainer = styled.div`
  display: flex;
  flex-direction: column; /* Ensure elements stack vertically */
  padding: 20px;
`;

const Heading = styled.h1`
  margin-bottom: 20px;
`;

const ScrollableContainer = styled.div`
  overflow-y: auto;
  max-height: 80vh; /* Adjust as needed */
`;

const CustomerList = styled(ScrollableContainer)`
  flex: 1;
  border-right: 1px solid #ccc;
`;

const CustomerCard = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${props => props.isSelected ? '#e0e0e0' : 'transparent'};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CustomerDetails = styled(ScrollableContainer)`
  flex: 2;
  padding: 20px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

const CustomerPortal: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const generateLorem = (length: number): string => {
    const loremWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'Duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'Excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

    let loremText = '';
    for (let i = 0; i < length; i++) {
      loremText += loremWords[Math.floor(Math.random() * loremWords.length)] + ' ';
    }
    return loremText.trim();
  };

  useEffect(() => {
    // Fetch customers from an API or any data source
    // For demo purpose, using mock data
    const fetchCustomers = () => {
      // Mocking 1000 customers
      const mockCustomers: Customer[] = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `Customer ${index + 1}`,
        title: `Title:- ${generateLorem(2)}`,
        address: `Address:- ${generateLorem(2)} ${generateLorem(1)}`,
        description: `Description:- ${generateLorem(10)} ${generateLorem(10)}`,
      }));
      setCustomers(mockCustomers);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    // Fetch photos from the API
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(API_URL);
        setPhotos(Array.from({ length: 9 }, () => response.data.imageUrl));
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();

    // Update photos every 10 seconds
    const interval = setInterval(fetchPhotos, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  return (
    
    <CustomerPortalContainer>
      <Heading>Welcome to Cube Customer Portal</Heading>
      <CustomerList>
        {customers.map(customer => (
          <CustomerCard
            key={customer.id}
            isSelected={selectedCustomer?.id === customer.id}
            onClick={() => handleCustomerClick(customer)}
          >
            <div>{customer.name}</div>
            <div>{customer.title}</div>
          </CustomerCard>
        ))}
      </CustomerList>
      <CustomerDetails>
        {selectedCustomer && (
          <>
            <h2>{selectedCustomer.name}</h2>
            <p>{selectedCustomer.title}</p>
            <p>{selectedCustomer.address}</p>
            <p>{selectedCustomer.description}</p>
            <PhotoGrid>
              {photos.map((photo, index) => (
                <Photo key={index} src={photo} alt="img" />
              ))}
            </PhotoGrid>
          </>
        )}
      </CustomerDetails>
    </CustomerPortalContainer>
  );
};

export default CustomerPortal;
