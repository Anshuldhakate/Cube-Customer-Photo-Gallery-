import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// const API_URL = 'https://random-image-pepebigotes.vercel.app/lists/example-images-list.json';

interface Customer {
  id: number;
  name: string;
  title: string;
  address: string;
  description: string;
}

const CustomerPortalContainer = styled.div`
  background-color: lightgrey;
  padding: 1%;
`;

const Heading = styled.h1`
  
  color: red;
  font-family: Arial, Helvetica, sans-serif;
  border: 1px solid black;
  width: 50%;
  margin: auto;
  padding: 1%;
  margin-bottom: 20px;
  background-color: lightyellow;

`;

const Customerdiv = styled.div`
  display: flex;
`;

const ScrollableContainer = styled.div`
  overflow-y: auto;
  max-height: 80vh;
`;

const CustomerList = styled(ScrollableContainer)`
  flex: 1;
  border-right: 1px solid #ccc;
  color: blue;
  font-weight: bold;
`;

const CustomerCard = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${props => props.isSelected ? '#e2eeb8' : 'transparent'};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CustomerDetails = styled(ScrollableContainer)`
margin-top: -2%;
  flex: 2;
  padding: 20px;
  color: #094f4f;
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
  opacity: 1;
  transition: opacity 1s ease-in-out;
`;

const CustomerPortal: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  
  let rotationInterval: NodeJS.Timeout;

  const generateLorem = (length: number): string => {
    const loremWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex'];

    let loremText = '';
    for (let i = 0; i < length; i++) {
      loremText += loremWords[Math.floor(Math.random() * loremWords.length)] + ' ';
    }
    return loremText.trim();
  };

  useEffect(() => {
    const fetchCustomers = () => {
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
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/images'); 
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
  
    fetchPhotos();
  
    const interval = setInterval(fetchPhotos, 10000);
  
    return () => clearInterval(interval);
  }, []);

  // Function to start the rotation interval
  const startRotation = () => {
    rotationInterval = setInterval(rotatePhotos, 10000);
  };

  // Function to rotate the photos array
  const rotatePhotos = () => {
    setPhotos(prevPhotos => {
      const rotatedPhotos = [...prevPhotos.slice(1), prevPhotos[0]];
      return rotatedPhotos;
    });
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    clearInterval(rotationInterval); 
    startRotation(); 
  };

  return (
    <CustomerPortalContainer>
      <Heading>Welcome to Cube Customer Portal</Heading>
      <Customerdiv>
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
                {photos.slice(0, 9).map((photo, index) => (
                  <Photo key={index} src={photo} alt={`Image ${index}`} />
                ))}
              </PhotoGrid>
            </>
          )}
        </CustomerDetails>
      </Customerdiv>
    </CustomerPortalContainer>
  );
};

export default CustomerPortal;
