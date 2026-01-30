/**
 * DataExporter: Utility for generating and downloading user rewards data
 * in various formats (CSV, JSON) for transparency and record-keeping.
 */
export class DataExporter {
    static exportToCSV(data: any[], filename: string) {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row =>
                headers.map(header => {
                    const val = row[header];
                    return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
                }).join(',')
            )
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, `${filename}.csv`);
    }

    static exportToJSON(data: any, filename: string) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `${filename}.json`);
    }

    static generatePrintSummary(userStats: any, achievements: any[]) {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
      <html>
        <head><title>StackMart Rewards Summary</title></head>
        <body style="font-family: sans-serif; padding: 2rem;">
          <h1>Rewards Summary</h1>
          <p>User: ${userStats.address}</p>
          <hr/>
          <h3>Statistics</h3>
          <ul>
            <li>Total Points: ${userStats.totalPoints}</li>
            <li>Current Tier: ${userStats.tier}</li>
            <li>Achievements: ${achievements.length}</li>
          </ul>
          <button onclick="window.print()">Print PDF</button>
        </body>
      </html>
    `;
        printWindow.document.write(html);
        printWindow.document.close();
    }

    private static downloadFile(blob: Blob, filename: string) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
