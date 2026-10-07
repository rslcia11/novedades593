/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Usa la misma configuración de Vite que Astro (alias @/, variables de entorno).
// Docs: https://docs.astro.build/en/guides/testing/#vitest
export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
