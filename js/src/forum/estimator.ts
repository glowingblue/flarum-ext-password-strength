/*
 * This file is part of glowingblue/password-strength.
 *
 * Copyright (c) 2021 Rafael Horvat.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';

/**
 * Build the zxcvbn estimator. We bundle only @zxcvbn-ts/language-common (keyboard
 * adjacency graphs + the common-password/diceware dictionaries); per-language
 * word lists are intentionally not bundled. zxcvbn's own feedback strings are
 * unused — we render our own strength labels — so no translations are configured.
 *
 * This module is loaded on demand via a dynamic `import()` so that the (large)
 * dictionary payload is only fetched once a user actually starts typing a
 * password, keeping the main forum bundle small. See extend.php's
 * `->jsDirectory()` registration which makes the resulting chunk available.
 */
const zxcvbn = new ZxcvbnFactory({
	graphs: zxcvbnCommonPackage.adjacencyGraphs,
	dictionary: {
		...zxcvbnCommonPackage.dictionary,
	},
});

export default zxcvbn;
