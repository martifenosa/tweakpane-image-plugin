export function createPlaceholderImage(): Promise<HTMLImageElement> {
	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 64"> 
			<style>
					.svg__text {
						font-family: 'Arial';
						fill: white;
						font-size: 12px;
					}
			</style>
			<rect x="0" y="0" width="128" height="64" fill="#272727"/>
			<text x="50%" y="55%" text-anchor="middle" class="svg__text">No image</text>
		</svg>
	`;

	return new Promise((resolve) => {
		const blob = new Blob([svg], { type: 'image/svg+xml'});
		const image = new Image();
		image.src = URL.createObjectURL(blob as Blob);
		image.onload = () => {
			resolve(image);
		};
	});
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
	const image = new Image();
	image.crossOrigin = 'anonymous';
	return new Promise((resolve) => {
		image.src = src;
		image.onload = () => {
			resolve(image);
		};
	});
}

export function cloneImage(
	source: HTMLImageElement,
): Promise<HTMLImageElement> {
	const canvas = document.createElement('canvas');
	canvas.width = source.width;
	canvas.height = source.height;

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(source, 0, 0);

	const image = new Image();
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if(!blob) reject();
			image.src = URL.createObjectURL(blob as Blob);
			image.onload = () => {
				resolve(image);
			};
		});
	});
}
