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
                <Menu theme="dark" defaultSelectedKeys={[ '/' ]} mode="inline">
                    <SubMenu
                        key="sub-menu-1"
                        title={
                            <span>
                                <Icon type="user" />
                                <span>测试子Menu</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/"><Link to="/">route 1</Link></Menu.Item>
                        <Menu.Item key="/test"><Link to="/test">route 2</Link></Menu.Item>
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
