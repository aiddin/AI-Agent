<template>
  <div class="data-cleansing-container">
    <!-- Sidebar for file uploads -->
    <div class="w-80 border-r border-[#e0e6ed] dark:border-[#1b2e4b] overflow-y-auto">
      <div class="p-6 space-y-6">
        <div>
          <h2 class="text-xl font-semibold dark:text-white-light">Data Cleansing Tool</h2>
          <p class="text-sm text-white-dark mt-1">Upload files and process data with AI</p>
        </div>

        <!-- Source 1: ID Document -->
        <div class="panel">
          <div class="mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">Source 1: ID Document</h5>
            <p class="text-sm text-white-dark mt-1">Upload ID Image</p>
          </div>
          <div class="space-y-4">
            <div class="border-2 border-dashed border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
              <div class="text-white-dark mb-4">
                <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <p class="text-sm text-white-dark mb-2">Drag and drop file here</p>
              <input type="file" @change="handleImageUpload" accept="image/jpeg,image/png,image/jpg" class="hidden" ref="imageInput" />
              <button @click="$refs.imageInput.click()" class="btn btn-outline-primary btn-sm">Browse files</button>
            </div>
            <div v-if="imagePreview" class="mt-4">
              <img :src="imagePreview" alt="Uploaded ID Document" class="w-full rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b]" />
            </div>
          </div>
        </div>

        <!-- Source 2: CSV File 1 -->
        <div class="panel">
          <div class="mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">Source 2: CSV File 1</h5>
            <p class="text-sm text-white-dark mt-1">Upload CSV 1 (with address field)</p>
          </div>
          <div class="space-y-4">
            <div class="border-2 border-dashed border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
              <div class="text-white-dark mb-4">
                <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p class="text-sm text-white-dark mb-2">Drag and drop file here</p>
              <input type="file" @change="handleCSV1Upload" accept=".csv" class="hidden" ref="csv1Input" />
              <button @click="$refs.csv1Input.click()" class="btn btn-outline-primary btn-sm">Browse files</button>
            </div>
            <div v-if="csv1File" class="flex items-center gap-2">
              <span class="badge bg-success text-xs">
                ✓ {{ csv1File.name }} uploaded
              </span>
            </div>
          </div>
        </div>

        <!-- Source 3: CSV File 2 -->
        <div class="panel">
          <div class="mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">Source 3: CSV File 2</h5>
            <p class="text-sm text-white-dark mt-1">Upload CSV 2 (with address components)</p>
          </div>
          <div class="space-y-4">
            <div class="border-2 border-dashed border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
              <div class="text-white-dark mb-4">
                <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p class="text-sm text-white-dark mb-2">Drag and drop file here</p>
              <input type="file" @change="handleCSV2Upload" accept=".csv" class="hidden" ref="csv2Input" />
              <button @click="$refs.csv2Input.click()" class="btn btn-outline-primary btn-sm">Browse files</button>
            </div>
            <div v-if="csv2File" class="flex items-center gap-2">
              <span class="badge bg-success text-xs">
                ✓ {{ csv2File.name }} uploaded
              </span>
            </div>
          </div>
        </div>

        <!-- Process Button -->
        <button @click="processData" class="btn btn-primary w-full" :disabled="!canProcess" :class="{ 'opacity-60 pointer-events-none': !canProcess }">
          Process Data
        </button>
      </div>
    </div>

    <!-- Main content area for results -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold dark:text-white-light">Data Cleansing Results</h2>
          <p class="text-white-dark">View processed data and AI analysis</p>
        </div>

        <!-- Info Message -->
        <div v-if="!isProcessing && !hasResults" class="panel">
          <div class="text-center py-8">
            <div class="text-4xl mb-4">🧹</div>
            <h3 class="text-lg font-semibold mb-2 dark:text-white-light">Get Started</h3>
            <p class="text-white-dark">
              Upload all files in the sidebar and click 'Process Data' to begin data cleansing
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="panel">
          <div class="bg-danger-light p-4 rounded-lg border border-danger">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-danger" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <span class="text-danger font-medium">{{ error }}</span>
            </div>
          </div>
        </div>

        <!-- Processing Message -->
        <div v-if="isProcessing" class="panel">
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mr-4"></div>
            <span class="text-white-dark">Processing data...</span>
          </div>
        </div>

        <!-- Results section -->
        <div v-if="hasResults" class="space-y-6">
          <!-- Name Result -->
          <div class="panel">
            <div class="mb-5">
              <h5 class="font-semibold text-lg dark:text-white-light">NAME</h5>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h6 class="font-semibold mb-3 dark:text-white-light">Source Values</h6>
                <div class="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ID Document</td>
                        <td>{{ preparedData?.name?.name1 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 1</td>
                        <td>{{ preparedData?.name?.name2 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 2</td>
                        <td>{{ preparedData?.name?.name3 || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div v-if="results.name && !results.name.error">
                  <h6 class="font-semibold mb-3 dark:text-white-light">Cleaned Value</h6>
                  <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4 mb-4">
                    <p class="font-medium dark:text-white-light">{{ results.name.cleaned_name }}</p>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Confidence Score:</h6>
                  <div class="mb-4">
                    <span class="badge bg-primary">{{ results.name.confidence_score }}</span>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Reasoning:</h6>
                  <p class="text-white-dark text-sm">{{ results.name.reasoning }}</p>
                </div>
                <div v-else-if="results.name && results.name.error" class="bg-danger-light p-4 rounded-lg border border-danger">
                  <span class="text-danger">Error: {{ results.name.error }}</span>
                </div>
                <div v-else-if="isProcessingField.name" class="flex items-center gap-2">
                  <div class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span class="text-white-dark">Processing NAME...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- DOB Result -->
          <div class="panel">
            <div class="mb-5">
              <h5 class="font-semibold text-lg dark:text-white-light">DOB</h5>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h6 class="font-semibold mb-3 dark:text-white-light">Source Values</h6>
                <div class="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ID Document</td>
                        <td>{{ preparedData?.dob?.dob1 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 1</td>
                        <td>{{ preparedData?.dob?.dob2 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 2</td>
                        <td>{{ preparedData?.dob?.dob3 || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div v-if="results.dob && !results.dob.error">
                  <h6 class="font-semibold mb-3 dark:text-white-light">Cleaned Value</h6>
                  <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4 mb-4">
                    <p class="font-medium dark:text-white-light">{{ results.dob.cleaned_dob }}</p>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Confidence Score:</h6>
                  <div class="mb-4">
                    <span class="badge bg-primary">{{ results.dob.confidence_score }}</span>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Reasoning:</h6>
                  <p class="text-white-dark text-sm">{{ results.dob.reasoning }}</p>
                </div>
                <div v-else-if="results.dob && results.dob.error" class="bg-danger-light p-4 rounded-lg border border-danger">
                  <span class="text-danger">Error: {{ results.dob.error }}</span>
                </div>
                <div v-else-if="isProcessingField.dob" class="flex items-center gap-2">
                  <div class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span class="text-white-dark">Processing DOB...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- NRIC Result -->
          <div class="panel">
            <div class="mb-5">
              <h5 class="font-semibold text-lg dark:text-white-light">NRIC</h5>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h6 class="font-semibold mb-3 dark:text-white-light">Source Values</h6>
                <div class="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ID Document</td>
                        <td>{{ preparedData?.nric?.nric1 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 1</td>
                        <td>{{ preparedData?.nric?.nric2 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 2</td>
                        <td>{{ preparedData?.nric?.nric3 || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div v-if="results.nric && !results.nric.error">
                  <h6 class="font-semibold mb-3 dark:text-white-light">Cleaned Value</h6>
                  <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4 mb-4">
                    <p class="font-medium dark:text-white-light">{{ results.nric.cleaned_nric }}</p>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Confidence Score:</h6>
                  <div class="mb-4">
                    <span class="badge bg-primary">{{ results.nric.confidence_score }}</span>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Reasoning:</h6>
                  <p class="text-white-dark text-sm">{{ results.nric.reasoning }}</p>
                </div>
                <div v-else-if="results.nric && results.nric.error" class="bg-danger-light p-4 rounded-lg border border-danger">
                  <span class="text-danger">Error: {{ results.nric.error }}</span>
                </div>
                <div v-else-if="isProcessingField.nric" class="flex items-center gap-2">
                  <div class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span class="text-white-dark">Processing NRIC...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Result -->
          <div class="panel">
            <div class="mb-5">
              <h5 class="font-semibold text-lg dark:text-white-light">ADDRESS</h5>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h6 class="font-semibold mb-3 dark:text-white-light">Source Values</h6>
                <div class="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ID Document</td>
                        <td>{{ preparedData?.address?.address1 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 1</td>
                        <td>{{ preparedData?.address?.address2 || '-' }}</td>
                      </tr>
                      <tr>
                        <td>CSV File 2</td>
                        <td>{{ preparedData?.address?.address3 || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div v-if="results.address && !results.address.error">
                  <h6 class="font-semibold mb-3 dark:text-white-light">Cleaned Value</h6>
                  <div class="bg-[#f1f2f3] dark:bg-[#1b2e4b] rounded-lg p-4 mb-4">
                    <p class="font-medium dark:text-white-light">{{ formatAddress(results.address) }}</p>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Confidence Score:</h6>
                  <div class="mb-4">
                    <span class="badge bg-primary">{{ results.address.confidence_score }}</span>
                  </div>

                  <h6 class="font-semibold mb-2 dark:text-white-light">Reasoning:</h6>
                  <p class="text-white-dark text-sm">{{ results.address.reasoning }}</p>
                </div>
                <div v-else-if="results.address && results.address.error" class="bg-danger-light p-4 rounded-lg border border-danger">
                  <span class="text-danger">Error: {{ results.address.error }}</span>
                </div>
                <div v-else-if="isProcessingField.address" class="flex items-center gap-2">
                  <div class="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span class="text-white-dark">Processing ADDRESS...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Final Summary -->
          <div v-if="allResultsReceived" class="panel">
            <div class="mb-5">
              <h5 class="font-semibold text-lg dark:text-white-light">Final Clean Data Summary</h5>
            </div>
            <div class="table-responsive mb-6">
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Cleaned Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{{ results.name?.cleaned_name || '-' }}</td>
                  </tr>
                  <tr>
                    <td>DOB</td>
                    <td>{{ results.dob?.cleaned_dob || '-' }}</td>
                  </tr>
                  <tr>
                    <td>NRIC</td>
                    <td>{{ results.nric?.cleaned_nric || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Address Line 1</td>
                    <td>{{ results.address?.addressLine1 || '-' }}</td>
                  </tr>
                  <tr>
                    <td>City</td>
                    <td>{{ results.address?.city || '-' }}</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td>{{ results.address?.state || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Country</td>
                    <td>{{ results.address?.country || '-' }}</td>
                  </tr>
                  <tr>
                    <td>Postcode</td>
                    <td>{{ results.address?.postcode || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button @click="downloadCSV" class="btn btn-success">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download Clean Data as CSV
            </button>
          </div>
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
        name: "https://workflow.forwen.com/webhook/data-cleansing/name",
        dob: "https://workflow.forwen.com/webhook/data-cleansing/dob",
        nric: "https://workflow.forwen.com/webhook/data-cleansing/nric",
        address: "https://workflow.forwen.com/webhook-test/data-cleansing/address"
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

        const response = await fetch("https://workflow.forwen.com/webhook/data-cleansing/image", {
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
/* Custom styles for responsive design */
@media (max-width: 768px) {
  .w-80 {
    width: 100%;
  }

  .flex {
    flex-direction: column;
  }
}
.data-cleansing-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 90vh;
  overflow-y: scroll;

}

::-webkit-scrollbar {
    display: none;
}
</style>
