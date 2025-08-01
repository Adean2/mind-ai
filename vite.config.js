import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        automation: resolve(__dirname, 'automation.html'),
        transportation: resolve(__dirname, 'transportaion.html'),
        security: resolve(__dirname, 'security.html'),
        employment: resolve(__dirname, 'employment.html'),
        entertainment: resolve(__dirname, 'entertainment.html'),
        employment: resolve(__dirname, 'employment.html'),
        customerservice: resolve(__dirname, 'customerservice.html'),
        resource: resolve(__dirname, 'resource.html')
      }
    }
  }
})
