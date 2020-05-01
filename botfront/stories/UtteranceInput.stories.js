import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import {
    withKnobs, text, select, boolean,
} from '@storybook/addon-knobs';
import UtteranceInput from '../imports/ui/components/utils/UtteranceInput';


import {i18n} from 'meteor/universe:i18n';

function UtteranceInputWrapped(props) {
    const [utterance, setUtterance] = useState('');
    return (
        <UtteranceInput {...props} value={utterance} onChange={setUtterance} />
    );
}

storiesOf('UtteranceInput', module)
    .addDecorator(withKnobs)
    .add('with props', () => (
        <UtteranceInputWrapped
            placeholder={text('placeholder', i18n.__('user_say'))}
            size={select(
                'size',
                ['mini', 'small', 'medium', 'large', 'big', 'huge', 'massive'],
                'small',
            )}
            fluid={boolean('fluid', false)}
        />
    ));
