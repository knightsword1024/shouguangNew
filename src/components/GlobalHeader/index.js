import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import logo from '@/assets/logo.png';

@connect(({ project }) => ({ project }))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const {
      collapsed,
      project: { projectTotal },
    } = this.props;
    const menuNum = localStorage.getItem('menuNum');
    var menuName = '';
    for (let i of projectTotal) {
      if (i.id == menuNum) {
        menuName = i.name;
      }
    }
    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        {menuNum != 0 && (
          <span>
            当前项目：
            {menuName}
          </span>
        )}
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
          <span>物联管理平台</span>
        </Link>
        <RightContent {...this.props} />
      </div>
    );
  }
}
