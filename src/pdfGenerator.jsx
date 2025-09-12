import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

const PdfGenerator = () => {
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: 'RFQ20240092',
    invoiceDate: new Date().toISOString().split('T')[0], // Default to today's date
    dueDate: new Date().toISOString().split('T')[0], // Default to today's date
  });
  const [vendorData, setVendorData] = useState({
    vendorName: 'Foo',
    vendorAddress: '123 Kings Road',
    vendorPinCode: 'SW1A 1AA',
    contactPerson: 'Bar',
    contactPersonMobNo: '07444 899 712',
  });
  const [customerData, setCustomerData] = useState({
    customerName: 'John Doe',
    customerAddress: '456 Customer Street',
    customerPinCode: '12345',
    customerContactPerson: 'Jane Doe',
    customerContactPersonMobNo: '09876 543 210',
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
    pdf.setProperties({ title: "INVOICE" });

    // Define colors
    const primaryColor = [52, 73, 94];   // Dark blue-gray
    const secondaryColor = [149, 165, 166]; // Light gray
    const accentColor = [52, 152, 219];  // Blue
    
    // Header Section with improved layout
    try {
      const imageUrl = "/logo.jpg";
      pdf.addImage(imageUrl, 'JPEG', 15, 15, 35, 20);
    } catch (error) {
      // If logo fails to load, add placeholder
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text('YOUR COMPANY', 15, 25);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('LOGO', 15, 30);
    }
    
    // Company details on the right
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text('INVOICE', 140, 25);
    
    // Add decorative line under header
    pdf.setLineWidth(2);
    pdf.setDrawColor(...accentColor);
    pdf.line(15, 40, 195, 40);
    
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(...secondaryColor);
    pdf.line(15, 42, 195, 42);
    
    // Invoice metadata section with improved layout
    const metadataStartY = 50;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    
    // Create a box for invoice details
    pdf.setFillColor(248, 249, 250);
    pdf.rect(140, metadataStartY, 55, 25, 'F');
    pdf.setDrawColor(...secondaryColor);
    pdf.rect(140, metadataStartY, 55, 25);
    
    pdf.text('Invoice No:', 143, metadataStartY + 6);
    pdf.text('Invoice Date:', 143, metadataStartY + 12);
    pdf.text('Due Date:', 143, metadataStartY + 18);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceDetails.invoiceNo, 170, metadataStartY + 6);
    pdf.text(format(new Date(invoiceDetails.invoiceDate), 'MMM dd, yyyy'), 170, metadataStartY + 12);
    pdf.text(format(new Date(invoiceDetails.dueDate), 'MMM dd, yyyy'), 170, metadataStartY + 18);
    
    // Vendor and Customer sections with improved layout
    const sectionStartY = 85;
    
    // Vendor Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...accentColor);
    pdf.text('VENDOR DETAILS', 15, sectionStartY);
    
    // Vendor box
    pdf.setFillColor(252, 253, 254);
    pdf.rect(15, sectionStartY + 5, 85, 40, 'F');
    pdf.setDrawColor(...secondaryColor);
    pdf.rect(15, sectionStartY + 5, 85, 40);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text(vendorData?.vendorName || 'N/A', 18, sectionStartY + 12);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(vendorData?.vendorAddress || 'N/A', 18, sectionStartY + 18);
    pdf.text(`Post Code: ${vendorData?.vendorPinCode || 'N/A'}`, 18, sectionStartY + 24);
    pdf.text(`Contact: ${vendorData?.contactPerson || 'N/A'}`, 18, sectionStartY + 30);
    pdf.text(`Phone: ${vendorData?.contactPersonMobNo || 'N/A'}`, 18, sectionStartY + 36);

    // Customer Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...accentColor);
    pdf.text('CUSTOMER DETAILS', 110, sectionStartY);
    
    // Customer box
    pdf.setFillColor(252, 253, 254);
    pdf.rect(110, sectionStartY + 5, 85, 40, 'F');
    pdf.setDrawColor(...secondaryColor);
    pdf.rect(110, sectionStartY + 5, 85, 40);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text(customerData?.customerName || 'N/A', 113, sectionStartY + 12);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(customerData?.customerAddress || 'N/A', 113, sectionStartY + 18);
    pdf.text(`Post Code: ${customerData?.customerPinCode || 'N/A'}`, 113, sectionStartY + 24);
    pdf.text(`Contact: ${customerData?.customerContactPerson || 'N/A'}`, 113, sectionStartY + 30);
    pdf.text(`Phone: ${customerData?.customerContactPersonMobNo || 'N/A'}`, 113, sectionStartY + 36);

    // Enhanced Items Table
    const itemDetailsRows = itemsData?.map((item, index) => [
      (index + 1).toString(),
      item.itemName.toString(),
      item.quantity?.toString() || '0',
      `£${parseFloat(item.unitPrice || 0).toFixed(2)}`,
      `£${parseFloat(item.total || 0).toFixed(2)}`,
    ]);
    
    const itemDetailsHeaders = ['S.No', 'Item Description', 'Qty', 'Unit Price', 'Total Amount'];
    
    const itemDetailsYStart = sectionStartY + 55;
    
    // Add items section title
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...accentColor);
    pdf.text('ITEMS & SERVICES', 15, itemDetailsYStart - 5);

    pdf.autoTable({
      head: [itemDetailsHeaders],
      body: itemDetailsRows,
      startY: itemDetailsYStart,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 85, halign: 'left' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' },
      },
      alternateRowStyles: { 
        fillColor: [248, 249, 250] 
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: { top: 4, right: 5, bottom: 4, left: 5 },
        textColor: [0, 0, 0],
        lineColor: secondaryColor,
        lineWidth: 0.1,
      },
      tableLineColor: secondaryColor,
      tableLineWidth: 0.1,
      margin: { left: 15, right: 15 },
      didDrawPage: function (data) {
        const finalY = data.cursor.y;
        
        // Calculate subtotal, tax, and total
        const subtotal = parseFloat(grandTotal);
        const taxRate = 0.20; // 20% VAT
        const taxAmount = subtotal * taxRate;
        const totalWithTax = subtotal + taxAmount;
        
        // Summary section
        const summaryX = 130;
        let summaryY = finalY + 15;
        
        // Summary box
        pdf.setFillColor(248, 249, 250);
        pdf.rect(summaryX, summaryY - 5, 65, 30, 'F');
        pdf.setDrawColor(...secondaryColor);
        pdf.rect(summaryX, summaryY - 5, 65, 30);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...primaryColor);
        
        // Subtotal
        pdf.text('Subtotal:', summaryX + 3, summaryY + 3);
        pdf.text(`£${subtotal.toFixed(2)}`, summaryX + 45, summaryY + 3);
        
        // Tax
        pdf.text('VAT (20%):', summaryX + 3, summaryY + 9);
        pdf.text(`£${taxAmount.toFixed(2)}`, summaryX + 45, summaryY + 9);
        
        // Line separator
        pdf.setLineWidth(0.5);
        pdf.line(summaryX + 3, summaryY + 12, summaryX + 62, summaryY + 12);
        
        // Total
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('TOTAL:', summaryX + 3, summaryY + 18);
        pdf.text(`£${totalWithTax.toFixed(2)}`, summaryX + 35, summaryY + 18);
        
        // Payment terms and additional info
        const termsY = finalY + 55;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...accentColor);
        pdf.text('PAYMENT TERMS & CONDITIONS', 15, termsY);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...primaryColor);
        const terms = [
          '• Payment is due within 30 days of invoice date',
          '• Late payments may incur additional charges',
          '• Please quote invoice number in all correspondence',
          '• Bank Details: Sort Code: 12-34-56, Account: 12345678'
        ];
        
        terms.forEach((term, index) => {
          pdf.text(term, 15, termsY + 8 + (index * 5));
        });
      },
    });

    // Enhanced page numbering and footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer line
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(...secondaryColor);
      pdf.line(15, pageHeight - 20, 195, pageHeight - 20);
      
      // Page number
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...secondaryColor);
      pdf.text(`Page ${i} of ${totalPages}`, 15, pageHeight - 10);
      
      // Company footer info
      pdf.text('Thank you for your business!', 105, pageHeight - 10, { align: 'center' });
      pdf.text(`Generated on ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 195, pageHeight - 10, { align: 'right' });
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

      <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerData.customerName}
            onChange={(e) => setCustomerData({ ...customerData, customerName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700">Customer Address:</label>
          <input
            type="text"
            id="customerAddress"
            value={customerData.customerAddress}
            onChange={(e) => setCustomerData({ ...customerData, customerAddress: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="customerPinCode" className="block text-sm font-medium text-gray-700">Customer Post Code:</label>
          <input
            type="text"
            id="customerPinCode"
            value={customerData.customerPinCode}
            onChange={(e) => setCustomerData({ ...customerData, customerPinCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="customerContactPerson" className="block text-sm font-medium text-gray-700">Contact Person:</label>
          <input
            type="text"
            id="customerContactPerson"
            value={customerData.customerContactPerson}
            onChange={(e) => setCustomerData({ ...customerData, customerContactPerson: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="customerContactPersonMobNo" className="block text-sm font-medium text-gray-700">Contact Person Mobile No:</label>
          <input
            type="text"
            id="customerContactPersonMobNo"
            value={customerData.customerContactPersonMobNo}
            onChange={(e) => setCustomerData({ ...customerData, customerContactPersonMobNo: e.target.value })}
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