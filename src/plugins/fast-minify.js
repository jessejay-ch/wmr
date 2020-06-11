import terser from 'terser';

/** @returns {import('rollup').Plugin} */
export default function fastMinifyPlugin({ sourcemap = false, warnThreshold = 50 } = {}) {
	return {
		name: 'fast-minify',
		renderChunk(code, chunk) {
			const start = Date.now();
			const out = terser.minify(code, {
				sourceMap: sourcemap,
				mangle: true,
				compress: false,
				module: true,
				ecma: 9,
				safari10: true,
				output: {
					comments: false
				}
			});
			const duration = Date.now() - start;
			if (out.error) this.error(out.error);
			if (out.warnings) for (const warn of out.warnings) this.warn(warn);
			if (duration > warnThreshold) {
				this.warn(`minify(${chunk.fileName}) took ${duration}ms`);
			}
			const map = typeof out.map === 'string' ? JSON.parse(out.map) : out.map || null;
			return { code: out.code, map };
		}
	};
}