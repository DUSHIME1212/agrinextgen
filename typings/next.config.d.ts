
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
declare interface configType {
	static images: {
	static remotePatterns: ({	} | aRW)[];
	};

	static typescript: {
	static ignoreBuildErrors: boolean;
	};
}
