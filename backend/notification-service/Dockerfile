# Use Node.js LTS image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5004

# Expose port
EXPOSE 5004

# Start the application
CMD ["node", "server.js"]
