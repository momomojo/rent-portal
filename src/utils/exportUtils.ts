import { jsPDF } from 'jspdf';

export const exportToCSV = (data: any, filename: string) => {
  const headers = [
    'Property',
    'Revenue',
    'Expenses',
    'Occupancy Rate',
    'Collection Rate',
    'Maintenance Requests'
  ];

  const csvContent = [
    headers.join(','),
    ...data.performance.map((property: any) => [
      property.name,
      property.revenue,
      property.expenses,
      `${property.occupancyRate}%`,
      `${property.collectionRate}%`,
      property.maintenanceRequests
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

export const exportToPDF = (data: any, filename: string) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title
  doc.setFontSize(20);
  doc.text('Rental Property Report', 20, yPos);
  yPos += 20;

  // Add summary section
  doc.setFontSize(14);
  doc.text('Summary', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.text(`Total Revenue: $${data.revenue.total.toLocaleString()}`, 30, yPos);
  yPos += 10;
  doc.text(`Average Occupancy Rate: ${data.occupancy.rate}%`, 30, yPos);
  yPos += 10;
  doc.text(`Payment Collection Rate: ${data.payments.collectionRate}%`, 30, yPos);
  yPos += 10;
  doc.text(`Total Maintenance Costs: $${data.maintenance.total.toLocaleString()}`, 30, yPos);
  yPos += 20;

  // Add property performance section
  doc.setFontSize(14);
  doc.text('Property Performance', 20, yPos);
  yPos += 10;

  // Table headers
  const headers = ['Property', 'Revenue', 'Expenses', 'Occupancy'];
  const columnWidths = [60, 40, 40, 40];
  let xPos = 20;

  doc.setFontSize(12);
  headers.forEach((header, index) => {
    doc.text(header, xPos, yPos);
    xPos += columnWidths[index];
  });
  yPos += 10;

  // Table rows
  data.performance.forEach((property: any) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    xPos = 20;
    doc.text(property.name, xPos, yPos);
    xPos += columnWidths[0];
    doc.text(`$${property.revenue.toLocaleString()}`, xPos, yPos);
    xPos += columnWidths[1];
    doc.text(`$${property.expenses.toLocaleString()}`, xPos, yPos);
    xPos += columnWidths[2];
    doc.text(`${property.occupancyRate}%`, xPos, yPos);
    yPos += 10;
  });

  doc.save(`${filename}.pdf`);
};