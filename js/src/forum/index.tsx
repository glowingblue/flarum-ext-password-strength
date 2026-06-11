/*
 * This file is part of glowingblue/password-strength.
 *
 * Copyright (c) 2024 Glowing Blue AG.
 * Authors: Davide Iadeluca, Ian Morland, hasan-ozbey, iPurpl3x, the-turk.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import type ItemList from 'flarum/common/utils/ItemList';
import { slug } from '../common';
import LogInPasswordField from './components/LogInPasswordField';
import SignUpPasswordField from './components/SignUpPasswordField';

type PasswordModal = {
	showingPassword: Stream<boolean>;
	password: Stream<string>;
	confirmPassword?: Stream<string>;
	loading: boolean;
	attrs: { token?: string };
	oninit(...args: any[]): void;
	fields(...args: any[]): ItemList<Mithril.Children>;
};

app.initializers.add(slug, () => {
	function extendOninit(this: PasswordModal) {
		this.showingPassword = new Stream(false);
	}
	extend('flarum/forum/components/LogInModal', 'oninit', extendOninit);
	extend('flarum/forum/components/SignUpModal', 'oninit', extendOninit);

	extend('flarum/forum/components/LogInModal', 'fields', function (this: PasswordModal, items: ItemList<Mithril.Children>) {
		if (app.forum.attribute(`${slug}.enablePasswordToggle`) && items.has('password')) {
			items.setContent('password', <LogInPasswordField parent_this={this} showingPassword={this.showingPassword.bind(this)} />);
		}
	});

	extend('flarum/forum/components/SignUpModal', 'fields', function (this: PasswordModal, items: ItemList<Mithril.Children>) {
		if (!this.attrs.token) {
			const hasConfirmFiled = items.has('nearataConfirmPassword') && this.confirmPassword !== undefined;

			items.setContent(
				'password',
				<SignUpPasswordField parent_this={this} showingPassword={this.showingPassword.bind(this)} hasConfirmFiled={hasConfirmFiled} />
			);

			if (hasConfirmFiled) {
				items.setContent(
					'nearataConfirmPassword',
					<SignUpPasswordField
						parent_this={this}
						showingPassword={this.showingPassword.bind(this)}
						hasConfirmFiled={hasConfirmFiled}
						isConfirmFiled={true}
					/>
				);
			}
		}
	});
});
