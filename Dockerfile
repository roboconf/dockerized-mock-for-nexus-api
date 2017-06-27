FROM node:8-alpine

LABEL maintainer="The Roboconf Team" \
      github="https://github.com/roboconf"

EXPOSE 9090
COPY ./*.* /usr/src/app/
WORKDIR /usr/src/app/
RUN npm install
CMD [ "npm", "start" ]
