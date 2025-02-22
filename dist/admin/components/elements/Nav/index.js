import React, { useState, useEffect } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import RenderCustomComponent from '../../utilities/RenderCustomComponent';
import Chevron from '../../icons/Chevron';
import LogOut from '../../icons/LogOut';
import Menu from '../../icons/Menu';
import CloseMenu from '../../icons/CloseMenu';
import Icon from '../../graphics/Icon';
import Account from '../../graphics/Account';
import Localizer from '../Localizer';
import './index.scss';
const baseClass = 'nav';
const DefaultNav = () => {
    const { permissions } = useAuth();
    const [menuActive, setMenuActive] = useState(false);
    const history = useHistory();
    const { collections, globals, routes: { admin, }, admin: { components: { beforeNavLinks, afterNavLinks, }, }, } = useConfig();
    const classes = [
        baseClass,
        menuActive && `${baseClass}--menu-active`,
    ].filter(Boolean).join(' ');
    useEffect(() => history.listen(() => {
        setMenuActive(false);
    }), [history]);
    return (React.createElement("aside", { className: classes },
        React.createElement("div", { className: `${baseClass}__scroll` },
            React.createElement("header", null,
                React.createElement(Link, { to: admin, className: `${baseClass}__brand` },
                    React.createElement(Icon, null)),
                React.createElement("button", { type: "button", className: `${baseClass}__mobile-menu-btn`, onClick: () => setMenuActive(!menuActive) },
                    menuActive && (React.createElement(CloseMenu, null)),
                    !menuActive && (React.createElement(Menu, null)))),
            React.createElement("div", { className: `${baseClass}__wrap` },
                Array.isArray(beforeNavLinks) && beforeNavLinks.map((Component, i) => React.createElement(Component, { key: i })),
                React.createElement("span", { className: `${baseClass}__label` }, "Collections"),
                React.createElement("nav", null, collections && collections.map((collection, i) => {
                    var _a, _b;
                    const href = `${admin}/collections/${collection.slug}`;
                    if ((_b = (_a = permissions === null || permissions === void 0 ? void 0 : permissions.collections) === null || _a === void 0 ? void 0 : _a[collection.slug]) === null || _b === void 0 ? void 0 : _b.read.permission) {
                        return (React.createElement(NavLink, { id: `nav-${collection.slug}`, activeClassName: "active", key: i, to: href },
                            React.createElement(Chevron, null),
                            collection.labels.plural));
                    }
                    return null;
                })),
                (globals && globals.length > 0) && (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: `${baseClass}__label` }, "Globals"),
                    React.createElement("nav", null, globals.map((global, i) => {
                        var _a;
                        const href = `${admin}/globals/${global.slug}`;
                        if ((_a = permissions === null || permissions === void 0 ? void 0 : permissions.globals) === null || _a === void 0 ? void 0 : _a[global.slug].read.permission) {
                            return (React.createElement(NavLink, { id: `nav-global-${global.slug}`, activeClassName: "active", key: i, to: href },
                                React.createElement(Chevron, null),
                                global.label));
                        }
                        return null;
                    })))),
                Array.isArray(afterNavLinks) && afterNavLinks.map((Component, i) => React.createElement(Component, { key: i })),
                React.createElement("div", { className: `${baseClass}__controls` },
                    React.createElement(Localizer, null),
                    React.createElement(Link, { to: `${admin}/account`, className: `${baseClass}__account` },
                        React.createElement(Account, null)),
                    React.createElement(Link, { to: `${admin}/logout`, className: `${baseClass}__log-out` },
                        React.createElement(LogOut, null)))))));
};
const Nav = () => {
    const { admin: { components: { Nav: CustomNav, } = {
        Nav: undefined,
    }, } = {}, } = useConfig();
    return (React.createElement(RenderCustomComponent, { CustomComponent: CustomNav, DefaultComponent: DefaultNav }));
};
export default Nav;
