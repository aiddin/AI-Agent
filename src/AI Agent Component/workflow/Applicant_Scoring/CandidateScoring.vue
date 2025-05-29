<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold dark:text-white-light">Candidate Scoring</h1>
      <p class="text-white-dark">AI-powered scoring system for student applications</p>
    </div>

    <!-- Upload Section -->
    <div class="panel">
      <div class="mb-5">
        <h5 class="font-semibold text-lg dark:text-white-light">Upload Student Records CSV</h5>
      </div>

      <!-- File Upload Area -->
      <div
        class="upload-area"
        :class="{
          'border-primary bg-primary/10': isDragOver,
          'border-[#ebedf2] dark:border-[#191e3a]': !isDragOver
        }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="flex items-center justify-between p-6">
          <div class="flex items-center space-x-4">
            <div class="text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"/>
                <path d="M7 10L12 5L17 10"/>
                <path d="M12 5V15"/>
              </svg>
            </div>
            <div>
              <div class="font-medium dark:text-white-light">Drag and drop file here</div>
              <div class="text-sm text-white-dark">Limit 200MB per file • CSV</div>
            </div>
          </div>
          <button class="btn btn-outline-primary" @click.stop="triggerFileInput">Browse files</button>
        </div>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        @change="handleFileUpload"
        accept=".csv"
        class="hidden"
      />

      <!-- Upload Status Message -->
      <div v-if="!hasFile" class="mt-4">
        <div class="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p class="text-warning text-sm">Please upload a CSV file to begin scoring.</p>
        </div>
      </div>

      <!-- File Status -->
      <div v-if="studentData.length > 0" class="mt-4 flex items-center gap-2">
        <span class="badge bg-success text-xs">
          ✓ File uploaded: {{ studentData.length }} records
        </span>
      </div>
    </div>

    <!-- File Preview Section -->
    <div v-if="studentData.length > 0" class="panel">
      <div class="mb-5">
        <h5 class="font-semibold text-lg dark:text-white-light">Preview of Uploaded Records</h5>
        <p class="text-sm text-white-dark">Showing first 10 records</p>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index"
                  :class="{
                    'ltr:rounded-l-md rtl:rounded-r-md': index === 0,
                    'ltr:rounded-r-md rtl:rounded-l-md': index === headers.length - 1
                  }">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in previewData" :key="rowIndex"
                class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                  class="text-black dark:text-white">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Scoring Button -->
    <button
      v-if="studentData.length > 0"
      @click="runScoring"
      :disabled="processing"
      class="btn btn-primary"
      :class="{ 'opacity-60 pointer-events-none': processing }"
    >
      {{ processing ? 'Processing...' : 'Run Candidate Scoring' }}
    </button>

    <!-- Progress Section -->
    <div v-if="processing" class="panel">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <span class="font-medium dark:text-white-light">Processing scoring...</span>
        </div>
        <p class="text-sm text-white-dark">{{ progressText }}</p>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="scoringResults.length > 0" class="panel">
      <div class="mb-5">
        <h5 class="font-semibold text-lg dark:text-white-light">Live Scoring Results</h5>
        <p class="text-sm text-white-dark">Real-time scoring results for each candidate</p>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th class="ltr:rounded-l-md rtl:rounded-r-md">Reference Number</th>
              <th>Full Name</th>
              <th>Choice 1 Score</th>
              <th>Choice 1 Reasoning</th>
              <th>Choice 2 Score</th>
              <th>Choice 2 Reasoning</th>
              <th>Choice 3 Score</th>
              <th class="ltr:rounded-r-md rtl:rounded-l-md">Choice 3 Reasoning</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in scoringResults" :key="result['Reference Number']"
                class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
              <td class="text-black dark:text-white">{{ result['Reference Number'] }}</td>
              <td class="text-black dark:text-white">{{ result['Full Name'] }}</td>
              <td>
                <span class="badge"
                      :class="{
                        'bg-success': getScoreLevel(result.C1_Score) === 'high',
                        'bg-warning': getScoreLevel(result.C1_Score) === 'medium',
                        'bg-danger': getScoreLevel(result.C1_Score) === 'low',
                        'bg-secondary': getScoreLevel(result.C1_Score) === 'processing'
                      }">
                  {{ result.C1_Score }}
                </span>
              </td>
              <td class="text-black dark:text-white max-w-xs truncate">{{ result.C1_Reasoning }}</td>
              <td>
                <span class="badge"
                      :class="{
                        'bg-success': getScoreLevel(result.C2_Score) === 'high',
                        'bg-warning': getScoreLevel(result.C2_Score) === 'medium',
                        'bg-danger': getScoreLevel(result.C2_Score) === 'low',
                        'bg-secondary': getScoreLevel(result.C2_Score) === 'processing'
                      }">
                  {{ result.C2_Score }}
                </span>
              </td>
              <td class="text-black dark:text-white max-w-xs truncate">{{ result.C2_Reasoning }}</td>
              <td>
                <span class="badge"
                      :class="{
                        'bg-success': getScoreLevel(result.C3_Score) === 'high',
                        'bg-warning': getScoreLevel(result.C3_Score) === 'medium',
                        'bg-danger': getScoreLevel(result.C3_Score) === 'low',
                        'bg-secondary': getScoreLevel(result.C3_Score) === 'processing'
                      }">
                  {{ result.C3_Score }}
                </span>
              </td>
              <td class="text-black dark:text-white max-w-xs truncate">{{ result.C3_Reasoning }}</td>
            </tr>
          </tbody>
        </table>
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
          'Reference Number': responseRefNumber,
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

    getScoreLevel (score) {
      if (score === 'Processing...' || score === 'Error') return 'processing'

      const numScore = parseInt(score, 10)
      if (isNaN(numScore)) return 'processing'

      if (numScore >= 80) return 'high'
      if (numScore >= 60) return 'medium'
      return 'low'
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
.upload-area {
  border: 2px dashed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb), 0.05);
}
</style>
