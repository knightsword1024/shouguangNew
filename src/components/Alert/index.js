import React, { Component } from 'react';
import { Avatar } from 'antd';
import styles from './index.less';
import alertImage from '@/assets/alert.png';

class Alert extends Component {
  render() {
    return (
      <div className={styles.gg}>
        <a href="/alerts" target="_top">
          <Avatar src={alertImage} size="small" className={styles.avatar} />
          <span>报警信息</span>
        </a>
      </div>
    );
  }
}
export default Alert;
