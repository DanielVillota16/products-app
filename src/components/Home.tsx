import { Breadcrumb, Layout, Menu, Typography } from "antd";
import { HomeOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import reactLogo from '../assets/react.svg';
import { useContext, useState } from "react";
import { ItemType } from "antd/es/menu/hooks/useItems";
import Account from "./Account";
import Products from "./Products";
import { ThemeContext } from '../context/ThemeContext';

const { Header, Content, Footer, Sider } = Layout;

interface View {
  key: React.Key;
  menuName: string;
  viewTitle: string;
  icon: React.ReactNode;
  route: string;
  component: JSX.Element;
}

type KeylessView = Omit<View, 'key'>;

interface BreadcrumbItem {
  href?: string;
  title: JSX.Element | string;
}

const Home = () => {

  const [chosenView, setChosenView] = useState(0);
  const { currentTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const keylessViews: KeylessView[] = [
    {
      icon: <ShoppingCartOutlined />,
      menuName: "Products",
      viewTitle: "Products 🛒",
      route: "products",
      component: <Products />,
    },
    {
      icon: <UserOutlined />,
      menuName: "Account",
      viewTitle: "Account 👤",
      route: "account",
      component: <Account />,
    }
  ]

  const views: View[] = keylessViews.map((v: KeylessView, index: number): View => ({ ...v, key: index }));

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
              views.map((view: View, index: number) => {
                const Element = () => view.component;
                return <Route key={index} path={view.route} element={<Element />} />
              })
            }
            <Route path='*' element={<Navigate to='/products' />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>¯\_(ツ)_/¯</Footer>
      </Layout>
    </Layout>
  )

}

export default Home;