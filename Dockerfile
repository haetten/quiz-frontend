FROM node:22 as build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build


FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html/quiz-app

#EXPOSE 3000
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]