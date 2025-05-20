# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Make uploads folder
RUN mkdir -p uploads

# Set and expose port
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
