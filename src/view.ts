import {ClassName, View, ViewProps} from '@tweakpane/core';

interface Config {
	viewProps: ViewProps;
	acceptUrl: boolean;
	imageFit: 'contain' | 'cover';
	extensions: string[];
}

const className = ClassName('img');

export class PluginView implements View {
	public readonly element: HTMLElement;
	public readonly input: HTMLElement;
	private image_: HTMLImageElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		this.input = doc.createElement('input');
		this.input.classList.add(className('input'));
		this.input.setAttribute('type', 'file');
		this.input.setAttribute('accept', config.extensions.join(','));
		this.element.appendChild(this.input);

		this.image_ = doc.createElement('img');
		this.image_.classList.add(className('image'));
		this.image_.classList.add(className(`image_${config.imageFit}`));
		this.element.appendChild(this.image_);
	}

	changeImage(src: string) {
		this.image_.src = src;
	}

	private onValueChange_(value: string) {
		this.changeImage(value);
	}
}
