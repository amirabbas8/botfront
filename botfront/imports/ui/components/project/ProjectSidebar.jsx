/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Menu, Divider } from 'semantic-ui-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Can } from '../../../lib/scopes';
import { Projects } from '../../../api/project/project.collection';
import ProjectsDropdown from './ProjectsDropdown';
import { GlobalSettings } from '../../../api/globalSettings/globalSettings.collection';

import {i18n} from 'meteor/universe:i18n';

const packageJson = require('/package.json');

class ProjectSidebar extends React.Component {
    render() {
        const {
            projectName, projectId, handleChangeProject, settingsReady, settings,
        } = this.props;

        return (
            <DocumentTitle title={projectName}>
                <Menu vertical inverted pointing className='project-menu'>
                    <Menu.Item>
                        <Menu.Header style={{ marginBottom: '20px' }}>{i18n.__('Project')}</Menu.Header>
                        <ProjectsDropdown currentProjectId={projectId} onProjectChange={handleChangeProject} />
                    </Menu.Item>
                    <Link to={`/project/${projectId}/stories`}>
                        <Menu.Item name={i18n.__('stories')} icon='book' data-cy='stories-sidebar-link' />
                    </Link>
                    <Link to={`/project/${projectId}/nlu/models`}>
                        <Menu.Item name={i18n.__('NLU')} icon='grid layout' data-cy='nlu-sidebar-link' />
                    </Link>
                    <Link to={`/project/${projectId}/incoming`}>
                        <Menu.Item name={i18n.__('Incoming')} icon='inbox' data-cy='incoming-sidebar-link' />
                    </Link>
                    <Link to={`/project/${projectId}/dialogue/templates`}>
                        <Menu.Item name={i18n.__('Responses')} icon='comment' />
                    </Link>
                    <Link to={`/project/${projectId}/settings`}>
                        <Menu.Item name={i18n.__('settings')} icon='setting' />
                    </Link>
                    <a href={settingsReady ? settings.settings.public.docUrl : ''} target='_blank' rel='noopener noreferrer'>
                        <Menu.Item name={i18n.__('documentation')} icon='question' />
                    </a>
                    <a href={settingsReady ? 'https://spectrum.chat/botfront' : ''} target='_blank' rel='noopener noreferrer'>
                        <Menu.Item name={i18n.__('help')} icon='bell' content={i18n.__('help')} />
                    </a>
                    <Divider inverted />
                    <Link to='/login'>
                        <Menu.Item data-cy='signout' name={i18n.__('Sign out')} icon='sign-out' />
                    </Link>
                    <span className='force-bottom'>{packageJson.version}</span>
                </Menu>
            </DocumentTitle>
        );
    }
}

ProjectSidebar.propTypes = {
    projectId: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    handleChangeProject: PropTypes.func.isRequired,
    settingsReady: PropTypes.bool.isRequired,
    settings: PropTypes.object,
};

ProjectSidebar.defaultProps = {
    settings: null,
};

const ProjectSidebarContainer = withTracker((props) => {
    const { projectId } = props;
    const settingsHandler = Meteor.subscribe('settings');
    const settings = GlobalSettings.findOne({}, { fields: { 'settings.public.docUrl': 1 } });
    const currentProject = Projects.find({ _id: projectId }).fetch();
    const projectName = currentProject.length > 0 ? `${currentProject[0].name}` : i18n.__('app_name');

    return {
        projectName,
        settingsReady: settingsHandler.ready(),
        settings,
    };
})(ProjectSidebar);

export default ProjectSidebarContainer;
