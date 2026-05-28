# Use official Node.js image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy only backend package files for efficient caching
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend ./

# Expose the port your app listens on (adjust if different)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
