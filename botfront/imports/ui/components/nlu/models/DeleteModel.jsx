import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, Confirm, Icon, Message, Tab,
} from 'semantic-ui-react';
import 'brace/mode/json';
import 'brace/theme/github';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { getTrainingDataInRasaFormat } from '../../../../api/instances/instances.methods';

import i18n from 'meteor/universe:i18n';


export default class DeleteModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            backupDownloaded: false,
            confirmOpen: false,
        };
    }

    onCancel = () => {
        this.setState(this.getInitialState());
    };

    onConfirm = () => {
        const { onDeleteModel } = this.props;
        onDeleteModel();
    };

    downloadModelData = () => {
        if (window.Cypress) {
            this.setState({ backupDownloaded: true });
            return;
        }
        const { model } = this.props;
        const data = JSON.stringify(getTrainingDataInRasaFormat(model, true, []), null, 2);
        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        const filename = `${model.name.toLowerCase()}-${moment().toISOString()}.json`;
        saveAs(blob, filename);
        this.setState({ backupDownloaded: true });
    };

    renderCannotDeleteMessage = (cannotDelete) => {
        const { language } = this.props;
        if (!cannotDelete) {
            return (
                <Message
                    header={i18n.__('cant_delete_default_lang_header')}
                    icon='warning'
                    content={i18n.__('cant_delete_default_lang_content')}
                    warning
                />
            );
        }
        return (
            <Message
                negative
                header={i18n.__('delete_of_a_model_lang_data', [language])}
                icon='warning circle'
                content={i18n.__('download_backup_before_proceding')}
            />
        );
    }


    render() {
        const { backupDownloaded, confirmOpen } = this.state;
        const { model, cannotDelete, language } = this.props;
        return (
            <Tab.Pane>
                <Confirm
                    open={confirmOpen}
                    header={i18n.__('ask_delete_of_a_model_lang_data', [language, model.training_data.common_examples.length])}
                    content={i18n.__('cant_undone')}
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}
                />
                {!backupDownloaded && (
                    <div>
                        {this.renderCannotDeleteMessage(cannotDelete)}
                        <br />
                        <Button positive onClick={this.downloadModelData} className='dowload-model-backup-button' data-cy='download-backup'>
                            <Icon name='download' />
                            Backup {language} data of your model
                        </Button>
                    </div>
                )}
                {backupDownloaded && <Message success icon='check circle' content='Backup downloaded' />}
                <br />
                <br />
                {cannotDelete && (
                    <Button
                        className='delete-model-button'
                        type='submit'
                        onClick={() => this.setState({ confirmOpen: true })}
                        negative
                        disabled={!backupDownloaded || !cannotDelete}
                    >
                        <Icon name='trash' />
                        Delete <strong>{language}</strong> data from your model
                    </Button>
                )}
            </Tab.Pane>
        );
    }
}

DeleteModel.propTypes = {
    model: PropTypes.object.isRequired,
    onDeleteModel: PropTypes.func.isRequired,
    cannotDelete: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired,
};
