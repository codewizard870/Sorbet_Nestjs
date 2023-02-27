# Use the official Node.js runtime as a parent image
FROM node:16-slim
RUN apt-get update
RUN apt-get install -y openssl
# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies with npm ci
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Generate a new schema
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:prod"]