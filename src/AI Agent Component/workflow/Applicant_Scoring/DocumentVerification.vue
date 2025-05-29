<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold dark:text-white-light">Batch Document Verification</h1>
      <p class="text-white-dark">Upload and verify student records with AI-powered analysis</p>
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
          <p class="text-warning text-sm">Please upload a CSV file to begin verification.</p>
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

    <!-- Verification Button -->
    <button
      v-if="studentData.length > 0"
      @click="runVerification"
      :disabled="processing"
      class="btn btn-primary"
      :class="{ 'opacity-60 pointer-events-none': processing }"
    >
      {{ processing ? 'Processing...' : 'Run Document Verification' }}
    </button>

    <!-- Progress Section -->
    <div v-if="processing" class="panel">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <span class="font-medium dark:text-white-light">Processing verification...</span>
        </div>
        <p class="text-sm text-white-dark">{{ progressText }}</p>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="results.length > 0" class="panel">
      <div class="mb-5">
        <h5 class="font-semibold text-lg dark:text-white-light">Live Verification Results</h5>
        <p class="text-sm text-white-dark">Real-time verification status for each student</p>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th class="ltr:rounded-l-md rtl:rounded-r-md">Student ID</th>
              <th>Status</th>
              <th>Comparison</th>
              <th class="ltr:rounded-r-md rtl:rounded-l-md">Explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" :key="result.StudentID"
                class="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
              <td class="text-black dark:text-white">{{ result.StudentID }}</td>
              <td>
                <span class="badge"
                      :class="{
                        'bg-success': result.Status === 'PASS',
                        'bg-danger': result.Status === 'FLAGGED',
                        'bg-warning': result.Status === 'Processing...' || result.Status === 'Error'
                      }">
                  {{ result.Status }}
                </span>
              </td>
              <td class="text-black dark:text-white">{{ result.Comparison }}</td>
              <td class="text-black dark:text-white">{{ result.Explanation }}</td>
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
      results: [],
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
      this.results = []
      this.processing = false
    },

    async runVerification () {
      if (this.studentData.length === 0) return

      this.processing = true
      this.completedTasks = 0
      this.totalTasks = this.studentData.length

      // Initialize results with "Processing" status
      this.results = this.studentData.map(student => ({
        StudentID: student[this.headers[0]],
        Status: 'Processing...',
        Comparison: '',
        Explanation: ''
      }))

      // Process in batches to avoid overwhelming the server
      const batchSize = 5
      const delay = 200 // ms between requests

      const processBatch = async (startIndex) => {
        const endIndex = Math.min(startIndex + batchSize, this.studentData.length)
        const batchPromises = []

        for (let i = startIndex; i < endIndex; i++) {
          batchPromises.push(this.verifyStudent(this.studentData[i], i))
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
          this.progressText = `✅ All ${this.totalTasks} records processed successfully!`
        }
      }

      // Start processing the first batch
      await processBatch(0)
    },

    async verifyStudent (studentData, index) {
      try {
        const response = await axios.post(
          'https://n8n.forwen.com/webhook/f05ea972-d438-4bce-8ca6-fbcd1321847d',
          studentData,
          { timeout: 90000 }
        )
        console.log(response.data, 'response data verification')
        const result = response.data

        // Get the student ID from the API response if available, otherwise use the one from the student data
        // This ensures we're using the exact reference number returned by the API
        let studentId = studentData[this.headers[0]]
        if (result.ref) {
          studentId = result.ref
        }
        this.results[index] = {
          StudentID: studentId,
          Status: result.status || 'Unknown',
          Comparison: result.comparison || '',
          Explanation: result.explanation || ''
        }

        this.completedTasks++
        this.progressText = `Progress: ${this.completedTasks}/${this.totalTasks} records processed`

        return result
      } catch (error) {
        // Handle error
        this.$set(this.results, index, {
          StudentID: studentData[this.headers[0]],
          Status: 'Error',
          Comparison: '',
          Explanation: error.message || 'An error occurred during verification'
        })

        this.completedTasks++
        this.progressText = `Progress: ${this.completedTasks}/${this.totalTasks} records processed`

        return { error: true }
      }
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
