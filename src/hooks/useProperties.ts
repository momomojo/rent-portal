import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Property } from '../types/property';
import { useAuthState } from './useAuthState';
import { useRoleAccess } from './useRoleAccess';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useProperties() {
  const { user } = useAuthState();
  const { canViewAllProperties } = useRoleAccess();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user, canViewAllProperties]);

  const fetchProperties = async () => {
    try {
      let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      
      if (!canViewAllProperties) {
        q = query(q, where('landlordId', '==', user?.uid));
      }

      const snapshot = await getDocs(q);
      const propertyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      
      setProperties(propertyData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty = {
        ...propertyData,
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        landlordId: user?.uid
      };

      await addDoc(collection(db, 'properties'), newProperty);
      toast.success('Property added successfully');
      await fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
      throw error;
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        ...updates,
        updatedAt: Date.now()
      });
      toast.success('Property updated successfully');
      await fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
      throw error;
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      toast.success('Property deleted successfully');
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
      throw error;
    }
  };

  const uploadPropertyImages = async (propertyId: string, files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const imageRef = ref(storage, `properties/${propertyId}/${uuidv4()}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      });

      const urls = await Promise.all(uploadPromises);
      await updateDoc(doc(db, 'properties', propertyId), {
        images: urls,
        updatedAt: Date.now()
      });

      toast.success('Images uploaded successfully');
      await fetchProperties();
      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
      throw error;
    }
  };

  const assignTenant = async (propertyId: string, tenantId: string) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        tenantId,
        available: false,
        updatedAt: Date.now()
      });
      toast.success('Tenant assigned successfully');
      await fetchProperties();
    } catch (error) {
      console.error('Error assigning tenant:', error);
      toast.error('Failed to assign tenant');
      throw error;
    }
  };

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    uploadPropertyImages,
    assignTenant,
    refreshProperties: fetchProperties
  };
}