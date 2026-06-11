<?php

namespace GlowingBlue\PasswordStrength\Tests\integration;

use Flarum\Testing\integration\TestCase;

class ForumSettingsSerializationTest extends TestCase
{
	protected function setUp(): void
	{
		parent::setUp();

		$this->extension('glowingblue-password-strength');
	}

	public function test_forum_payload_uses_default_password_strength_settings(): void
	{
		$response = $this->send($this->request('GET', '/api'));

		$this->assertEquals(200, $response->getStatusCode());

		$attributes = $this->forumAttributes($response);

		$this->assertSame('#ff8180', $attributes['glowingblue-password-strength.weakColor']);
		$this->assertSame('#f9c575', $attributes['glowingblue-password-strength.mediumColor']);
		$this->assertSame('#6fc7a4', $attributes['glowingblue-password-strength.strongColor']);
		$this->assertFalse($attributes['glowingblue-password-strength.enableInputColor']);
		$this->assertTrue($attributes['glowingblue-password-strength.enableInputBorderColor']);
		$this->assertTrue($attributes['glowingblue-password-strength.enablePasswordToggle']);
	}

	public function test_forum_payload_uses_custom_password_strength_settings(): void
	{
		$this->setting('glowingblue-password-strength.weakColor', '#010203');
		$this->setting('glowingblue-password-strength.mediumColor', '#040506');
		$this->setting('glowingblue-password-strength.strongColor', '#070809');
		$this->setting('glowingblue-password-strength.enableInputColor', true);
		$this->setting('glowingblue-password-strength.enableInputBorderColor', false);
		$this->setting('glowingblue-password-strength.enablePasswordToggle', false);

		$response = $this->send($this->request('GET', '/api'));

		$this->assertEquals(200, $response->getStatusCode());

		$attributes = $this->forumAttributes($response);

		$this->assertSame('#010203', $attributes['glowingblue-password-strength.weakColor']);
		$this->assertSame('#040506', $attributes['glowingblue-password-strength.mediumColor']);
		$this->assertSame('#070809', $attributes['glowingblue-password-strength.strongColor']);
		$this->assertTrue($attributes['glowingblue-password-strength.enableInputColor']);
		$this->assertFalse($attributes['glowingblue-password-strength.enableInputBorderColor']);
		$this->assertFalse($attributes['glowingblue-password-strength.enablePasswordToggle']);
	}

	public function test_migration_does_not_persist_defaults_on_fresh_install(): void
	{
		// Defaults are provided at read time via Extend\Settings()->default(),
		// so the migration must not persist any rows on a fresh install where no
		// old-namespace settings exist.
		$this->assertNull($this->settingValue('glowingblue-password-strength.weakColor'));
		$this->assertNull($this->settingValue('glowingblue-password-strength.mediumColor'));
		$this->assertNull($this->settingValue('glowingblue-password-strength.strongColor'));
		$this->assertNull($this->settingValue('glowingblue-password-strength.enableInputColor'));
		$this->assertNull($this->settingValue('glowingblue-password-strength.enableInputBorderColor'));
		$this->assertNull($this->settingValue('glowingblue-password-strength.enablePasswordToggle'));
	}

	public function test_color_format_migration_converts_rgb_triples_to_hex(): void
	{
		// Simulate an upgrade from a version that stored colours as RGB triples
		// by writing those values directly, then re-running the migration's `up`
		// closure against the live connection.
		$this->database()->table('settings')->insert([
			['key' => 'glowingblue-password-strength.weakColor', 'value' => '255,129,128'],
			['key' => 'glowingblue-password-strength.mediumColor', 'value' => '249,197,117'],
			['key' => 'glowingblue-password-strength.strongColor', 'value' => '111, 199 ,164'],
		]);

		$this->runColorFormatMigration('up');

		$this->assertSame('#ff8180', $this->settingValue('glowingblue-password-strength.weakColor'));
		$this->assertSame('#f9c575', $this->settingValue('glowingblue-password-strength.mediumColor'));
		// Whitespace around the components is tolerated.
		$this->assertSame('#6fc7a4', $this->settingValue('glowingblue-password-strength.strongColor'));
	}

	public function test_color_format_migration_leaves_hex_values_untouched(): void
	{
		// Values that are already hex (e.g. a fresh install that never stored an
		// RGB triple) must be left exactly as-is.
		$this->database()->table('settings')->insert([
			['key' => 'glowingblue-password-strength.weakColor', 'value' => '#abcdef'],
		]);

		$this->runColorFormatMigration('up');

		$this->assertSame('#abcdef', $this->settingValue('glowingblue-password-strength.weakColor'));
	}

	public function test_color_format_migration_down_reverts_hex_to_rgb(): void
	{
		$this->database()->table('settings')->insert([
			['key' => 'glowingblue-password-strength.weakColor', 'value' => '#ff8180'],
		]);

		$this->runColorFormatMigration('down');

		$this->assertSame('255,129,128', $this->settingValue('glowingblue-password-strength.weakColor'));
	}

	protected function runColorFormatMigration(string $direction): void
	{
		$migration = require __DIR__ . '/../../migrations/2026_06_11_000000_convert_colors_to_hex.php';

		$migration[$direction]($this->database()->getSchemaBuilder());
	}

	protected function forumAttributes($response): array
	{
		$body = json_decode((string) $response->getBody(), true);

		$this->assertIsArray($body);
		$this->assertArrayHasKey('data', $body);
		$this->assertArrayHasKey('attributes', $body['data']);

		return $body['data']['attributes'];
	}

	protected function settingValue(string $key): ?string
	{
		return $this->database()->table('settings')->where('key', $key)->value('value');
	}
}
