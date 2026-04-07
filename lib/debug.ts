/**
 * Debug utility — only active in __DEV__.
 * Prints deeply nested objects as formatted JSON to the Metro console.
 *
 * Usage:
 *   import { debug } from '@/lib/debug';
 *   debug('auth store', user);
 *   debug.warn('missing field', { field: 'name', value: null });
 *   debug.error('parse failed', error);
 *   debug.group('API response', { status: 200, data: { ... } });
 */

function serialize(value: unknown): string {
  return JSON.stringify(value, replacer, 2);
}

/** Handle circular refs, Dates, Errors, undefined */
function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Error) return { message: value.message, stack: value.stack };
  if (value === undefined) return '__undefined__';
  return value;
}

function log(label: string, ...data: unknown[]): void {
  if (!__DEV__) return;
  const parts = data.map((d) =>
    typeof d === 'object' && d !== null ? serialize(d) : String(d)
  );
  console.log(`\n🔍 [DEBUG] ${label}\n${parts.join('\n')}`);
}

function warn(label: string, ...data: unknown[]): void {
  if (!__DEV__) return;
  const parts = data.map((d) =>
    typeof d === 'object' && d !== null ? serialize(d) : String(d)
  );
  console.warn(`\n⚠️  [DEBUG] ${label}\n${parts.join('\n')}`);
}

function error(label: string, ...data: unknown[]): void {
  if (!__DEV__) return;
  const parts = data.map((d) =>
    typeof d === 'object' && d !== null ? serialize(d) : String(d)
  );
  console.error(`\n❌ [DEBUG] ${label}\n${parts.join('\n')}`);
}

/** Print multiple values under a named group */
function group(label: string, data: Record<string, unknown>): void {
  if (!__DEV__) return;
  const lines = Object.entries(data)
    .map(([k, v]) => `  ${k}: ${typeof v === 'object' && v !== null ? serialize(v) : String(v)}`)
    .join('\n');
  console.log(`\n📦 [DEBUG] ${label}\n${lines}`);
}

export const debug = Object.assign(log, { warn, error, group, log });
