import '../../../../lib/dynamic_import';
import {
    Container, Tab, Message, Grid, Menu,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import 'react-s-alert/dist/s-alert-default.css';
import {
    AutoForm, ErrorsField, SubmitField, AutoField,
} from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { GlobalSettings } from '../../../../api/globalSettings/globalSettings.collection';
import AceField from '../../utils/AceField';
import { wrapMeteorCallback } from '../../utils/Errors';
import { PageMenu } from '../../utils/Utils';

import {i18n} from 'meteor/universe:i18n';


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { saving: false };
        this.state = { schema: null };
    }

    async componentDidMount() {
        const orchestrator = await Meteor.callWithPromise('orchestration.type');
        const { GlobalSettingsSchema: schema } = await import(`../../../../api/globalSettings/globalSettings.schema.${orchestrator}`);
        let orchestratorSettingsComponent = null;
        if (orchestrator !== 'default') {
            const { default: def } = await import(`./Settings.${orchestrator}`);
            orchestratorSettingsComponent = def;
        }

        this.setState({ schema, orchestratorSettingsComponent, orchestrator });
    }

    handleReturnToProjectSettings = () => {
        const { router, projectId } = this.props;
        router.push(`/project/${projectId}/settings`);
    }

    onSave = (settings) => {
        this.setState({ saving: true });
        Meteor.call('settings.save', settings, wrapMeteorCallback(() => this.setState({ saving: false }), 'Settings saved'));
    };

    renderSecurityPane = () => (
        <Tab.Pane>
            <Message
                info
                icon='question circle'
                content={(
                    <>
                        If you want to secure your login page with a Catpcha. &nbsp;
                        <a target='_blank' rel='noopener noreferrer' href='https://developers.google.com/recaptcha'>
                            Get your keys here
                        </a>
                        . Only v2 is supported.
                    </>
                )}
            />
            <AutoField name='settings.public.reCatpchaSiteKey' />
            <AutoField name='settings.private.reCatpchaSecretServerKey' />
        </Tab.Pane>
    );

    renderDefaultNLUPipeline = () => (
        <Tab.Pane>
            <Message info icon='question circle' content='Default NLU pipeline for new NLU models' />
            <AceField name='settings.public.defaultNLUConfig' label='' convertYaml />
        </Tab.Pane>
    );

    renderAppearance = () => (
        <Tab.Pane>
            <Message info icon='question circle' content='Login page background images URLs' />
            <AutoField name='settings.public.backgroundImages' />
        </Tab.Pane>
    );

    renderMisc = () => (
        <Tab.Pane>
            <Message info icon='question circle' content='ID of project containing chitchat NLU training data' />
            <AutoField name='settings.public.chitChatProjectId' />
            <AutoField name='settings.public.docUrl' />
        </Tab.Pane>
    );

    getSettingsPanes = () => {
        const { projectId } = this.props;
        const { orchestratorSettingsComponent: OrchestratorSettingsComponent, orchestrator } = this.state;
        let panes = [
            { menuItem: i18n.__('default_nlu_pipeline'), render: this.renderDefaultNLUPipeline },
            { menuItem: i18n.__('security'), render: this.renderSecurityPane },
            { menuItem: i18n.__('appearance'), render: this.renderAppearance },
            { menuItem: i18n.__('misc'), render: this.renderMisc },
        ];

        if (OrchestratorSettingsComponent) {
            panes = panes.concat(OrchestratorSettingsComponent);
        }

        if (projectId) {
            panes = [
                ...panes,
                {
                    menuItem: (
                        <Menu.Item
                            icon='backward'
                            content={i18n.__('project_settings')}
                            key='Project Settings'
                            onClick={this.handleReturnToProjectSettings}
                        />
                    ),
                },
            ];
        }
        return panes;
    };

    renderSettings = (saving, settings, schema) => (
        <>
            <PageMenu icon='setting' title={i18n.__('global_settings')} />
            <Container id='admin-settings' data-cy='admin-settings-menu'>
                <AutoForm schema={new SimpleSchema2Bridge(schema)} model={settings} onSubmit={this.onSave} disabled={saving}>
                    <Tab menu={{ vertical: true }} grid={{ paneWidth: 13, tabWidth: 3 }} panes={this.getSettingsPanes()} />
                    <br />
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3} />
                            <Grid.Column width={13}>
                                <ErrorsField />
                                <SubmitField value={i18n.__('save')} className='primary' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </AutoForm>
            </Container>
        </>
    );

    renderLoading = () => <div />;

    render() {
        const { settings, ready } = this.props;
        const { saving, schema } = this.state;
        if (ready && schema) return this.renderSettings(saving, settings, schema);
        return this.renderLoading();
    }
}

Settings.propTypes = {
    settings: PropTypes.object,
    projectId: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
    ready: PropTypes.bool.isRequired,
};

Settings.defaultProps = {
    settings: {},
};

const SettingsContainer = withTracker((props) => {
    const handler = Meteor.subscribe('settings');
    const settings = GlobalSettings.findOne({ _id: 'SETTINGS' });
    return {
        ready: handler.ready(),
        settings,
        ...props,
    };
})(Settings);

const mapStateToProps = state => ({
    projectId: state.settings.get('projectId'),
});

export default connect(mapStateToProps)(SettingsContainer);
