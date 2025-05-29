<template>
  <div class="container">
    <div v-if="!uploaded && !isLoading">

      <h2 class="title" >Upload Receipt</h2>
      <div class="upload-controls">
        <button @click="takePhoto" class="button" :disabled="isLoading">
          Take Photo
        </button>
      </div>
      <div class="image-container">
        <div v-if="!imageUrl && !isLoading" class="image-placeholder">
          Your image here
        </div>
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="uploaded-image" />
      </div>
      <div class="upload-controls">
        <button @click="uploadImage" class="button" :disabled="isLoading">Submit</button>
      </div>
     
    </div>
    <div v-if="isLoading" class="loader"></div>
    <div>
      <div v-if="isLoading" style="color: black" class="loading-message">
        Uploading your receipt 
      </div>
  </div>
    <div v-if="uploaded" style="margin:20px;">
      <h2 class="title" style="margin-top:20px;">Expenses Summary</h2>
      <div class="scrollable-list">
        <ul>
          <li v-for="(item, index) in items" :key="index" class="item-card">
            <div class="item-row">
              <span>Description:</span>
              <strong>{{ item.Description }}</strong>
            </div>
            <div class="item-row">
              <span>Quantity:</span>
              <strong>{{ item.Quantity }}</strong>
            </div>
            <div class="item-row">
              <span>Unit Price:</span>
              <strong>{{ item['Unit Price'] }}</strong>
            </div>
            <div class="item-row">
              <span>Discount:</span>
              <strong>{{ item.Discount }}</strong>
            </div>
            <div class="item-row">
              <span>Amount:</span>
              <strong>{{ item.Amount }}</strong>
            </div>
            <div class="item-row">
              <span>Claimable:</span>
              <span>
                <img v-if="item.Claimable === 'Yes'" src="@/components/icons/IconCheck.svg" alt="Claimable" />
                <img v-else src="@/components/icons/IconCross.svg" alt="Non-Claimable" />
              </span>
            </div>
            <div v-if="item.Remark !== ''" class="item-row">
              <span>Remark:</span>
              <strong>{{ item.Remark }}</strong>
            </div>
            <div v-if="item.Reasoning && item.Reasoning !== ''" class="item-row">
              <span>Reasoning:</span>
              <ul>
                <li v-for="(reason, reasonIndex) in item.Reasoning.split('\n')" :key="reasonIndex">
                  <strong>{{ reason.replace(/^\s*-\s*/, '- ') }}</strong>
                </li>
              </ul>
            </div>
            
          </li>
        </ul>
      </div>
      <div style="padding-top:40px;">
      <h3 class="claimable-row">
        <img src="@/components/icons/IconCross.svg" alt="Non-Claimable" class="icon" />
        Not Claimable: {{ nonClaimable.toFixed(2) }}
      </h3>
      <h3 class="claimable-row">
        <img src="@/components/icons/IconCheck.svg" alt="Claimable" class="icon" />
        Claimable: {{ claimable.toFixed(2) }}
      </h3>
      <button @click="backtoHome()" class="back-button">Back to Home</button>
    </div>
    </div>  
  </div>
</template>

<script>
import { Camera, CameraResultType } from '@capacitor/camera'
export default {
  data () {
    return {
      imageUrl: null,
      file: null,
      items: [], // Initialize items array
      isLoading: false, // Loading state
      loadingDots: 0, // Count of dots
      loadingMessage: '', // Message to display
      loadingInterval: null,
      reasoning:'',
      uploaded: false,
      claimable: 0,
      nonClaimable:0
    }
  },

  methods: {
    onFileChange (event) {
      const file = event.target.files[0]
      if (file) {
        this.file = file
        this.imageUrl = URL.createObjectURL(file)
      }
    },
    async takePhoto () {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        })
        this.imageUrl = image.webPath // Use webPath for display
        const response = await fetch(image.webPath)
        const blob = await response.blob()
        this.file = new File([blob], 'photo.jpg', { type: blob.type })
      } catch (error) {
        console.error('Error taking photo:', error)
      }
    },
    async uploadImage () {
      if (!this.file) {
        alert('Please select an image first!')
        return
      }
      this.isLoading = true // Start loading
      this.loadingDots = 0 // Reset dots count
      this.loadingMessage = '.' // Initialize loading message
      this.loadingInterval = setInterval(this.updateLoadingMessage, 500) // Start interval
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
    
    this.items = result[0].items.table; // Assign the response to items
    this.reasoning = result[0].reasoning || 'No reasoning provided'; // Capture reasoning
    
    // Calculate claimable and non-claimable amounts
    this.items.forEach(item => {
      if (item.Claimable === "Yes") {
        this.claimable += parseFloat(item.Amount);
      } else {
        this.nonClaimable += parseFloat(item.Amount);
      }
    });
  } else {
    console.error('Upload failed:', response.statusText);
    alert(response.statusText, 'Please upload again' );
  }
} catch (error) {
  console.error('Error uploading image:', error);
  this.uploaded = false;
  alert(error);
} finally {
        clearInterval(this.loadingInterval) // Clear the interval
        this.isLoading = false // End loading
      }
    },
    updateLoadingMessage () {
      this.loadingDots = (this.loadingDots + 1) % 4 // Cycle through 0 to 3
      this.loadingMessage = '.'.repeat(this.loadingDots) // Update message with dots
    },
    backtoHome(){
      this.uploaded = false 
      this.claimable = 0
      this.nonClaimable = 0
    }
  },
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  height: 95vh; /* Full viewport height */
  overflow-y:auto;
  font-family: Inter;
  margin: 10px;

}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 20px auto; /* Center the loader */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.title,
.items-title {
  color: var(--slate-800, #1E293B); /* Title color */
  font-family: Inter;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px; /* Line height */
  margin: 10px; /* Space below titles */
  text-align: center; /* Center the title */
}

.upload-controls {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Center buttons */
  width: 100%; /* Full width */
  margin-bottom: 10px; /* Space below upload controls */
}

.button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s; /* Include box-shadow in transition */
  width: 100%; /* Full width for buttons */
  max-width: 300px; /* Optional: Limit max width */
  margin-bottom: 10px; /* Space between buttons */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add box shadow */
}

