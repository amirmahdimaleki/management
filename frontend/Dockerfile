# ---- Builder Stage ----
# Use a Node.js version that includes pnpm
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install all dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code into JavaScript
RUN pnpm build

# Prune development dependencies to reduce size
RUN pnpm prune --prod


# ---- Production Stage ----
# Use a lightweight Node.js image for the final image
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# The command to run the application
CMD ["node", "dist/server.js"]