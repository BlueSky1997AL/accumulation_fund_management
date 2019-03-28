import { Icon, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, RouterChildContext } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import './index.less';

interface FrameProps {
    children?: React.ReactChild;
}

function Frame ({ children }: FrameProps) {
    const [ sideBarCollapsed, setCollapseState ] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible={true}
                collapsed={sideBarCollapsed}
                onCollapse={collapsed => setCollapseState(collapsed)}
            >
                <div className="logo">
                    <div className="logo-text">公积金管理系统</div>
                </div>
                <Menu theme="dark" defaultSelectedKeys={[ '/' ]} defaultOpenKeys={[ 'account', 'fund', 'ticket', 'log' ]} mode="inline">
                    <SubMenu
                        key="account"
                        title={
                            <span>
                                <Icon type="user" />
                                <span>账户管理</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/">
                            <Link to="/">账户列表</Link>
                        </Menu.Item>
                        <Menu.Item key="/test">
                            <Link to="/test">本账户操作</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="ticket"
                        title={
                            <span>
                                <Icon type="tags" />
                                <span>工单管理</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/">
                            <Link to="/">工单审核</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="fund"
                        title={
                            <span>
                                <Icon type="money-collect" />
                                <span>公积金管理</span>
                            </span>
                        }
                    >
                        <Menu.Item key="">
                            <Link to="/123">汇缴</Link>
                        </Menu.Item>
                        <Menu.Item key="">
                            <Link to="/123">补缴</Link>
                        </Menu.Item>
                        <Menu.Item key="">
                            <Link to="/123">支取</Link>
                        </Menu.Item>
                        <Menu.Item key="">
                            <Link to="/123">转入/转出</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="log"
                        title={
                            <span>
                                <Icon type="exception" />
                                <span>操作日志</span>
                            </span>
                        }
                    >
                        <Menu.Item key="">
                            <Link to="/123">日志记录</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>{children}</Content>
                <Footer style={{ textAlign: 'center' }}>
                    Accumulation Fund Management ©2019 Created by Allen Lawrence
                </Footer>
            </Layout>
        </Layout>
    );
}

export default Frame;
