import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TenantApplication } from '../../types/application';
import { toast } from 'sonner';
import {
  User,
  Briefcase,
  Home,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  FileText,
} from 'lucide-react';

interface ApplicationDetailsProps {
  application: TenantApplication;
  onUpdate: () => void;
}

export default function ApplicationDetails({ application, onUpdate }: ApplicationDetailsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: TenantApplication['status']) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'applications', application.id), {
        status: newStatus,
        updatedAt: Date.now(),
      });
      toast.success('Application status updated');
      onUpdate();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Application Details
          </h3>
          <div className="space-x-3">
            <button
              onClick={() => handleStatusUpdate('approved')}
              disabled={loading || application.status === 'approved'}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={loading || application.status === 'rejected'}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleStatusUpdate('screening')}
              disabled={loading || application.status === 'screening'}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Start Screening
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Full Name
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.personalInfo.firstName} {application.personalInfo.lastName}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.personalInfo.email}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Phone
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.personalInfo.phone}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Date of Birth
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.personalInfo.dateOfBirth}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Current Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.personalInfo.currentAddress.street}
              {application.personalInfo.currentAddress.unit && `, Unit ${application.personalInfo.currentAddress.unit}`}
              <br />
              {application.personalInfo.currentAddress.city}, {application.personalInfo.currentAddress.state} {application.personalInfo.currentAddress.zipCode}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Employment Information
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="space-y-2">
                <p><span className="font-medium">Employer:</span> {application.employmentInfo.currentEmployer}</p>
                <p><span className="font-medium">Position:</span> {application.employmentInfo.position}</p>
                <p><span className="font-medium">Monthly Income:</span> ${application.employmentInfo.monthlyIncome}</p>
                <p><span className="font-medium">Length of Employment:</span> {application.employmentInfo.employmentLength} years</p>
              </div>
            </dd>
          </div>

          {application.creditCheck && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Credit Score
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {application.creditCheck.score}
              </dd>
            </div>
          )}

          {application.backgroundCheck && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Background Check
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {application.backgroundCheck.criminalRecord ? 'Records Found' : 'Clear'}
              </dd>
            </div>
          )}

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documents
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {application.documents.map((doc) => (
                  <li key={doc.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">{doc.name}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}