import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

import {i18n} from 'meteor/universe:i18n';

const BadLineLabel = (props) => {
    const { lineMd, lineIndex } = props;
    return (
        <Popup
            on='click'
            trigger={(
                <div className='label-container black'>
                    <div>bad line</div>
                    <div>
                        {lineMd}
                    </div>
                </div>
            )}
            header={i18n.__('bad_line',[lineIndex])}
            content={<p>{i18n.__('fix_bad_line')}</p>}
        />
    );
};

BadLineLabel.propTypes = {
    lineMd: PropTypes.string,
    lineIndex: PropTypes.number.isRequired,
};

BadLineLabel.defaultProps = {
    lineMd: '',
};

export default BadLineLabel;
