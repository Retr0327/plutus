export function isDeepEqual(source: any, target: any): boolean {
  if (source === null && target === null) {
    return true;
  }

  if (typeof source !== typeof target) {
    return false;
  }

  if (typeof source !== 'object' && typeof target !== 'object') {
    return Object.is(source, target); // strict equality(x === y), but also handles +0, -0, and NaN
  }

  // check if objects are the same reference
  if (source === target) {
    return true;
  }

  if (source instanceof Date && target instanceof Date) {
    return source.getTime() === target.getTime();
  }

  if (Array.isArray(source) && Array.isArray(target)) {
    if (source.length !== target.length) {
      return false;
    }

    for (let i = 0; i < source.length; i++) {
      if (!isDeepEqual(source[i], target[i])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(source) || Array.isArray(target)) {
    return false;
  }

  const sourceKey = Object.keys(source);
  const targetKey = Object.keys(target);

  if (sourceKey.length !== targetKey.length) {
    return false;
  }

  for (let i = 0; i < sourceKey.length; i++) {
    const key = sourceKey[i];

    if (!(key in target)) {
      return false;
    }

    if (!isDeepEqual(source[key], target[key])) {
      return false;
    }
  }

  return true;
}
