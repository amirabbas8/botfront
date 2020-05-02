import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router';

import {i18n} from 'meteor/universe:i18n';

export default () => (
    <div style={{ textAlign: 'center' }}>
        <Header as='h1' content={i18n.__('welcome_to') + i18n.__('app_name')} className='setup-welcome-header' />
        <br />
        <span className='step-text'>{i18n.__('lets_get_know')}</span>
        <br />
        <br />
        <br />
        <br />
        <Link to='/setup/account'><Button data-cy='start-setup' size='big' primary content={i18n.__('lets_get_started')} /></Link>
    </div>
);
