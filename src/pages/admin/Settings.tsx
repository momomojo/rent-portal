import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Building, CreditCard, Mail, Shield, Settings as SettingsIcon } from 'lucide-react';
import CompanySettings from '../../components/settings/CompanySettings';
import PaymentMethodSettings from '../../components/settings/PaymentMethodSettings';
import PaymentGatewaySettings from '../../components/settings/PaymentGatewaySettings';
import EmailSettings from '../../components/settings/EmailSettings';
import RoleSettings from '../../components/settings/RoleSettings';
import SystemSettings from '../../components/settings/SystemSettings';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'company' | 'payment-methods' | 'payment-gateway' | 'email' | 'roles' | 'system'>('company');
  const { settings, loading, updateSettings } = useSettings();
  const { isAdmin } = useRoleAccess();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'company', name: 'Company', icon: Building },
    { id: 'payment-methods', name: 'Payment Methods', icon: CreditCard },
    { id: 'payment-gateway', name: 'Payment Gateway', icon: CreditCard },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'roles', name: 'Roles', icon: Shield },
    { id: 'system', name: 'System', icon: SettingsIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure system settings and preferences
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                `}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'company' && (
            <CompanySettings
              settings={settings.company}
              onUpdate={(company) => updateSettings({ company })}
            />
          )}
          {activeTab === 'payment-methods' && (
            <PaymentMethodSettings
              settings={settings.payment}
              onUpdate={(payment) => updateSettings({ payment })}
            />
          )}
          {activeTab === 'payment-gateway' && (
            <PaymentGatewaySettings
              settings={settings.payment}
              onUpdate={(payment) => updateSettings({ payment })}
            />
          )}
          {activeTab === 'email' && (
            <EmailSettings
              settings={settings.email}
              onUpdate={(email) => updateSettings({ email })}
            />
          )}
          {activeTab === 'roles' && (
            <RoleSettings
              settings={settings.roles}
              onUpdate={(roles) => updateSettings({ roles })}
            />
          )}
          {activeTab === 'system' && (
            <SystemSettings
              settings={settings.preferences}
              onUpdate={(preferences) => updateSettings({ preferences })}
            />
          )}
        </div>
      </div>
    </div>
  );
}