<?php

namespace GlowingBlue\PasswordStrength\Listeners;

use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;

class LoadSettings
{
	public function __construct(protected SettingsRepositoryInterface $settings)
	{
	}

	public function __invoke(): array
	{
		$settingsPrefix = 'glowingblue-password-strength.';

		return [
			Schema\Str::make('psWeakColor')
				->get(fn () => 'rgb(' . $this->settings->get($settingsPrefix . 'weakColor', '255,129,128') . ')'),
			Schema\Str::make('psMediumColor')
				->get(fn () => 'rgb(' . $this->settings->get($settingsPrefix . 'mediumColor', '249,197,117') . ')'),
			Schema\Str::make('psStrongColor')
				->get(fn () => 'rgb(' . $this->settings->get($settingsPrefix . 'strongColor', '111,199,164') . ')'),
			Schema\Boolean::make('psEnableInputColor')
				->get(fn () => (bool) $this->settings->get($settingsPrefix . 'enableInputColor', false)),
			Schema\Boolean::make('psEnableInputBorderColor')
				->get(fn () => (bool) $this->settings->get($settingsPrefix . 'enableInputBorderColor', true)),
			Schema\Boolean::make('psEnablePasswordToggle')
				->get(fn () => (bool) $this->settings->get($settingsPrefix . 'enablePasswordToggle', true)),
		];
	}
}
