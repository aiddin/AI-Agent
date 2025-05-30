<template>
    <div class="flex h-full">
        <!-- Sidebar for file upload -->
        <div class="w-80 border-r border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div class="p-6 space-y-6">
                <div>
                    <h2 class="text-xl font-semibold dark:text-white-light">Issue Classification</h2>
                    <p class="text-sm text-white-dark mt-1">Upload and process CSV files with AI</p>
                </div>

                <div class="panel">
                    <div class="mb-5">
                        <h5 class="font-semibold text-lg dark:text-white-light">Upload CSV File</h5>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <input type="file" accept=".csv" @change="handleFileUpload"
                                class="form-input cursor-pointer" />
                            <p class="text-xs text-white-dark mt-2">
                                File must contain 'text' and 'human_label' columns
                            </p>
                        </div>

                        <div v-if="csvFile" class="flex items-center gap-2">
                            <span class="badge bg-secondary text-xs">
                                ✓ {{ csvFile.name }}
                            </span>
                        </div>
                    </div>
                </div>

                <button @click="processData" :disabled="!csvFile || isProcessing" class="btn btn-primary w-full"
                    :class="{ 'opacity-60 pointer-events-none': !csvFile || isProcessing }">
                    {{ isProcessing ? 'Processing...' : 'Process with AI' }}
                </button>

                <div v-if="isProcessing" class="space-y-3">
                    <div class="w-full bg-[#ebedf2] dark:bg-dark/40 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full transition-all duration-300"
                            :style="{ width: `${progressValue * 100}%` }"></div>
                    </div>
                    <p class="text-sm text-white-dark text-center">
                        {{ statusText }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Main content area for results -->
        <div class="flex-1 p-6 overflow-auto">
            <div v-if="!csvFile && !hasResults" class="flex items-center justify-center h-full">
                <div class="panel max-w-md">
                    <div class="text-center py-8">
                        <div
                            class="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center text-center text-gray-600 text-3xl p-5">
                            <img src="/assets/images/Ai Agent_Issue Classification.png" alt="Placeholder Image"
                                width=160 height="160"></div>
                        <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Get Started</h3>
                        <p class="text-white-dark">
                            Upload a CSV file with 'text' and 'human_label' columns to begin processing and compare
                            human labels with AI-generated labels.
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="error" class="mb-6">
                <div class="panel border-danger">
                    <div class="py-4">
                        <div class="flex items-center gap-2 text-danger">
                            <icon-info-triangle class="w-5 h-5" />
                            <span>{{ error }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="csvFile || hasResults" class="space-y-6">
                <div>
                    <h2 class="text-2xl font-semibold dark:text-white-light">Label Comparison Results</h2>
                    <p class="text-white-dark">Compare human annotations with AI predictions</p>
                </div>

                <div class="panel">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th class="ltr:rounded-l-md rtl:rounded-r-md">Text</th>
                                    <th>Human Label</th>
                                    <th>AI Label</th>
                                    <th class="ltr:rounded-r-md rtl:rounded-l-md text-center">Match</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in displayData" :key="index"
                                    class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td class="max-w-xs truncate text-black dark:text-white">{{ row.text }}</td>
                                    <td>
                                        <span class="badge badge-outline-secondary">{{ row.human_label }}</span>
                                    </td>
                                    <td>
                                        <span v-if="row.ai_label" class="badge bg-secondary">{{ row.ai_label }}</span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="row.match === true" class="badge bg-success">
                                            ✓
                                        </span>
                                        <span v-else-if="row.match === false" class="badge bg-danger">
                                            ✗
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="processingComplete" class="space-y-4">
                    <div class="panel border-success bg-success-light dark:bg-success/10">
                        <div class="py-4">
                            <div class="flex items-center gap-2 text-success">
                                <icon-circle-check class="w-5 h-5" />
                                <span class="font-medium">Processing Complete</span>
                                <span class="text-sm">- {{ totalRows }} rows processed</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="panel">
                            <div class="mb-5">
                                <h5 class="font-semibold text-sm text-white-dark">AI-Human Agreement</h5>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-success">{{ matchPercentage.toFixed(1) }}%</div>
                                <p class="text-xs text-white-dark">{{ matchCount }}/{{ totalRows }} rows</p>
                            </div>
                        </div>

                        <div class="panel">
                            <div class="mb-5">
                                <h5 class="font-semibold text-sm text-white-dark">Mismatches</h5>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-danger">{{ totalRows - matchCount }}</div>
                                <p class="text-xs text-white-dark">{{ (100 - matchPercentage).toFixed(1) }}%</p>
                            </div>
                        </div>

                        <div class="panel">
                            <div class="flex items-center justify-center py-6">
                                <button @click="downloadCSV" class="btn btn-outline-primary w-full">
                                    <icon-download class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                                    Download Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconInfoTriangle from '@/components/icon/icon-info-triangle.vue'
import IconCircleCheck from '@/components/icon/icon-circle-check.vue'
import IconDownload from '@/components/icon/icon-download.vue'
import { parse } from 'csv-parse/browser/esm/sync'

export default {
  name: 'IssueClassificationTool',
  components: {
    IconInfoTriangle,
    IconCircleCheck,
    IconDownload
  },
  data() {
    return {
      csvFile: null,
      csvData: [],
      displayData: [],
      isProcessing: false,
      hasResults: false,
      processingComplete: false,
      error: null,
      progressValue: 0,
      statusText: '',
      matchCount: 0,
      totalRows: 0,
      matchPercentage: 0
    };
  },
  methods: {
    // Handle file upload
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.csvFile = file;
        this.readCSVFile();
      }
    },

    // Read and parse CSV file
    async readCSVFile() {
      try {
        const text = await this.readFileAsText(this.csvFile);
        const data = this.parseCSV(text);

        // Check if required columns exist
        const requiredColumns = ['text', 'human_label'];
        const headers = Object.keys(data[0] || {});

        if (!requiredColumns.every(col => headers.includes(col))) {
          this.error = "CSV must contain 'text' and 'human_label' columns.";
          return;
        }

        // Add AI label and match columns if they don't exist
        this.csvData = data.map(row => ({
          ...row,
          ai_label: row.ai_label || '',
          match: row.match || ''
        }));

        // Update display data
        this.displayData = [...this.csvData];
        this.hasResults = true;
        this.error = null;
      } catch (error) {
        console.error("Error reading CSV file:", error);
        this.error = `Error reading CSV file: ${error.message}`;
      }
    },

    // Read file as text
    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error("No file provided"));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error("File reading failed"));
        reader.readAsText(file);
      });
    },

    // Parse CSV text using csv-parse library
    parseCSV(text) {
      try {
        // Use csv-parse to properly handle CSV format
        const records = parse(text, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });

        console.log('CSV parsed successfully:', records.length, 'rows');
        console.log('Sample record:', records[0]);

        return records;
      } catch (error) {
        console.error('CSV parsing error:', error);
        throw new Error(`CSV parsing failed: ${error.message}`);
      }
    },

    // Clean text by handling encoding issues
    cleanText(text) {
      if (typeof text === 'string') {
        // Replace common problematic characters
        text = text.replace(/�/g, "'");
        return text;
      }
      return text;
    },

    // Process data with AI
    async processData() {
      if (!this.csvFile) {
        this.error = "Please upload a CSV file first";
        return;
      }

      this.isProcessing = true;
      this.progressValue = 0;
      this.statusText = 'Starting processing...';
      this.error = null;

      try {
        this.totalRows = this.csvData.length;
        this.matchCount = 0;

        // Process each row
        for (let i = 0; i < this.csvData.length; i++) {
          const row = this.csvData[i];

          // Update progress
          this.progressValue = (i + 1) / this.totalRows;
          this.statusText = `Processing row ${i + 1} of ${this.totalRows}...`;

          // Clean text
          const cleanedText = this.cleanText(row.text);

          // Call API
          const result = await this.callWebhookAPI(cleanedText, row.human_label);

          // Update data
          this.csvData[i].ai_label = result.ai_label;
          this.csvData[i].match = result.match;

          if (result.match) {
            this.matchCount++;
          }

          // Update display data
          this.displayData = [...this.csvData];

          // Small delay to allow UI to update
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Calculate statistics
        this.matchPercentage = (this.matchCount / this.totalRows) * 100;

        // Complete
        this.statusText = 'Processing complete!';
        this.processingComplete = true;
      } catch (error) {
        console.error("Error processing data:", error);
        this.error = `Error processing data: ${error.message}`;
      } finally {
        this.isProcessing = false;
      }
    },

    // Call webhook API
    async callWebhookAPI(text, humanLabel) {
      try {
        // Prepare payload
        const payload = {
          text: text,
          human_label: humanLabel
        };

        // Make API call
        const response = await fetch("https://n8n.forwen.com/webhook/24b3d90f-9f0d-42c9-adf1-4153cc43d3ff", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        return {
          ai_label: result.ai_label || '',
          match: result.match || false
        };
      } catch (error) {
        console.error("API Call Failed:", error);
        return {
          ai_label: "Error",
          match: false
        };
      }
    },

    // Download CSV
    downloadCSV() {
      if (!this.csvData.length) return;

      // Convert data to CSV
      const headers = Object.keys(this.csvData[0]);
      const csvContent = [
        headers.join(','),
        ...this.csvData.map(row =>
          headers.map(header => {
            let value = row[header];
            // Handle special cases
            if (header === 'match' && typeof value === 'boolean') {
              value = value.toString();
            }
            // Escape values with commas
            if (typeof value === 'string' && value.includes(',')) {
              value = `"${value}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'label_comparison_results.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
/* Custom styles for responsive design */
@media (max-width: 768px) {
  .w-80 {
    width: 100%;
  }

  .flex {
    flex-direction: column;
  }
}
</style>
