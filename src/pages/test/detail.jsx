import { memo } from 'react';
import { Button } from 'antd';
import { PageContainer } from '@/components';

const DetailDemo = ({ location }) => {
  return (
    <PageContainer fixedHeight fixedHeader showFooter title="测试标题" controls={<Button>测试按钮</Button>}>
      DetailDemo. {location.search}
      <div style={{ height: 1000, width: 400, backgroundColor: '#f4f4f4' }}>长内容测试</div>
    </PageContainer>
  );
};

DetailDemo.displayName = 'DetailDemo';

export default memo(DetailDemo);
