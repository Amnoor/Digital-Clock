# The base image for my builder stage is the official Node.js image, which includes Node.js and npm. Specifically, the node:24.13.1-alpine3.22 image is used.
FROM node:24.13.1-alpine3.22 AS builder

# The working directory inside the container is set to /application. This is where the application code will be copied and where npm commands will be run.
WORKDIR /application

# The package.json and package-lock.json files are copied into the working directory. These files contain the metadata and dependencies of the Node.js application.
COPY package*.json ./

# The npm ci command is used to install the dependencies defined in package-lock.json. The --omit=dev flag is used to exclude devDependencies, which are not needed in the production environment.
RUN npm ci --omit=dev

# Finally, the rest of the application code is copied into the working directory. This includes all the source files needed to run the application.
COPY . .

# The base image for the runtime stage is a custom image named amnoorbrar/runtime-node:v1.0.0-24.13.1. This image is based on a Node.js runtime environment.
FROM amnoorbrar/runtime-node:v1.0.0-24.13.1

# Finally, the application files are copied from the builder stage to the runtime stage. This includes all the source files needed to run the application, and they are set with appropriate ownership and permissions for security and functionality.
COPY --from=builder --chown=0:1000 --chmod=550 /application /application

# The working directory is set to /application, which is where the application code is located. This means that when the container starts, it will be in this directory, and any commands will be executed from this location.
WORKDIR /application

# The EXPOSE instruction informs Docker that the container will listen on port 80 at runtime. This is a port that the web application listen, and it allows other containers or services to connect to this application on that port.
EXPOSE 80

# The ENTRYPOINT instruction specifies the command that will be executed when the container starts. In this case, it runs the Node.js application using the node binary and the router.js file as the entry point of the application.
ENTRYPOINT ["/usr/local/bin/node", "router.js"]