// C:\xampp\htdocs\QA\test-multi-tenancy-testing\playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    // Point to your Laravel app (Docker Apache: 8080)
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
  },
});