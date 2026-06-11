/*
 * This file is part of glowingblue/password-strength.
 *
 * Copyright (c) 2021 Rafael Horvat.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

import Component, { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import type Mithril from 'mithril';
import type Stream from 'flarum/common/utils/Stream';

export interface EyeButtonAttrs extends ComponentAttrs {
	showing: Stream<boolean>;
}

export default class EyeButton extends Component<EyeButtonAttrs> {
	view(): Mithril.Children {
		const { showing } = this.attrs;
		return (
			<span className="EyeButton" onclick={() => showing(!showing())}>
				<Icon name={`fas fa-eye${showing() ? '-slash' : ''}`} />
			</span>
		);
	}
}
