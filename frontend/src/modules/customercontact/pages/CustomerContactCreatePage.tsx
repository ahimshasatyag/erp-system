import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerContactForm from '../forms/CustomerContactForm';

const CustomerContactCreatePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box flex justify-between items-center py-4">
                        <h4 className="page-title text-xl font-bold">Tambah Contact</h4>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <CustomerContactForm
                        onSuccess={() => navigate('/customerscontact')}
                        onCancel={() => navigate('/customerscontact')}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerContactCreatePage;
