import '../../../lib/dynamic_import';
import { Container, Menu, Tab } from 'semantic-ui-react';
import React from 'react';
import 'react-s-alert/dist/s-alert-default.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { PageMenu } from '../utils/Utils';
import Credentials from './Credentials';
import Endpoints from './Endpoints';
import ProjectInfo from './ProjectInfo';
import Instances from './Instances';
import DefaultDomain from './DefaultDomain';
import ImportExportProject from './ImportExportProject';

import i18n from 'meteor/universe:i18n';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = { orchestratorMenuItems: null, orchestrator: null };
    }

    async componentDidMount() {
        const orchestrator = await Meteor.callWithPromise('orchestration.type');
        let orchestratorMenuItems = null;
        if (orchestrator !== 'default') {
            try {
                const { default: def } = await import(`./${orchestrator}/Settings.${orchestrator}`);
                orchestratorMenuItems = def;
            } catch (e) {
                // eslint-disable-next-line no-console
                if (!process.env.production) console.log('this is not displayed in production environment \n', e);
            }
        }

        this.setState({ orchestratorMenuItems, orchestrator });
    }

    handleMoreSettings = () => {
        const { router, projectId } = this.props;
        router.push(`/project/${projectId}/settings/global`);
    }

    getSettingsPanes = () => {
        const { orchestratorMenuItems, orchestrator } = this.state;
        let panes = [
            {
                menuItem: <Menu.Item data-cy='project-settings-menu-info' icon='info' content={i18n.__('project_info')} key='Project Info' />,
                render: () => <Tab.Pane><ProjectInfo /></Tab.Pane>,
            },
            {
                menuItem: <Menu.Item data-cy='project-settings-menu-credentials' icon='key' content={i18n.__('credentials')} key='Credentials' />,
                render: () => <Tab.Pane><Credentials orchestrator={orchestrator} /></Tab.Pane>,
            },
            {
                menuItem: <Menu.Item data-cy='project-settings-menu-endpoints' icon='code' content={i18n.__('endpoints')} key='Endpoints' />,
                render: () => <Tab.Pane><Endpoints orchestrator={orchestrator} /></Tab.Pane>,
            },
            {
                menuItem: <Menu.Item data-cy='project-settings-menu-instances' icon='server' content={i18n.__('instances')} key='Instances' />,
                render: () => <Tab.Pane><Instances /></Tab.Pane>,
            },
            {
                menuItem: <Menu.Item data-cy='project-settings-menu-default-domain' icon='globe' content={i18n.__('default_domain')} key='Default Domain' />,
                render: () => <Tab.Pane><DefaultDomain /></Tab.Pane>,
            },
            {
                menuItem: <Menu.Item data-cy='project-settings-menu-import-export' icon='download' content={i18n.__('import_export')} key='Import/Export' />,
                render: () => <Tab.Pane><ImportExportProject /></Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item
                        data-cy='project-settings-more'
                        icon='ellipsis horizontal'
                        content={i18n.__('more_settings')}
                        key='More Settings'
                        onClick={this.handleMoreSettings}
                    />
                ),
            },
        ];

        if (orchestratorMenuItems) {
            panes = panes.concat(orchestratorMenuItems);
        }
        return panes;
    };

    render() {
        return (
            <>
                <PageMenu title={i18n.__(Settings)} icon='setting' />
                <Container>
                    <Tab menu={{ vertical: true }} grid={{ paneWidth: 12, tabWidth: 4 }} panes={this.getSettingsPanes()} />
                </Container>
            </>
        );
    }
}

Settings.propTypes = {
    projectId: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    projectId: state.settings.get('projectId'),
});

export default connect(mapStateToProps)(Settings);
