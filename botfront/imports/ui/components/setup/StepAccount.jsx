import React from 'react';

import {
    AutoForm, AutoField, ErrorsField, SubmitField,
} from 'uniforms-semantic';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { accountSetupSchema } from '../../../api/setup';

import {i18n} from 'meteor/universe:i18n';

// eslint-disable-next-line react/prefer-stateless-function
class StepAccountComponent extends React.Component {
    render() {
        const { onSubmit, data } = this.props;
        const bridge = new SimpleSchema2Bridge(accountSetupSchema);
        return (
            <AutoForm model={data} schema={bridge} onSubmit={onSubmit}>
                <AutoField name='firstName' placeholder={i18n.__('Your first name')} label={null} />
                <AutoField name='lastName' placeholder={i18n.__('your_last_name')} label={null} />
                <AutoField name='email' placeholder={i18n.__('your_email')} label={null} />
                <AutoField
                    name='password'
                    placeholder={i18n.__('choose_password')}
                    label={null}
                    type='password'
                />
                <AutoField
                    name='passwordVerify'
                    placeholder={i18n.__('confirm_password')}
                    label={null}
                    type='password'
                />
                <br />
                <ErrorsField />
                <div style={{ textAlign: 'center' }}>
                    <SubmitField
                        data-cy='account-create-button'
                        value={i18n.__('continue')}
                        className='primary'
                    />
                </div>
            </AutoForm>
        );
    }
}

StepAccountComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object,
};

StepAccountComponent.defaultProps = {
    data: undefined,
};

export default StepAccountComponent;
