import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/core/config/firebase';
import { PropertyFilters } from '../types';

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  type: string;
  status: 'available' | 'rented' | 'maintenance';
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
  landlordId: string;
}

export const fetchProperties = async (filters: PropertyFilters) => {
  try {
    let q = collection(db, 'properties');

    // Build query based on filters
    const constraints: any[] = [];

    if (filters.type && filters.type !== 'all') {
      constraints.push(where('type', '==', filters.type));
    }

    if (filters.status && filters.status !== 'all') {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters.minPrice) {
      constraints.push(where('price', '>=', filters.minPrice));
    }

    if (filters.maxPrice) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const snapshot = await getDocs(q);
    let properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Property[];

    // Handle search filter in memory since Firestore doesn't support full-text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      properties = properties.filter(property => 
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower)
      );
    }

    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const createProperty = async (propertyData: Omit<Property, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...propertyData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  try {
    const propertyRef = doc(db, 'properties', id);
    await updateDoc(propertyRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'properties', id));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};