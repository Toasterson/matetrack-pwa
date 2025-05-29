FROM nginx:alpine

# Copy the PWA files to the nginx html directory
COPY public/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx-standard.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard nginx port)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]