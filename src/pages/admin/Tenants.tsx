// Previous imports remain the same...

export default function Tenants() {
  // Previous state and hooks remain the same...

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Tenant Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage tenant assignments and relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Tenant
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tenant
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Assigned Landlord
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Assigned Property
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Rent Amount
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.uid}>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {tenant.name[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{tenant.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {tenant.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={tenant.assignedLandlord || ''}
                          onChange={(e) => handleAssignLandlord(tenant, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select Landlord</option>
                          {landlords.map((landlord) => (
                            <option key={landlord.uid} value={landlord.uid}>
                              {landlord.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={properties.find(p => p.tenantId === tenant.uid)?.id || ''}
                          onChange={(e) => handleAssignProperty(tenant, e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select Property</option>
                          {properties
                            .filter(p => p.available || p.tenantId === tenant.uid)
                            .map((property) => (
                              <option key={property.id} value={property.id}>
                                {property.name} - ${property.rent}/month
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {properties.find(p => p.tenantId === tenant.uid)?.rent ? (
                          `$${properties.find(p => p.tenantId === tenant.uid)?.rent}/month`
                        ) : (
                          'Not assigned'
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowAssignModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Manage Tenant Assignment
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign Landlord
                  </label>
                  <select
                    value={selectedTenant.assignedLandlord || ''}
                    onChange={(e) => handleAssignLandlord(selectedTenant, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Landlord</option>
                    {landlords.map((landlord) => (
                      <option key={landlord.uid} value={landlord.uid}>
                        {landlord.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign Property
                  </label>
                  <select
                    value={properties.find(p => p.tenantId === selectedTenant.uid)?.id || ''}
                    onChange={(e) => handleAssignProperty(selectedTenant, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Property</option>
                    {properties
                      .filter(p => p.available || p.tenantId === selectedTenant.uid)
                      .map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} - ${property.rent}/month
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rent Settings
                  </label>
                  <Link
                    to="/admin/rent"
                    className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Manage Rent Settings
                  </Link>
                </div>
              </div>

              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTenant(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTenant(null);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}