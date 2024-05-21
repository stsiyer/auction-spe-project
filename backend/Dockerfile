# Use the base image with Node.js installed
FROM node:16-alpine

# Set the working directory to /backend
WORKDIR /backend

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Run tests during the build process (optional, but recommended)
RUN npm run test

# Expose the port that the application will run on
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "start"]