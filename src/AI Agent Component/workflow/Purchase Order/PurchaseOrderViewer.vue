<template>
  <div class="purchase-order-viewer">
    <!-- Main layout with sidebar and content -->
    <div class="layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <h2>Upload File</h2>
        <div class="file-upload">
          <input 
            type="file" 
            id="file-input"
            @change="handleFileUpload" 
            accept="application/pdf" 
          />
          <div class="file-upload-help">Upload a purchase order in PDF format</div>
          <div v-if="selectedFile" class="selected-file">
            Selected: {{ selectedFile.name }}
          </div>
        </div>
        
        <div v-if="selectedFile" class="divider"></div>
        
        <button 
          v-if="selectedFile" 
          @click="processFile" 
          :disabled="processing" 
          class="process-button"
        >
          {{ processing ? 'Processing...' : 'Process' }}
        </button>
      </div>
      
      <!-- Main content -->
      <div class="content">
        <h1>Purchase Order Viewer</h1>
        
        <!-- Empty state when no file is uploaded -->
        <div v-if="!selectedFile" class="empty-state">
          <img src="https://img.icons8.com/clouds/150/000000/upload.png" alt="Upload" />
          <p class="empty-state-text">Upload a PDF file using the sidebar to get started.</p>
          <p class="empty-state-subtext">The system will automatically extract and display purchase order details.</p>
        </div>
        
        <!-- Tabs for file preview and extracted details -->
        <div v-else class="tabs">
          <div class="tab-headers">
            <div 
              class="tab-header" 
              :class="{ active: activeTab === 'preview' }" 
              @click="activeTab = 'preview'"
            >
              File Preview
            </div>
            <div 
              class="tab-header" 
              :class="{ active: activeTab === 'details' }" 
              @click="activeTab = 'details'"
            >
              Extracted Details
            </div>
          </div>
          
          <!-- File Preview Tab -->
          <div v-if="activeTab === 'preview'" class="tab-content">
            <div v-if="images.length > 0" class="images-container">
              <div v-for="(image, index) in images" :key="index" class="image-wrapper">
                <img :src="image" class="preview-image" />
                <div class="image-caption">Page {{ index + 1 }}</div>
              </div>
            </div>
            <div v-else-if="convertingImages" class="loading-message">
              Converting PDF to images...
            </div>
            <div v-else class="no-preview-message">
              No preview available. Please upload a valid PDF file.
            </div>
          </div>
          
          <!-- Extracted Details Tab -->
          <div v-if="activeTab === 'details'" class="tab-content">
            <div v-if="!poData" class="no-data-message">
              <p v-if="processing">Processing file...</p>
              <p v-else>No data available. Please process the file first.</p>
            </div>
            
            <div v-else class="po-details">
              <div v-for="(po, poIndex) in poData" :key="poIndex" class="po-container">
                <!-- Company Information -->
                <h3>Company Information</h3>
                <div class="info-container">
                  <div class="info-grid">
                    <div class="info-column">
                      <strong>Company:</strong>
                      <div>{{ po.purchaser_company_name_with_registration_number || 'null' }}</div>
                      
                      <strong>Address:</strong>
                      <div>{{ po.purchaser_address || 'null' }}</div>
                    </div>
                    
                    <div class="info-column">
                      <strong>Tel:</strong>
                      <div>{{ po.purchaser_tel || 'null' }}</div>
                      
                      <strong>Fax:</strong>
                      <div>{{ po.purchaser_fax || 'null' }}</div>
                    </div>
                    
                    <div class="info-column">
                      <strong>Email:</strong>
                      <div>{{ po.purchaser_email || 'null' }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- PO Details -->
                <h3>Purchase Order Information</h3>
                <div class="info-container">
                  <div class="info-grid">
                    <div class="info-column">
                      <strong>PO Number:</strong>
                      <div>{{ po.po_number || 'null' }}</div>
                    </div>
                    
                    <div class="info-column">
                      <strong>PO Date:</strong>
                      <div>{{ po.po_date || 'null' }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Items Table -->
                <h3>Items</h3>
                <div v-if="po.table && po.table.length > 0" class="table-container">
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th v-for="(column, colIndex) in Object.keys(po.table[0])" :key="colIndex">
                          {{ column }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, itemIndex) in po.table" :key="itemIndex">
                        <td v-for="(column, colIndex) in Object.keys(item)" :key="colIndex">
                          {{ item[column] !== null ? item[column] : '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="no-items-message">
                  No items found in the purchase order.
                </div>
                
                <!-- Reasoning -->
                <h3>Reasoning</h3>
                <div class="reasoning-container">
                  <p v-if="po.reasoning" v-html="formatReasoning(po.reasoning)"></p>
                  <p v-else>No reasoning provided.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      images: [],
      poData: null,
      activeTab: 'preview',
      processing: false,
      convertingImages: false
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.selectedFile = file;
        this.poData = null;
        this.images = [];
        this.convertPdfToImages(file);
      }
    },
    
    async convertPdfToImages(file) {
      this.convertingImages = true;
      
      try {
        const formData = new FormData();
        formData.append('fileInput', file);
        formData.append('imageFormat', 'jpg');
        formData.append('singleOrMultiple', 'multiple');
        formData.append('dpi', '300');
        
        const response = await axios.post(
          'https://stirlingpdf.io/api/v1/convert/pdf/img',
          formData,
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        // Process the zip file
        await this.processZipResponse(response.data);
      } catch (error) {
        console.error('Error converting PDF to images:', error);
      } finally {
        this.convertingImages = false;
      }
    },
    
    async processZipResponse(zipData) {
      try {
        // Use JSZip to extract images from the zip file
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        const zipContents = await zip.loadAsync(zipData);
        const imageFiles = Object.values(zipContents.files).filter(file => 
          !file.dir && /\.(jpe?g|png)$/i.test(file.name)
        );
        
        // Sort image files by name to maintain order
        imageFiles.sort((a, b) => a.name.localeCompare(b.name));
        
        // Process each image file
        for (const file of imageFiles) {
          const blob = await file.async('blob');
          const imageUrl = URL.createObjectURL(blob);
          this.images.push(imageUrl);
        }
      } catch (error) {
        console.error('Error processing zip file:', error);
      }
    },
    
    async processFile() {
      if (!this.selectedFile) return;
      
      this.processing = true;
      
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        
        const response = await axios.post(
          'https://n8n.forwen.com/webhook/c6622b28-df07-4f33-86b0-3233901525e1',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        this.poData = response.data;
        this.activeTab = 'details';
      } catch (error) {
        console.error('Error processing file:', error);
      } finally {
        this.processing = false;
      }
    },
    
    formatReasoning(reasoning) {
      if (!reasoning) return '';
      return reasoning.replace(/\\n/g, '<br>');
    }
  }
};
</script>

<style scoped>
.purchase-order-viewer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
}

.layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar styles */
.sidebar {
  width: 300px;
  padding: 2rem;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.file-upload {
  margin-bottom: 1.5rem;
}

.file-upload input[type="file"] {
  display: block;
  margin-bottom: 1rem;
  width: 100%;
}

.selected-file {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #007bff;
  word-break: break-all;
}

.file-upload-help {
  font-size: 0.875rem;
  color: #6c757d;
}

.divider {
  height: 1px;
  background-color: #dee2e6;
  margin: 1.5rem 0;
}

.process-button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
}

.process-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Content styles */
.content {
  flex: 1;
  padding: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 1rem;
  margin: 2rem 0;
  text-align: center;
}

.empty-state img {
  margin-bottom: 1.5rem;
}

.empty-state-text {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 1rem 0;
}

.empty-state-subtext {
  color: #6c757d;
}

/* Tabs styles */
.tabs {
  margin-top: 2rem;
}

.tab-headers {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #dee2e6;
}

.tab-header {
  padding: 1rem 0;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
}

.tab-header.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.tab-content {
  padding: 2rem 0;
}

/* Image preview styles */
.images-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.image-caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.loading-message, .no-preview-message, .no-data-message {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

/* PO details styles */
.po-container {
  margin-bottom: 3rem;
}

.info-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.info-column strong {
  display: block;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.info-column strong:first-child {
  margin-top: 0;
}

.table-container {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th, .items-table td {
  border: 1px solid #dee2e6;
  padding: 0.75rem;
  text-align: left;
}

.items-table th {
  background-color: #f8f9fa;
  font-weight: 500;
}

.items-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.no-items-message {
  padding: 1.5rem;
  text-align: center;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  margin-bottom: 2rem;
}

.reasoning-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 1.5rem;
  white-space: pre-line;
}
</style>
