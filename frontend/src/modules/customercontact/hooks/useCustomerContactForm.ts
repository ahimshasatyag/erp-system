import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerContactSchema, type CustomerContactFormValues } from '../validation/customerContactValidation';
import { fetchCustomerContact, createCustomerContact, updateCustomerContact, fetchCustomersData } from '../api/customerContactApi';

export const useCustomerContactForm = (id?: string | null) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);

    const form = useForm<CustomerContactFormValues>({
        resolver: zodResolver(customerContactSchema),
        defaultValues: {
            nm_customers_contact: '',
            id_customers: undefined,
            customers_contact_posisi: '',
            customers_contact_phone: '',
            customers_contact_mobile: '',
            customers_contact_email: '',
            customers_contact_address: '',
        }
    });

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const res = await fetchCustomersData();
                setCustomers(res.data.map((c: any) => ({
                    id: String(c.id_customers),
                    name: c.nm_customers
                })));
            } catch (err) {
                console.error('Failed to fetch customers', err);
            }
        };

        loadCustomers();
    }, []);

    useEffect(() => {
        if (id) {
            const loadContact = async () => {
                setLoading(true);
                try {
                    const res = await fetchCustomerContact(id);
                    const data = res.data;
                    form.reset({
                        nm_customers_contact: data.nm_customers_contact,
                        id_customers: data.id_customers,
                        customers_contact_posisi: data.customers_contact_posisi || '',
                        customers_contact_phone: data.customers_contact_phone || '',
                        customers_contact_mobile: data.customers_contact_mobile || '',
                        customers_contact_email: data.customers_contact_email || '',
                        customers_contact_address: data.customers_contact_address || '',
                    });
                } catch (error) {
                    console.error("Failed to load customer contact", error);
                } finally {
                    setLoading(false);
                }
            };
            loadContact();
        }
    }, [id, form]);

    const submitForm = async (data: CustomerContactFormValues) => {
        setLoading(true);
        try {
            if (id) {
                await updateCustomerContact(id, data);
            } else {
                await createCustomerContact(data);
            }
            return { success: true };
        } catch (error: any) {
            console.error("Form submission error", error);
            return { success: false, error: error.response?.data?.message || 'Submission failed' };
        } finally {
            setLoading(false);
        }
    };

    return { ...form, loading, customers, submitForm };
};
