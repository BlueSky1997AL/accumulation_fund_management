import { Icon, Layout, Menu, notification } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { UserType } from '~server/app/util/interface/user';

import { userTypeToString } from '~utils/user';
import { logout } from './request';

interface FrameProps {
    children?: React.ReactChild;
}

function Frame ({ children }: FrameProps) {
    const userType = window.userType as UserType;

    const [ sideBarCollapsed, setCollapseState ] = useState(false);

    async function logoutHandler () {
        try {
            const resp = await logout();
            if (resp.message !== MsgType.OPT_SUCCESS) {
                throw new Error(resp.message);
            }
            setTimeout(() => {
                location.href = '/login';
            }, 100);
        } catch (error) {
            notification.error({
                message: (error as Error).message
            });
        }
    }

    function getLogo (collapsed: boolean) {
        if (collapsed) {
            return (
                <div className="logo-container">
                    <Icon type="home" theme="filled" />
                </div>
            );
        }
        return (
            <div className="logo-container">
                <Icon type="home" theme="filled" style={{ marginRight: 8 }} />
                <span>公积金管理系统</span>
            </div>
        );
    }

    function getSelectedKey () {
        return location.pathname.replace('/web', '');
    }

    function getSiderMenuByUserType (type: UserType) {
        switch (userType) {
            case UserType.Admin: {
                return (
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[ getSelectedKey() ]}
                        defaultOpenKeys={[ '/account', '/work_order' ]}
                        mode="inline"
                    >
                        <SubMenu
                            key="/account"
                            title={
                                <span>
                                    <Icon type="user" />
                                    <span>账户管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/account/info">
                                <Link to="/account/info">账户信息</Link>
                            </Menu.Item>
                            <Menu.Item key="/account/list">
                                <Link to="/account/list">账户列表</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="/work_order"
                            title={
                                <span>
                                    <Icon type="tags" />
                                    <span>工单管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/work_order/audit">
                                <Link to="/work_order/audit">工单审核</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                );
            }
            case UserType.Common: {
                return (
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[ getSelectedKey() ]}
                        defaultOpenKeys={[ '/account', '/work_order', '/fund' ]}
                        mode="inline"
                    >
                        <SubMenu
                            key="/account"
                            title={
                                <span>
                                    <Icon type="user" />
                                    <span>账户管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/account/info">
                                <Link to="/account/info">账户信息</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="/work_order"
                            title={
                                <span>
                                    <Icon type="tags" />
                                    <span>工单管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/work_order/mine">
                                <Link to="/work_order/mine">我的工单</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="/fund"
                            title={
                                <span>
                                    <Icon type="money-collect" />
                                    <span>公积金管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/fund/back">
                                <Link to="/fund/back">补缴</Link>
                            </Menu.Item>
                            <Menu.Item key="/fund/draw">
                                <Link to="/fund/draw">支取</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                );
            }
            case UserType.Enterprise: {
                return (
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[ getSelectedKey() ]}
                        defaultOpenKeys={[ '/account', '/work_order', '/fund', '/record' ]}
                        mode="inline"
                    >
                        <SubMenu
                            key="/account"
                            title={
                                <span>
                                    <Icon type="user" />
                                    <span>账户管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/account/info">
                                <Link to="/account/info">账户信息</Link>
                            </Menu.Item>
                            <Menu.Item key="/account/list">
                                <Link to="/account/list">子账户列表</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="/work_order"
                            title={
                                <span>
                                    <Icon type="tags" />
                                    <span>工单管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/work_order/mine">
                                <Link to="/work_order/mine">我的工单</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="/fund"
                            title={
                                <span>
                                    <Icon type="money-collect" />
                                    <span>公积金管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/fund/remit">
                                <Link to="/fund/remit">汇缴</Link>
                            </Menu.Item>
                            <Menu.Item key="/fund/back">
                                <Link to="/fund/back">补缴</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                );
            }
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark" collapsible={true} collapsed={sideBarCollapsed} onCollapse={setCollapseState}>
                <div className="frame-logo">{getLogo(sideBarCollapsed)}</div>
                {getSiderMenuByUserType(userType)}
            </Sider>
            <Layout>
                <Header className="frame-header">
                    <div className="username">
                        当前用户：<span className="highlight-text">{window.username}</span>
                    </div>
                    <div className="user-type">
                        账户类型：<span className="highlight-text">{userTypeToString(window.userType)}</span>
                    </div>
                    <div className="logout" onClick={logoutHandler}>
                        注销
                    </div>
                </Header>
                <Content style={{ margin: '16px' }}>{children}</Content>
                <Footer style={{ textAlign: 'center' }}>公积金管理系统 ©2019 东北农业大学 微机1501 刘秉楠</Footer>
            </Layout>
        </Layout>
    );
}

export default Frame;
