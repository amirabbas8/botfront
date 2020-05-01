/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import PropTypes from 'prop-types';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { AutoForm, SubmitField, ErrorsField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { UserEditSchema } from '../../../api/user/user.schema';
import InfoField from '../utils/InfoField';
import { wrapMeteorCallback } from '../utils/Errors';
import SelectField from '../form_fields/SelectField';
import { languages } from '../../../lib/languages';
import { i18n } from 'meteor/universe:i18n';


class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
        };
    }

    getOptions = () => {
        const renderOptions = Object.keys(languages)
            .filter(code =>
                code == 'fa' || code == 'en'
            ).map(code => ({
                text: languages[code].name,
                key: code,
                value: code,
            }));
        return renderOptions;
    };

    diffArray = (array1, array2) => array1.filter(elementArray1 => array2.indexOf(elementArray1) < 0);

    renderLabel = (language, languageCodes) => {
        const isModelExist = languageCodes.includes(language.value);
        const label = {
            color: isModelExist ? 'blue' : 'green',
            content: `${language.text}`,
        };
        if (!isModelExist) return label;
        label.removeIcon = '';
        return label;
    };

    onChange = (e, { value: newValue }) => {
        const { supportedLanguages } = this.state;
        // Check if the supported lanaguages are present in the newValue
        let renderNewValue = true;
        supportedLanguages.forEach(function (language) {
            if (!newValue.includes(language)) {
                renderNewValue = false;
            }
        });
        if (renderNewValue) {
            this.setState({ saving: false, value: newValue });
        }
    };


    onSave = (user) => {
        this.setState({ saving: true });
        Meteor.call('user.updateLang', user.profile.lang,
            wrapMeteorCallback((err) => {
                if (!err) {
                    this.setState({
                        saving: false,
                    });
                    location.reload()
                }
            }, i18n.__('changes_saved'))
        );
    };

    render() {
        const { user } = this.props;
        const { saving } = this.state;
        const userSchema = UserEditSchema;
        const bridge = new SimpleSchema2Bridge(userSchema);
        return (
            <>
                {true && (
                    <AutoForm
                        schema={bridge}
                        model={user}
                        onSubmit={updateUser => this.onSave(updateUser)
                        }
                        disabled={saving}
                    >
                        <InfoField
                            name='profile.firstName'
                            label='Name'
                            className='user-firstname'
                            disabled={true}
                        />
                        <SelectField
                            label='Language'
                            name='profile.lang'
                            options={this.getOptions()}
                            className='user-language'
                            data-cy='user-langauge-selection'
                        />
                        <br />
                        <ErrorsField />
                        <SubmitField
                            className='primary save-user-info-button'
                            value={i18n.__('save_changes')}
                            data-cy={i18n.__('save_changes')}
                        />
                    </AutoForm>
                )}
            </>
        );
    }
}

UserInfo.propTypes = {
    user: PropTypes.object.isRequired,
};

const UserInfoContainer = withTracker(({ }) => {
    const user = Meteor.user()
    return {
        user,
    };
})(UserInfo);

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(UserInfoContainer);
