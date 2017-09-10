FROM node:4
ADD ./package.json /golosjs/package.json
WORKDIR /golosjs
RUN npm install
ADD . /golosjs
RUN npm test
