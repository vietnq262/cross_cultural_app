import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomPasswordSalt = (): string => crypto.randomUUID();

export const generatePasswordHash = async (
  password: string,
  salt: string = '',
): Promise<string> => {
  const encoder = new TextEncoder();
  const saltedPassword = encoder.encode(password + salt);
  const hashedPasswordBuffer = await crypto.subtle.digest(
    'SHA-256',
    saltedPassword,
  );
  return getStringFromBuffer(hashedPasswordBuffer);
};

export const isPasswordMatched = async (
  password: string,
  hashedPassword: string,
  salt: string = '',
): Promise<boolean> => {
  const pwd = await generatePasswordHash(password, salt);
  return pwd === hashedPassword;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }

  return res.json();
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatFileSizeText(size: number): string {
  const size1MB = 1000 * 1000;
  const sizeInMB = limitDecimalPlace(size / size1MB, 2);
  return sizeInMB.toString() + 'MB';
}

export function limitDecimalPlace(
  value: number,
  numberOfDecimalPlace: number,
): number {
  if (!value) {
    return value;
  }
  const factor = Math.pow(10, numberOfDecimalPlace);
  return Math.round(value * factor) / factor;
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>,
) => {
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export function unaccent(text: string): string {
  if (!text) {
    return text;
  }
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function unaccentAndSlugify(text: string): string {
  return slugify(unaccent(text));
}

export function replaceFileExtension(
  filename: string,
  newExtension: string,
): string {
  const dotIndex = filename.lastIndexOf('.');

  // If the file has an extension, replace it
  if (dotIndex !== -1) {
    return filename.slice(0, dotIndex) + '.' + newExtension;
  }

  // If no extension found, just append the new extension
  return `${filename}.${newExtension}`;
}
