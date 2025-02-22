import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import Thumbnail from '../Thumbnail';
import Button from '../Button';
import Meta from './Meta';
import Chevron from '../../icons/Chevron';
import './index.scss';
const baseClass = 'file-details';
const FileDetails = (props) => {
    var _a;
    const { doc, collection, handleRemove, } = props;
    const { upload: { staticURL, }, } = collection;
    const { filename, filesize, width, height, mimeType, sizes, url, } = doc;
    const [moreInfoOpen, setMoreInfoOpen] = useState(false);
    const hasSizes = sizes && ((_a = Object.keys(sizes)) === null || _a === void 0 ? void 0 : _a.length) > 0;
    return (React.createElement("div", { className: baseClass },
        React.createElement("header", null,
            React.createElement(Thumbnail, { doc: doc, collection: collection }),
            React.createElement("div", { className: `${baseClass}__main-detail` },
                React.createElement(Meta, { staticURL: staticURL, filename: filename, filesize: filesize, width: width, height: height, mimeType: mimeType, url: url }),
                hasSizes && (React.createElement(Button, { className: `${baseClass}__toggle-more-info${moreInfoOpen ? ' open' : ''}`, buttonStyle: "none", onClick: () => setMoreInfoOpen(!moreInfoOpen) },
                    !moreInfoOpen && (React.createElement(React.Fragment, null,
                        "More info",
                        React.createElement(Chevron, null))),
                    moreInfoOpen && (React.createElement(React.Fragment, null,
                        "Less info",
                        React.createElement(Chevron, null)))))),
            handleRemove && (React.createElement(Button, { icon: "x", round: true, buttonStyle: "icon-label", iconStyle: "with-border", onClick: handleRemove, className: `${baseClass}__remove` }))),
        hasSizes && (React.createElement(AnimateHeight, { className: `${baseClass}__more-info`, height: moreInfoOpen ? 'auto' : 0 },
            React.createElement("ul", { className: `${baseClass}__sizes` }, Object.entries(sizes).map(([key, val]) => {
                if (val === null || val === void 0 ? void 0 : val.filename) {
                    return (React.createElement("li", { key: key },
                        React.createElement("div", { className: `${baseClass}__size-label` }, key),
                        React.createElement(Meta, { ...val, mimeType: mimeType, staticURL: staticURL })));
                }
                return null;
            }))))));
};
export default FileDetails;
