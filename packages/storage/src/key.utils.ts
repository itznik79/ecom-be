import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

function sanitizeName(name: string) {
  return name.replace(/[^a-z0-9-_\.]/gi, '-').replace(/-+/g, '-').toLowerCase();
}

export const generateProductImageKey = (productId: string, filename: string) => {
  const ext = path.extname(filename || '') || '.bin';
  const base = path.basename(filename || '', ext).slice(0, 40);
  const safe = sanitizeName(base);
  return `products/${productId}/${Date.now()}-${uuidv4()}-${safe}${ext}`;
};

export const generateBrandImageKey = (brandId: string, filename: string) => {
  const ext = path.extname(filename || '') || '.bin';
  const base = path.basename(filename || '', ext).slice(0, 40);
  const safe = sanitizeName(base);
  return `brands/${brandId}/${Date.now()}-${uuidv4()}-${safe}${ext}`;
};
