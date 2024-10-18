FROM node:alpine as build
ENV NODE_ENV production
WORKDIR /app
COPY package.json .


COPY . .


RUN npm install
RUN npm install typescript -g
RUN npm install vite -g
RUN npm install @vitejs/plugin-react -g
RUN npm install vite-plugin-svgr -g
RUN npm i --save-dev @types/react
RUN npm i --save-dev @types/react-dom
RUN ln -s /usr/local/lib/node_modules/ ../node_modules


RUN npm run build
EXPOSE 8000
CMD [ "npm", "run", "preview" ]


# production environment

# FROM ubuntu
# RUN rm /var/lib/dpkg/available \
# && touch /var/lib/dpkg/available  \
# && sh -c 'for i in /var/lib/apt/lists/*_Packages; do dpkg --merge-avail "$i"; done'
# FROM nginx:stable-alpine
# # RUN apt-get update
# RUN apt-get install nginx -y
# COPY --from=build /app/dist /var/www/html/

# CMD ["nginx","-g","daemon off;"]
# FROM nginx:stable-alpine

# COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 8000
# CMD ["nginx", "-g", "daemon off;"]

# FROM nginx:stable-alpine
# # COPY --from=build /app/build /usr/share/nginx/html
# COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 8000
