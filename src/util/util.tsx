import { Buffer } from 'buffer';

function base64ToFile(base64String: string, fileName: string): File {
  const byteString = Buffer.from(base64String.split(',')[1], 'base64');
  const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
  const blob = new Blob([byteString], { type: mimeString });
  return new File([blob], fileName, { type: mimeString });
}

function getContentTypeFromBase64(base64String: string): string {
  const parts = base64String.split(',');
  const match = parts[0].match(/:(.*?);/);
  if (parts.length < 2 || match === null || match === undefined) {
    return '';
  }
  return match[1];
}

const contentTypeToExtensionMap: { [key: string]: string } = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
};

export { base64ToFile, getContentTypeFromBase64, contentTypeToExtensionMap };