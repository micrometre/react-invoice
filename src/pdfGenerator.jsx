import React, { useState } from 'react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

// Define the PdfGenerator component
const PdfGenerator = () => {
  // Sample vendor data
  const [vendorData, setVendorData] = useState({
    vendorName: 'Velavan B',
    vendorAddress: '14/203, Kallakulam, Seenapuram',
    vendorPinCode: '638057',
    contactPerson: 'Santhosh D',
    contactPersonMobNo: '8993298712',
  });

  // Sample items data
  const [itemsData, setItemsData] = useState([
    { itemName: 'Water Tanks', quantity: "15", uom: "Liters", unitPrice: "1200", total: (15 * 1200).toString() },
    { itemName: 'Laptops', quantity: "5", uom: "Pieces", unitPrice: "25000", total: (5 * 25000).toString() },
    { itemName: 'Coffee Mugs', quantity: "50", uom: "Pieces", unitPrice: "50", total: (50 * 50).toString() },
    { itemName: 'Desk Chairs', quantity: "8", uom: "Pieces", unitPrice: "8000", total: (8 * 8000).toString() },
    { itemName: 'LED TVs', quantity: "3", uom: "Units", unitPrice: "30000", total: (3 * 30000).toString() },
    { itemName: 'Bookshelves', quantity: "2", uom: "Units", unitPrice: "5000", total: (2 * 5000).toString() },
  ]);

  const handleAddItem = () => {
    setItemsData([...itemsData, { itemName: '', quantity: '', uom: '', unitPrice: '', total: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItemsData = [...itemsData];
    newItemsData[index][field] = value;

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseInt(newItemsData[index].quantity) || 0;
      const unitPrice = parseInt(newItemsData[index].unitPrice) || 0;
      newItemsData[index].total = (quantity * unitPrice).toString();
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
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Set document properties
    pdf.setProperties({
      title: "Request For Quotation"
    })

    // Add images and text to the PDF
    const callImage = "/Calling.png";
    const imageUrl = "/aalam.png";
    pdf.addImage(imageUrl, 'JPEG', 10, 5, 40, 12);
    pdf.setFontSize(10);
    //pdf.setFont('custom', 'bold');
    pdf.text('REQUEST FOR QUOTATION', 150, 12);

    // Line width in units (you can adjust this)
    pdf.setLineWidth(0.1);

    // Line color (RGB)
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, 18, 200, 18)
    pdf.text('Contact Person', 13, 23)
    //pdf.setFont('custom', 'normal');
    pdf.text("Nithish Kumar CP", 13, 28)
    pdf.addImage(callImage, 'PNG', 13, 29, 3, 3);
    pdf.text("9078382732", 16, 32)
    //pdf.setFont('Newsreader', 'bold')
    pdf.text('RFQ No      :', 130, 23)
    pdf.text('RFQ Date   :', 130, 27)
    pdf.text('Due Date    :', 130, 31)
    //pdf.setFont('Newsreader', 'normal')
    pdf.text("RFQ20240092", 155, 23)
    pdf.text(format(new Date(), 'MMM dd, yyyy'), 155, 27)
    pdf.text(format(new Date("2024-02-08 00:00:00.000 +0530"), 'MMM dd, yyyy'), 155, 31)
    pdf.line(10, 34, 200, 34)
    //pdf.setFont('Newsreader', 'bold')
    pdf.text('To', 13, 39)
    //pdf.setFont('Newsreader', 'bold')
    pdf.text('Purchase Centre Address :', 130, 39)
    //pdf.setFont('Newsreader', 'normal')
    pdf.text('Head Office', 130, 44)
    pdf.text('CHENNAI', 130, 48)

    // Generate the vendor-specific content
    //pdf.setFont('Newsreader', 'bold');
    pdf.text(`${vendorData?.vendorName}`, 13, 44);
    pdf.text(`${vendorData?.vendorAddress}`, 13, 48)
    //pdf.setFont('Newsreader', 'normal');
    pdf.text(`P.O BOX : ${vendorData?.vendorPinCode}`, 13, 52);
    //pdf.setFont('Newsreader', 'bold')
    pdf.text('Contact Person', 13, 56)
    //pdf.setFont('Newsreader', 'normal')
    pdf.text(`${vendorData?.contactPerson}`, 13, 60);
    pdf.addImage(callImage, 'PNG', 13, 61, 3, 3);
    pdf.text(`  ${vendorData?.contactPersonMobNo || "N/A"}`, 16, 64);
    //pdf.setFont('Newsreader', 'bold')
    pdf.text('Dear Sir,', 13, 72)
    //pdf.setFont('Newsreader', 'normal')
    pdf.text('Please send your most competitive offer/mentioning your Terms & Conditions before the due date. You can send the same to \nthe above mentioned e-mail/fax', 13, 79)
    //pdf.setFont('Newsreader', 'normal')
    //pdf.setFontSize(10);

    // Generate AutoTable for item details
    const itemDetailsRows = itemsData?.map((item, index) => [
      (index + 1).toString(),
      item.itemName.toString(),
      item.quantity?.toString(),
      item.uom?.toString(),
      item.total?.toLocaleString(),
    ]);
    const itemDetailsHeaders = ['S.No', 'Item Name', 'Quantity', 'UOM', 'Total'];
    const columnWidths = [15, 90, 30, 30, 23]; // Adjust column widths as needed
    // Define table styles
    const headerStyles = {
      fillColor: [240, 240, 240],
      textColor: [0],
      fontFamily: 'Newsreader',
      fontStyle: 'bold',
    };

    //pdf.setFont('Newsreader');
    const itemDetailsYStart = 88;
    pdf.autoTable({
      head: [itemDetailsHeaders],
      body: itemDetailsRows,
      startY: itemDetailsYStart, // Adjust the Y position as needed
      headStyles: {
        fillColor: headerStyles.fillColor,
        textColor: headerStyles.textColor,
        fontStyle: headerStyles.fontStyle,
        fontSize: 10, // Adjust the font size as needed
        //font: 'Newsreader', // Set the font family
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0] }, // Adjust column widths as needed
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      bodyStyles: {
        fontSize: 10, // Adjust the font size for the body
        font: 'Newsreader', // Set the font family for the body
        cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
        textColor: [0, 0, 0], // Set text color for the body
        rowPageBreak: 'avoid', // Avoid row page breaks
      },
      margin: { top: 10, left: 13 },
    });

    // Add summary and page numbers
    const summaryYStart = pdf.internal.pageSize.getHeight() - 50;

    //pdf.setFont('Newsreader', 'noraml')
    pdf.text('Thanking You,', 13, summaryYStart + 20)
    pdf.text('Yours Faithfully,', 13, summaryYStart + 24)
    pdf.text('For ', 13, summaryYStart + 28)
    //pdf.setFont('Newsreader', 'bold')
    pdf.text('Aalam Info Solutions LLP', 19, summaryYStart + 28)

    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.line(10, 283, 200, 283)
      pdf.setPage(i);
      //pdf.setFont('Newsreader');
      pdf.text(
        `Page ${i} of ${totalPages}`,
        185,
        pdf.internal.pageSize.getHeight() - 5
      );
    }

    // Save the PDF
    pdf.save(`RFQ.pdf`);

    // pdf open in a new tab
    const pdfDataUri = pdf.output('datauristring');
    const newTab = window.open();
    newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
  };

  return (
    <div>
        <h2>Vendor Details</h2>
      <div>
        <div>
          <label htmlFor="vendorName">Vendor Name:</label>
          <input
            type="text"
            id="vendorName"
            value={vendorData.vendorName}
            onChange={(e) => handleVendorChange('vendorName', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="vendorAddress">Vendor Address:</label>
          <input
            type="text"
            id="vendorAddress"
            value={vendorData.vendorAddress}
            onChange={(e) => handleVendorChange('vendorAddress', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="vendorPinCode">Vendor Pin Code:</label>
          <input
            type="text"
            id="vendorPinCode"
            value={vendorData.vendorPinCode}
            onChange={(e) => handleVendorChange('vendorPinCode', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contactPerson">Contact Person:</label>
          <input
            type="text"
            id="contactPerson"
            value={vendorData.contactPerson}
            onChange={(e) => handleVendorChange('contactPerson', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contactPersonMobNo">Contact Person Mobile No:</label>
          <input
            type="text"
            id="contactPersonMobNo"
            value={vendorData.contactPersonMobNo}
            onChange={(e) => handleVendorChange('contactPersonMobNo', e.target.value)}
          />
        </div>
      </div>
      <h2>Item Details</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>UOM</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemsData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={item.uom}
                  onChange={(e) => handleItemChange(index, 'uom', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                />
              </td>
              <td>{item.total}</td>
              <td>
                <button onClick={() => handleRemoveItem(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default PdfGenerator;
