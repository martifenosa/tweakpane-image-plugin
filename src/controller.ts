import {Controller, Value, ViewProps} from '@tweakpane/core';

import {ImageResolvable} from './model';
import {cloneImage, createPlaceholderImage, loadImage} from './utils';
import {PluginView} from './view';

interface Config {
	value: Value<ImageResolvable>;
	acceptUrl: boolean;
	imageFit: 'contain' | 'cover';
	extensions: string[];
	viewProps: ViewProps;
}

export class PluginController implements Controller<PluginView> {
	public readonly value: Value<ImageResolvable>;
	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new PluginView(doc, {
			viewProps: this.viewProps,
			acceptUrl: config.acceptUrl,
			extensions: config.extensions,
			imageFit: config.imageFit,
		});

		this.onFile_ = this.onFile_.bind(this);
		this.view.input.addEventListener('change', this.onFile_);

		this.viewProps.handleDispose(() => {
			this.view.input.removeEventListener('change', this.onFile_);
		});

		this.handleImage(this.value.rawValue);
	}

	private onFile_(event: Event): void {
		console.debug('Changing file via controller');
		const files = (event?.target as HTMLInputElement).files;
		if (!files || !files.length) return;

		const file = files[0];
		const image = document.createElement('img');
		image.src = URL.createObjectURL(file);
		const onLoad = () => {
			image.removeEventListener('load', onLoad);
			this.value.rawValue = image;
		};
		image.addEventListener('load', onLoad);
	}

	private onDrop_() {
		console.log('TODOs');
	}

	private handleImage(image: ImageResolvable) {
		if (image instanceof HTMLImageElement) {
			cloneImage(image).then((clone) => {
				this.view.changeImage(clone.src);
			});
		} else if (typeof image === 'string') {
			try {
				new URL(image);
				loadImage(image).then((image_) => {
					this.view.changeImage(image_.src);
				});
			} catch (_) {
				initialValue = exValue;
			}
		}
	}
}
