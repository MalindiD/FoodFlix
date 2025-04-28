FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5004

# Expose port
EXPOSE 5004

# Start the application
CMD ["node", "server.js"]