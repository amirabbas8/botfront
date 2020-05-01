import React from 'react';
import PropTypes from 'prop-types';

import UploadDropzone from '../utils/UploadDropzone';

import {i18n} from 'meteor/universe:i18n';


const ImportProjectDropfield = ({
    onChange,
    manipulateData,
    success,
    maxSizeInMb,
    verifyData,
    fileTag,
    successMessage,
}) => {
    const handleOnDropped = (data) => {
        const parsedData = manipulateData(data);
        if (verifyData(parsedData)) onChange({ [fileTag]: parsedData });
    };

    return (
        <UploadDropzone
            onDropped={handleOnDropped}
            binary={false}
            success={success}
            accept='.json'
            maxSizeInMb={maxSizeInMb}
            successMessage={successMessage}
        />
    );
};

ImportProjectDropfield.propTypes = {
    onChange: PropTypes.func.isRequired,
    manipulateData: PropTypes.func,
    success: PropTypes.bool.isRequired,
    maxSizeInMb: PropTypes.number,
    verifyData: PropTypes.func,
    fileTag: PropTypes.string.isRequired,
    successMessage: PropTypes.string,
};

ImportProjectDropfield.defaultProps = {
    manipulateData: data => data,
    maxSizeInMb: 30,
    verifyData: () => true,
    successMessage: i18n.__('file_ready'),
};

export default ImportProjectDropfield;
