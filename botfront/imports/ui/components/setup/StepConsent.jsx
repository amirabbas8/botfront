import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {i18n} from 'meteor/universe:i18n';

// eslint-disable-next-line react/prefer-stateless-function
class StepConsentComponent extends React.Component {
    render() {
        const { onSubmit } = this.props;
        return (
            <>
                <br />
                <br />
                <span className='step-text'>
                    {i18n.__('get_notified_new_releases')}
                </span>
                <br />
                <br />
                <br />
                <span className='legal-text'>
                    {i18n.__('privacy_notice_mailchimp_start')}
                    <br />
                    <a
                        href='https://mailchimp.com/legal/'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {i18n.__('privacy_notice_mailchimp_end')}
                    </a>
                </span>
                <br />
                <br />
                <br />
                <div style={{ textAlign: 'center' }}>
                    <Button
                        data-cy='email-consent'
                        content={i18n.__('yes_finish')}
                        primary
                        size='small'
                        onClick={() => onSubmit(true)}
                    />
                    <Button
                        data-cy='email-refuse'
                        basic
                        size='small'
                        content={i18n.__('maybe_later')}
                        onClick={() => onSubmit(false)}
                    />
                </div>
            </>
        );
    }
}

StepConsentComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default StepConsentComponent;
