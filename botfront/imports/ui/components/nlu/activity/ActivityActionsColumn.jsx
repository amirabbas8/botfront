import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import IconButton from '../../common/IconButton';

import {i18n} from 'meteor/universe:i18n';


export default function ActivityActionsColumn(props) {
    const {
        datum,
        onToggleValidation,
        onDelete,
    } = props;

    const size = 'small';
    let action;
    if (!!datum.validated) {
        action = (
            <IconButton
                size={size}
                onClick={() => onToggleValidation(datum)}
                color='green'
                icon='check'
                data-cy='valid-utterance-button'
            />
        );
    } else {
        action = (
            <Popup
                size='mini'
                inverted
                content={i18n.__('mark_utterance_valid')}
                trigger={(
                    <IconButton
                        basic
                        size={size}
                        disabled={!datum.intent}
                        onClick={() => onToggleValidation(datum)}
                        color='green'
                        icon='check'
                        data-cy='invalid-utterance-button'
                    />
                )}
            />
        );
    }

    return (
        <div key={`${datum._id}-actions`} className='side-by-side narrow right'>
            {action}
            <IconButton
                onClick={() => onDelete([datum])}
                color='grey'
                icon='trash'
                data-cy='trash icon-trash'
            />
        </div>
    );
}

ActivityActionsColumn.propTypes = {
    datum: PropTypes.object.isRequired,
    onToggleValidation: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

ActivityActionsColumn.defaultProps = {};
