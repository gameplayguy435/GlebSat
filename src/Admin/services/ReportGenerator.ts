import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

interface StatsData {
  min: number | string;
  max: number | string;
  avg: number | string;
  start: number | string;
  end: number | string;
  change: string;
}

interface MissionStatsData {
  temperature: StatsData;
  pressure: StatsData;
  humidity: StatsData;
  altitude: StatsData;
  co2: StatsData;
  particles: StatsData;
}

interface ReportData {
  mission: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    duration: string;
  };
  stats: MissionStatsData;
  records: any[];
}

/**
 * Formats a date in PT-PT format (DD-MM-YYYY)
 */
export const formatReportDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'N/A';
  }
};

/**
 * Formats time in PT-PT format (HH:MM:SS)
 */
export const formatReportTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return 'N/A';
  }
};

/**
 * Formats duration as MM min SS seg
 */
export const formatReportDuration = (duration: string) => {
  if (!duration) return 'N/A';
  
  try {
    if (duration.includes(':')) {
      const parts = duration.split(':');
      if (parts.length >= 2) {
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2]?.split('.')[0] || '0', 10);
        
        if (minutes === 0) {
          return `${seconds} seg`;
        } else if (seconds === 0) {
          return `${minutes} min`;
        } else {
          return `${minutes} min ${seconds} seg`;
        }
      }
    }
    
    return duration;
  } catch (error) {
    console.error("Error formatting duration:", error);
    return 'N/A';
  }
};

/**
 * Generate a PDF report for a mission with all stats and information
 */
