import { Layout, theme } from 'antd'
import AdminHeaderFunc from '../../components/adminHeader'
import RehersalsList from '../../components/rehersalsList'

const { Content } = Layout
// Страница Прослушивания 
// Доступна только администраторам
const Rehersals = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ marginTop: '-0.5%', marginLeft: '-0.5%', marginRight: '-0.5%', marginBottom: '-0.5%' }}>
      <AdminHeaderFunc back='admin-main-page' />
      <Content style={{ minHeight: '51vw' }}>
        <RehersalsList />
      </Content>
    </Layout>
  );
};

export default Rehersals;
