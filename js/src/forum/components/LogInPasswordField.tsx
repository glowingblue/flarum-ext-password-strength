/*
 * This file is part of glowingblue/password-strength.
 *
 * Copyright (c) 2021 Rafael Horvat.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';
import type Stream from 'flarum/common/utils/Stream';
import EyeButton from './EyeButton';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);

export interface LogInPasswordFieldAttrs extends ComponentAttrs {
	parent_this: {
		password: Stream<string>;
		loading: boolean;
	};
	showingPassword: Stream<boolean>;
}

export default class LogInPasswordField extends Component<LogInPasswordFieldAttrs> {
	view(): Mithril.Children {
		const { parent_this, showingPassword } = this.attrs;

		const passwordLabel = extractText(t('core.forum.log_in.password_placeholder'));

		return (
			// This replaces the `password` field rendered by core's `LogInModal`
			// (flarum/forum/components/LogInModal#fields). Keep the input's
			// attributes in sync with core; the only additions are the `togglable`
			// class, the visibility-aware `type`, and the EyeButton.
			<div className="Form-group PasswordField">
				<input
					className="FormControl togglable"
					name="password"
					type={showingPassword() ? 'text' : 'password'}
					autocomplete="current-password"
					placeholder={passwordLabel}
					aria-label={passwordLabel}
					bidi={parent_this.password}
					disabled={parent_this.loading}
				/>
				<EyeButton showing={showingPassword} />
			</div>
		);
	}
}
