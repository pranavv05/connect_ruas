import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Load environment variables
import 'dotenv/config'

export default defineConfig({
  experimental: {
    adapter: true,
  },
  schema: path.join('prisma', 'schema.prisma'),
})