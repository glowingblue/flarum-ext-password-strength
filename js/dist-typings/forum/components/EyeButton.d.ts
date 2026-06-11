import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import type Stream from 'flarum/common/utils/Stream';
export interface EyeButtonAttrs extends ComponentAttrs {
    showing: Stream<boolean>;
}
export default class EyeButton extends Component<EyeButtonAttrs> {
    view(): Mithril.Children;
}
