import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Confirm, Dropdown, Button, Icon,
} from 'semantic-ui-react';

import {i18n} from 'meteor/universe:i18n';


const confirmations = {
    ADD_TO_TRAINING: i18n.__('confirm_add_to_training'),
    EVALUATE: i18n.__('confirm_evaluate'),
    DELETE: i18n.__('confirm_delete'),
    INVALIDATE: i18n.__('confirm_invalidate'),
};

const actionOptions = [
    { text: i18n.__('add_to_training'), key: 'ADD_TO_TRAINING' },
    { text: i18n.__('delete'), key: 'DELETE' },
    { text: i18n.__('evaluate'), key: 'EVALUATE' },
    { text: i18n.__('invalidate'), key: 'INVALIDATE' },
];

export default function ActivityActions(props) {
    const [selectedAction, setSelectedAction] = useState(null);
    const {
        numValidated, onInvalidate, onAddToTraining, onDelete, onEvaluate,
    } = props;

    const executeAction = (action) => {
        switch (action) {
            case 'INVALIDATE': onInvalidate(); break;
            case 'EVALUATE': onEvaluate(); break;
            case 'ADD_TO_TRAINING': onAddToTraining(); break;
            case 'DELETE': onDelete(); break;
            default: break;
        }
        setSelectedAction(null);
    };

    return (
        <div>
            <Confirm
                open={!!selectedAction}
                header='Please confirm'
                content={confirmations[selectedAction]}
                onCancel={() => setSelectedAction(null)}
                onConfirm={() => executeAction(selectedAction)}
            />
            <Dropdown
                trigger={(
                    <Button
                        className='white'
                        color='green'
                        size='small'
                        basic
                        icon
                        labelPosition='left'
                        data-cy='process-in-bulk'
                    >
                        <Icon name='angle double right' />{i18n.__('process_validated_utterances', [numValidated > 0 ? numValidated : '', numValidated === 1 ? '' : 's'])}
                    </Button>
                )}
                disabled={!numValidated}
                onChange={(e, { value }) => setSelectedAction(value)}
                className='dropdown-button-trigger'
                data-cy='choose-action-dropdown'
            >
                <Dropdown.Menu>
                    {actionOptions.map(o => <Dropdown.Item {...o} onClick={() => setSelectedAction(o.key)} />)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

ActivityActions.propTypes = {
    onInvalidate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEvaluate: PropTypes.func.isRequired,
    onAddToTraining: PropTypes.func.isRequired,
    numValidated: PropTypes.number.isRequired,
};
