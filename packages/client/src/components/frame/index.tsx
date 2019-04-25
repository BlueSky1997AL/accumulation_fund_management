import { Icon, Layout, Menu, notification } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import './index.less';

import { MsgType } from '~server/app/util/interface/common';
import { PersonType, UserType } from '~server/app/util/interface/user';

import { userTypeToString } from '~utils/user';
import { logout } from './request';

interface FrameProps {
    children?: React.ReactChild;
}

function Frame ({ children }: FrameProps) {
    const userType = window.userType as UserType;
    const personType = window.personType as PersonType;

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
        switch (type) {
            case UserType.Admin: {
                return (
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[ getSelectedKey() ]}
                        defaultOpenKeys={[ '/account', '/work_order' ]}
                        mode="inline"
                        style={{ marginBottom: 48 }}
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
                            <Menu.Item key="/work_order/query">
                                <Link to="/work_order/query">工单查询</Link>
                            </Menu.Item>
                            <Menu.Item key="/work_order/not_audited">
                                <Link to="/work_order/not_audited">未审核工单</Link>
                            </Menu.Item>
                            <SubMenu key="/work_order/enterprise" title={<span>企业工单</span>}>
                                <Menu.Item key="/work_order/enterprise/back">
                                    <Link to="/work_order/enterprise/back">企业补缴</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/enterprise/remit">
                                    <Link to="/work_order/enterprise/remit">企业汇缴</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/enterprise/sub_user_remove">
                                    <Link to="/work_order/enterprise/sub_user_remove">企业子账户移除</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/enterprise/sub_user_add">
                                    <Link to="/work_order/enterprise/sub_user_add">企业子账户添加</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="/work_order/personal" title={<span>个人工单</span>}>
                                <Menu.Item key="/work_order/personal/back">
                                    <Link to="/work_order/personal/back">个人补缴</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/personal/deposit">
                                    <Link to="/work_order/personal/deposit">个人缴存</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/personal/draw">
                                    <Link to="/work_order/personal/draw">个人支取</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="/work_order/account" title={<span>账号工单</span>}>
                                <Menu.Item key="/work_order/account/disable_export">
                                    <Link to="/work_order/account/disable_export">账号注销/调出</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/freeze">
                                    <Link to="/work_order/account/freeze">账号冻结</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/unfreeze">
                                    <Link to="/work_order/account/unfreeze">账号解冻</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/signup">
                                    <Link to="/work_order/account/signup">账户创建</Link>
                                </Menu.Item>
                            </SubMenu>
                        </SubMenu>
                    </Menu>
                );
            }
            case UserType.Common: {
                if (personType === PersonType.IndividualBusiness) {
                    return (
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={[ getSelectedKey() ]}
                            defaultOpenKeys={[ '/account', '/work_order', '/fund' ]}
                            mode="inline"
                            style={{ marginBottom: 48 }}
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
                                        <span>我的工单</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="/work_order/query">
                                    <Link to="/work_order/query">工单查询</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/not_audited">
                                    <Link to="/work_order/not_audited">未审核工单</Link>
                                </Menu.Item>
                                <SubMenu key="/work_order/fund" title={<span>公积金工单</span>}>
                                    <Menu.Item key="/work_order/fund/back">
                                        <Link to="/work_order/fund/back">补缴</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/work_order/fund/deposit">
                                        <Link to="/work_order/fund/deposit">缴存</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/work_order/fund/draw">
                                        <Link to="/work_order/fund/draw">支取</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key="/work_order/account" title={<span>账户工单</span>}>
                                    <Menu.Item key="/work_order/account/disable_export">
                                        <Link to="/work_order/account/disable_export">注销/转出</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/work_order/account/freeze">
                                        <Link to="/work_order/account/freeze">冻结</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/work_order/account/unfreeze">
                                        <Link to="/work_order/account/unfreeze">解冻</Link>
                                    </Menu.Item>
                                </SubMenu>
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
                                <Menu.Item key="/fund/deposit">
                                    <Link to="/fund/deposit">缴存</Link>
                                </Menu.Item>
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
                return (
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[ getSelectedKey() ]}
                        defaultOpenKeys={[ '/account', '/work_order', '/fund' ]}
                        mode="inline"
                        style={{ marginBottom: 48 }}
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
                                    <span>我的工单</span>
                                </span>
                            }
                        >
                            <Menu.Item key="/work_order/query">
                                <Link to="/work_order/query">工单查询</Link>
                            </Menu.Item>
                            <Menu.Item key="/work_order/not_audited">
                                <Link to="/work_order/not_audited">未审核工单</Link>
                            </Menu.Item>
                            <SubMenu key="/work_order/fund" title={<span>公积金工单</span>}>
                                <Menu.Item key="/work_order/fund/draw">
                                    <Link to="/work_order/fund/draw">支取</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="/work_order/account" title={<span>账户工单</span>}>
                                <Menu.Item key="/work_order/account/disable_export">
                                    <Link to="/work_order/account/disable_export">注销/转出</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/freeze">
                                    <Link to="/work_order/account/freeze">冻结</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/unfreeze">
                                    <Link to="/work_order/account/unfreeze">解冻</Link>
                                </Menu.Item>
                            </SubMenu>
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
                        style={{ marginBottom: 48 }}
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
                                <Link to="/account/list">员工列表</Link>
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
                            <Menu.Item key="/work_order/query">
                                <Link to="/work_order/query">工单查询</Link>
                            </Menu.Item>
                            <Menu.Item key="/work_order/not_audited">
                                <Link to="/work_order/not_audited">未审核工单</Link>
                            </Menu.Item>
                            <SubMenu key="/work_order/fund" title={<span>公积金工单</span>}>
                                <Menu.Item key="/work_order/fund/remit">
                                    <Link to="/work_order/fund/remit">汇缴</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/fund/back">
                                    <Link to="/work_order/fund/back">补缴</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="/work_order/sub_user" title={<span>子账户工单</span>}>
                                <Menu.Item key="/work_order/sub_user/remove">
                                    <Link to="/work_order/sub_user/remove">转出子账户</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/sub_user/add">
                                    <Link to="/work_order/sub_user/add">转入子账户</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="/work_order/account" title={<span>账户工单</span>}>
                                <Menu.Item key="/work_order/account/disable_export">
                                    <Link to="/work_order/account/disable_export">注销/转出</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/freeze">
                                    <Link to="/work_order/account/freeze">冻结</Link>
                                </Menu.Item>
                                <Menu.Item key="/work_order/account/unfreeze">
                                    <Link to="/work_order/account/unfreeze">解冻</Link>
                                </Menu.Item>
                            </SubMenu>
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
            <Sider
                theme="dark"
                collapsible={true}
                collapsed={sideBarCollapsed}
                onCollapse={setCollapseState}
                style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
            >
                <div className="frame-logo">{getLogo(sideBarCollapsed)}</div>
                {getSiderMenuByUserType(userType)}
            </Sider>
            <Layout style={{ marginLeft: sideBarCollapsed ? 80 : 200 }}>
                <Header className="frame-header" style={{ left: sideBarCollapsed ? 80 : 200 }}>
                    <div className="username">
                        当前用户：<span className="highlight-text">{window.name}</span>
                    </div>
                    <div className="user-type">
                        账户类型：<span className="highlight-text">{userTypeToString(window.userType)}</span>
                    </div>
                    <div className="logout" onClick={logoutHandler}>
                        注销
                    </div>
                </Header>
                <Content style={{ margin: '16px', marginTop: '80px' }}>{children}</Content>
                <Footer style={{ textAlign: 'center' }}>公积金管理系统 ©2019 东北农业大学 微机1501 刘秉楠</Footer>
            </Layout>
        </Layout>
    );
}

export default Frame;
