# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
# If using npm: COPY package.json package-lock.json ./

RUN \
  if [ -f "yarn.lock" ]; then yarn install --frozen-lockfile; \
  elif [ -f "pnpm-lock.yaml" ]; then pnpm install --frozen-lockfile; \
  else npm install --omit=dev; fi

COPY . .

ARG NEXT_PUBLIC_JAVA_URL
ENV NEXT_PUBLIC_JAVA_URL=$NEXT_PUBLIC_JAVA_URL

RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

WORKDIR /app


ENV NODE_ENV=production

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]