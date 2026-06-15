import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useIncShipment, 
  useAssignSn, 
  useReceiveIncShipment, 
  usePrintBarcode 
} from '../hooks/useIncshipment';

const IncomingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incomingId = Number(id);

  const { data: response, isLoading, isError } = useIncShipment(incomingId);
  const assignSnMutation = useAssignSn();
  const receiveMutation = useReceiveIncShipment();
  const printBarcodeMutation = usePrintBarcode();

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  if (isLoading) return <div className="flex justify-center p-12 text-gray-500 text-[13px]">Loading...</div>;
  if (isError || !response?.data) return <div className="p-4 bg-red-100 text-red-700 rounded border border-red-400 m-6">Error loading data</div>;

  const data = response.data;
  const isReady = data.status_incoming === 'READY TO RECEIVE';
  const hasAssigned = data.f_assign_barcode === 1;
  const hasPrinted = data.f_print_barcode === 1;

  const handleAssignSn = () => {
    assignSnMutation.mutate(incomingId);
  };

  const handlePrintBarcode = () => {
    // Open print page in new tab
    window.open(`/incshipment/${incomingId}/print-barcode`, '_blank');
    // Update print status backend
    printBarcodeMutation.mutate(incomingId);
  };

  const handleReceiveGoods = () => {
    if (selectedRowKeys.length === 0) {
      alert("Pilih barang minimal 1");
      return;
    }
    
    if (window.confirm("Receive? Anda tidak dapat mengubah data ini lagi ketika sudah di confirm !")) {
      const dataBarang = selectedRowKeys.map(key => ({ id_dtl: key }));
      receiveMutation.mutate({ id: incomingId, dataBarang });
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allKeys = data.details?.map(item => item.id_dtl) || [];
      setSelectedRowKeys(allKeys);
    } else {
      setSelectedRowKeys([]);
    }
  };

  const toggleRowSelect = (id_dtl: number) => {
    if (selectedRowKeys.includes(id_dtl)) {
      setSelectedRowKeys(selectedRowKeys.filter(k => k !== id_dtl));
    } else {
      setSelectedRowKeys([...selectedRowKeys, id_dtl]);
    }
  };

  const isAllSelected = data.details && data.details.length > 0 && selectedRowKeys.length === data.details.length;

  return (
    <div className="w-full min-h-screen py-2 px-4">
      <div className="flex justify-between items-center mb-4 pt-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/incshipment')}
            className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-2 py-1 flex items-center bg-white"
          >
            ← Kembali
          </button>
          <p className="text-2xl font-semibold text-[#3f2a2a] tracking-tight m-0">
            {data.code} <span className="text-lg font-normal text-gray-500">({data.status_incoming})</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isReady && !hasAssigned && (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-[13px] font-medium disabled:opacity-50"
              onClick={handleAssignSn}
              disabled={assignSnMutation.isPending}
            >
              {assignSnMutation.isPending ? 'Processing...' : 'Assign Serial Number'}
            </button>
          )}

          {isReady && hasAssigned && !hasPrinted && (
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-[13px] font-medium"
              onClick={handlePrintBarcode}
            >
              Print Barcode
            </button>
          )}

          {isReady && hasAssigned && hasPrinted && (
            <>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-[13px] font-medium disabled:opacity-50"
                onClick={handleReceiveGoods}
                disabled={receiveMutation.isPending}
              >
                {receiveMutation.isPending ? 'Processing...' : 'Receive Goods'}
              </button>
              <button 
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-1.5 rounded text-[13px] font-medium"
                onClick={handlePrintBarcode}
              >
                Print Barcode (Again)
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 mb-6 p-4 text-[13px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="py-2 w-1/3 font-semibold text-gray-600">Supplier</td>
                <td className="py-2 text-gray-800">{data.nm_suppliers}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-gray-600">Purchase Order</td>
                <td className="py-2 text-gray-800">{data.code_po}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-gray-600">Print Barcode</td>
                <td className="py-2 text-gray-800">{data.f_print_barcode === 1 ? 'YA' : 'TIDAK'}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-gray-600">OK to Receive</td>
                <td className="py-2 text-gray-800">
                  <input type="checkbox" checked={data.f_ok_receive === 1} disabled className="h-4 w-4" />
                </td>
              </tr>
            </tbody>
          </table>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr>
                <td className="py-2 font-semibold text-gray-600">Creation Date</td>
                <td className="py-2 text-gray-800">{data.date_create ? new Date(data.date_create).toLocaleString('id-ID') : '-'}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-gray-600">Receive Date</td>
                <td className="py-2 text-gray-800">{data.date_receive ? new Date(data.date_receive).toLocaleString('id-ID') : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 p-4">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max text-[13px]">
            <thead>
              <tr className="bg-[#f8f9fa] border-y border-gray-200">
                <th className="py-2.5 px-4 font-semibold text-gray-700">Kode</th>
                <th className="py-2.5 px-4 font-semibold text-gray-700">Product</th>
                <th className="py-2.5 px-4 font-semibold text-gray-700 text-center">Qty</th>
                <th className="py-2.5 px-4 font-semibold text-gray-700">Satuan</th>
                <th className="py-2.5 px-4 font-semibold text-gray-700">SN</th>
                <th className="py-2.5 px-4 font-semibold text-gray-700">Source Location</th>
                <th className="py-2.5 px-4 font-semibold text-gray-700">Destination Location</th>
                {isReady && hasAssigned && hasPrinted && (
                  <th className="py-2.5 px-4 font-semibold text-gray-700 text-center w-10">
                    <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} className="h-4 w-4" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.details?.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{row.code_product}</td>
                  <td className="py-3 px-4 text-gray-800">{row.nm_product}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{row.qty}</td>
                  <td className="py-3 px-4 text-gray-800">{row.nm_product_satuan}</td>
                  <td className="py-3 px-4 text-gray-800">{row.sn}</td>
                  <td className="py-3 px-4 text-gray-800">{row.lokasi_source || '-'}</td>
                  <td className="py-3 px-4 text-gray-800">{row.lokasi_destination || '-'}</td>
                  {isReady && hasAssigned && hasPrinted && (
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4" 
                        checked={selectedRowKeys.includes(row.id_dtl)}
                        onChange={() => toggleRowSelect(row.id_dtl)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomingEditPage;
