FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID
ARG NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID=$NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID \
    NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID=$NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID
COPY . .
RUN npm install
RUN npm run build --workspace=@gravity/dashboard

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/dashboard/.next ./.next
COPY --from=builder /app/apps/dashboard/public ./public
COPY --from=builder /app/apps/dashboard/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
