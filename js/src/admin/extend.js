import app from 'flarum/admin/app';
import Icon from 'flarum/common/components/Icon';
import Extend from 'flarum/common/extenders';
import { slug } from '../common';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.admin.settings`;

export default [
  new Extend.Admin()
    .setting(() => (
      <div className="Form-group">
        <label className="psHeading">{t(`${prfx}.colorOptions`)}</label>
        <div className="helpText psHelpText">
          <Icon name="fas fa-exclamation-circle" />
          <span>{t(`${prfx}.colorHelp`)}</span>
        </div>
      </div>
    ))
    .setting(() => ({
      setting: `${slug}.weakColor`,
      type: 'text',
      label: t(`${prfx}.weakColor`),
    }))
    .setting(() => ({
      setting: `${slug}.mediumColor`,
      type: 'text',
      label: t(`${prfx}.mediumColor`),
    }))
    .setting(() => ({
      setting: `${slug}.strongColor`,
      type: 'text',
      label: t(`${prfx}.strongColor`),
    }))
    .setting(() => (
      <div className="Form-group">
        <label className="psHeading">{t(`${prfx}.otherOptions`)}</label>
      </div>
    ))
    .setting(() => ({
      setting: `${slug}.enableInputColor`,
      type: 'boolean',
      label: t(`${prfx}.enableInputColor`),
    }))
    .setting(() => ({
      setting: `${slug}.enableInputBorderColor`,
      type: 'boolean',
      label: t(`${prfx}.enableInputBorderColor`),
    }))
    .setting(() => ({
      setting: `${slug}.enablePasswordToggle`,
      type: 'boolean',
      label: t(`${prfx}.enablePasswordToggle`),
    })),
];
