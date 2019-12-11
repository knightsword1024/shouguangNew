import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Tag, Menu, Icon, Dropdown, Avatar, Row, Col } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import ProjectSelect from '../ProjectSelect';
import Alert from '../Alert';
import styles from './index.less';
import person from '@/assets/person.png';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const { currentUser, onMenuClick } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.right}>
        <Row gutter={40}>
          <Col span={7}>
            <ProjectSelect />
          </Col>
          <Col span={8}>
            <Alert />
          </Col>
          <Col span={9}>
            <Dropdown overlay={menu} placement="bottomCenter">
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={person} alt="avatar" />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}
