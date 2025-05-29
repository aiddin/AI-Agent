<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6">
    <!-- Upload Section -->
    <div v-if="!uploaded && !isLoading" class="w-full max-w-md">
      <div class="panel">
        <div class="mb-5">
          <h2 class="text-xl font-semibold dark:text-white-light text-center">Upload Receipt</h2>
        </div>

        <div class="space-y-4">
          <button @click="takePhoto" class="btn btn-primary w-full" :disabled="isLoading">
            <icon-camera class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Take Photo
          </button>

          <div class="image-container">
            <div v-if="!imageUrl && !isLoading" class="image-placeholder">
              <icon-gallery class="w-12 h-12 text-white-dark mb-2" />
              <span class="text-white-dark">Your image here</span>
            </div>
            <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="uploaded-image" />
          </div>

          <button @click="uploadImage" class="btn btn-success w-full" :disabled="isLoading || !imageUrl">
            <icon-send class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Submit
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Section -->
    <div v-if="isLoading" class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-white-dark animate-pulse">Uploading your receipt...</p>
    </div>

    <!-- Results Section -->
    <div v-if="uploaded" class="w-full max-w-4xl">
      <div class="panel mb-6">
        <div class="mb-5">
          <h2 class="text-xl font-semibold dark:text-white-light">Expenses Summary</h2>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="panel bg-success-light dark:bg-success/10 border-success">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3">
                <icon-circle-check class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-success">Claimable</h3>
                <p class="text-2xl font-bold text-success">{{ claimable.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="panel bg-danger-light dark:bg-danger/10 border-danger">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-danger text-white rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3">
                <icon-x-circle class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-danger">Not Claimable</h3>
                <p class="text-2xl font-bold text-danger">{{ nonClaimable.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="panel">
        <div class="mb-5">
          <h3 class="text-lg font-semibold dark:text-white-light">Item Details</h3>
        </div>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="(item, index) in items" :key="index" class="panel border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div class="space-y-3">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-semibold dark:text-white-light">{{ item.Description }}</h4>
                </div>
                <span v-if="item.Claimable === 'Yes'" class="badge bg-success">
                  <icon-circle-check class="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                  Claimable
                </span>
                <span v-else class="badge bg-danger">
                  <icon-x-circle class="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                  Not Claimable
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-white-dark">Quantity:</span>
                  <p class="font-medium dark:text-white-light">{{ item.Quantity }}</p>
                </div>
                <div>
                  <span class="text-white-dark">Unit Price:</span>
                  <p class="font-medium dark:text-white-light">{{ item['Unit Price'] }}</p>
                </div>
                <div>
                  <span class="text-white-dark">Discount:</span>
                  <p class="font-medium dark:text-white-light">{{ item.Discount }}</p>
                </div>
                <div>
                  <span class="text-white-dark">Amount:</span>
                  <p class="font-medium dark:text-white-light">{{ item.Amount }}</p>
                </div>
              </div>

              <div v-if="item.Remark && item.Remark !== ''" class="mt-3">
                <span class="text-white-dark">Remark:</span>
                <p class="font-medium dark:text-white-light mt-1">{{ item.Remark }}</p>
              </div>

              <div v-if="item.Reasoning && item.Reasoning !== ''" class="mt-3">
                <span class="text-white-dark">Reasoning:</span>
                <ul class="mt-1 space-y-1">
                  <li v-for="(reason, reasonIndex) in item.Reasoning.split('\n')" :key="reasonIndex" class="text-sm dark:text-white-light">
                    {{ reason.replace(/^\s*-\s*/, '• ') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
          <button @click="backtoHome()" class="btn btn-secondary w-full">
            <icon-arrow-left class="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
import IconCamera from '@/components/icon/icon-camera.vue'
import IconGallery from '@/components/icon/icon-gallery.vue'
import IconCircleCheck from '@/components/icon/icon-circle-check.vue'
import IconXCircle from '@/components/icon/icon-x-circle.vue'
import IconArrowLeft from '@/components/icon/icon-arrow-left.vue'
import IconSend from '@/components/icon/icon-send.vue'

export default {
  components: {
    IconCamera,
    IconGallery,
    IconCircleCheck,
    IconXCircle,
    IconArrowLeft,
    IconSend
  },
  data() {
    return {
      imageUrl: null,
      file: null,
      items: [],
      isLoading: false,
      reasoning: '',
      uploaded: false,
      claimable: 0,
      nonClaimable: 0
    }
  },

  methods: {
    async takePhoto() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        })
        this.imageUrl = image.webPath
        const response = await fetch(image.webPath)
        const blob = await response.blob()
        this.file = new File([blob], 'photo.jpg', { type: blob.type })
      } catch (error) {
        console.error('Error taking photo:', error)
      }
    },

    async uploadImage() {
      if (!this.file) {
        alert('Please select an image first!')
        return
      }

      this.isLoading = true
      const formData = new FormData()
      formData.append('img', this.file)

      try {
        const response = await fetch('https://n8n.forwen.com/webhook/abc30272-a718-4474-b415-680d561be61e', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          this.uploaded = true;
          const result = await response.json();
          console.log('Upload successful:', result);

          this.items = result[0].items.table;
          this.reasoning = result[0].reasoning || 'No reasoning provided';

          // Calculate claimable and non-claimable amounts
          this.claimable = 0;
          this.nonClaimable = 0;
          this.items.forEach(item => {
            if (item.Claimable === "Yes") {
              this.claimable += parseFloat(item.Amount);
            } else {
              this.nonClaimable += parseFloat(item.Amount);
            }
          });
        } else {
          console.error('Upload failed:', response.statusText);
          alert(response.statusText + ', Please upload again');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        this.uploaded = false;
        alert(error);
      } finally {
        this.isLoading = false;
      }
    },

    backtoHome() {
      this.uploaded = false;
      this.claimable = 0;
      this.nonClaimable = 0;
      this.imageUrl = null;
      this.file = null;
      this.items = [];
    }
  },
}
</script>

<style scoped>
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 2px dashed #e0e6ed;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

/* Dark mode adjustments */
.dark .image-container {
  border-color: #1b2e4b;
}

.dark .image-placeholder {
  background-color: #0e1726;
}
</style>
