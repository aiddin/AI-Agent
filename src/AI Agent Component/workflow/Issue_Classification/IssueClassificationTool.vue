<template>
  <div class="flex h-full bg-white">
    <!-- Sidebar for file upload -->
    <div class="w-80 border-r border-gray-200 bg-white">
      <div class="p-6 space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Issue Classification</h2>
          <p class="text-sm text-gray-600 mt-1">Upload and process CSV files with AI</p>
        </div>
        
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Input 
                type="file" 
                accept=".csv"
                @change="handleFileUpload"
                class="cursor-pointer"
              />
              <p class="text-xs text-gray-500 mt-2">
                File must contain 'text' and 'human_label' columns
              </p>
            </div>
            
            <div v-if="csvFile" class="flex items-center gap-2">
              <Badge variant="secondary" class="text-xs">
                ✓ {{ csvFile.name }}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          @click="processData" 
          :disabled="!csvFile || isProcessing"
          class="w-full"
          size="lg"
        >
          {{ isProcessing ? 'Processing...' : 'Process with AI' }}
        </Button>
        
        <div v-if="isProcessing" class="space-y-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: `${progressValue * 100}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 text-center">
            {{ statusText }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Main content area for results -->
    <div class="flex-1 p-6 overflow-auto">
      <div v-if="!csvFile && !hasResults" class="flex items-center justify-center h-full">
        <Card class="max-w-md">
          <CardContent class="text-center py-8">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-lg font-semibold mb-2">Get Started</h3>
            <p class="text-gray-600">
              Upload a CSV file with 'text' and 'human_label' columns to begin processing and compare human labels with AI-generated labels.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div v-if="error" class="mb-6">
        <Card class="border-red-200">
          <CardContent class="py-4">
            <div class="flex items-center gap-2 text-red-600">
              <span class="text-lg">⚠️</span>
              <span>{{ error }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div v-if="csvFile || hasResults" class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Label Comparison Results</h2>
          <p class="text-gray-600">Compare human annotations with AI predictions</p>
        </div>
        
        <Card>
          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="border-b border-gray-200">
                  <tr class="bg-gray-50">
                    <th class="text-left p-4 font-medium">Text</th>
                    <th class="text-left p-4 font-medium">Human Label</th>
                    <th class="text-left p-4 font-medium">AI Label</th>
                    <th class="text-center p-4 font-medium">Match</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in displayData" :key="index" class="border-b border-gray-200 last:border-0">
                    <td class="p-4 max-w-xs truncate">{{ row.text }}</td>
                    <td class="p-4">
                      <Badge variant="outline">{{ row.human_label }}</Badge>
                    </td>
                    <td class="p-4">
                      <Badge v-if="row.ai_label" variant="secondary">{{ row.ai_label }}</Badge>
                    </td>
                    <td class="p-4 text-center">
                      <Badge v-if="row.match === true" variant="default" class="bg-green-100 text-green-800 border-green-200">
                        ✓
                      </Badge>
                      <Badge v-else-if="row.match === false" variant="destructive">
                        ✗
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div v-if="processingComplete" class="space-y-4">
          <Card class="border-green-200 bg-green-50">
            <CardContent class="py-4">
              <div class="flex items-center gap-2 text-green-800">
                <span class="text-lg">✅</span>
                <span class="font-medium">Processing Complete</span>
                <span class="text-sm">- {{ totalRows }} rows processed</span>
              </div>
            </CardContent>
          </Card>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm text-gray-600">AI-Human Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold text-green-600">{{ matchPercentage.toFixed(1) }}%</div>
                <p class="text-xs text-gray-500">{{ matchCount }}/{{ totalRows }} rows</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm text-gray-600">Mismatches</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold text-red-600">{{ totalRows - matchCount }}</div>
                <p class="text-xs text-gray-500">{{ (100 - matchPercentage).toFixed(1) }}%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent class="flex items-center justify-center py-6">
                <Button @click="downloadCSV" variant="outline" class="w-full">
                  📥 Download Results
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '@/components/ui'

export default {
  name: 'IssueClassificationTool',
  components: {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Input,
    Badge
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
    
    // Parse CSV text
    parseCSV(text) {
      if (!text || text.trim() === '') {
        return [];
      }
      
      // Handle different line endings
      const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        return [];
      }
      
      // Get headers from first line
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parse data rows
      return lines.slice(1)
        .map(line => {
          // Handle quoted values with commas inside
          const values = [];
          let inQuote = false;
          let currentValue = '';
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
              inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          
          // Add the last value
          values.push(currentValue.trim());
          
          // Create object from headers and values
          const obj = {};
          headers.forEach((header, index) => {
            // Remove quotes from values if present
            let value = values[index] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }
            obj[header] = value;
          });
          
          return obj;
        });
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
