FROM node:alpine as builder

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json ./

RUN npm cache clean --force

RUN npm install 

COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD [ "npm", "run", "dev" ]
