import React from 'react';
import {
    AutoForm, HiddenField, ErrorsField, SubmitField,
} from 'uniforms-semantic';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SelectField from '../nlu/common/SelectLanguage';
import { newProjectSchema } from '../../../api/setup';

import {i18n} from 'meteor/universe:i18n';

// eslint-disable-next-line react/prefer-stateless-function
class StepProjectComponent extends React.Component {
    render() {
        const { onSubmit, data } = this.props;
        const bridge = new SimpleSchema2Bridge(newProjectSchema);
        return (
            <AutoForm model={data} schema={bridge} onSubmit={onSubmit}>
                <br />
                <span className='step-text'>
                    What is the default language of your project?
                </span>
                <br />
                <br />
                <HiddenField
                    name='project'
                    value={i18n.__('my_project')}
                />
                <SelectField
                    label={null}
                    name='language'
                    placeholder={i18n.__('select_lang_project')}
                />
                <br />
                <ErrorsField />
                <div style={{ textAlign: 'center' }}>
                    <SubmitField
                        data-cy='project-create-button'
                        value={i18n.__('continues')}
                        className='primary'
                    />
                </div>
            </AutoForm>
        );
    }
}

StepProjectComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object,
};

StepProjectComponent.defaultProps = {
    data: undefined,
};

export default StepProjectComponent;
