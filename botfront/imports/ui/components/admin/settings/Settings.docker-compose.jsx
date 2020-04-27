import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import InfoField from '../../utils/InfoField';

import i18n from 'meteor/universe:i18n';


export default [
    {
        menuItem: <Menu.Item content='Docker Compose' />,
        render: () => (
            <Tab.Pane>
                <InfoField name='settings.private.bfApiHost' label={i18n.__('app_api_host', [i18n.__('app_name')])} data-cy='docker-api-host' />
                <InfoField name='settings.private.rootUrl' label={i18n.__('app_url', [i18n.__('app_name')])} />
                <InfoField name='settings.private.actionsServerUrl' label={i18n.__('action_url')} />
                <InfoField name='settings.private.rasaUrl' label={i18n.__('rasa_url')} />
            </Tab.Pane>
        ),
    },
];
