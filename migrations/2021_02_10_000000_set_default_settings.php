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

return [
	'up' => function (Builder $schema) {
		$connection = $schema->getConnection();

		$prefix = 'glowingblue-password-strength';
		$oldPrefix = 'the-turk-password-strength';

		// Default values are registered via Extend\Settings()->default() in
		// extend.php, so they don't need to be persisted here. This migration
		// only takes over any settings stored under the old namespace, renaming
		// them to the current prefix. Migrations run before the container is
		// fully booted (e.g. during a CLI install), so we read/write the
		// settings table directly rather than resolving the settings repository.
		$keys = [
			'weakColor',
			'mediumColor',
			'strongColor',
			'enableInputColor',
			'enableInputBorderColor',
			'enablePasswordToggle',
		];

		foreach ($keys as $key) {
			$old = $connection->table('settings')->where('key', "$oldPrefix.$key")->value('value');

			if ($old !== null) {
				$connection->table('settings')->updateOrInsert(
					['key' => "$prefix.$key"],
					['value' => $old]
				);
			}
		}

		// Delete potentially existing old settings.
		$connection->table('settings')
			->whereIn('key', array_map(fn ($key) => "$oldPrefix.$key", $keys))
			->delete();
	},
	'down' => function (Builder $schema) {
		$prefix = 'glowingblue-password-strength';

		$schema->getConnection()
			->table('settings')
			->whereIn('key', [
				"$prefix.weakColor",
				"$prefix.mediumColor",
				"$prefix.strongColor",
				"$prefix.enableInputColor",
				"$prefix.enableInputBorderColor",
				"$prefix.enablePasswordToggle",
			])
			->delete();
	},
];
