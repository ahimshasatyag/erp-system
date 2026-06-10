import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CustomerContactForm from '../forms/CustomerContactForm';
import { fetchCustomerContact } from '../api/customerContactApi';
import type { CustomerContact } from '../api/customerContactApi';

const CustomerContactEditPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();

    const [isEditMode, setIsEditMode] = useState<boolean>(() => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('mode') === 'edit';
    });
    const [contact, setContact] = useState<CustomerContact | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsEditMode(new URLSearchParams(location.search).get('mode') === 'edit');
    }, [location.search]);

    useEffect(() => {
        if (id && !isEditMode && !contact) {
            setLoading(true);
            fetchCustomerContact(id).then(res => {
                setContact(res.data);
            }).catch(console.error).finally(() => setLoading(false));
        }
    }, [id, isEditMode, contact]);

    const headerButtons = (
        <>
            {id && !isEditMode && (
                <button
                    onClick={() => {
                        const searchParams = new URLSearchParams(location.search);
                        searchParams.set('mode', 'edit');
                        navigate({ search: searchParams.toString() }, { replace: true, state: location.state });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white text-[13px] font-medium rounded transition-colors bg-[#0ea5e9] hover:bg-[#0284c7]"
                >
                    <i className="fas fa-edit"></i>
                    Edit
                </button>
            )}
        </>
    );

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20c997]"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-6">
            <div className="flex justify-between items-center mb-6 pt-2">
                <p className="text-[32px] font-normal text-[#3f2a2a] tracking-tight"> Contact {isEditMode ? 'Edit' : 'Detail'}</p>
                <div className="text-[13px] text-gray-500 font-medium">Data Customers / Contact / {isEditMode ? 'Edit' : 'Detail'}</div>
            </div>

            {isEditMode ? (
                <div className="space-y-4">
                    <CustomerContactForm
                        id={id}
                        isEdit={true}
                        onSuccess={() => navigate('/customerscontact')}
                        onCancel={() => {
                            const searchParams = new URLSearchParams(location.search);
                            searchParams.delete('mode');
                            navigate({ search: searchParams.toString() }, { replace: true, state: location.state });
                        }}
                    />
                </div>
            ) : contact ? (
                <div className="bg-white dark:bg-[#1f2028] p-6 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            Detail Contact
                        </h4>
                        <div className="flex gap-2">
                            {headerButtons}
                            <button type="button" onClick={() => navigate('/customerscontact')} className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-white text-[13px] font-medium rounded hover:bg-[#d97706] transition-colors"><i className="fas fa-undo"></i> Kembali</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Contact Name</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.nm_customers_contact}</div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Company Name</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.customer?.nm_customers || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Job Position</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.customers_contact_posisi || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Phone</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.customers_contact_phone || '-'}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Mobile</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.customers_contact_mobile || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Email</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.customers_contact_email || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Address</label>
                                <div className="text-[15px] font-medium text-gray-800">{contact.customers_contact_address || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">Contact not found</div>
            )}
        </div>
    );
};

export default CustomerContactEditPage;