/* Optional: Add a hover effect */
.button:hover {
  background-color: #0056b3; /* Darker shade on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Slightly larger shadow on hover */
}

.scrollable-list {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  color: black;
  max-height: 60vh; /* Set a max height for scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
  border-radius: 5px;
  width: 100%; /* Full width */
  margin: 10px; /* Padding inside the scrollable area */
  margin-top: 20px; /* Space between title and scrollable list */
}

ul {
  list-style-type: none; /* Remove default list styles */
  padding: 0;
  margin: 0;
  width: 100%; /* Full width */
}

.item {
  width: 100%; /* Full width for items */
  max-width: 300px; /* Optional: Limit max width for items */
  margin-bottom: 10px; /* Space between items */
  border-bottom: 1px solid #eee; /* Divider line */
  padding-bottom: 10px; /* Space below item */
}

.item strong {
  color: #007bff; /* Strong text color */
}

.image-container {
  display: flex;
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
  width: 100%; /* Full width */
  height: 50vh; /* Set height to 50% of the viewport height */
  width: 300px; /* Set a max width for the image container */
  margin: 20px 0; /* Center margin */
  overflow: hidden; /* Hide overflow if the image exceeds the container */
  position: relative; /* Position for any absolute children */
}

.image-placeholder {
  width: 300px; /* Full width */
  height: 100%; /* Full height */
  background-color: #e0e0e0; /* Light gray background */
  border: 2px dashed #aaa; /* Dashed border */
  border-radius: 8px; /* Rounded corners */
  display: flex; /* Center text */
  justify-content: center; /* Center text horizontally */
  align-items: center; /* Center text vertically */
  color: #666; /* Text color */
  font-size: 16px; /* Font size */
  font-family: Inter; /* Font family */
}

.uploaded-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  align-self: stretch; /* Stretch to fill container */
}

/* Responsive adjustments */
@media (min-width: 600px) {
  .upload-controls {
    flex-direction: row; /* Align buttons horizontally on larger screens */
  }
  .file-input {
    flex: 1; /* Allow file input to grow */
    margin-right: 10px; /* Space between input and buttons */
  }
  .button {
    flex: 0 0 auto; /* Allow buttons to keep their size */
    width: auto; /* Auto width for buttons on larger screens */
  }
}

.loading-dots {
  animation: blink 1s steps(5, end) infinite; /* Blinking animation */
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
.item-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin: 10px 0;
  display: flex; /* Use flexbox for layout */
  flex-wrap: wrap; /* Allow items to wrap */
}

.item-row {
  display: flex; /* Use flexbox for each row */
  width: 100%; /* Full width for each row */
  margin-bottom: 5px; /* Space between rows */
}

.item-row span {
  min-width: 120px; /* Set a minimum width for labels */
  white-space: nowrap; /* Prevent wrapping for labels */
}

.item-row strong {
  overflow-wrap: break-word; /* Allow breaking of long words */
  flex-grow: 1; /* Allow the strong text to take up remaining space */
  white-space: normal; /* Allow wrapping for strong text */
}

.back-button {
  position: sticky; /* Make the button sticky */
  bottom: 20px; /* Space from the bottom */
  background-color: #007bff; /* Button color */
  color: white; /* Text color */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  padding: 10px; /* Padding */
  width: 100%; /* Full width */
  margin-top: auto; /* Push to bottom of the container */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s; /* Transition effect */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add box shadow */

}

.back-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
.claimable-row {
  display: flex; /* Use flexbox for horizontal alignment */
  align-items: center; /* Center items vertically */
  margin-top: 10px; /* Space above the row */
}

.icon {
  width: 24px; /* Set width for the icon */
  height: 24px; /* Set height for the icon */
  margin-right: 8px; /* Space between icon and text */
}
.loading-message {
  display: inline-block; /* Allows for transformation */
  animation: bounce 1s infinite; /* Animation properties */
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0); /* Original position */
  }
  50% {
    transform: translateY(-5px); /* Move up */
  }
}

</style>