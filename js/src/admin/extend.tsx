import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import { slug } from '../common';

// Make translation calls shorter
const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.admin.settings`;

export default [
	new Extend.Admin()
		.customSetting(() => (
			<div className="Form-group">
				<label className="psHeading">{t(`${prfx}.colorOptions`)}</label>
			</div>
		))
		.setting(() => ({
			setting: `${slug}.weakColor`,
			type: 'color-preview',
			label: t(`${prfx}.weakColorHex`),
			help: t(`${prfx}.weakColorHex_help`),
		}))
		.setting(() => ({
			setting: `${slug}.mediumColor`,
			type: 'color-preview',
			label: t(`${prfx}.mediumColorHex`),
			help: t(`${prfx}.mediumColorHex_help`),
		}))
		.setting(() => ({
			setting: `${slug}.strongColor`,
			type: 'color-preview',
			label: t(`${prfx}.strongColorHex`),
			help: t(`${prfx}.strongColorHex_help`),
		}))
		.customSetting(() => (
			<div className="Form-group">
				<label className="psHeading">{t(`${prfx}.otherOptions`)}</label>
			</div>
		))
		.setting(() => ({
			setting: `${slug}.enableInputColor`,
			type: 'boolean',
			label: t(`${prfx}.enableInputColor`),
			help: t(`${prfx}.enableInputColor_help`),
		}))
		.setting(() => ({
			setting: `${slug}.enableInputBorderColor`,
			type: 'boolean',
			label: t(`${prfx}.enableInputBorderColor`),
			help: t(`${prfx}.enableInputBorderColor_help`),
		}))
		.setting(() => ({
			setting: `${slug}.enablePasswordToggle`,
			type: 'boolean',
			label: t(`${prfx}.enablePasswordToggle`),
			help: t(`${prfx}.enablePasswordToggle_help`),
		})),
];
