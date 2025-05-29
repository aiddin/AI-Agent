<template>
  <div class="candidate-scoring">

    <!-- Main Content -->
    <div class="main-content">
      <h1 class="page-title">Candidate Scoring</h1>

      <!-- Upload Section -->
      <div class="upload-container">
        <div class="upload-label">Upload Student Records CSV</div>
        
        <!-- File Upload Area -->
        <div 
          class="upload-area"
          :class="{ 'drag-over': isDragOver }"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <div class="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 10L12 5L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="upload-text">
            <div class="upload-main-text">Drag and drop file here</div>
            <div class="upload-sub-text">Limit 200MB per file • CSV</div>
          </div>
          <button class="browse-button" @click.stop="triggerFileInput">Browse files</button>
        </div>

        <!-- Hidden file input -->
        <input 
          ref="fileInput"
          type="file" 
          @change="handleFileUpload" 
          accept=".csv" 
          class="hidden-file-input"
        />

        <!-- Upload Status Message -->
        <div v-if="!hasFile" class="upload-message">
          Please upload a CSV file.
        </div>

        <!-- File Preview Section -->
        <div v-if="studentData.length > 0" class="preview-section">
          <h3 class="preview-title">Preview of Uploaded Records</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in previewData" :key="rowIndex">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Scoring Button -->
      <button 
        @click="runScoring" 
        :disabled="studentData.length === 0 || processing" 
        class="action-button"
        v-if="studentData.length > 0"
      >
        Run Candidate Scoring
      </button>

      <!-- Results Section -->
      <div v-if="scoringResults.length > 0" class="results-section">
        <h3 class="results-title">Live Scoring Results</h3>
        <div v-if="processing" class="progress-info">
          <div class="spinner"></div>
          <p>{{ progressText }}</p>
        </div>
        <div class="table-container">
          <table class="results-table">
            <thead>
              <tr>
                <th>Reference Number</th>
                <th>Full Name</th>
                <th>Choice 1 Score</th>
                <th>Choice 1 Reasoning</th>
                <th>Choice 2 Score</th>
                <th>Choice 2 Reasoning</th>
                <th>Choice 3 Score</th>
                <th>Choice 3 Reasoning</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in scoringResults" :key="result['Reference Number']">
                <td>{{ result['Reference Number'] }}</td>
                <td>{{ result['Full Name'] }}</td>
                <td :style="{ backgroundColor: getScoreColor(result.C1_Score), color: 'black' }">{{ result.C1_Score }}</td>
                <td>{{ result.C1_Reasoning }}</td>
                <td :style="{ backgroundColor: getScoreColor(result.C2_Score), color: 'black' }">{{ result.C2_Score }}</td>
                <td>{{ result.C2_Reasoning }}</td>
                <td :style="{ backgroundColor: getScoreColor(result.C3_Score), color: 'black' }">{{ result.C3_Score }}</td>
                <td>{{ result.C3_Reasoning }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      studentData: [],
      headers: [],
      scoringResults: [],
      processing: false,
      completedTasks: 0,
      totalTasks: 0,
      progressText: '',
      isDragOver: false
    }
  },
  computed: {
    previewData () {
      // Return first 10 rows for preview
      return this.studentData.slice(0, 10)
    },
    hasFile () {
      return this.studentData.length > 0
    }
  },
  methods: {
    handleFileUpload (event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target.result
        this.parseCSV(csvText)
      }
      reader.readAsText(file)
    },

    parseCSV (csvText) {
      const lines = csvText.trim().split('\n')
      this.headers = lines[0].split(',').map(header => header.trim())

      this.studentData = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim())
        if (values.length === this.headers.length) {
          const rowData = {}
          this.headers.forEach((header, index) => {
            rowData[header] = values[index]
          })
          this.studentData.push(rowData)
        }
      }

      // Reset results when new file is uploaded
      this.scoringResults = []
      this.processing = false
    },

    async runScoring () {
      if (this.studentData.length === 0) return

      this.processing = true
      this.completedTasks = 0
      this.totalTasks = this.studentData.length

      // Initialize results with "Processing" status
      this.scoringResults = this.studentData.map(student => ({
        'Reference Number': student['Reference Number'] || 'Unknown',
        'Full Name': student['Full Name'] || '',
        'C1_Score': 'Processing...',
        'C1_Reasoning': 'Processing...',
        'C2_Score': 'Processing...',
        'C2_Reasoning': 'Processing...',
        'C3_Score': 'Processing...',
        'C3_Reasoning': 'Processing...'
      }))

      // Process in batches to avoid overwhelming the server
      const batchSize = 5
      const delay = 200 // ms between requests

      const processBatch = async (startIndex) => {
        const endIndex = Math.min(startIndex + batchSize, this.studentData.length)
        const batchPromises = []

        for (let i = startIndex; i < endIndex; i++) {
          batchPromises.push(this.scoreStudent(this.studentData[i], i))
          // Add small delay between requests
          await new Promise(resolve => setTimeout(resolve, delay))
        }

        await Promise.all(batchPromises)

        if (endIndex < this.studentData.length) {
          // Process next batch
          await processBatch(endIndex)
        } else {
          // All batches completed
          this.processing = false
          this.progressText = `✅ All ${this.totalTasks} candidates scored successfully!`
        }
      }

      // Start processing the first batch
      await processBatch(0)
    },

    async scoreStudent (studentData, index) {
      try {
        // Extract data from the student row
        const refNumber = studentData['Reference Number']
        const results = {
          "BAHASA INGGERIS (BI)": studentData["BAHASA INGGERIS (BI)"] || "",
          "BAHASA MELAYU (BM)": studentData["BAHASA MELAYU (BM)"] || "",
          "BIOLOGI": studentData["BIOLOGI"] || "",
          "FIZIK": studentData["FIZIK"] || "",
          "KIMIA": studentData["KIMIA"] || "",
          "MATEMATIK": studentData["MATEMATIK"] || "",
          "MATEMATIK TAMBAHAN": studentData["MATEMATIK TAMBAHAN"] || ""
        }

        // Create the request body as specified
        const requestBody = [
          {
            "ref": refNumber,
            "score": "c1_score",
            "reasoning": "c1_reasoning",
            "choiceColumn": "choice1",
            "choice": studentData["CHOICE 1"] || "",
            "qualification": studentData["Qualification Latest"] || "",
            "result": JSON.stringify(results)
          },
          {
            "ref": refNumber,
            "score": "c2_score",
            "reasoning": "c2_reasoning",
            "choiceColumn": "choice2",
            "choice": studentData["CHOICE 2"] || "",
            "qualification": studentData["Qualification Latest"] || "",
            "result": JSON.stringify(results)
          },
          {
            "ref": refNumber,
            "score": "c3_score",
            "reasoning": "c3_reasoning",
            "choiceColumn": "choice3",
            "choice": studentData["CHOICE 3"] || "",
            "qualification": studentData["Qualification Latest"] || "",
            "result": JSON.stringify(results)
          }
        ]

        // Make API call
        const response = await axios.post(
          'https://n8n.forwen.com/webhook/17b1aac8-c7a4-49f7-9069-96eca180a922',
          requestBody,
          { timeout: 120000 }
        )

        // Process response - the API returns data row by row, not in an array format
        const apiResponse = response.data[0]
        console.log(response.data, 'Candidate Scoring', refNumber)

        // Helper function to safely convert to int
        const safeInt = (value, defaultValue = 0) => {
          if (value === null || value === undefined) return defaultValue
          try {
            return parseInt(value, 10)
          } catch (error) {
            return defaultValue
          }
        }

        // Extract data from the API response
        let responseRefNumber = refNumber
        let c1_score = 0, c1_reasoning = ''
        let c2_score = 0, c2_reasoning = ''
        let c3_score = 0, c3_reasoning = ''

        // Check if the API response has the ref field
        if (apiResponse && apiResponse.ref) {
          responseRefNumber = apiResponse.ref
        }

        // Extract scores and reasoning from the API response
        if (apiResponse) {
          c1_score = safeInt(apiResponse.c1_score, 0)
          c1_reasoning = apiResponse.c1_reasoning || ''
          c2_score = safeInt(apiResponse.c2_score, 0)
          c2_reasoning = apiResponse.c2_reasoning || ''
          c3_score = safeInt(apiResponse.c3_score, 0)
          c3_reasoning = apiResponse.c3_reasoning || ''
        }

        // Update the result at the specific index
        this.scoringResults[index] = {
          referenceNumber: responseRefNumber, // Changed key here
          'Full Name': studentData['Full Name'] || '',
          C1_Score: c1_score,
          C1_Reasoning: c1_reasoning,
          C2_Score: c2_score,
          C2_Reasoning: c2_reasoning,
          C3_Score: c3_score,
          C3_Reasoning: c3_reasoning
        }

        this.completedTasks++
        this.progressText = `Progress: ${this.completedTasks}/${this.totalTasks} records processed`

        return {
          responseRefNumber,
          c1_score,
          c1_reasoning,
          c2_score,
          c2_reasoning,
          c3_score,
          c3_reasoning
        }
      } catch (error) {
        // Handle error
        this.$set(this.scoringResults, index, {
          'Reference Number': studentData['Reference Number'] || 'Unknown',
          'Full Name': studentData['Full Name'] || '',
          'C1_Score': 'Error',
          'C1_Reasoning': error.message || 'An error occurred during scoring',
          'C2_Score': 'Error',
          'C2_Reasoning': '',
          'C3_Score': 'Error',
          'C3_Reasoning': ''
        })

        this.completedTasks++
        this.progressText = `Progress: ${this.completedTasks}/${this.totalTasks} records processed`

        return { error: true }
      }
    },

    getScoreColor (score) {
      if (score === 'Processing...' || score === 'Error') return '#FFFFCC' // Light yellow

      const numScore = parseInt(score, 10)
      if (isNaN(numScore)) return ''

      if (numScore >= 80) return '#CCFFCC' // Light green
      if (numScore >= 60) return '#FFFFCC' // Light yellow
      return '#FFCCCC' // Light red
    },

    // Drag and drop methods
    handleDragOver (event) {
      this.isDragOver = true
    },

    handleDragLeave (event) {
      this.isDragOver = false
    },

    handleDrop (event) {
      this.isDragOver = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          this.processFile(file)
        }
      }
    },

    triggerFileInput () {
      this.$refs.fileInput.click()
    },

    processFile (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target.result
        this.parseCSV(csvText)
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style scoped>
.candidate-scoring {
  display: flex;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 40px;
}

/* Upload Container */
.upload-container {
  margin-bottom: 30px;
}

.upload-label {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 20px;
}

/* Upload Area */
.upload-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2a2a2a;
  border: 2px dashed #4a4a4a;
  border-radius: 8px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #666;
  background-color: #333;
}

