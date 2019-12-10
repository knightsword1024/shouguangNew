import React, { PureComponent } from 'react';
import { Card, Table, Descriptions } from 'antd';
import { connect } from 'dva';
import { stringify } from 'qs';
import styles from './index.less';
const { DescriptionItem } = Descriptions.Item;

@connect(({}) => ({}))
class EquipmentInfo extends PureComponent {
  state = {
    timer: '',
  };
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
  }
  componentWillUnmount() {}
  // 传感器表头
  createColumns = () => [
    {
      title: '属性名称',
      dataIndex: 'name',
    },
    {
      title: '属性类型',
      dataIndex: 'propertyTypeDesc',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
  ];
  // 实时数据表头
  RealTimeColumns = () => [
    {
      title: '传感器id',
      dataIndex: 'senId',
    },
    {
      title: '传感器名称',
      dataIndex: 'sensorName',
    },
    {
      title: '属性名称',
      dataIndex: 'sensorPropertyName',
    },
    {
      title: '属性类型',
      dataIndex: 'sensorPropertyTypeDesc',
    },
    {
      title: '属性值',
      dataIndex: 'val',
    },
    {
      title: '单位',
      dataIndex: 'sensorPropertyUnit',
    },
    {
      title: '采集时间',
      dataIndex: 'gmtCreated',
    },
    {
      title: '上报时间',
      dataIndex: 'ts',
    },
  ];
  // 列表信息
  renderSimpleHeader = () => {
    const {
      //   equipment: { info }
    } = this.props;
    return <div />;
  };

  render() {
    const {} = this.props;
    return (
      <div>
        {this.renderSimpleHeader()}
        <Card>
          <h2>传感器</h2>
        </Card>
        <div>
          <Card>
            <h2>实时数据</h2>
          </Card>
        </div>
      </div>
    );
  }
}

export default EquipmentInfo;
