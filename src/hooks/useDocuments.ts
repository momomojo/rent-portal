import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Document, DocumentType, DocumentStatus } from '../types/document';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useDocuments() {
  const { user } = useAuthState();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchTemplates();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const q = query(
        collection(db, 'documents'),
        where('metadata.isTemplate', '==', false),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const q = query(
        collection(db, 'documents'),
        where('metadata.isTemplate', '==', true)
      );
      const snapshot = await getDocs(q);
      const templateDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      setTemplates(templateDocs);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const uploadDocument = async (
    file: File,
    type: DocumentType,
    metadata: Partial<Document['metadata']>
  ) => {
    try {
      const documentId = uuidv4();
      const storageRef = ref(storage, `documents/${documentId}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const documentData: Partial<Document> = {
        id: documentId,
        name: file.name,
        type,
        category: 'other',
        url,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: user!.uid,
        size: file.size,
        version: 1,
        sharedWith: [],
        status: 'draft',
        metadata: {
          ...metadata,
          isTemplate: false,
          keywords: [],
        },
      };

      await addDoc(collection(db, 'documents'), documentData);
      toast.success('Document uploaded successfully');
      await fetchDocuments();
      return documentId;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      throw error;
    }
  };

  const createFromTemplate = async (
    templateId: string,
    name: string,
    metadata: Partial<Document['metadata']>
  ) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const documentData: Partial<Document> = {
        name,
        type: template.type,
        category: template.category,
        url: template.url,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: user!.uid,
        size: template.size,
        version: 1,
        sharedWith: [],
        status: 'draft',
        templateId,
        metadata: {
          ...metadata,
          isTemplate: false,
          keywords: template.metadata.keywords,
        },
      };

      await addDoc(collection(db, 'documents'), documentData);
      toast.success('Document created from template');
      await fetchDocuments();
    } catch (error) {
      console.error('Error creating from template:', error);
      toast.error('Failed to create document from template');
      throw error;
    }
  };

  const updateDocument = async (
    documentId: string,
    file: File,
    changes: string
  ) => {
    try {
      const document = documents.find(d => d.id === documentId);
      if (!document) throw new Error('Document not found');

      // Store the current version as history
      const previousVersion = {
        id: uuidv4(),
        url: document.url,
        createdAt: document.createdAt,
        createdBy: document.createdBy,
        changes: '',
        version: document.version,
      };

      // Upload new version
      const storageRef = ref(storage, `documents/${documentId}_v${document.version + 1}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'documents', documentId), {
        url,
        updatedAt: Date.now(),
        version: document.version + 1,
        previousVersions: [...(document.previousVersions || []), previousVersion],
      });

      toast.success('Document updated successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
      throw error;
    }
  };

  const shareDocument = async (documentId: string, userIds: string[]) => {
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        sharedWith: userIds,
        updatedAt: Date.now(),
      });
      toast.success('Document shared successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Error sharing document:', error);
      toast.error('Failed to share document');
      throw error;
    }
  };

  const signDocument = async (
    documentId: string,
    signature: string,
    ipAddress: string
  ) => {
    try {
      const document = documents.find(d => d.id === documentId);
      if (!document) throw new Error('Document not found');

      const signatureData = {
        userId: user!.uid,
        name: user!.displayName || user!.email,
        signedAt: Date.now(),
        ipAddress,
        signatureUrl: signature,
      };

      await updateDoc(doc(db, 'documents', documentId), {
        signatures: [...(document.signatures || []), signatureData],
        status: 'signed',
        updatedAt: Date.now(),
      });

      toast.success('Document signed successfully');
      await fetchDocuments();
    } catch (error) {
      console.error('Error signing document:', error);
      toast.error('Failed to sign document');
      throw error;
    }
  };

  return {
    documents,
    templates,
    loading,
    uploadDocument,
    createFromTemplate,
    updateDocument,
    shareDocument,
    signDocument,
    refreshDocuments: fetchDocuments,
  };
}