export const generateMissionReport = (data: ReportData) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add logo if available
  // doc.addImage('/images/logo.png', 'PNG', 10, 10, 50, 20);
  
  // Document title
  doc.setFontSize(20);
  doc.setTextColor(33, 33, 33);
  doc.setFont('helvetica', 'bold');
  doc.text(`Relatório da Missão - ${data.mission.name}`, 20, 25);
  
  // Mission details section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(66, 66, 66);
  
  // Create a header box
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(20, 35, 170, 50, 3, 3, 'F');
  
  // Add mission information
  doc.setFont('helvetica', 'bold');
  doc.text("INFORMAÇÕES DA MISSÃO", 25, 45);
  doc.setFont('helvetica', 'normal');
  
  // Mission ID
  doc.text(`Número da Missão: ${data.mission.id}`, 25, 55);
  
  // Date formatting
  const startDate = new Date(data.mission.start_date);
  const endDate = new Date(data.mission.end_date);
  const sameDay = formatReportDate(data.mission.start_date) === formatReportDate(data.mission.end_date);
  
  // Date display
  doc.text(`Data: ${sameDay ? 
    formatReportDate(data.mission.start_date) : 
    `${formatReportDate(data.mission.start_date)} - ${formatReportDate(data.mission.end_date)}`}`, 25, 65);
  
  // Time display
  doc.text(`Hora: ${formatReportTime(data.mission.start_date)} - ${formatReportTime(data.mission.end_date)}`, 25, 75);
  
  // Duration
  doc.text(`Duração: ${formatReportDuration(data.mission.duration)}`, 105, 75);
  
  // Add timestamp
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Relatório gerado a: ${new Date().toLocaleString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}`, 25, 82);
  
  // Statistics Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(33, 33, 33);
  doc.text("Estatísticas", 20, 100);
  
  // Format numbers for display
  const formatValue = (value: any) => {
    if (value === undefined || value === null || value === 'N/A') return 'N/A';
    return typeof value === 'number' 
      ? value.toFixed(2).replace('.', ',') 
      : value.toString().replace('.', ',');
  };
  
  // Prepare table data
  const tableData = [
    [
      { content: 'Parâmetro', styles: { fontStyle: 'bold', halign: 'left' } },
      { content: 'Mínimo', styles: { fontStyle: 'bold', halign: 'center' } },
      { content: 'Máximo', styles: { fontStyle: 'bold', halign: 'center' } },
      { content: 'Média', styles: { fontStyle: 'bold', halign: 'center' } },
      { content: 'Início', styles: { fontStyle: 'bold', halign: 'center' } },
      { content: 'Fim', styles: { fontStyle: 'bold', halign: 'center' } },
      { content: 'Variação', styles: { fontStyle: 'bold', halign: 'center' } }
    ],
    [
      { content: 'Temperatura (°C)', styles: { halign: 'left' } },
      { content: formatValue(data.stats.temperature.min), styles: { halign: 'center' } },
      { content: formatValue(data.stats.temperature.max), styles: { halign: 'center' } },
      { content: formatValue(data.stats.temperature.avg), styles: { halign: 'center' } },
      { content: formatValue(data.stats.temperature.start), styles: { halign: 'center' } },
      { content: formatValue(data.stats.temperature.end), styles: { halign: 'center' } },
      { content: data.stats.temperature.change, styles: { halign: 'center' } }
    ],
    [
      { content: 'Pressão (hPa)', styles: { halign: 'left' } },
      { content: formatValue(data.stats.pressure.min), styles: { halign: 'center' } },
      { content: formatValue(data.stats.pressure.max), styles: { halign: 'center' } },
      { content: formatValue(data.stats.pressure.avg), styles: { halign: 'center' } },
      { content: formatValue(data.stats.pressure.start), styles: { halign: 'center' } },
      { content: formatValue(data.stats.pressure.end), styles: { halign: 'center' } },
      { content: data.stats.pressure.change, styles: { halign: 'center' } }
    ],
    [
      { content: 'Humidade (%)', styles: { halign: 'left' } },
      { content: formatValue(data.stats.humidity.min), styles: { halign: 'center' } },
      { content: formatValue(data.stats.humidity.max), styles: { halign: 'center' } },
      { content: formatValue(data.stats.humidity.avg), styles: { halign: 'center' } },
      { content: formatValue(data.stats.humidity.start), styles: { halign: 'center' } },
      { content: formatValue(data.stats.humidity.end), styles: { halign: 'center' } },
      { content: data.stats.humidity.change, styles: { halign: 'center' } }
    ],
    [
      { content: 'Altitude (m)', styles: { halign: 'left' } },
      { content: formatValue(data.stats.altitude.min), styles: { halign: 'center' } },
      { content: formatValue(data.stats.altitude.max), styles: { halign: 'center' } },
      { content: formatValue(data.stats.altitude.avg), styles: { halign: 'center' } },
      { content: formatValue(data.stats.altitude.start), styles: { halign: 'center' } },
      { content: formatValue(data.stats.altitude.end), styles: { halign: 'center' } },
      { content: data.stats.altitude.change, styles: { halign: 'center' } }
    ],
    [
      { content: 'CO2 (ppm)', styles: { halign: 'left' } },
      { content: formatValue(data.stats.co2.min), styles: { halign: 'center' } },
      { content: formatValue(data.stats.co2.max), styles: { halign: 'center' } },
      { content: formatValue(data.stats.co2.avg), styles: { halign: 'center' } },
      { content: formatValue(data.stats.co2.start), styles: { halign: 'center' } },
      { content: formatValue(data.stats.co2.end), styles: { halign: 'center' } },
      { content: data.stats.co2.change, styles: { halign: 'center' } }
    ],
    [
      { content: 'Partículas (µg/m³)', styles: { halign: 'left' } },
      { content: formatValue(data.stats.particles.min), styles: { halign: 'center' } },
      { content: formatValue(data.stats.particles.max), styles: { halign: 'center' } },
      { content: formatValue(data.stats.particles.avg), styles: { halign: 'center' } },
      { content: formatValue(data.stats.particles.start), styles: { halign: 'center' } },
      { content: formatValue(data.stats.particles.end), styles: { halign: 'center' } },
      { content: data.stats.particles.change, styles: { halign: 'center' } }
    ]
  ];
  
  // Generate the table
  autoTable(doc, {
    startY: 105,
    body: tableData,
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 5,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    margin: { left: 20, right: 20 },
  });
  
  // Add info about data points
  const dataPointCount = data.records.length;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Total de registos: ${dataPointCount}`, 20, doc.lastAutoTable.finalY + 10);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`GlebSat - Relatório da Missão ${data.mission.name} - Página ${i} de ${pageCount}`, 20, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  const fileName = `relatorio_missao_${data.mission.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  const pdfBlob = doc.output('blob');
  
  return pdfBlob;
};