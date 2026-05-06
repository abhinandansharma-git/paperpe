const ABSOLUTE_URL_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;

export function isStoragePath(fileUrl) {
  if (typeof fileUrl !== 'string') {
    return false;
  }

  const trimmedFileUrl = fileUrl.trim();
  if (!trimmedFileUrl) {
    return false;
  }

  return !ABSOLUTE_URL_PATTERN.test(trimmedFileUrl);
}
