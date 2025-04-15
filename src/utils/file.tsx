export function getImageViewUrl(image: string | null | undefined) {
	if (!image) return ``;
	if (
		image?.startsWith("http") ||
		image?.startsWith("https") ||
		image?.startsWith("blob") ||
		image?.startsWith("data") ||
		image?.startsWith("/api")
	) {
		return image;
	}
	return `/api/files/view/${image}`;
}

export function getDownloadUrl(image: string | null | undefined) {
	if (!image) return ``;
	if (
		image?.startsWith("http") ||
		image?.startsWith("https") ||
		image?.startsWith("blob") ||
		image?.startsWith("data") ||
		image?.startsWith("/api")
	) {
		return image;
	}
	return `/api/files/download/${image}`;
}
