export const DEFAULT_FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f8fafc"/><rect x="10" y="10" width="280" height="280" rx="16" fill="none" stroke="%23e2e8f0" stroke-width="2" stroke-dasharray="6 6"/><g fill="%2394a3b8"><path d="M120 110a15 15 0 1 0 0-30 15 15 0 0 0 0 30zm60 20l-30 40-20-25-45 60h140l-45-75z"/><text x="150" y="225" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="%2394a3b8">사진 없음</text></g></svg>`;

/**
 * Clean and convert image/video URLs from common image hosts, share links,
 * embed tags (<img src="...">), or markdown tags (![alt](url)).
 */
export function cleanAndConvertImageUrl(rawUrl: string): string {
  if (!rawUrl) return DEFAULT_FALLBACK_IMAGE;
  let url = rawUrl.trim();
  if (!url) return DEFAULT_FALLBACK_IMAGE;

  // Extract inner URL from Markdown format like [text](http...) or [http...](http...)
  // Handle case where URL itself contains parentheses like (1)
  const mdMatch = url.match(/\[.*?\]\((https?:\/\/.+)\)/i);
  if (mdMatch && mdMatch[1]) {
    let candidate = mdMatch[1];
    // Balance trailing parenthesis if it closes the markdown parenthesis
    let openCount = 0;
    let closeCount = 0;
    for (let i = 0; i < candidate.length; i++) {
      if (candidate[i] === '(') openCount++;
      if (candidate[i] === ')') closeCount++;
    }
    if (closeCount > openCount && candidate.endsWith(')')) {
      candidate = candidate.slice(0, candidate.lastIndexOf(')'));
    }
    url = candidate;
  } else {
    // If not markdown link, check HTML <img> or plain extraction
    const imgTagMatch = url.match(/src=["']([^"']+)["']/i);
    if (imgTagMatch && imgTagMatch[1]) {
      url = imgTagMatch[1];
    } else {
      const plainHttpMatch = url.match(/(https?:\/\/[^\s"'<>]+)/i);
      if (plainHttpMatch && plainHttpMatch[1]) {
        url = plainHttpMatch[1];
      }
    }
  }

  // Remove surrounding quotes, brackets or whitespace
  url = url.replace(/^["'<>\[\]]+|["'<>\[\]]+$/g, '').trim();

  // Prepend https:// if protocol is missing for known domains
  if (/^(i\.postimg\.cc|postimg\.cc|postimages\.org|i\.ibb\.co|i\.imgur\.com|images\.unsplash\.com|drive\.google\.com|lh3\.googleusercontent\.com|dropbox\.com)/i.test(url)) {
    url = 'https://' + url;
  }

  // If it's already a direct postimg link: e.g. https://i.postimg.cc/s2sHdhjD/jadongbium1(1).png
  if (/^https?:\/\/i\.postimg\.cc\//i.test(url)) {
    return url;
  }

  // PostImg page links: https://postimg.cc/s2sHdhjD or https://postimages.org/s2sHdhjD
  const postImgMatch = url.match(/(?:postimg\.cc|postimages\.org)\/([a-zA-Z0-9]+)/i);
  if (postImgMatch && postImgMatch[1]) {
    return `https://i.postimg.cc/${postImgMatch[1]}/image.png`;
  }

  // Google Drive share/view links
  const gDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }

  // Dropbox share links
  if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/\?dl=\d/, '');
  }

  // Imgur page links
  if (!/^https?:\/\/i\.imgur\.com\//i.test(url)) {
    const imgurMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/i);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.png`;
    }
  }

  return url || DEFAULT_FALLBACK_IMAGE;
}

export function cleanAndConvertVideoUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // 태그 내부 src 주소 추출
  const videoTagMatch = url.match(/src=["']([^"']+)["']/i);
  if (videoTagMatch && videoTagMatch[1]) {
    url = videoTagMatch[1];
  }

  // 따옴표, 대괄호 등 앞뒤 찌꺼기 문자 제거
  url = url.replace(/^["'\[\s<]+|["'\]\s>]+$/g, '');

  // https:// 가 빠진 경우에만 붙여주도록 안전 보정
  if (url.startsWith('//')) {
    url = 'https:' + url;
  } else if (!/^https?:\/\//i.test(url) && url.length > 0) {
    url = 'https://' + url;
  }

  return url;
}