import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
import type Stream from 'flarum/common/utils/Stream';
export interface LogInPasswordFieldAttrs extends ComponentAttrs {
    parent_this: {
        password: Stream<string>;
        loading: boolean;
    };
    showingPassword: Stream<boolean>;
}
export default class LogInPasswordField extends Component<LogInPasswordFieldAttrs> {
    view(): Mithril.Children;
}
