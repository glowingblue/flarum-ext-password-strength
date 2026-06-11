/*
 * This file is part of glowingblue/password-strength.
 *
 * Copyright (c) 2021 Rafael Horvat.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';

export interface StrengthIndicatorAttrs extends ComponentAttrs {
	score?: number;
	label: string;
	color?: string;
}

interface StrengthPillAttrs extends ComponentAttrs {
	color?: string;
	active: boolean;
}

export default class StrengthIndicator extends Component<StrengthIndicatorAttrs> {
	view(): Mithril.Children {
		const { label, color } = this.attrs;
		return (
			<div className={`StrengthIndicator ${label ? 'active' : ''}`}>
				<div className="StrengthIndicator-container">
					<div className="StrengthIndicator-pills">
						{['weak', 'medium', 'strong'].map((key) => (
							<StrengthPill color={color} active={this.isPillActive(key)} />
						))}
					</div>
					<div className="StrengthIndicator-label">
						<span>{label}</span>
					</div>
				</div>
			</div>
		);
	}

	isPillActive(key: string): boolean {
		const { score } = this.attrs;
		switch (key) {
			case 'weak':
				if (Number.isInteger(score)) {
					return true;
				}
			case 'medium':
				if (score !== undefined && score >= 2) {
					return true;
				}
			case 'strong':
				if (score !== undefined && score >= 4) {
					return true;
				}

			default:
				return false;
		}
	}
}

class StrengthPill extends Component<StrengthPillAttrs> {
	view(): Mithril.Children {
		const { color, active } = this.attrs;
		const backgroundColor = active ? color : undefined;
		return <div className="StrengthPill" style={{ backgroundColor }}></div>;
	}
}
