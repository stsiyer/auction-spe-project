# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build  # Assuming your build command for ReactJS

# FROM nginx:alpine

# COPY --from=builder /app/build /usr/share/nginx/html

# EXPOSE 2004  

# CMD ["nginx", "-g", "daemon off;"]


#Use a Node.js base image
FROM node:14-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire frontend application
COPY . .

# Build the React app for production
RUN npm run build

# Install serve globally to be used in start:prod script
RUN npm install -g serve

# Expose the port on which the Node.js server will run
EXPOSE 2004

# Command to run the Node.js server
CMD ["npm", "run", "start:prod"]