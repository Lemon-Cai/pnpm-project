/*
 * @Author: CP
 * @Date: 2024-01-04 10:43:33
 * @Description: 当iframe页面,注入数据
 */
import React, { ComponentType } from 'react';

interface EnhanceProps {
  // Add any additional props that EnhanceCmp might accept
  [key: string]: any
}

const EnhanceIframe = <P extends object>(
  WrapperCmp: ComponentType<P>,
  otherProps: EnhanceProps
) => {
  const EnhanceCmp: React.FC<P & EnhanceProps> = (props) => {
    // Do something with otherProps if needed
    return <WrapperCmp {...props} {...otherProps} />;
  };

  return EnhanceCmp;
};

export default EnhanceIframe;
