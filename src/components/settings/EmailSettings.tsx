import { useState } from 'react';
import { EmailSettings as EmailSettingsType } from '../../types/settings';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface EmailSettingsProps {
  settings: EmailSettingsType;
  onUpdate: (settings: EmailSettingsType) => void;
}

export default function EmailSettings({ settings, onUpdate }: EmailSettingsProps) {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      toast.success('Email settings updated successfully');
    } catch (error) {
      console.error('Error updating email settings:', error);
      toast.error('Failed to update email settings');
    }
  };

  const addTemplate = () => {
    setFormData(prev => ({
      ...prev,
      templates: [
        ...prev.templates,
        {
          id: crypto.randomUUID(),
          name: '',
          subject: '',
          body: '',
          variables: [],
          type: 'welcome',
          active: true
        }
      ]
    }));
  };

  const removeTemplate = (id: string) => {
    setFormData(prev => ({
      ...prev,
      templates: prev.templates.filter(t => t.id !== id)
    }));
  };

  const updateTemplate = (id: string, updates: Partial<EmailSettingsType['templates'][0]>) => {
    setFormData(prev => ({
      ...prev,
      templates: prev.templates.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure email notifications and templates
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default From Name
            </label>
            <input
              type="text"
              value={formData.defaultFromName}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultFromName: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default From Email
            </label>
            <input
              type="email"
              value={formData.defaultFromEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultFromEmail: e.target.value }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Footer
            </label>
            <textarea
              value={formData.emailFooter}
              onChange={(e) => setFormData(prev => ({ ...prev, emailFooter: e.target.value }))}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Email Templates
              </label>
              <button
                type="button"
                onClick={addTemplate}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Template
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {formData.templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Template Name
                        </label>
                        <input
                          type="text"
                          value={template.name}
                          onChange={(e) => updateTemplate(template.id, { name: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          value={template.type}
                          onChange={(e) => updateTemplate(template.id, { type: e.target.value as any })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="welcome">Welcome</option>
                          <option value="payment_reminder">Payment Reminder</option>
                          <option value="payment_received">Payment Received</option>
                          <option value="payment_late">Payment Late</option>
                          <option value="maintenance_update">Maintenance Update</option>
                          <option value="lease_expiring">Lease Expiring</option>
                          <option value="application_status">Application Status</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={template.subject}
                          onChange={(e) => updateTemplate(template.id, { subject: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Body
                        </label>
                        <textarea
                          value={template.body}
                          onChange={(e) => updateTemplate(template.id, { body: e.target.value })}
                          rows={4}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Active
                        </label>
                        <div className="mt-1">
                          <input
                            type="checkbox"
                            checked={template.active}
                            onChange={(e) => updateTemplate(template.id, { active: e.target.checked })}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTemplate(template.id)}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.enableEmailNotifications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  enableEmailNotifications: e.target.checked
                }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable Email Notifications
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}