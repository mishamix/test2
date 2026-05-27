import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useInquiries } from '../../hooks/useFetchProperties';
import { PropertyInquiry, Language } from '../../types';
import Loading from '../../components/Loading';

export default function AdminInquiries() {
  const { t, language } = useApp();
  const { inquiries, loading, updateInquiryStatus } = useInquiries();
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<PropertyInquiry | null>(null);

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (activeTab === 'all') return true;
    return inquiry.status === activeTab;
  });

  const handleStatusUpdate = async (id: string, status: 'new' | 'read' | 'replied') => {
    await updateInquiryStatus(id, status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'replied':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-400';
    }
  };

  const tabs = [
    { value: 'all', label: 'All', count: inquiries.length },
    { value: 'new', label: 'New', count: inquiries.filter((i) => i.status === 'new').length },
    { value: 'read', label: 'Read', count: inquiries.filter((i) => i.status === 'read').length },
    { value: 'replied', label: 'Replied', count: inquiries.filter((i) => i.status === 'replied').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t('admin.inquiries.title')}
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Manage customer inquiries and contact requests
        </p>
      </div>

      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-secondary-200 dark:border-secondary-700">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.value
                  ? 'text-luxury-gold'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.value
                    ? 'bg-luxury-gold text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
              )}
            </button>
          ))}
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-secondary-600 dark:text-secondary-400">
              {t('admin.inquiries.noInquiries')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {filteredInquiries.map((inquiry) => {
              const propertyName = inquiry.property?.title
                ? inquiry.property.title[language as Language] || inquiry.property.title.en
                : null;

              return (
                <div
                  key={inquiry.id}
                  className={`p-6 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer ${
                    selectedInquiry?.id === inquiry.id ? 'bg-luxury-gold/5' : ''
                  }`}
                  onClick={() => setSelectedInquiry(selectedInquiry?.id === inquiry.id ? null : inquiry)}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white">
                        {inquiry.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {inquiry.email}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>

                  {propertyName && (
                    <p className="text-sm text-luxury-gold mb-2">
                      Property: {propertyName}
                    </p>
                  )}

                  <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center justify-between mt-4 text-xs text-secondary-500">
                    <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                    <div className="flex items-center gap-4">
                      <span>
                        Preferred: {inquiry.preferred_contact}
                      </span>
                    </div>
                  </div>

                  {selectedInquiry?.id === inquiry.id && (
                    <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                      <div className="space-y-3 mb-4">
                        <p className="text-secondary-700 dark:text-secondary-300">
                          <span className="font-medium">Phone:</span> {inquiry.phone || 'Not provided'}
                        </p>
                        <p className="text-secondary-700 dark:text-secondary-300">
                          <span className="font-medium">Message:</span>
                        </p>
                        <p className="text-secondary-600 dark:text-secondary-400 whitespace-pre-wrap">
                          {inquiry.message || 'No message provided'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(inquiry.id, 'read');
                          }}
                          className="btn btn-ghost text-sm py-2"
                        >
                          Mark as Read
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(inquiry.id, 'replied');
                          }}
                          className="btn btn-primary text-sm py-2"
                        >
                          Mark as Replied
                        </button>
                        <a
                          href={`mailto:${inquiry.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn btn-ghost text-sm py-2 ml-auto"
                        >
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
