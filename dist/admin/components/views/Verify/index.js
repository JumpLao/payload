import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import Logo from '../../graphics/Logo';
import MinimalTemplate from '../../templates/Minimal';
import Button from '../../elements/Button';
import Meta from '../../utilities/Meta';
import Login from '../Login';
import './index.scss';
const baseClass = 'verify';
const Verify = ({ collection }) => {
    const { slug: collectionSlug } = collection;
    const { user } = useAuth();
    const { token } = useParams();
    const { serverURL, routes: { admin: adminRoute }, admin: { user: adminUser } } = useConfig();
    const isAdminUser = collectionSlug === adminUser;
    const [verifyResult, setVerifyResult] = useState(null);
    useEffect(() => {
        async function verifyToken() {
            const result = await fetch(`${serverURL}/api/${collectionSlug}/verify/${token}`, { method: 'POST' });
            setVerifyResult(result);
        }
        verifyToken();
    }, [setVerifyResult, collectionSlug, serverURL, token]);
    if (user) {
        return React.createElement(Login, null);
    }
    const getText = () => {
        if ((verifyResult === null || verifyResult === void 0 ? void 0 : verifyResult.status) === 200)
            return 'Verified Successfully';
        if ((verifyResult === null || verifyResult === void 0 ? void 0 : verifyResult.status) === 202)
            return 'Already Activated';
        return 'Unable To Verify';
    };
    return (React.createElement(MinimalTemplate, { className: baseClass },
        React.createElement(Meta, { title: "Verify", description: "Verify user", keywords: "Verify, Payload, CMS" }),
        React.createElement("div", { className: `${baseClass}__brand` },
            React.createElement(Logo, null)),
        React.createElement("h2", null, getText()),
        isAdminUser && (verifyResult === null || verifyResult === void 0 ? void 0 : verifyResult.status) === 200 && (React.createElement(Button, { el: "link", buttonStyle: "secondary", to: `${adminRoute}/login` }, "Login"))));
};
export default Verify;
