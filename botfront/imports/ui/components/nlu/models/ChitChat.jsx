import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import { Meteor } from 'meteor/meteor';
import {
    Dropdown, Confirm, Button,
    Loader, Message, Icon,
} from 'semantic-ui-react';
import 'react-s-alert/dist/s-alert-default.css';

import { wrapMeteorCallback } from '../../utils/Errors';

import i18n from 'meteor/universe:i18n';


export default class ChitChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chitChatIntents: null,
            notConfiguredError: null,
            confirmOpen: false,
            selectedIntents: [],
        };
    }

    componentDidMount() {
        this.loadChitChatIntents();
    }

    handleIntentSelectorChange = (e, { value }) => {
        this.setState({ selectedIntents: value });
    };

    loadChitChatIntents = () => {
        const { model: { language } } = this.props;

        Meteor.call('nlu.getChitChatIntents', language, (e, intents) => {
            if (e) {
                if (e instanceof ReferenceError) {
                    this.setState({ notConfiguredError: e.message });
                } else {
                    Alert.error(i18n.__('cant_fetch_chit_chat', [JSON.stringify(e.reason)]), {
                        position: 'top',
                        timeout: 'none',
                    });
                }
            } else {
                this.setState({ chitChatIntents: intents });
            }
        });
    };

    addToTrainingData = () => {
        const { model: { _id: modelId, language } } = this.props;
        const { selectedIntents } = this.state;
        this.close();

        Meteor.call('nlu.addChitChatToTrainingData', modelId, language, selectedIntents, wrapMeteorCallback(() => {
            this.setState({ selectedIntents: [] });
        }, 'imported chitchat examples to training data.'));
    };

    open = () => this.setState({ confirmOpen: true });

    close = () => this.setState({ confirmOpen: false });

    render() {
        const {
            notConfiguredError, chitChatIntents, confirmOpen, selectedIntents,
        } = this.state;

        return (
            <div className='glow-box extra-padding no-margin'>
                {notConfiguredError && <Message error content={notConfiguredError} />}
                {chitChatIntents && chitChatIntents.length === 0 && <Message info content={i18n.__('chit_caht_not_available_in_model_lang')} />}
                {chitChatIntents && chitChatIntents.length > 0 && (
                    <div className='chitchat' style={{ minHeight: 300 }}>
                        {/* minHeight to make sure there is enough space for the dropdown */}
                        <Message info data-cy='chit-chat-message'>
                            <Icon name='lightbulb' size='small' />
                            {i18n.__('chit_chat_are_pretrained_intents')}
                        </Message>
                        <br />

                        <Dropdown
                            data-cy='select-chit-chat'
                            placeholder='Select chit chat intents'
                            multiple
                            selection
                            fluid
                            value={selectedIntents}
                            search
                            onChange={this.handleIntentSelectorChange}
                            options={chitChatIntents.map(i => ({ text: i, value: i }))}
                        />
                        <br />
                        <br />
                        <Button
                            primary
                            disabled={selectedIntents.length === 0}
                            content={i18n.__('select_chit_chat_intent')}
                            onClick={this.open}
                            data-cy='add-chit-chat'
                        />
                        <Confirm
                            header={i18n.__('ask_add_to_train_data')}
                            content={i18n.__('confirm_add_chit_chat', [selectedIntents.join(' ')])}
                            open={confirmOpen}
                            onCancel={this.close}
                            onConfirm={this.addToTrainingData}
                        />
                    </div>
                )}

                {!chitChatIntents && <Loader active inline='centered' />}
            </div>
        );
    }
}

ChitChat.propTypes = {
    model: PropTypes.object.isRequired,
};