.upload-icon {
  color: #888;
  margin-right: 20px;
}

.upload-text {
  flex: 1;
}

.upload-main-text {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 5px;
}

.upload-sub-text {
  font-size: 14px;
  color: #888;
}

.browse-button {
  background-color: #4a4a4a;
  color: #ffffff;
  border: 1px solid #666;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.browse-button:hover {
  background-color: #555;
}

.hidden-file-input {
  display: none;
}

/* Upload Message */
.upload-message {
  background-color: #8b7355;
  color: #ffffff;
  padding: 15px 20px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Preview Section */
.preview-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.table-container {
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #3a3a3a;
  overflow-x: auto;
}

/* Action Button */
.action-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 30px;
}

.action-button:hover {
  background-color: #45a049;
}

.action-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

/* Results Section */
.results-section {
  margin-top: 30px;
  overflow-x: auto;
}

.results-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #ccc;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 3px solid #4CAF50;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Tables */
.data-table,
.results-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #2a2a2a;
  min-width: 800px;
}

.data-table th,
.data-table td,
.results-table th,
.results-table td {
  border: 1px solid #3a3a3a;
  padding: 12px;
  text-align: left;
  color: #ffffff;
}

.data-table th,
.results-table th {
  background-color: #333;
  font-weight: 600;
  color: #fff;
}

.data-table td,
.results-table td {
  background-color: #2a2a2a;
}

.data-table tr:hover td,
.results-table tr:hover td {
  background-color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .candidate-scoring {
    flex-direction: column;
  }
  
  .navigation-sidebar {
    width: 100%;
    padding: 15px 0;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .upload-area {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .upload-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
