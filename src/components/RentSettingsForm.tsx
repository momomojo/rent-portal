import { useState } from 'react';
import { X } from 'lucide-react';
import type { Property } from '../types/property';
import type { UserRole } from '../types/user';

interface RentSettingsFormProps {
  property: Property;
  userRole: UserRole;
  onClose: () => void;
  onSave: (updates: Partial<Property>) => void;
}

export default function RentSettingsForm({ property, userRole, onClose, onSave }: RentSettingsFormProps) {
  const [formData, setFormData] = useState({
    rent: property.rent,
    deposit: property.deposit,
    leaseTerms: {
      ...property.leaseTerms,
      rentDueDay: property.leaseTerms?.rentDueDay || 1,
      lateFeeAmount: property.leaseTerms?.lateFeeAmount || 0,
      lateFeeStartDay: property.leaseTerms?.lateFeeStartDay || 5,
      paymentCycle: property.leaseTerms?.paymentCycle || 'monthly',
    },
    utilities: property.utilities || {
      water: false,
      electricity: false,
      gas: false,
      internet: false,
      trash: false,
      costs: {},
    },
    fees: property.fees || {
      parking: 0,
      pet: 0,
      cleaning: 0,
      other: [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Determine if user can edit certain fields based on role
  const canEditBaseRent = userRole === 'admin';
  const canEditPaymentCycle = userRole === 'admin';
  const canEditLateFees = userRole === 'admin';

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Rent Settings - {property.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Base Rent
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
                    disabled={!canEditBaseRent}
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                      !canEditBaseRent ? 'bg-gray-100' : ''
                    }`}
                  />
                </div>
                {!canEditBaseRent && (
                  <p className="mt-1 text-xs text-gray-500">Only administrators can modify base rent</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Cycle
                </label>
                <select
                  value={formData.leaseTerms.paymentCycle}
                  onChange={(e) => setFormData({
                    ...formData,
                    leaseTerms: {
                      ...formData.leaseTerms,
                      paymentCycle: e.target.value as Property['leaseTerms']['paymentCycle'],
                    },
                  })}
                  disabled={!canEditPaymentCycle}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                    !canEditPaymentCycle ? 'bg-gray-100' : ''
                  }`}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rent Due Day
                </label>
                <select
                  value={formData.leaseTerms.rentDueDay}
                  onChange={(e) => setFormData({
                    ...formData,
                    leaseTerms: {
                      ...formData.leaseTerms,
                      rentDueDay: Number(e.target.value),
                    },
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {[...Array(28)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Late Fee Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={formData.leaseTerms.lateFeeAmount}
                    onChange={(e) => setFormData({
                      ...formData,
                      leaseTerms: {
                        ...formData.leaseTerms,
                        lateFeeAmount: Number(e.target.value),
                      },
                    })}
                    disabled={!canEditLateFees}
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                      !canEditLateFees ? 'bg-gray-100' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Late Fee Start Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.leaseTerms.lateFeeStartDay}
                  onChange={(e) => setFormData({
                    ...formData,
                    leaseTerms: {
                      ...formData.leaseTerms,
                      lateFeeStartDay: Number(e.target.value),
                    },
                  })}
                  disabled={!canEditLateFees}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    !canEditLateFees ? 'bg-gray-100' : ''
                  }`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Utilities Included</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.utilities).map((utility) => (
                  utility !== 'costs' && (
                    <label key={utility} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.utilities[utility as keyof typeof formData.utilities]}
                        onChange={(e) => setFormData({
                          ...formData,
                          utilities: {
                            ...formData.utilities,
                            [utility]: e.target.checked,
                          },
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {utility.charAt(0).toUpperCase() + utility.slice(1)}
                      </span>
                    </label>
                  )
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Additional Fees</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Parking Fee
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={formData.fees.parking}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: {
                          ...formData.fees,
                          parking: Number(e.target.value),
                        },
                      })}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pet Fee
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={formData.fees.pet}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: {
                          ...formData.fees,
                          pet: Number(e.target.value),
                        },
                      })}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cleaning Fee
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={formData.fees.cleaning}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: {
                          ...formData.fees,
                          cleaning: Number(e.target.value),
                        },
                      })}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}