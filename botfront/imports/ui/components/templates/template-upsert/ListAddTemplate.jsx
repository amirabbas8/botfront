/* eslint-disable react/prop-types */
import React from 'react';
import connectField from 'uniforms/connectField';
import { Dropdown, Button } from 'semantic-ui-react';
import yamljs from 'js-yaml';
import cloneDeep from 'lodash/cloneDeep';
import { examples } from './templateExamples';

import {i18n} from 'meteor/universe:i18n';

const messageTypesOptions = [
    { value: 0, text: i18n.__('Text') },
    { value: 1, text: i18n.__('Text with buttons (quick replies)') },
    { value: 2, text: i18n.__('Image') },
    { value: 3, text: i18n.__('Button template') },
    { value: 4, text: i18n.__('Generic template') },
    { value: 5, text: i18n.__('List template') },
    { value: 6, text: i18n.__('Messenger Handoff') },
    // { value: 6, text: 'Carousel (deprecated)' },
];

const insert = (array, index, value) => {
    const arr2 = cloneDeep(array);
    arr2.splice(index, 0, value);
    return arr2;
};

function getExample(index) {
    return { content: yamljs.safeDump(examples[index]) };
}

const ListAddTemplate = ({
    className,
    disabled,
    parent,
    value,
    ...props
}) => {
    const { insert: isInsert, name } = props;
    const index = name.split(/[.]+/).pop();
    const limitNotReached = !disabled && !(parent.maxCount <= parent.value.length);
    const handleChange = (e, data) => {
        if (isInsert) {
            return limitNotReached && parent.onChange(insert(parent.value, index, getExample(data.value)));
        }
        return limitNotReached && parent.onChange(parent.value.concat([{ content: yamljs.safeDump(examples[data.value]) }]));
    };
    const indexClassName = `response-message-${isInsert ? index : 'next'}`;

    return (
        <Button.Group size='big'>
            <Dropdown
                basic
                size='big'
                icon='add'
                disabled={!limitNotReached}
                button
                className={`icon ${indexClassName} sequence-add-message`}
            >
                <Dropdown.Menu>
                    <Dropdown.Header content={i18n.__('Choose a message template')} className='sequence-add-message-menu-header' />
                    {messageTypesOptions.map(option => <Dropdown.Item key={option.value} onClick={handleChange} {...option} />)}
                </Dropdown.Menu>
            </Dropdown>
        </Button.Group>
    );
};

export default connectField(ListAddTemplate, { includeParent: true, initialValue: false });
