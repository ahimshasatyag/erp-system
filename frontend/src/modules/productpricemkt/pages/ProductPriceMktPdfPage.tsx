import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductPriceMktPdf } from '../hooks/useProductPriceMkt';

const formatcemua = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

const ProductPriceMktPdfPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: pdfData, isLoading, isError } = useProductPriceMktPdf(id || null);

    useEffect(() => {
        if (pdfData && !isLoading) {
            // Automatically trigger print dialog when data is loaded
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [pdfData, isLoading]);

    if (isLoading) {
        return <div className="p-8 text-center">Menyiapkan Dokumen PDF...</div>;
    }

    if (isError || !pdfData) {
        return <div className="p-8 text-center text-red-500">Gagal memuat data PDF.</div>;
    }

    // Assuming API returns data wrapped in data
    const detail = pdfData.data;

    return (
        <div className="bg-white text-black p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="mb-8">
                <h2 className="text-xl font-bold uppercase mb-4 text-center">Harga Jual</h2>
                
                <table className="w-full mb-6">
                    <tbody>
                        <tr>
                            <td className="w-32 py-1 font-semibold">Product Code</td>
                            <td className="w-4">:</td>
                            <td>{detail.code_product}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Product Name</td>
                            <td>:</td>
                            <td>{detail.nm_product}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Harga Jual</td>
                            <td>:</td>
                            <td>{formatcemua(detail.product_price)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Kurs Bank</td>
                            <td>:</td>
                            <td>{formatcemua(detail.kurs_bank)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-semibold">Estimasi</td>
                            <td>:</td>
                            <td>{formatcemua(detail.estimasi)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #pdf-content, #pdf-content * {
                            visibility: visible;
                        }
                        #pdf-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>
        </div>
    );
};

// Wrap the export to use the id for printing
const Wrapper: React.FC = () => (
    <div id="pdf-content">
        <ProductPriceMktPdfPage />
    </div>
);

export default Wrapper;
