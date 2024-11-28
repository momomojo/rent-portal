import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { SystemSettings } from '../types/settings';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>({} as SystemSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'system'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as SystemSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SystemSettings>) => {
    try {
      await updateDoc(doc(db, 'settings', 'system'), updates);
      setSettings(prev => ({ ...prev, ...updates }));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const logoRef = ref(storage, `company/logo/${uuidv4()}`);
      await uploadBytes(logoRef, file);
      const url = await getDownloadURL(logoRef);
      
      await updateSettings({
        company: {
          ...settings.company,
          logo: url
        }
      });
      
      return url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      throw error;
    }
  };

  const createEmailTemplate = async (template: Omit<SystemSettings['email']['templates'][0], 'id'>) => {
    try {
      const newTemplate = {
        ...template,
        id: uuidv4()
      };

      const updatedTemplates = [...settings.email.templates, newTemplate];
      await updateSettings({
        email: {
          ...settings.email,
          templates: updatedTemplates
        }
      });

      return newTemplate.id;
    } catch (error) {
      console.error('Error creating email template:', error);
      toast.error('Failed to create email template');
      throw error;
    }
  };

  const updateEmailTemplate = async (templateId: string, updates: Partial<SystemSettings['email']['templates'][0]>) => {
    try {
      const updatedTemplates = settings.email.templates.map(template =>
        template.id === templateId ? { ...template, ...updates } : template
      );

      await updateSettings({
        email: {
          ...settings.email,
          templates: updatedTemplates
        }
      });
    } catch (error) {
      console.error('Error updating email template:', error);
      toast.error('Failed to update email template');
      throw error;
    }
  };

  const deleteEmailTemplate = async (templateId: string) => {
    try {
      const updatedTemplates = settings.email.templates.filter(template => template.id !== templateId);
      await updateSettings({
        email: {
          ...settings.email,
          templates: updatedTemplates
        }
      });
    } catch (error) {
      console.error('Error deleting email template:', error);
      toast.error('Failed to delete email template');
      throw error;
    }
  };

  const updateRolePermissions = async (role: string, permissions: Record<string, boolean>) => {
    try {
      const updatedRoles = {
        ...settings.roles,
        [role]: permissions
      };

      await updateSettings({ roles: updatedRoles });
    } catch (error) {
      console.error('Error updating role permissions:', error);
      toast.error('Failed to update role permissions');
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    uploadLogo,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    updateRolePermissions
  };
}