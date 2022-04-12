FROM node:alpine
WORKDIR '/moneymaly-app'
ENV PATH /moneymaly-app/node_modules/.bin:$PATH
RUN npm install
COPY . ./
CMD ["npm", "start"] 