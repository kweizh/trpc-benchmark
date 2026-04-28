FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Vite React project with zod installed for tRPC v11 React Query integration task."

RUN cd /home/user && \
    npm create vite@latest app -- --template react-ts && \
    cd app && \
    npm install && \
    npm install zod

# Container contents:
#   - Node.js v24 installed
#   - /home/user/app — Vite React project with zod installed

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
