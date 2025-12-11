<template>
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="card p-8">
          <h1 class="text-4xl font-display font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p class="text-gray-700 mb-8">Get in touch with our team</p>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="font-semibold mb-2">Email</h3>
              <p class="text-gray-600">info@auctionary.co.uk</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Phone</h3>
              <p class="text-gray-600">+44 07766554433</p>
            </div>
          </div>
  
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Name</label
              >
              <input type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email</label
              >
              <input type="email" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Message</label
              >
              <textarea rows="6" class="input-field" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default { name: "ContactPage" };
  </script>