/**
 * Opens a clean, centered Facebook share popup window.
 * @param path The relative path of the article (e.g., '/articles/my-first-run')
 */
export const shareToFacebook = (path: string) => {
  if (typeof window === "undefined") return;

  const absoluteUrl = `${window.location.origin}${path}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`;

  // Center the popup window on the user's screen layout
  const width = 600;
  const height = 450;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    fbUrl,
    "facebook-share-dialog",
    `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
  );
};
