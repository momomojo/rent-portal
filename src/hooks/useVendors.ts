import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vendor, VendorAssignment } from '../types/vendor';
import { MaintenanceRequest } from '../types/maintenance';
import { toast } from 'sonner';

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [assignments, setAssignments] = useState<VendorAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
    fetchAssignments();
  }, []);

  const fetchVendors = async () => {
    try {
      const q = query(
        collection(db, 'vendors'),
        where('status', '==', 'active'),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      const vendorData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];
      setVendors(vendorData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, 'vendorAssignments'));
      const snapshot = await getDocs(q);
      const assignmentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VendorAssignment[];
      setAssignments(assignmentData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const assignVendor = async (
    vendorId: string,
    maintenanceRequestId: string,
    scheduledDate: number
  ) => {
    try {
      const assignment: Partial<VendorAssignment> = {
        vendorId,
        maintenanceRequestId,
        status: 'pending',
        scheduledDate,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await addDoc(collection(db, 'vendorAssignments'), assignment);
      toast.success('Vendor assigned successfully');
      await fetchAssignments();
    } catch (error) {
      console.error('Error assigning vendor:', error);
      toast.error('Failed to assign vendor');
      throw error;
    }
  };

  const updateAssignment = async (
    assignmentId: string,
    updates: Partial<VendorAssignment>
  ) => {
    try {
      await updateDoc(doc(db, 'vendorAssignments', assignmentId), {
        ...updates,
        updatedAt: Date.now()
      });
      toast.success('Assignment updated successfully');
      await fetchAssignments();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment');
      throw error;
    }
  };

  const getAvailableVendors = (
    maintenanceRequest: MaintenanceRequest
  ): Vendor[] => {
    return vendors.filter(vendor => 
      vendor.services.includes(maintenanceRequest.category) &&
      !assignments.some(
        assignment => 
          assignment.vendorId === vendor.id &&
          assignment.status === 'pending'
      )
    );
  };

  return {
    vendors,
    assignments,
    loading,
    assignVendor,
    updateAssignment,
    getAvailableVendors,
    refreshVendors: fetchVendors,
    refreshAssignments: fetchAssignments
  };
}