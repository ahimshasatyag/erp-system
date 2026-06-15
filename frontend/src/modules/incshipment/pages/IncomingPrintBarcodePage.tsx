import React from 'react';
import { useParams } from 'react-router-dom';
import { useIncShipment } from '../hooks/useIncshipment';
import Barcode from 'react-barcode';

const IncomingPrintBarcodePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const incomingId = Number(id);
  const { data: response, isLoading, isError } = useIncShipment(incomingId);

  if (isLoading) return <div className="flex justify-center p-12 text-gray-500">Loading...</div>;
  if (isError || !response?.data) return <div className="p-4 bg-red-100 text-red-700 m-6 rounded border border-red-400">Error loading data</div>;

  const data = response.data;
  const itemsWithSn = data.details?.filter(item => item.sn) || [];

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <div className="bg-white border-b p-4 flex justify-between items-center print:hidden shadow-sm">
        <h1 className="text-xl font-semibold m-0 text-gray-800">Print Barcodes - {data.code}</h1>
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          Print Labels
        </button>
      </div>

      {/* Print Container */}
      <div className="print-container max-w-4xl mx-auto mt-8">
        {itemsWithSn.length === 0 && (
          <div className="p-4 bg-yellow-100 text-yellow-800 m-6 rounded border border-yellow-400 print:hidden">
            No items with Serial Numbers to print.
          </div>
        )}
        
        <div className="flex flex-wrap gap-8 justify-center print:gap-0 print:block">
          {itemsWithSn.map((item, index) => (
            <div 
              key={index} 
              className="barcode-label bg-white border border-gray-300 p-4 shadow-sm w-[10cm] h-[15cm] flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:break-after-page"
              style={{
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid'
              }}
            >
              <div>
                <div className="flex items-start mb-6">
                  {/* Logo Placeholder */}
                  <div className="w-20 h-20 bg-gray-200 border border-gray-400 flex items-center justify-center mr-4 text-xs text-gray-500 font-bold">
                    LOGO
                  </div>
                  <div>
                    <h2 className="text-xl font-bold m-0 leading-tight">PT Eka Maju Mesinindo</h2>
                    <p className="text-sm m-0 mt-1 leading-snug">Untuk service dan maintenance hubungi:</p>
                    <p className="text-sm font-bold m-0 leading-snug">
                      (WhatsApp) 0818-0790-2222<br/>
                      (021) 660-2665, 661-8255
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-lg m-0">{item.nm_product}</p>
                  <p className="text-4xl font-bold m-0 mt-2">{item.code_product}</p>
                </div>
              </div>

              <div className="flex justify-center mt-auto mb-8">
                <Barcode 
                  value={item.sn!} 
                  width={2} 
                  height={80} 
                  fontSize={16}
                  background="#ffffff"
                  lineColor="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: 10cm 15cm portrait;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print-container {
            margin: 0 !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default IncomingPrintBarcodePage;
