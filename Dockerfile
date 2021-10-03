FROM node:14-alpine

# Create app directory
ENV HOME=/usr/src/backend

# copy all files
COPY . $HOME
WORKDIR $HOME

EXPOSE 3000 

RUN npm install
RUN npm run build
