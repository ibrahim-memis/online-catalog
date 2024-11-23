import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function exportToExcel(data: any[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

export async function exportToPDF(data: any[], filename: string) {
  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));

  autoTable(doc, {
    head: [headers],
    body: rows,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [46, 125, 50] }
  });

  doc.save(`${filename}.pdf`);
}

export async function exportToWord(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));

  let html = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #2e7d32; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/msword' });
  saveAs(blob, `${filename}.doc`);
}