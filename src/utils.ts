/**
 * Clean and convert image/video URLs from common image hosts, share links,
 * embed tags (<img src="...">), or markdown tags (![alt](url)).
 */

export function cleanAndConvertImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // Extract URL from HTML <img src="..."> if present
  const imgTagMatch = url.match(/src=["']([^"']+)["']/i);
  if (imgTagMatch && imgTagMatch[1]) {
    url = imgTagMatch[1];
  }

  // Extract URL from Markdown ![alt](url) if present
  const mdMatch = url.match(/\((https?:\/\/[^\)]+)\)/i);
  if (mdMatch && mdMatch[1]) {
    url = mdMatch[1];
  }

  // Remove surrounding quotes or angle brackets
  url = url.replace(/^["'<>]+|["'<>]+$/g, '').trim();

  // Prepend https:// if starts with i.ibb.co or i.imgur.com or images.unsplash.com without protocol
  if (/^(i\.ibb\.co|i\.imgur\.com|images\.unsplash\.com|drive\.google\.com|lh3\.googleusercontent\.com|dropbox\.com)/i.test(url)) {
    url = 'https://' + url;
  }

  // Google Drive share/view links:
  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const gDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }

  // Dropbox share links:
  // https://www.dropbox.com/s/xyz/photo.jpg?dl=0
  if (url.includes('dropbox.com')) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/\?dl=\d/, '');
  }

  // Imgur page links:
  // https://imgur.com/ABCDEF -> https://i.imgur.com/ABCDEF.png
  const imgurMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/i);
  if (imgurMatch && imgurMatch[1]) {
    return `https://i.imgur.com/${imgurMatch[1]}.png`;
  }

  return url;
}

export function cleanAndConvertVideoUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // Extract URL from HTML <video src="..."> or <iframe src="..."> if present
  const videoTagMatch = url.match(/src=["']([^"']+)["']/i);
  if (videoTagMatch && videoTagMatch[1]) {
    url = videoTagMatch[1];
  }

  // Remove surrounding quotes or angle brackets
  url = url.replace(/^["'<>]+|["'<>]+$/g, '').trim();

  if (/^(commondatastorage\.googleapis\.com|drive\.google\.com)/i.test(url)) {
    url = 'https://' + url;
  }

  return url;
}
