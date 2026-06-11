<?php
/*
 * This file is part of glowingblue/password-strength.
 *
 * Copyright (c) 2021 Rafael Horvat.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Builder;

/**
 * The colour settings used to be stored as comma-separated RGB triples (e.g.
 * "255,129,128"). The admin UI now uses a colour picker that works with hex
 * values, so existing values are converted to the "#rrggbb" format.
 *
 * Migrations run before the container is fully booted (e.g. during a CLI
 * install), so the settings table is read/written directly rather than
 * resolving the settings repository.
 */
return [
	'up' => function (Builder $schema) {
		$connection = $schema->getConnection();

		$prefix = 'glowingblue-password-strength';
		$colorKeys = ['weakColor', 'mediumColor', 'strongColor'];

		foreach ($colorKeys as $key) {
			$value = $connection->table('settings')->where('key', "$prefix.$key")->value('value');

			if ($value === null) {
				continue;
			}

			if (! preg_match('/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/', $value, $matches)) {
				// Not an RGB triple (already hex or otherwise) — leave it alone.
				continue;
			}

			[$r, $g, $b] = [(int) $matches[1], (int) $matches[2], (int) $matches[3]];

			if ($r > 255 || $g > 255 || $b > 255) {
				// Out of range — not a valid colour, leave it for the admin to fix.
				continue;
			}

			$hex = sprintf('#%02x%02x%02x', $r, $g, $b);

			$connection->table('settings')
				->where('key', "$prefix.$key")
				->update(['value' => $hex]);
		}
	},
	'down' => function (Builder $schema) {
		$connection = $schema->getConnection();

		$prefix = 'glowingblue-password-strength';
		$colorKeys = ['weakColor', 'mediumColor', 'strongColor'];

		foreach ($colorKeys as $key) {
			$value = $connection->table('settings')->where('key', "$prefix.$key")->value('value');

			if ($value === null || ! preg_match('/^#([0-9a-f]{6})$/i', $value, $matches)) {
				continue;
			}

			$rgb = sscanf($matches[1], '%02x%02x%02x');

			$connection->table('settings')
				->where('key', "$prefix.$key")
				->update(['value' => implode(',', $rgb)]);
		}
	},
];
