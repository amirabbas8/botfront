/* THIS FILE SHOULD NOT BE EDITED ON EE */
import React from 'react';
import {
    AutoForm,
} from 'uniforms-semantic';
import ToggleField from '../common/ToggleField';
import SelectField from '../form_fields/SelectField';

import i18n from 'meteor/universe:i18n';


// force open affect force close and vice versa
export class AutoFormMetadata extends AutoForm {
    onChange(key, value) {
        if (key === 'forceOpen') {
            super.onChange('forceOpen', value);
            if (value) super.onChange('forceClose', false);
            return;
        }
        if (key === 'forceClose') {
            super.onChange('forceClose', value);
            if (value) super.onChange('forceOpen', false);
            return;
        }
        super.onChange(key, value);
    }
}


export const basicSchemaString = `
        type ResponseMetadata {
            linkTarget: String!
            userInput:  String!
            forceOpen: Boolean!
            forceClose: Boolean!
        }`;

export const defaultModel = {
    linkTarget: '_blank',
    userInput: 'show',
    forceOpen: false,
    forceClose: false,
};

export const schemaData = {
    linkTarget: {
        label: i18n.__('where_open_link'),
        defaultValue: '_blank',
        allowedValues: ['_blank', '_self'],
        options: [
            { text: i18n.__('in_current_Tab'), value: '_self' },
            { text: i18n.__('in_new_tab'), value: '_blank' },
        ],
    },
    userInput: {
        label: i18n.__('how_to_render_input_field'),
        defaultValue: 'show',
        allowedValues: ['show', 'hide', 'disable'],
        options: [
            { text: i18n.__('show'), value: 'show' },
            { text: i18n.__('hide'), value: 'hide' },
            { text: i18n.__('disable'), value: 'disable' },
        ],
    },
    forceOpen: {
        label: i18n.__('force_chat_widget_open'),
        defaultValue: false,
    },
    forceClose: {
        label: i18n.__('force_chat_widget_close'),
        defaultValue: false,
    },
};

export const panes = [
    {
        menuItem: 'General',
        render: () => (
            <>
                <SelectField name='linkTarget' data-cy='links-target' />
                <SelectField name='userInput' />
                <ToggleField
                    name='forceOpen'
                    className='toggle'
                    data-cy='toggle-force-open'
                />
                <ToggleField
                    name='forceClose'
                    className='toggle'
                />
            </>
        ),
    },
];
