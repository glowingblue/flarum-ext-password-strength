import Component, { ComponentAttrs } from 'flarum/common/Component';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
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
    strengthLabel: Stream<string>;
    passwordScore: Stream<number | undefined>;
    strengthColor: Stream<string | undefined>;
    oninit(vnode: Mithril.Vnode<SignUpPasswordFieldAttrs, this>): void;
    view(): Mithril.Children;
    inputHandler(e: InputEvent): void;
    applyScore(score: number): void;
}
