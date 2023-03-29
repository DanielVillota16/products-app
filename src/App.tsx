import { useEffect, useMemo, useState } from 'react';
import { HomeOutlined, ShoppingCartOutlined, FormatPainterOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, ConfigProvider, Typography, FloatButton } from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import reactLogo from './assets/react.svg';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Products from './components/Products';
import Account from './components/Account';

const { Header, Content, Footer, Sider } = Layout;

interface ThemeProps {
  colorTextBase: string;
  colorPrimary: string;
  colorBgBase: string;
}

interface ThemeOption {
  dark: ThemeProps;
  light: ThemeProps;
}

interface View {
  key: React.Key;
  menuName: string;
  viewTitle: string;
  icon: React.ReactNode;
  route: string;
  component: () => JSX.Element;
}

type KeylessView = Omit<View, 'key'>;

interface BreadcrumbItem {
  href?: string;
  title: JSX.Element | string;
}

const themes: ThemeOption = {
  dark: {
    colorTextBase: "#b7dcfa",
    colorPrimary: "#1554ad",
    colorBgBase: "#111a2c",
  },
  light: {
    colorTextBase: "#111a2c",
    colorPrimary: "#1554ad",
    colorBgBase: "#ecf5fa",
  }
}

const keylessViews: KeylessView[] = [
  {
    icon: <ShoppingCartOutlined />,
    menuName: "Products",
    viewTitle: "Products 🛒",
    route: "products",
    component: Products,
  },
  {
    icon: <UserOutlined />,
    menuName: "Account",
    viewTitle: "Account 👤",
    route: "account",
    component: Account,
  }
]

const views: View[] = keylessViews.map((v: KeylessView, index: number): View => ({ ...v, key: index }));

function App() {

  const [darkTheme, setDarkTheme] = useState<boolean>(localStorage.getItem('darkTheme') === 'true');
  const currentTheme: ThemeProps = useMemo(() => darkTheme ? themes.dark : themes.light, [darkTheme]);
  const [chosenView, setChosenView] = useState(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    localStorage['darkTheme'] = darkTheme;
  }, [darkTheme]);

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: ItemType[]
  ): ItemType => ({
    label, key, icon, children
  });

  const items: ItemType[] = views.map((view: View) => getItem(view.menuName, view.key, view.icon));

  const extraBreadcrumbItems: Array<BreadcrumbItem> = pathname.split('/').filter(item => item).map(
    item => ({
      href: `/${item}`,
      title: `${item[0].toUpperCase()}${item.slice(1)}`,
    }
    ));

  const home: Array<BreadcrumbItem> = [{ title: <HomeOutlined /> }];

  const breadcrumbItems = home.concat(extraBreadcrumbItems);

  return (
    <ConfigProvider
      theme={{
        token: currentTheme
      }}
    >
      <Layout style={{ minHeight: '98vh' }}>
        <Sider breakpoint="lg" theme='light'>
          <div style={{ textAlign: 'center', height: 46, margin: 16 }}>
            <img src={reactLogo} style={{ height: '100%' }} />
          </div>
          <Menu
            mode="inline"
            items={items}
            onClick={(item) => {
              setChosenView(parseInt(item.key));
              navigate(views[parseInt(item.key)].route);
            }}
          />
        </Sider>
        <Layout>
          <Header style={{ height: 'auto', background: currentTheme.colorBgBase }} >
            <Typography.Title level={2} style={{ textAlign: 'center' }}>{views[chosenView].viewTitle}</Typography.Title>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ fontSize: 16, margin: '16px 0' }}
              items={breadcrumbItems}
            />
            <Routes>
              {
                views.map((view: View, index: number) => <Route key={index} path={view.route} Component={view.component} />)
              }
              <Route path='*' element={<Navigate to='/products' />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>¯\_(ツ)_/¯</Footer>
        </Layout>
        <FloatButton icon={<FormatPainterOutlined />} onClick={() => setDarkTheme(!darkTheme)} />
      </Layout>
    </ConfigProvider>
  )
}

export default App
