import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface StrengthIndicatorAttrs extends ComponentAttrs {
    score?: number;
    label: string;
    color?: string;
}
export default class StrengthIndicator extends Component<StrengthIndicatorAttrs> {
    view(): Mithril.Children;
    isPillActive(key: string): boolean;
}
