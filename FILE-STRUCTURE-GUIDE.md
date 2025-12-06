# Auctionary - File Structure Guide

## Project Root Files

```
your-project-root/
├── tailwind.config.js          ← Tailwind configuration
├── postcss.config.js            ← PostCSS configuration
├── package.json                 ← Existing file (update dependencies)
├── vite.config.js              ← Existing file (keep as is)
└── index.html                   ← Existing file (keep as is)
```

## Source Files Structure

```
src/
├── main.js                      ← Replace existing file
├── App.vue                      ← Replace existing file
│
├── assets/
│   └── main.css                 ← NEW: Create this folder and file
│
├── components/
│   ├── NavigationHeader.vue     ← NEW: Create this component
│   └── ItemCard.vue             ← NEW: Create this component
│
├── stores/
│   ├── auth.js                  ← NEW: Create this folder and file
│   └── items.js                 ← NEW: Create this file
│
├── views/                       ← NEW: Create this folder for page components
│   ├── Home.vue                 ← Will create next
│   ├── Login.vue                ← Will create next
│   ├── Register.vue             ← Will create next
│   ├── Browse.vue               ← Will create next
│   ├── Account.vue              ← Will create next
│   └── ItemForm.vue             ← Will create next
│
└── router/
    └── index.js                 ← Will update existing file
```

## Installation Steps

1. **Install Tailwind CSS v3:**

   ```bash
   npm install -D tailwindcss@3 postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Install Core Dependencies:**

   ```bash
   npm install axios pinia @vueuse/core
   ```

3. **Install UI Enhancement Libraries:**
   ```bash
   npm install @headlessui/vue @heroicons/vue lucide-vue-next
   npm install swiper
   npm install vue-toastification@next
   ```

## Files Created So Far

✅ tailwind.config.js (root)
✅ postcss.config.js (root)
✅ src/assets/main.css
✅ src/stores/auth.js
✅ src/stores/items.js
✅ src/main.js
✅ src/components/NavigationHeader.vue
✅ src/components/ItemCard.vue

## Files Coming Next

⏳ src/App.vue (updated version)
⏳ src/views/Home.vue
⏳ src/views/Login.vue
⏳ src/views/Register.vue
⏳ src/views/Browse.vue
⏳ src/views/Account.vue
⏳ src/views/ItemForm.vue
⏳ src/router/index.js (updated)

## Important Notes

1. **Create folders if they don't exist:**

   - `src/assets/`
   - `src/components/`
   - `src/stores/`
   - `src/views/`

2. **Replace existing files:**

   - `src/main.js`
   - `src/App.vue` (when provided)
   - `src/router/index.js` (when provided)

3. **API Configuration:**

   - Create `.env` file in project root with:
     ```
     VITE_API_URL=http://localhost:3000/api
     ```

4. **Delete old files (optional):**
   - src/Home.vue (old version)
   - src/Login.vue (old version)
   - src/Questions.vue (if not needed)
