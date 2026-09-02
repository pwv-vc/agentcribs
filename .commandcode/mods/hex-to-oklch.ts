import type {ModApi} from '@commandcode/harness';

type RGBA = {r: number; g: number; b: number; a: number};
type OKLCH = {L: number; C: number; H: number; a: number};

function hexToRgba(input: string): RGBA | null {
	let hex = input.trim().replace(/^#/, '');
	if (/^[0-9a-f]{3}$/i.test(hex) || /^[0-9a-f]{4}$/i.test(hex)) {
		hex = hex
			.split('')
			.map(c => c + c)
			.join('');
	}
	if (!/^[0-9a-f]{6}$/i.test(hex) && !/^[0-9a-f]{8}$/i.test(hex)) return null;
	return {
		r: parseInt(hex.slice(0, 2), 16) / 255,
		g: parseInt(hex.slice(2, 4), 16) / 255,
		b: parseInt(hex.slice(4, 6), 16) / 255,
		a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
	};
}

function linearize(c: number): number {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToOklch(input: string): OKLCH | null {
	const {r, g, b, a} = hexToRgba(input) ?? {};
	if (r === undefined) return null;
	const rl = linearize(r);
	const gl = linearize(g);
	const bl = linearize(b);
	const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
	const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
	const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
	const lc = Math.cbrt(l);
	const mc = Math.cbrt(m);
	const sc = Math.cbrt(s);
	const L = 0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc;
	const ao = 1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc;
	const bo = 0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc;
	const C = Math.hypot(ao, bo);
	const deg = (Math.atan2(bo, ao) * 180) / Math.PI;
	return {L, C, H: deg < 0 ? deg + 360 : deg, a};
}

function round(value: number, digits: number): number {
	const f = Math.pow(10, digits);
	return Math.round(value * f) / f;
}

function formatOklch(hex: string, digits = 4): string {
	const o = hexToOklch(hex);
	if (!o) return '';
	const base = `oklch(${round(o.L, digits)} ${round(o.C, digits)} ${round(o.H, 2)})`;
	return o.a < 1 ? `${base} / ${round(o.a, digits)}` : base;
}

const HEX_RE = /^#?[0-9a-f]{3,8}$/i;

function isHex(token: string): boolean {
	return HEX_RE.test(token) && [3, 4, 6, 8].includes(token.replace(/^#/, '').length);
}

function convertToken(token: string): string {
	const color = formatOklch(token);
	return color ? `${token} → ${color}` : `"${token}" is not a valid hex color`;
}

export default function (cmd: ModApi): void {
	cmd.addTool({
		schema: {
			name: 'hex_to_oklch',
			description:
				'Convert a hex color (#RGB, #RGBA, #RRGGBB, or #RRGGBBAA) to the CSS OKLCH color space, returning a ready-to-use oklch() value and a CSS color declaration.',
			input_schema: {
				type: 'object',
				properties: {
					color: {
						type: 'string',
						description:
							'Hex color to convert, e.g. "#00d2c8", "#ff0000", "f00", or "#ff550080".',
					},
				},
				required: ['color'],
			},
		},
		readOnly: true,
		run: async ({input}) => {
			const color = typeof input.color === 'string' ? input.color.trim() : '';
			const oklch = formatOklch(color);
			if (!oklch) {
				return {
					ok: false,
					error: `"${color}" is not a valid hex color. Expected #RGB, #RGBA, #RRGGBB, or #RRGGBBAA.`,
				};
			}
			return {
				ok: true,
				content: [
					{
						type: 'text',
						text: `${color} → ${oklch}\ncolor: ${oklch};`,
					},
				],
			};
		},
	});

	cmd.addCommand({
		name: 'oklch',
		description: 'Convert hex color(s) to CSS oklch() values',
		argumentHint: '#RRGGBB [#RRGGBB ...]',
		handler: ({args}) => {
			const tokens = args
				.trim()
				.split(/\s+/)
				.filter(Boolean);
			const colors = tokens.filter(isHex);
			const invalid = tokens.filter(t => !isHex(t));
			if (colors.length === 0) {
				return {
					message: invalid.length
						? `No valid hex colors in "${args.trim()}" — expected #RGB/#RGBA/#RRGGBB/#RRGGBBAA.`
						: 'Usage: /oklch #RRGGBB [more hex colors...]',
				};
			}
			const lines = colors.map(c => formatOklch(c));
			return {
				message:
					(lines.length === 1
						? lines[0]
						: colors.map((c, i) => `${c} → ${lines[i]}`).join('\n')) +
					'\n' +
					lines.map(l => `color: ${l};`).join('\n'),
			};
		},
	});
}
