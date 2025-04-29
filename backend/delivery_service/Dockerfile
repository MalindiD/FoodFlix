# Use an official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your delivery service listens to
EXPOSE 5003

# Command to run the app
CMD ["npm", "start"]
