import { AutoForm, AutoField, ErrorsField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Button, Header,
} from 'semantic-ui-react';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import { passwordComplexityRegex } from '../../../api/user/user.methods';

import {i18n} from 'meteor/universe:i18n';


const changePasswordSchema = new SimpleSchema(
    {
        password: {
            type: String,
            custom() {
                return !this.value.match(passwordComplexityRegex) ? 'passwordTooSimple' : null;
            },
        },
        passwordVerify: {
            type: String,
            custom() {
                return this.value !== this.field('password').value ? 'passwordMismatch' : null;
            },
        },
    },
    { tracker: Tracker },
);


changePasswordSchema.messageBox.messages({
    en: {
        passwordMismatch: i18n.__('password_mismatch')},
        passwordTooSimple: i18n.__('password_simple'),
    },
});

const changePasswordSchemaBridge = new SimpleSchema2Bridge(this.resetPasswordSchema);

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            password: '',
            passwordConfirm: '',
        };
    }

    handleChange = (e, { value }) => {
        if (e.target.name === 'password') this.setState({ password: value });
        else if (e.target.name === 'passwordConfirm') this.setState({ passwordConfirm: value });
    };

    handleChangePassword = (formData) => {
        const { userId } = this.props;
        const { password, passwordVerify } = formData;
        if (password !== passwordVerify) {
            Alert.error(i18n.__('password_not_match'), {
                position: 'bottom',
                timeout: 2000,
            });
            return;
        }

        Meteor.call('user.changePassword', userId, password, (err) => {
            if (err) {
                Alert.error(i18n.__('error',[err.reason]), {
                    position: 'bottom',
                    timeout: 'none',
                });
            } else {
                this.setState(this.getInitialState());
                Alert.success(i18n.__('password_changed'), {
                    position: 'bottom',
                    timeout: 2000,
                });
            }
        });
    };

    render () {
        return (
            <AutoForm schema={changePasswordSchemaBridge} onSubmit={this.handleChangePassword}>
                <Header>Change Password</Header>
                <AutoField name='password' placeholder={i18n.__('password')} type='password' label={null} />
                <AutoField name='passwordVerify' placeholder={i18n.__('password')} type='password' label={null} />
                <Button data-cy='change-password'>{i18n.__('change')}</Button>
                <ErrorsField />
            </AutoForm>
        );
    }
}

ChangePassword.propTypes = {
    userId: PropTypes.string.isRequired,
};
