import path from 'path';

const VOID_TAGS = [
  'area', 'base', 'br', 'col',
  'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr',
];

/**
 * @param {string} tagName
 * @param {Object} [attributes]
 * @return {BuildTagItem}
 * */
export function tagsCreateItem(tagName, attributes) {
  const normalizedTagName = tagName.toLowerCase();

  return {
    tagName: normalizedTagName,
    voidTag: VOID_TAGS.includes(normalizedTagName),
    attributes: attributes || {},
  };
}

/**
 * @param {string} url
 * @param {BuildTagHint} hintType
 * @return {BuildTagItem}
 * */
export function tagsGetItemHint(url, hintType) {
  return tagsCreateItem('link', {
    rel: hintType,
    href: url,
    as: tagsGetResourceDirective(url),
  });
}

/**
 * @param {string} url
 * @return {BuildTagItem}
 * */
export function tagsGetItemModule(url) {
  return tagsCreateItem('script', {
    src: url,
    type: 'module',
  });
}

/**
 * @param {string} url
 * @return {BuildTagItem}
 * */
export function tagsGetItemNoModule(url) {
  return tagsCreateItem('script', {
    src: url,
    defer: true,
    nomodule: true,
  });
}

/**
 * @param {string} url
 * @return {BuildTagItem}
 * */
export function tagsGetItemStyle(url) {
  return tagsCreateItem('link', {
    rel: 'stylesheet',
    href: url,
  });
}

/**
 * @param {string} url
 * @return {undefined|string}
 * */
export function tagsGetResourceDirective(url) {
  const ext = path.extname(url);

  switch (ext) {
    case '.mjs':
    case '.js':
      return 'script';
    case '.css':
      return 'style';
    case '.ttf':
    case '.woff':
    case '.woff2':
      return 'font';
    case '.jpeg':
    case '.jpg':
    case '.gif':
    case '.png':
    case '.svg':
    case '.webp':
      return 'image';
    case '.mp3':
    case '.aac':
      return 'audio';
    case '.mp4':
      return 'video';
    default:
      return undefined;
  }
}

/**
 * @param {BuildTagItem} tag
 * @return {string}
 */
export function tagsItemToString(tag) {
  const {
    tagName,
    attributes,
    voidTag,
  } = tag;
  /** @type {Array<string>} */
  const attributesList = Object
    .entries(attributes)
    .filter(([, value]) => {
      return ![undefined, false].includes(value);
    })
    .map(([name, value]) => {
      if (['', true].includes(value)) {
        return name;
      }
      return `${name}="${value.replace(/"/g, '\'')}"`;
    });

  return [
    '<',
    [tagName, ...attributesList].join(' '),
    '>',
    !voidTag && `</${tagName}>`,
  ].filter(Boolean).join('');
}

/**
 * @param {Array<BuildTagItem>} items
 * @return {Array<string>}
 * */
export function tagsItemsToString(items) {
  return items.map((item) => tagsItemToString(item));
}

/**
 * @param {Array<BuildTagItem>} tags
 * @return {BuildTagItemsGrouped}
 * */
export function tagsGetItemsGrouped(tags) {
  /** @type {BuildTagItemsGrouped} */
  const itemsGrouped = {
    meta: [],
    prefetch: [],
    preload: [],
    style: [],
    module: [],
    nomodule: [],
  };

  return tags.reduce((result, tag) => {
    /** @type {BuildTagHint} */
    const rel = tag.attributes.rel;
    /** @type {undefined|'module'} */
    const type = tag.attributes.type;
    /** @type {undefined|boolean} */
    const nomodule = tag.attributes.nomodule;

    if (rel === 'prefetch') {
      result.prefetch.push(tag);
    }
    else if (['preload', 'modulepreload'].includes(rel)) {
      result.preload.push(tag);
    }
    else if (rel === 'stylesheet') {
      result.style.push(tag);
    }
    else if (type === 'module') {
      result.module.push(tag);
    }
    else if (nomodule === true) {
      result.nomodule.push(tag);
    }
    else {
      result.meta.push(tag);
    }

    return result;
  }, itemsGrouped);
}

/**
 * @param {Array<string>} chunkGroup
 * @return {Array<BuildTagItem>}
 * */
export function tagsGenerateItems(chunkGroup) {
  /** @type {Array<BuildTagItem>} */
  const items = [];

  chunkGroup.forEach((url) => {
    const ext = path.extname(url);
    const isModern = url.includes('.modern.');
    const isLegacy = url.includes('.legacy.');
    const isScript = ext === '.js';
    const isStyle = ext === '.css';

    if (isScript && isModern) {
      items.push(tagsGetItemHint(url, 'modulepreload'));
      items.push(tagsGetItemModule(url));
    }
    if (isScript && isLegacy) {
      items.push(tagsGetItemNoModule(url));
    }
    if (isStyle) {
      items.push(tagsGetItemHint(url, 'preload'));
      items.push(tagsGetItemStyle(url));
    }
  });

  return items;
}
