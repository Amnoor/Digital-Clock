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

#The base image for runtime stage is scratch, which is an empty image. This means that only the files explicitly copied from the builder stage will be included in the final image.
FROM scratch

# The necessary files and directories are copied from the builder stage to the runtime stage. The --chown=0:1000 flag sets the ownership of the files to user ID 1000 and group ID 1000, while the --chmod=550 flag sets the permissions to read and execute for the owner and group, and no permissions for others.
COPY --from=builder --chown=0:1000 --chmod=550 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# The necessary shared libraries for Node.js are also copied from the builder stage to the runtime stage. This includes the musl libc dynamic linker (ld-musl-*.so.1) and the standard C++ library (libstdc++.so.6) and the GCC support library (libgcc_s.so.1). These libraries are required for Node.js to run properly in the scratch image, which does not include any base libraries.
COPY --from=builder --chown=0:1000 --chmod=550 /lib/ld-musl-*.so.1 /lib/
COPY --from=builder --chown=0:1000 --chmod=550 /usr/lib/libstdc++.so.6 /usr/lib/
COPY --from=builder --chown=0:1000 --chmod=550 /usr/lib/libgcc_s.so.1 /usr/lib/

# The Node.js binary itself is also copied from the builder stage to the runtime stage. This allows the application to run using the Node.js runtime in the scratch image.
COPY --from=builder --chown=0:1000 --chmod=550 /usr/local/bin/node /usr/local/bin/node

# Finally, the application files are copied from the builder stage to the runtime stage. This includes all the source files needed to run the application, and they are set with appropriate ownership and permissions for security and functionality.
COPY --from=builder --chown=0:1000 --chmod=550 /application /application

# The USER instruction sets the user and group for running the application. In this case, it is set to user ID 1000 and group ID 1000, which is a common non-root user in many Linux distributions. This is a security best practice to avoid running applications as the root user.
USER 1000:1000

# The working directory is set to /application, which is where the application code is located. This means that when the container starts, it will be in this directory, and any commands will be executed from this location.
WORKDIR /application

# The EXPOSE instruction informs Docker that the container will listen on port 80 at runtime. This is a port that the web application listen, and it allows other containers or services to connect to this application on that port.
EXPOSE 80

# The ENTRYPOINT instruction specifies the command that will be executed when the container starts. In this case, it runs the Node.js application using the node binary and the router.js file as the entry point of the application.
ENTRYPOINT ["/usr/local/bin/node", "router.js"]