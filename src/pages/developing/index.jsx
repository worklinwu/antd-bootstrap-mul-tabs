import { PageContainer } from '@/components';
import developing from '@/assets/images/developing.png';

const Developing = () => {
  return (
    <PageContainer showFooter>
      <div style={{ padding: '225px 0px' }}>
        <div style={{ margin: '0px auto', width: 210, textAlign: 'center' }}>
          <img src={developing} alt="" style={{ display: 'block', width: 210, height: 180 }} />
          <p style={{ fontSize: '16px' }}>正在建设中，敬请期待！</p>
        </div>
      </div>
    </PageContainer>
  );
};

Developing.displayName = 'Developing';

export default Developing;
