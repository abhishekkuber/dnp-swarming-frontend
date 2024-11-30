export default {
    // Global page headers
    head: {
      title: 'Your Project Title',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    // Server configuration
    server: {
      port: process.env.PORT || 3000, // Bind to the PORT environment variable or fallback to 3000
      host: '0.0.0.0' // Allow external connections
    },

    // Other configurations can go here
  }
  