FROM node:6
ADD ./package.json /golosjs/package.json
WORKDIR /golosjs
RUN npm install
ADD . /golosjs
RUN npm test
