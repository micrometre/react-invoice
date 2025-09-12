import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

const PdfGenerator = () => {
  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `INV-${year}${month}${day}-${hours}${minutes}`;
  };

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0], // Default to today's date
    dueDate: new Date().toISOString().split('T')[0], // Default to today's date
  });
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyPhone: '',
    companyEmail: '',
  });
  const [vendorData, setVendorData] = useState({
    vendorName: 'Foo',
    vendorAddress: '123 Kings Road',
    vendorPinCode: 'SW1A 1AA',
    contactPerson: 'Bar',
    contactPersonMobNo: '07444 899 712',
  });
  const [customerData, setCustomerData] = useState({
    customerName: '',
    customerAddress: '',
    customerPinCode: '',
    customerContactPerson: '',
    customerContactPersonMobNo: '',
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
    // Large INVOICE title on the left
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text('INVOICE', 15, 27);
    
    // Invoice metadata under INVOICE title
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text('Invoice No:', 15, 37);
    pdf.text('Invoice Date:', 15, 42);
    pdf.text('Due Date:', 15, 47);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceDetails.invoiceNo, 50, 37);
    pdf.text(format(new Date(invoiceDetails.invoiceDate), 'MMM dd, yyyy'), 50, 42);
    pdf.text(format(new Date(invoiceDetails.dueDate), 'MMM dd, yyyy'), 50, 47);
    
    // Logo on the right, aligned with INVOICE title
    try {
      const imageUrl = "/logo.jpg";
      pdf.addImage(imageUrl, 'JPEG', 140, 15, 35, 20);
    } catch (error) {
      // If logo fails to load, add placeholder
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...secondaryColor);
      pdf.text('COMPANY', 150, 22);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('LOGO', 155, 28);
    }
    
    // Company details under logo
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text(companyData.companyName, 140, 45);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyData.companyAddress, 140, 50);
    pdf.text(companyData.companyCity, 140, 54);
    pdf.text(`Phone: ${companyData.companyPhone}`, 140, 58);
    pdf.text(`Email: ${companyData.companyEmail}`, 140, 62);
    
    // Add decorative line under header
    pdf.setLineWidth(2);
    pdf.setDrawColor(...accentColor);
    pdf.line(15, 90, 195, 90);
    
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(...secondaryColor);
    pdf.line(15, 92, 195, 92);
    
    // Vendor and Customer sections with improved layout
    const sectionStartY = 100;
    
    // Customer Section (now takes full width)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...accentColor);
    pdf.text('CUSTOMER DETAILS', 15, sectionStartY);
    
    // Customer box (wider since no vendor section)
    pdf.setFillColor(252, 253, 254);
    pdf.rect(15, sectionStartY + 5, 180, 40, 'F');
    pdf.setDrawColor(...secondaryColor);
    pdf.rect(15, sectionStartY + 5, 180, 40);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text(customerData?.customerName || 'N/A', 18, sectionStartY + 12);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(customerData?.customerAddress || 'N/A', 18, sectionStartY + 18);
    pdf.text(`Post Code: ${customerData?.customerPinCode || 'N/A'}`, 18, sectionStartY + 24);
    pdf.text(`Contact: ${customerData?.customerContactPerson || 'N/A'}`, 18, sectionStartY + 30);
    pdf.text(`Phone: ${customerData?.customerContactPersonMobNo || 'N/A'}`, 18, sectionStartY + 36);

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
        
        // Calculate total without tax
        const total = parseFloat(grandTotal);
        
        // Summary section
        const summaryX = 130;
        let summaryY = finalY + 15;
        
        // Summary box
        pdf.setFillColor(248, 249, 250);
        pdf.rect(summaryX, summaryY - 5, 65, 20, 'F');
        pdf.setDrawColor(...secondaryColor);
        pdf.rect(summaryX, summaryY - 5, 65, 20);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...primaryColor);
        
        // Line separator
        pdf.setLineWidth(0.5);
        pdf.line(summaryX + 3, summaryY + 2, summaryX + 62, summaryY + 2);
        
        // Total
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('TOTAL:', summaryX + 3, summaryY + 10);
        pdf.text(`£${total.toFixed(2)}`, summaryX + 35, summaryY + 10);
        
        // Payment terms and additional info
        const termsY = finalY + 45;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...accentColor);
        pdf.text('PAYMENT TERMS & CONDITIONS', 15, termsY);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...primaryColor);
        const terms = [
          '• Late payments may incur additional charges',
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
      
      <h2 className="text-2xl font-bold mb-4">Company Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyData.companyName}
            onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">Company Address:</label>
          <input
            type="text"
            id="companyAddress"
            value={companyData.companyAddress}
            onChange={(e) => setCompanyData({ ...companyData, companyAddress: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">Phone Number:</label>
          <input
            type="text"
            id="companyPhone"
            value={companyData.companyPhone}
            onChange={(e) => setCompanyData({ ...companyData, companyPhone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">Email Address:</label>
          <input
            type="email"
            id="companyEmail"
            value={companyData.companyEmail}
            onChange={(e) => setCompanyData({ ...companyData, companyEmail: e.target.value })}
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
          <label htmlFor="customerContactPersonMobNo" className="block text-sm font-medium text-gray-700"> Mobile No:</label>
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