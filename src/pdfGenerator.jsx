import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

const PdfGenerator = () => {
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: 'RFQ20240092',
    invoiceDate: new Date().toISOString().split('T')[0], // Default to today's date
    dueDate: '2024-02-08', // Default due date
  });
  const [vendorData, setVendorData] = useState({
    vendorName: 'Foo',
    vendorAddress: '123 Kings Road',
    vendorPinCode: 'SW1A 1AA',
    contactPerson: 'Bar',
    contactPersonMobNo: '07444 899 712',
  });

  const [itemsData, setItemsData] = useState([
    { itemName: 'Water Tanks', quantity: "15", unitPrice: "1200", total: (15 * 1200).toString() },
    { itemName: 'Bookshelves', quantity: "2", unitPrice: "5000", total: (2 * 5000).toString() },
  ]);

  const grandTotal = useMemo(() => {
    return itemsData.reduce((sum, item) => sum + (parseInt(item.total) || 0), 0).toFixed(2);
  }, [itemsData]);

  const handleAddItem = () => {
    setItemsData([...itemsData, { itemName: '', quantity: '', unitPrice: '', total: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItemsData = [...itemsData];
    newItemsData[index][field] = value;

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseInt(newItemsData[index].quantity) || 0;
      const unitPrice = parseFloat(newItemsData[index].unitPrice) || 0;

      newItemsData[index].total = (quantity * unitPrice).toFixed(2).toString();
    }

    setItemsData(newItemsData);
  };

  const handleRemoveItem = (index) => {
    const newItemsData = [...itemsData];
    newItemsData.splice(index, 1);
    setItemsData(newItemsData);
  };

  const handleVendorChange = (field, value) => {
    setVendorData({ ...vendorData, [field]: value });
  };

  const generatePdf = () => {
    const pdf = new jsPDF();
    pdf.setProperties({ title: "Request For Quotation" });

    const callImage = "../public/logo.jpg";
    const imageUrl = "../public/logo.jpg";
    pdf.addImage(imageUrl, 'JPEG', 10, 5, 40, 12);
    pdf.setFontSize(10);
    pdf.text(`INVOICE`, 150, 12);
    pdf.setLineWidth(0.1);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, 18, 200, 18);
    pdf.text('FastScrew LTD', 13, 23);
    pdf.text("Basil", 13, 28);
    pdf.addImage(callImage, 'PNG', 13, 29, 3, 3);
    pdf.text("074447 907 838", 16, 32);
    pdf.text('invoice No      :', 130, 23);
    pdf.text('invoice Date   :', 130, 27);
    pdf.text('Due Date    :', 130, 31);
    pdf.text("RFQ001", 155, 23);
    pdf.text(format(new Date(), 'MMM dd, yyyy'), 155, 27);
    pdf.text(format(new Date("2024-02-08 00:00:00.000 +0530"), 'MMM dd, yyyy'), 155, 31);
    pdf.line(10, 34, 200, 34);
    pdf.text('To', 13, 39);
    pdf.text(`${vendorData?.vendorName}`, 13, 44);
    pdf.text(`${vendorData?.vendorAddress}`, 13, 48);
    pdf.text(`P.O BOX : ${vendorData?.vendorPinCode}`, 13, 52);
    pdf.text('Contact Person', 13, 56);
    pdf.text(`${vendorData?.contactPerson}`, 13, 60);
    pdf.addImage(callImage, 'PNG', 13, 61, 3, 3);
    pdf.text(`  ${vendorData?.contactPersonMobNo || "N/A"}`, 16, 64);

    const itemDetailsRows = itemsData?.map((item, index) => [
      (index + 1).toString(),
      item.itemName.toString(),
      item.quantity?.toString(),
      item.total?.toLocaleString(),
    ]);
    const itemDetailsHeaders = ['S.No', 'Item Name', 'Quantity', 'Total'];
    const columnWidths = [15, 90, 30, 30, 23];
    const headerStyles = {
      fillColor: [240, 240, 240],
      textColor: [0],
      fontStyle: 'bold',
    };

    const itemDetailsYStart = 88;
    pdf.autoTable({
      head: [itemDetailsHeaders],
      body: itemDetailsRows,
      startY: itemDetailsYStart,
      headStyles: {
        fillColor: headerStyles.fillColor,
        textColor: headerStyles.textColor,
        fontStyle: headerStyles.fontStyle,
        fontSize: 10,
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      bodyStyles: {
        fontSize: 10,
        cellPadding: { top: 1, right: 5, bottom: 1, left: 2 },
        textColor: [0, 0, 0],
        rowPageBreak: 'avoid',
      },
      margin: { top: 10, left: 13 },
      didDrawPage: function (data) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Grand Total: £${grandTotal.toLocaleString()}`, 13, data.cursor.y + 10);
      },
    });

    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.line(10, 283, 200, 283);
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, 185, pdf.internal.pageSize.getHeight() - 5);
    }
    pdf.save(`invoice-${format(new Date(), 'yyyyMMddHHmmss')}.pdf`);
    const pdfDataUri = pdf.output('datauristring');
    const newTab = window.open();
    newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700">Invoice No:</label>
          <input
            type="text"
            id="invoiceNo"
            value={invoiceDetails.invoiceNo}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceNo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700">Invoice Date:</label>
          <input
            type="date"
            id="invoiceDate"
            value={invoiceDetails.invoiceDate}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={invoiceDetails.dueDate}
            onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>  
      <h2 className="text-2xl font-bold mb-4">Vendor Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Vendor Name:</label>
          <input
            type="text"
            id="vendorName"
            value={vendorData.vendorName}
            onChange={(e) => handleVendorChange('vendorName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="vendorAddress" className="block text-sm font-medium text-gray-700">Vendor Address:</label>
          <input
            type="text"
            id="vendorAddress"
            value={vendorData.vendorAddress}
            onChange={(e) => handleVendorChange('vendorAddress', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="vendorPinCode" className="block text-sm font-medium text-gray-700">Vendor Post Code:</label>
          <input
            type="text"
            id="vendorPinCode"
            value={vendorData.vendorPinCode}
            onChange={(e) => handleVendorChange('vendorPinCode', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person:</label>
          <input
            type="text"
            id="contactPerson"
            value={vendorData.contactPerson}
            onChange={(e) => handleVendorChange('contactPerson', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="contactPersonMobNo" className="block text-sm font-medium text-gray-700">Contact Person Mobile No:</label>
          <input
            type="text"
            id="contactPersonMobNo"
            value={vendorData.contactPersonMobNo}
            onChange={(e) => handleVendorChange('contactPersonMobNo', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Item Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Item Name</th>
              <th className="px-4 py-2 border">Qty</th>
              <th className="px-4 py-2 border">Unit Price</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsData.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
                <td className="px-4 py-2 border">£{item.total}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-right px-4 py-2 border font-bold">Grand Total:</td>
              <td colSpan="2" className="px-4 py-2 border font-bold">£{grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Item
        </button>
        <button
          onClick={generatePdf}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default PdfGenerator;