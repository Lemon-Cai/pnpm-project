```tsx
import ApproveDialog from './ApproveDialog';
import BaseTrigger from './BaseTrigger';
import { Button } from 'antd';

const Example = () => {
  const handleReturn = () => {
    // 打回逻辑
  }

  return (
    <BaseTrigger
      content={
        <ApproveDialog 
          title={locale('打回')}
          onOk={handleReturn}
        />
      }
    >                    
      <Button>{locale('打回')}</Button>
    </BaseTrigger>
  )
}
```