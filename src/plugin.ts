import {
	BaseInputParams,
	BindingTarget,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
} from '@tweakpane/core';

import {PluginController} from './controller';
import {ImageResolvable} from './model';

export interface PluginInputParams extends BaseInputParams {
	view: 'input-image';
	acceptUrl?: boolean;
	imageFit?: 'contain' | 'cover';
	extensions?: string[];
}

const DEFAULT_EXTENSIONS = ['.jpg', '.png', '.gif'];

export const TweakpaneImagePlugin: InputBindingPlugin<
	ImageResolvable,
	ImageResolvable,
	PluginInputParams
> = {
	id: 'input-image',
	type: 'input',
	css: '__css__',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (!(exValue instanceof HTMLImageElement || typeof exValue === 'string')) {
			return null;
		}

		const p = ParamsParsers;
		const result = parseParams<PluginInputParams>(params, {
			view: p.required.constant('input-image'),
			acceptUrl: p.optional.boolean,
			imageFit: p.optional.custom((v) =>
				v === 'contain' || v === 'cover' ? v : undefined,
			),
			extensions: p.optional.array(p.required.string),
		});
		if (!result) {
			return null;
		}

		return {
			initialValue: exValue,
			params: result,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): ImageResolvable => {
				return exValue instanceof HTMLImageElement ? exValue : 'placeholder';
			};
		},

		writer(_args) {
			return (target: BindingTarget, inValue) => {
				target.write(inValue);
			};
		},
	},

	controller(args) {
		return new PluginController(args.document, {
			value: args.value,
			acceptUrl: args.params.acceptUrl ?? false,
			imageFit: args.params.imageFit ?? 'cover',
			viewProps: args.viewProps,
			extensions: args.params.extensions ?? DEFAULT_EXTENSIONS,
		});
	},
};
