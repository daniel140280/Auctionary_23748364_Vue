<template>
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
            {{ isEditMode ? "Edit Item" : "List New Item" }}
          </h1>
          <p class="text-gray-600">
            {{
              isEditMode
                ? "Update your item details"
                : "Create a new auction listing"
            }}
          </p>
        </div>
  
        <!-- Form Card -->
        <div class="card p-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Basic Information Section -->
            <div>
              <h2
                class="text-xl font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Info class="w-5 h-5 mr-2 text-primary-600" />
                Basic Information
              </h2>
  
              <div class="space-y-6">
                <!-- Item Name -->
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Item Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="input-field"
                    :class="{ 'border-red-500': submitted && errors.name }"
                    placeholder="e.g., Antique Gold Pocket Watch (1850)"
                    required
                  />
                  <p
                    v-if="submitted && errors.name"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ errors.name }}
                  </p>
                </div>
  
                <!-- Category -->
                <div>
                  <label
                    for="category"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    v-model="formData.category"
                    class="input-field"
                    :class="{ 'border-red-500': submitted && errors.category }"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="pocket-watches">Pocket Watches</option>
                    <option value="wristwatches">Wristwatches</option>
                    <option value="jewellery">Jewellery</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="other">Other Antiques</option>
                  </select>
                  <p
                    v-if="submitted && errors.category"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ errors.category }}
                  </p>
                </div>
  
                <!-- Description -->
                <div>
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    v-model="formData.description"
                    rows="6"
                    class="input-field"
                    :class="{ 'border-red-500': submitted && errors.description }"
                    placeholder="Provide detailed information about the item's history, condition, materials, and any unique features..."
                    required
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">Minimum 50 characters</p>
                  <p
                    v-if="submitted && errors.description"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ errors.description }}
                  </p>
                </div>
  
                <!-- Condition -->
                <div>
                  <label
                    for="condition"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Condition <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="condition"
                    v-model="formData.condition"
                    class="input-field"
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="mint">
                      Mint - Like new, no signs of wear
                    </option>
                    <option value="excellent">
                      Excellent - Minimal signs of use
                    </option>
                    <option value="good">
                      Good - Some wear consistent with age
                    </option>
                    <option value="fair">
                      Fair - Noticeable wear, fully functional
                    </option>
                    <option value="poor">
                      Poor - Significant wear, may need restoration
                    </option>
                  </select>
                </div>
              </div>
            </div>
  
            <!-- Pricing Section -->
            <div class="pt-6 border-t border-gray-200">
              <h2
                class="text-xl font-semibold text-gray-900 mb-4 flex items-center"
              >
                <DollarSign class="w-5 h-5 mr-2 text-primary-600" />
                Pricing & Auction Details
              </h2>
  
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Starting Price -->
                <div>
                  <label
                    for="startingPrice"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Starting Price <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500">$</span>
                    </div>
                    <input
                      id="startingPrice"
                      v-model.number="formData.starting_price"
                      type="number"
                      step="0.01"
                      min="1"
                      class="input-field pl-7"
                      :class="{
                        'border-red-500': submitted && errors.starting_price,
                      }"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p
                    v-if="submitted && errors.starting_price"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ errors.starting_price }}
                  </p>
                </div>
  
                <!-- Reserve Price (Optional) -->
                <div>
                  <label
                    for="reservePrice"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reserve Price (Optional)
                  </label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500">$</span>
                    </div>
                    <input
                      id="reservePrice"
                      v-model.number="formData.reserve_price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input-field pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Minimum price to sell (hidden from bidders)
                  </p>
                </div>
  
                <!-- Auction Duration -->
                <div>
                  <label
                    for="duration"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Auction Duration <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="duration"
                    v-model.number="formData.duration_days"
                    class="input-field"
                    required
                  >
                    <option value="">Select duration</option>
                    <option :value="1">1 Day</option>
                    <option :value="3">3 Days</option>
                    <option :value="7">7 Days</option>
                    <option :value="10">10 Days</option>
                    <option :value="14">14 Days</option>
                    <option :value="30">30 Days</option>
                  </select>
                </div>
  
                <!-- Buy Now Price (Optional) -->
                <div>
                  <label
                    for="buyNowPrice"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Buy Now Price (Optional)
                  </label>
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <span class="text-gray-500">$</span>
                    </div>
                    <input
                      id="buyNowPrice"
                      v-model.number="formData.buy_now_price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="input-field pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Allow instant purchase at this price
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Additional Details Section -->
            <div class="pt-6 border-t border-gray-200">
              <h2
                class="text-xl font-semibold text-gray-900 mb-4 flex items-center"
              >
                <FileText class="w-5 h-5 mr-2 text-primary-600" />
                Additional Details
              </h2>
  
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Year/Age -->
                <div>
                  <label
                    for="year"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Year / Era
                  </label>
                  <input
                    id="year"
                    v-model="formData.year"
                    type="text"
                    class="input-field"
                    placeholder="e.g., 1850, Victorian Era"
                  />
                </div>
  
                <!-- Materials -->
                <div>
                  <label
                    for="materials"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Materials
                  </label>
                  <input
                    id="materials"
                    v-model="formData.materials"
                    type="text"
                    class="input-field"
                    placeholder="e.g., Gold, Silver, Brass"
                  />
                </div>
  
                <!-- Maker/Brand -->
                <div>
                  <label
                    for="maker"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Maker / Brand
                  </label>
                  <input
                    id="maker"
                    v-model="formData.maker"
                    type="text"
                    class="input-field"
                    placeholder="e.g., Patek Philippe"
                  />
                </div>
  
                <!-- Origin -->
                <div>
                  <label
                    for="origin"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country of Origin
                  </label>
                  <input
                    id="origin"
                    v-model="formData.origin"
                    type="text"
                    class="input-field"
                    placeholder="e.g., Switzerland, England"
                  />
                </div>
              </div>
            </div>
  
            <!-- Image Upload Section -->
            <div class="pt-6 border-t border-gray-200">
              <h2
                class="text-xl font-semibold text-gray-900 mb-4 flex items-center"
              >
                <ImageIcon class="w-5 h-5 mr-2 text-primary-600" />
                Item Images
              </h2>
  
              <div class="space-y-4">
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                    id="imageUpload"
                  />
                  <label for="imageUpload" class="cursor-pointer">
                    <Upload class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p class="text-gray-600 mb-2">Click to upload images</p>
                    <p class="text-sm text-gray-500">
                      PNG, JPG up to 10MB each (Max 8 images)
                    </p>
                  </label>
                </div>
  
                <!-- Image Preview Grid -->
                <div
                  v-if="previewImages.length > 0"
                  class="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <div
                    v-for="(image, index) in previewImages"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="image"
                      class="w-full h-32 object-cover rounded-lg"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Error Message -->
            <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
              <div class="flex">
                <AlertCircle class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div
              class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200"
            >
              <router-link to="/account/items" class="btn-secondary">
                Cancel
              </router-link>
              <button
                type="submit"
                :disabled="isLoading"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
              >
                {{
                  isLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Item"
                    : "List Item"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useItemsStore } from "../stores/items";
  import { useToast } from "vue-toastification";
  import {
    Info,
    DollarSign,
    FileText,
    ImageIcon,
    Upload,
    X,
    AlertCircle,
  } from "lucide-vue-next";
  
  export default {
    name: "ItemForm",
    components: {
      Info,
      DollarSign,
      FileText,
      ImageIcon,
      Upload,
      X,
      AlertCircle,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const itemsStore = useItemsStore();
      const toast = useToast();
  
      const isEditMode = computed(() => !!route.params.id);
      const submitted = ref(false);
      const isLoading = ref(false);
      const errorMessage = ref("");
      const previewImages = ref([]);
      const uploadedFiles = ref([]);
  
      const formData = reactive({
        name: "",
        category: "",
        description: "",
        condition: "",
        starting_price: null,
        reserve_price: null,
        buy_now_price: null,
        duration_days: 7,
        year: "",
        materials: "",
        maker: "",
        origin: "",
      });
  
      const errors = reactive({
        name: "",
        category: "",
        description: "",
        starting_price: "",
      });
  
      const validateForm = () => {
        errors.name = "";
        errors.category = "";
        errors.description = "";
        errors.starting_price = "";
        let isValid = true;
  
        if (!formData.name || formData.name.length < 5) {
          errors.name = "Item name must be at least 5 characters";
          isValid = false;
        }
  
        if (!formData.category) {
          errors.category = "Please select a category";
          isValid = false;
        }
  
        if (!formData.description || formData.description.length < 50) {
          errors.description = "Description must be at least 50 characters";
          isValid = false;
        }
  
        if (!formData.starting_price || formData.starting_price < 1) {
          errors.starting_price = "Starting price must be at least $1";
          isValid = false;
        }
  
        return isValid;
      };
  
      const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
  
        if (previewImages.value.length + files.length > 8) {
          toast.error("Maximum 8 images allowed");
          return;
        }
  
        files.forEach((file) => {
          if (file.size > 10 * 1024 * 1024) {
            toast.error(`${file.name} is too large. Max size is 10MB`);
            return;
          }
  
          const reader = new FileReader();
          reader.onload = (e) => {
            previewImages.value.push(e.target.result);
            uploadedFiles.value.push(file);
          };
          reader.readAsDataURL(file);
        });
      };
  
      const removeImage = (index) => {
        previewImages.value.splice(index, 1);
        uploadedFiles.value.splice(index, 1);
      };
  
      const handleSubmit = async () => {
        submitted.value = true;
        errorMessage.value = "";
  
        if (!validateForm()) {
          toast.error("Please fix the errors in the form");
          return;
        }
  
        isLoading.value = true;
  
        try {
          let result;
          if (isEditMode.value) {
            result = await itemsStore.updateItem(route.params.id, formData);
          } else {
            result = await itemsStore.createItem(formData);
          }
  
          if (result.success) {
            toast.success(
              isEditMode.value
                ? "Item updated successfully!"
                : "Item listed successfully!"
            );
            router.push("/account/items");
          } else {
            errorMessage.value = result.error || "Failed to save item";
          }
        } catch (error) {
          errorMessage.value = "An error occurred. Please try again.";
          console.error("Submit error:", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      onMounted(async () => {
        if (isEditMode.value) {
          // Load item data for editing
          const item = await itemsStore.fetchItemById(route.params.id);
          if (item) {
            Object.assign(formData, item);
          }
        }
      });
  
      return {
        isEditMode,
        formData,
        submitted,
        isLoading,
        errorMessage,
        errors,
        previewImages,
        handleImageUpload,
        removeImage,
        handleSubmit,
      };
    },
  };
  </script>