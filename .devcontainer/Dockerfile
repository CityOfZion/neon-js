# Update the VARIANT arg in docker-compose.yml to pick a Node version: 14, 16, 18
ARG VARIANT=22

FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN sudo apt-get update && sudo apt-get -y install libusb-1.0-0-dev libusb-1.0-0 libudev-dev

# Update args in docker-compose.yaml to set the UID/GID of the "node" user.
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
    groupmod --gid $USER_GID node \
    && usermod --uid $USER_UID --gid $USER_GID node \
    && chmod -R $USER_UID:$USER_GID /home/node \
    && chmod -R $USER_UID:root /usr/local/share/nvm /usr/local/share/npm-global; \
    fi
