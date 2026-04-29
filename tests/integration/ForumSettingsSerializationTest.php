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

		$this->assertSame('rgb(255,129,128)', $attributes['psWeakColor']);
		$this->assertSame('rgb(249,197,117)', $attributes['psMediumColor']);
		$this->assertSame('rgb(111,199,164)', $attributes['psStrongColor']);
		$this->assertFalse($attributes['psEnableInputColor']);
		$this->assertTrue($attributes['psEnableInputBorderColor']);
		$this->assertTrue($attributes['psEnablePasswordToggle']);
	}

	public function test_forum_payload_uses_custom_password_strength_settings(): void
	{
		$this->setting('glowingblue-password-strength.weakColor', '1,2,3');
		$this->setting('glowingblue-password-strength.mediumColor', '4,5,6');
		$this->setting('glowingblue-password-strength.strongColor', '7,8,9');
		$this->setting('glowingblue-password-strength.enableInputColor', true);
		$this->setting('glowingblue-password-strength.enableInputBorderColor', false);
		$this->setting('glowingblue-password-strength.enablePasswordToggle', false);

		$response = $this->send($this->request('GET', '/api'));

		$this->assertEquals(200, $response->getStatusCode());

		$attributes = $this->forumAttributes($response);

		$this->assertSame('rgb(1,2,3)', $attributes['psWeakColor']);
		$this->assertSame('rgb(4,5,6)', $attributes['psMediumColor']);
		$this->assertSame('rgb(7,8,9)', $attributes['psStrongColor']);
		$this->assertTrue($attributes['psEnableInputColor']);
		$this->assertFalse($attributes['psEnableInputBorderColor']);
		$this->assertFalse($attributes['psEnablePasswordToggle']);
	}

	public function test_migration_sets_default_password_strength_settings(): void
	{
		$this->assertSame('255,129,128', $this->settingValue('glowingblue-password-strength.weakColor'));
		$this->assertSame('249,197,117', $this->settingValue('glowingblue-password-strength.mediumColor'));
		$this->assertSame('111,199,164', $this->settingValue('glowingblue-password-strength.strongColor'));
		$this->assertSame('0', $this->settingValue('glowingblue-password-strength.enableInputColor'));
		$this->assertSame('1', $this->settingValue('glowingblue-password-strength.enableInputBorderColor'));
		$this->assertSame('1', $this->settingValue('glowingblue-password-strength.enablePasswordToggle'));
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
