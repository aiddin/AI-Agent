<template>
  <div class="data-cleansing-container">
    <!-- Sidebar for file uploads -->
    <div class="sidebar">
      <div class="sidebar-header">
        <button class="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      </div>
      
      <h2 class="sidebar-title">Data Sources</h2>

      <div class="source-section">
        <h3 class="source-title">Source 1: ID Document</h3>
        <p class="source-subtitle">Upload ID Image</p>
        <div class="file-upload-area">
          <div class="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <p class="upload-text">Drag and drop file here</p>
          <input type="file" @change="handleImageUpload" accept="image/jpeg,image/png,image/jpg" class="file-input" />
          <button class="browse-button">Browse files</button>
        </div>
        <img v-if="imagePreview" :src="imagePreview" alt="Uploaded ID Document" class="image-preview" />
      </div>

      <div class="source-section">
        <h3 class="source-title">Source 2: CSV File 1</h3>
        <p class="source-subtitle">Upload CSV 1 (with address field)</p>
        <div class="file-upload-area">
          <div class="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <p class="upload-text">Drag and drop file here</p>
          <input type="file" @change="handleCSV1Upload" accept=".csv" class="file-input" />
          <button class="browse-button">Browse files</button>
        </div>
        <div v-if="csv1File" class="file-status success">
          <span>✓</span> {{ csv1File.name }} uploaded
        </div>
      </div>

      <div class="source-section">
        <h3 class="source-title">Source 3: CSV File 2</h3>
        <p class="source-subtitle">Upload CSV 2 (with address components)</p>
        <div class="file-upload-area">
          <div class="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <p class="upload-text">Drag and drop file here</p>
          <input type="file" @change="handleCSV2Upload" accept=".csv" class="file-input" />
          <button class="browse-button">Browse files</button>
        </div>
        <div v-if="csv2File" class="file-status success">
          <span>✓</span> {{ csv2File.name }} uploaded
        </div>
      </div>

      <button @click="processData" class="process-button" :disabled="!canProcess">
        Process Data
      </button>
    </div>

    <!-- Main content area for results -->
    <div class="main-content">
      <h1 class="main-title">Data Cleansing Results</h1>

      <div v-if="!isProcessing && !hasResults" class="info-message">
        Upload all files in the sidebar and click 'Process Data' to begin
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="isProcessing" class="processing-message">
        <div class="spinner"></div>
        <span>Processing data...</span>
      </div>

      <!-- Results section -->
      <div v-if="hasResults" class="results-section">
        <hr class="my-6" />

        <!-- Name Result -->
        <div class="result-card">
          <h2 class="text-xl font-bold mb-2">NAME</h2>
          <div class="result-content">
            <div class="source-values">
              <h3 class="font-semibold">Source Values</h3>
              <table class="w-full">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID Document</td>
                    <td>{{ preparedData?.name?.name1 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 1</td>
                    <td>{{ preparedData?.name?.name2 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 2</td>
                    <td>{{ preparedData?.name?.name3 || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="cleaned-value">
              <div v-if="results.name && !results.name.error">
                <h3 class="font-semibold">Cleaned value</h3>
                <p>{{ results.name.cleaned_name }}</p>

                <h3 class="font-semibold mt-4">Confidence Score:</h3>
                <p>{{ results.name.confidence_score }}</p>

                <h3 class="font-semibold mt-4">Reasoning:</h3>
                <p>{{ results.name.reasoning }}</p>
              </div>
              <div v-else-if="results.name && results.name.error" class="error-message">
                Error: {{ results.name.error }}
              </div>
              <div v-else-if="isProcessingField.name" class="processing-field">
                Processing NAME...
              </div>
            </div>
          </div>
        </div>

        <hr class="my-6" />

        <!-- DOB Result -->
        <div class="result-card">
          <h2 class="text-xl font-bold mb-2">DOB</h2>
          <div class="result-content">
            <div class="source-values">
              <h3 class="font-semibold">Source Values</h3>
              <table class="w-full">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID Document</td>
                    <td>{{ preparedData?.dob?.dob1 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 1</td>
                    <td>{{ preparedData?.dob?.dob2 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 2</td>
                    <td>{{ preparedData?.dob?.dob3 || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="cleaned-value">
              <div v-if="results.dob && !results.dob.error">
                <h3 class="font-semibold">Cleaned value</h3>
                <p>{{ results.dob.cleaned_dob }}</p>

                <h3 class="font-semibold mt-4">Confidence Score:</h3>
                <p>{{ results.dob.confidence_score }}</p>

                <h3 class="font-semibold mt-4">Reasoning:</h3>
                <p>{{ results.dob.reasoning }}</p>
              </div>
              <div v-else-if="results.dob && results.dob.error" class="error-message">
                Error: {{ results.dob.error }}
              </div>
              <div v-else-if="isProcessingField.dob" class="processing-field">
                Processing DOB...
              </div>
            </div>
          </div>
        </div>

        <hr class="my-6" />

        <!-- NRIC Result -->
        <div class="result-card">
          <h2 class="text-xl font-bold mb-2">NRIC</h2>
          <div class="result-content">
            <div class="source-values">
              <h3 class="font-semibold">Source Values</h3>
              <table class="w-full">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID Document</td>
                    <td>{{ preparedData?.nric?.nric1 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 1</td>
                    <td>{{ preparedData?.nric?.nric2 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 2</td>
                    <td>{{ preparedData?.nric?.nric3 || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="cleaned-value">
              <div v-if="results.nric && !results.nric.error">
                <h3 class="font-semibold">Cleaned value</h3>
                <p>{{ results.nric.cleaned_nric }}</p>

                <h3 class="font-semibold mt-4">Confidence Score:</h3>
                <p>{{ results.nric.confidence_score }}</p>

                <h3 class="font-semibold mt-4">Reasoning:</h3>
                <p>{{ results.nric.reasoning }}</p>
              </div>
              <div v-else-if="results.nric && results.nric.error" class="error-message">
                Error: {{ results.nric.error }}
              </div>
              <div v-else-if="isProcessingField.nric" class="processing-field">
                Processing NRIC...
              </div>
            </div>
          </div>
        </div>

        <hr class="my-6" />

        <!-- Address Result -->
        <div class="result-card">
          <h2 class="text-xl font-bold mb-2">ADDRESS</h2>
          <div class="result-content">
            <div class="source-values">
              <h3 class="font-semibold">Source Values</h3>
              <table class="w-full">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID Document</td>
                    <td>{{ preparedData?.address?.address1 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 1</td>
                    <td>{{ preparedData?.address?.address2 || '' }}</td>
                  </tr>
                  <tr>
                    <td>CSV File 2</td>
                    <td>{{ preparedData?.address?.address3 || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="cleaned-value">
              <div v-if="results.address && !results.address.error">
                <h3 class="font-semibold">Cleaned value</h3>
                <p>{{ formatAddress(results.address) }}</p>

                <h3 class="font-semibold mt-4">Confidence Score:</h3>
                <p>{{ results.address.confidence_score }}</p>

                <h3 class="font-semibold mt-4">Reasoning:</h3>
                <p>{{ results.address.reasoning }}</p>
              </div>
              <div v-else-if="results.address && results.address.error" class="error-message">
                Error: {{ results.address.error }}
              </div>
              <div v-else-if="isProcessingField.address" class="processing-field">
                Processing ADDRESS...
              </div>
            </div>
          </div>
        </div>

        <hr class="my-6" />

        <!-- Final Summary -->
        <div v-if="allResultsReceived" class="summary-section">
          <h2 class="text-xl font-bold mb-4">Final Clean Data Summary</h2>
          <table class="w-full">
            <thead>
              <tr>
                <th>Field</th>
                <th>Cleaned Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{{ results.name?.cleaned_name || '' }}</td>
              </tr>
              <tr>
                <td>DOB</td>
                <td>{{ results.dob?.cleaned_dob || '' }}</td>
              </tr>
              <tr>
                <td>NRIC</td>
                <td>{{ results.nric?.cleaned_nric || '' }}</td>
              </tr>
              <tr>
                <td>Address Line 1</td>
                <td>{{ results.address?.addressLine1 || '' }}</td>
              </tr>
              <tr>
                <td>City</td>
                <td>{{ results.address?.city || '' }}</td>
              </tr>
              <tr>
                <td>State</td>
                <td>{{ results.address?.state || '' }}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{{ results.address?.country || '' }}</td>
              </tr>
              <tr>
                <td>Postcode</td>
                <td>{{ results.address?.postcode || '' }}</td>
              </tr>
            </tbody>
          </table>

          <button @click="downloadCSV" class="download-button mt-6">
            Download Clean Data as CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCleansingTool',
  data () {
    return {
      // File uploads
      imageFile: null,
      imagePreview: null,
      csv1File: null,
      csv2File: null,

      // Processing states
      isProcessing: false,
      hasResults: false,
      error: null,
      isProcessingField: {
        name: false,
        dob: false,
        nric: false,
        address: false
      },

      // Data
      imageData: null,
      csv1Data: null,
      csv2Data: null,
      preparedData: null,

      // Results
      results: {
        name: null,
        dob: null,
        nric: null,
        address: null
      },

      // API endpoints
      apiEndpoints: {
        name: "https://n8n.forwen.com/webhook/c9ff9dae-6505-44e1-b22f-6ea7cd02d2b1",
        dob: "https://n8n.forwen.com/webhook/4ec23b06-20fe-4d74-a3c5-b636d2a74446",
        nric: "https://n8n.forwen.com/webhook/47437be7-6ebc-4633-9f73-b6bb8a277c9d",
        address: "https://n8n.forwen.com/webhook/e088e87e-215b-4cec-aef4-3d1e3b63ecbb"
      }
    }
  },
  computed: {
    canProcess () {
      return this.imageFile && this.csv1File && this.csv2File
    },
    allResultsReceived () {
      return (
        this.results.name &&
        this.results.dob &&
        this.results.nric &&
        this.results.address
      )
    }
  },
  methods: {
    // File upload handlers
    handleImageUpload (event) {
      const file = event.target.files[0]
      if (file) {
        this.imageFile = file
        this.createImagePreview(file)
      }
    },

    createImagePreview (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    handleCSV1Upload (event) {
      const file = event.target.files[0]
      if (file) {
        this.csv1File = file
      }
    },

    handleCSV2Upload (event) {
      const file = event.target.files[0]
      if (file) {
        this.csv2File = file
      }
    },

    // Process data
    async processData () {
      if (!this.canProcess) {
        this.error = "Please upload all required files (ID image and two CSV files)"
        return
      }

      this.error = null
      this.isProcessing = true
      this.hasResults = true

      try {
        // Extract data from image
        await this.extractInfoFromImage()

        // Process CSV files
        await this.processCSV1()
        await this.processCSV2()

        // Prepare data for API calls
        this.prepareData()

        // Make API calls
        await this.processAllFields()
      } catch (error) {
        console.error("Error processing data:", error)
        this.error = `Error processing data: ${error.message}`
      } finally {
        this.isProcessing = false
      }
    },

    // Extract info from image
    async extractInfoFromImage () {
      try {
        const formData = new FormData()
        formData.append('file', this.imageFile)

        const response = await fetch("https://n8n.forwen.com/webhook/9eb4285c-57bd-484d-b71f-4d915055321a", {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Image processing failed: ${response.statusText}`)
        }

        this.imageData = await response.json()
      } catch (error) {
        console.error("Error extracting info from image:", error)
        throw new Error(`Failed to extract info from image: ${error.message}`)
      }
    },

    // Process CSV files
    async processCSV1 () {
      try {
        const text = await this.readFileAsText(this.csv1File)
        console.log("CSV1 content:", text) // Debug log
        const parsedData = this.parseCSV(text)
        console.log("Parsed CSV1 data:", parsedData) // Debug log

        if (parsedData.length > 0) {
          this.csv1Data = parsedData[0] // Get first row as object
        } else {
          throw new Error("No data found in CSV1")
        }
      } catch (error) {
        console.error("Error processing CSV1:", error)
        this.error = `Failed to process CSV1: ${error.message}`
        throw error
      }
    },

    async processCSV2 () {
      try {
        const text = await this.readFileAsText(this.csv2File)
        console.log("CSV2 content:", text) // Debug log
        const parsedData = this.parseCSV(text)
        console.log("Parsed CSV2 data:", parsedData) // Debug log

        if (parsedData.length > 0) {
          this.csv2Data = parsedData[0] // Get first row as object
        } else {
          throw new Error("No data found in CSV2")
        }
      } catch (error) {
        console.error("Error processing CSV2:", error)
        this.error = `Failed to process CSV2: ${error.message}`
        throw error
      }
    },

    readFileAsText (file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error("No file provided"))
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(new Error("File reading failed"))
        reader.readAsText(file)
      })
    },

    parseCSV (text) {
      if (!text || text.trim() === '') {
        return []
      }

      // Handle different line endings
      const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim() !== '')

      if (lines.length === 0) {
        return []
      }

      // Get headers from first line
      const headers = lines[0].split(',').map(h => h.trim())

      // Parse data rows
      return lines.slice(1)
        .map(line => {
          // Handle quoted values with commas inside
          const values = []
          let inQuote = false
          let currentValue = ''

          for (let i = 0; i < line.length; i++) {
            const char = line[i]

            if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
              inQuote = !inQuote
            } else if (char === ',' && !inQuote) {
              values.push(currentValue.trim())
              currentValue = ''
            } else {
              currentValue += char
            }
          }

          // Add the last value
          values.push(currentValue.trim())

          // Create object from headers and values
          const obj = {}
          headers.forEach((header, index) => {
            // Remove quotes from values if present
            let value = values[index] || ''
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1)
            }
            obj[header] = value
          })

          return obj
        })
    },

    // Prepare data for API calls
    prepareData () {
      // Format address from CSV2
      const address_csv2 = [
        this.csv2Data.address1 || '',
        this.csv2Data.city || '',
        this.csv2Data.state || '',
        this.csv2Data.country || '',
        this.csv2Data.postcode || ''
      ].filter(Boolean).join(', ')

      // Format address from image data
      const address_img = [
        this.imageData.address1 || '',
        this.imageData.city || '',
        this.imageData.state || '',
        this.imageData.country || '',
        this.imageData.postcode || ''
      ].filter(Boolean).join(', ')

      this.preparedData = {
        name: {
          name3: this.csv2Data.name || '',
          name2: this.csv1Data.name || '',
          name1: this.imageData.name || ''
        },
        dob: {
          dob3: this.csv2Data.dob || '',
          dob2: this.csv1Data.dob || '',
          dob1: this.imageData.dob || ''
        },
        nric: {
          nric3: this.csv2Data.nric || '',
          nric2: this.csv1Data.nric || '',
          nric1: this.imageData.nric || ''
        },
        address: {
          address3: address_csv2,
          address2: this.csv1Data.address || '',
          address1: address_img
        }
      }
    },

    // Process all fields
    async processAllFields () {
      // Set processing state for all fields
      Object.keys(this.isProcessingField).forEach(field => {
        this.isProcessingField[field] = true
      })

      // Process each field in parallel
      const promises = [
        this.callAPI('name', this.preparedData.name),
        this.callAPI('dob', this.preparedData.dob),
        this.callAPI('nric', this.preparedData.nric),
        this.callAPI('address', this.preparedData.address)
      ]

      // Wait for all promises to resolve
      const results = await Promise.allSettled(promises)

      // Process results
      results.forEach((result, index) => {
        const fieldName = ['name', 'dob', 'nric', 'address'][index]

        if (result.status === 'fulfilled') {
          this.results[fieldName] = result.value
        } else {
          this.results[fieldName] = {
            error: result.reason.message,
            status: 'error'
          }
        }

        // Update processing state
        this.isProcessingField[fieldName] = false
      })
    },

    // Call API for a specific field
    async callAPI (fieldName, jsonData) {
      try {
        const url = this.apiEndpoints[fieldName]
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData)
        })

        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        console.error(`Error calling ${fieldName} API:`, error)
        throw error
      }
    },

    // Format address for display
    formatAddress (addressData) {
      if (!addressData) return ''

      const parts = [
        addressData.addressLine1,
        addressData.city,
        addressData.state,
        addressData.country,
        addressData.postcode
      ]

      return parts.filter(Boolean).join(', ')
    },

    // Download CSV
    downloadCSV () {
      if (!this.allResultsReceived) return

      // Create CSV data
      const cleanData = {
        name: this.results.name?.cleaned_name || '',
        dob: this.results.dob?.cleaned_dob || '',
        nric: this.results.nric?.cleaned_nric || '',
        addressLine1: this.results.address?.addressLine1 || '',
        city: this.results.address?.city || '',
        state: this.results.address?.state || '',
        country: this.results.address?.country || '',
        postcode: this.results.address?.postcode || ''
      }

      // Convert to CSV
      const headers = Object.keys(cleanData)
      const csvContent = [
        headers.join(','),
        Object.values(cleanData).join(',')
      ].join('\n')

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', 'clean_customer_data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.data-cleansing-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1a1a;
  color: #ffffff;
}

.sidebar {
  min-width: 150px;
  background-color: #2a2a2a;
  padding: 0;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #1e293b;
}

.back-button {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #1e293b;
}

.sidebar-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding: 0 1rem;
}

.source-section {
  padding: 0 1rem 1.5rem 1rem;
  border-bottom: 1px solid #1e293b;
}

.source-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.source-subtitle {
  color:  #cdbca7;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.file-upload-area {
  background-color: #0f172a00;
  border: 2px dashed  #c9c3bb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  position: relative;
  transition: border-color 0.2s;
}

.file-upload-area:hover {
  border-color:  #ffffff;
}

.upload-icon {
  color:  #b9a183;
  margin: 0 auto 0.75rem auto;
  width: 24px;
  height: 24px;
}

.upload-text {
  color: #ffffff;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.upload-limit {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0 0 1rem 0;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  opacity: 0;
  cursor: pointer;
}

.browse-button {
  background-color:  #8b7355;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.browse-button:hover {
  background-color: #1e293b;
}

.image-preview {
  margin-top: 1rem;
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
}

.file-status {
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.file-status.success {
  background-color: #14532d;
  color: #22c55e;
}

.file-status span {
  font-weight: bold;
  margin-right: 0.25rem;
}

.process-button {
  width: calc(100% - 2rem);
  margin: 1.5rem 1rem;
  padding: 0.75rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.process-button:hover {
  background-color: #b91c1c;
}

.process-button:disabled {
  background-color: #334155;
  cursor: not-allowed;
}

.main-content {
  flex: 1;
  background-color: #1a1a1a;
  padding: 2rem;
  overflow-y: auto;
}

.main-title {
  color: #ffffff;
  font-size: 1.875rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
}

.info-message {
  padding: 1rem 1.5rem;
  background-color: #8b7355;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
}

.error-message {
  padding: 1rem;
  background-color: #450a0a;
  border-radius: 0.375rem;
  color: #f87171;
  margin-bottom: 1rem;
}

.processing-message {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #1e293b;
  border-radius: 0.375rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #334155;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.75rem;
}
::-webkit-scrollbar {
  display: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.result-card {
  margin-bottom: 1.5rem;
}

.result-content {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.source-values,
.cleaned-value {
  flex: 1;
  min-width: 250px;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 0.5rem;
}

th,
td {
  border: 1px solid #1e293b;
  padding: 0.5rem;
  text-align: left;
  color: #ffffff;
}

th {
  background-color: #020617;
}

.processing-field {
  padding: 0.75rem;
  background-color: #1e293b;
  border-radius: 0.375rem;
  font-style: italic;
  color: #64748b;
}

.download-button {
  padding: 0.75rem 1.5rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-button:hover {
  background-color: #15803d;
}

/* Mobile layout adjustments */
@media (max-width: 768px) {
  .data-cleansing-container {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    width: 100%;
    min-width: 100%;
  }

  .main-content {
    padding: 1rem;
  }

  .result-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .source-values,
  .cleaned-value {
    width: 100%;
    min-width: 100%;
  }
  
}
</style>
