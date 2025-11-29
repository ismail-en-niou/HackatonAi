FROM node:latest    
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Build Next.js in production mode
RUN npm run build

EXPOSE 3000

# Start production server
CMD ["npm", "run", "start"]
