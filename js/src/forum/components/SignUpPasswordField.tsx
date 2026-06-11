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
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import type { ZxcvbnFactory } from '@zxcvbn-ts/core';
import type Mithril from 'mithril';
import EyeButton from './EyeButton';
import StrengthIndicator from './StrengthIndicator';
import { slug } from '../../common';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.strengthLabels`;
// Make settings accessible easier
const settings = <T = unknown,>(key: string): T => app.forum.attribute<T>(`${slug}.${key}`);

// The estimator bundles a large dictionary, so it is code-split into its own
// chunk and only fetched the first time a user types a password. The import
// promise is cached module-wide so the chunk is downloaded and the factory
// built at most once across all field instances.
let estimatorPromise: Promise<ZxcvbnFactory> | null = null;
function loadEstimator(): Promise<ZxcvbnFactory> {
	return (estimatorPromise ??= import('../estimator').then(({ default: zxcvbn }) => zxcvbn));
}

export interface SignUpPasswordFieldAttrs extends ComponentAttrs {
	parent_this: {
		password: Stream<string>;
		confirmPassword: Stream<string>;
		loading: boolean;
	};
	showingPassword: Stream<boolean>;
	hasConfirmFiled?: boolean;
	isConfirmFiled?: boolean;
}

export default class SignUpPasswordField extends Component<SignUpPasswordFieldAttrs> {
	strengthLabel!: Stream<string>;
	passwordScore!: Stream<number | undefined>;
	strengthColor!: Stream<string | undefined>;

	oninit(vnode: Mithril.Vnode<SignUpPasswordFieldAttrs, this>) {
		super.oninit(vnode);

		this.strengthLabel = new Stream('');
		this.passwordScore = new Stream<number | undefined>(undefined);
		this.strengthColor = new Stream<string | undefined>('');
	}

	view(): Mithril.Children {
		const { parent_this, showingPassword, hasConfirmFiled, isConfirmFiled } = this.attrs;

		const fieldLabel = isConfirmFiled
			? extractText(t('nearata-signup-confirm-password.forum.field_placeholder'))
			: extractText(t('core.forum.sign_up.password_placeholder'));

		return (
			// This replaces the `password` field rendered by core's `SignUpModal`
			// (flarum/forum/components/SignUpModal#fields), and nearata's
			// `nearataConfirmPassword` field. Keep the label/input attributes in
			// sync with core; the additions are the `togglable` class, the
			// visibility-aware `type`, strength-based styling, the EyeButton and
			// the StrengthIndicator.
			<div className="Form-group PasswordField">
				<label className="label">{fieldLabel}</label>
				<input
					className={`FormControl ${settings('enablePasswordToggle') ? 'togglable' : ''}`}
					name={isConfirmFiled ? 'confirmPassword' : 'password'}
					type={showingPassword() ? 'text' : 'password'}
					autocomplete="new-password"
					placeholder={fieldLabel}
					aria-label={fieldLabel}
					value={isConfirmFiled ? parent_this.confirmPassword() : parent_this.password()}
					disabled={parent_this.loading}
					oninput={this.inputHandler.bind(this)}
					style={{
						color:
							settings<boolean>('enableInputColor') && !showingPassword() && (!hasConfirmFiled || isConfirmFiled) ? this.strengthColor() : undefined,
						borderColor: settings<boolean>('enableInputBorderColor') && (!hasConfirmFiled || isConfirmFiled) ? this.strengthColor() : undefined,
					}}
				/>
				{settings<boolean>('enablePasswordToggle') ? <EyeButton showing={showingPassword} /> : null}
				{!hasConfirmFiled || isConfirmFiled ? (
					<StrengthIndicator score={this.passwordScore()} label={this.strengthLabel()} color={this.strengthColor()} />
				) : null}
			</div>
		);
	}

	inputHandler(e: InputEvent): void {
		const { parent_this, isConfirmFiled } = this.attrs;

		const password = (e.target as HTMLInputElement).value;

		if (isConfirmFiled) {
			parent_this.confirmPassword(password);
		} else {
			parent_this.password(password);
		}

		if (!password) {
			this.passwordScore(undefined);
			this.strengthLabel('');
			this.strengthColor(undefined);
			return;
		}

		// Scoring requires the code-split estimator chunk. Load it on demand (the
		// promise is cached), then update the indicator and trigger a redraw. We
		// guard against an out-of-order resolution by checking the current value.
		loadEstimator().then((zxcvbn) => {
			const current = isConfirmFiled ? parent_this.confirmPassword() : parent_this.password();
			if (current !== password) {
				return;
			}

			this.applyScore(zxcvbn.check(password).score);
			m.redraw();
		});
	}

	applyScore(score: number): void {
		this.passwordScore(score);

		// Define strength color & label
		switch (score) {
			case 0:
			case 1:
				this.strengthLabel(t(`${prfx}.weak`) as string);
				this.strengthColor(settings<string>('weakColor'));
				break;

			case 2:
			case 3:
				this.strengthLabel(t(`${prfx}.medium`) as string);
				this.strengthColor(settings<string>('mediumColor'));
				break;

			case 4:
				this.strengthLabel(t(`${prfx}.strong`) as string);
				this.strengthColor(settings<string>('strongColor'));
				break;
		}
	}
}
