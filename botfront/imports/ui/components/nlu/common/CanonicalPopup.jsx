
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import UserUtteranceViewer from './UserUtteranceViewer';
import { Context } from '../../../../../stories/StoryLabels/CanonicalPopup.stories';

import {i18n} from 'meteor/universe:i18n';


const CanonicalPopup = (props) => {
    const {
        trigger,
        example,
    } = props;

    const { getCanonicalExample } = useContext(Context);

    const canonicalExample = getCanonicalExample(example);

    const renderPopupContent = () => {
        if (!canonicalExample) {
            return (
                <span className='canonical-popup-content'>
                    <p>{i18n.__('intent_without_example')}</p>
                </span>
            );
        }
        return (
            <span className='canonical-popup-content'>
                <Icon
                    name={canonicalExample.canonical === true ? 'gem' : 'tag'}
                />
                <UserUtteranceViewer
                    value={canonicalExample}
                    disableEditing
                    showIntent={false}
                />
            </span>
        );
    };
    const renderCanonicalPopup = () => (
        <Popup
            content={renderPopupContent}
            /* if the root element of the trigger has custom hover behaviour it
               prevents the popup from opening. Wrapping the trigger in a div ensures
               the popup will open
            */
            trigger={<div className='canonical-popup-trigger'>{trigger}</div>}
            inverted
            flowing
            hoverable
            open
            className='canonical-popup'
        />
    );
    return renderCanonicalPopup();
};

const exampleShape = {
    intent: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    entities: PropTypes.array.isRequired,
    canonical: PropTypes.bool,
};

CanonicalPopup.propTypes = {
    trigger: PropTypes.element.isRequired,
    example: PropTypes.shape(exampleShape),
};
CanonicalPopup.defaultProps = {
    example: {},
};
export default CanonicalPopup;
