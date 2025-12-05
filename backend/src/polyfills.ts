/**
 * Polyfills para compatibilidade com Node.js 18
 */
import { webcrypto } from 'crypto';

// Adiciona crypto.randomUUID ao globalThis se não existir
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}
