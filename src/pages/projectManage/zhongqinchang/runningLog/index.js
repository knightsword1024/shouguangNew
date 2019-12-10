import React, { Component, Fragment } from 'react';
import { Card, Form, Col, Row, Select, Input, Table, DatePicker, Modal } from 'antd';
import { connect } from 'dva';
import style from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TextArea = Input.TextArea;

// 查看设备信息弹窗
// @connect(({ equipment, loading, production }) => ({ production, equipment, loading: loading.models.equipment }))
@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  okHandle = () => {};

  render() {
    const { modalVisible, handleModalVisible, form, rowValue } = this.props;
    return (
      <Modal
        title="报文内容"
        visible={modalVisible}
        closable={false}
        destroyOnClose
        onCancel={() => {
          handleModalVisible();
        }}
        onOk={() => {
          handleModalVisible();
        }}
      >
        <FormItem label="设备序列号" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('did', {
            initialValue: rowValue.did,
          })(<Input placeholder="设备序列号" disabled="true" />)}
        </FormItem>
        <FormItem label="所属网关" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('gateway', {
            initialValue: rowValue.gatewayid,
          })(<Input placeholder="所属网关" disabled="true" />)}
        </FormItem>
        <FormItem label="报文内容" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('params', {
            initialValue: rowValue.params,
          })(<TextArea placeholder="报文内容" disabled="true" autoSize="true" />)}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
class DataStatistics extends Component {
  formValues = {
    offset: 0,
    count: 10,
  };

  state = {
    projectid: '3',
    formValues: this.formValues,
    modalVisible: false,
    sendValue: [],
    typeValue: [],
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    const { formValues, projectid } = this.state;
    dispatch({
      type: 'manage/fetchAllRunningLog',
      payload: { ...formValues, projectid: projectid },
    });
    dispatch({
      type: 'manage/fetchAllAlertType',
      payload: { eventtyp: '1' },
    });
    dispatch({
      type: 'manage/fetchSearchValue',
      payload: {
        ...formValues,
        projectid: projectid,
      },
    }).then(res => {
      var value1 = [];
      for (let i of res.data.devtyps) {
        value1.push({ value: i.name, key: i.devtyp });
      }
      this.setState({
        typeValue: value1,
      });
    });
  };
  createColumn() {
    return [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
      },
      {
        title: '设备序列号',
        dataIndex: 'did',
      },
      {
        title: '所属网关',
        dataIndex: 'gatewayid',
      },
      {
        title: '数据类型',
        dataIndex: 'eventdesc',
      },
      {
        title: '通信时间',
        dataIndex: 'createtime',
      },
      {
        title: '报文内容',
        // dataIndex: 'occurredTime'
        render: row => (
          <div>
            <a onClick={() => this.handleModalVisible(true, row)}>查看</a>
          </div>
        ),
      },
    ];
  }

  renderSimpleForm() {
    const { typeValue } = this.state;
    const {
      manage: { alertTypeValue, gateValue },
    } = this.props;
    return (
      <Fragment>
        <Form>
          <Row gutter={10}>
            <Col span={5}>
              <FormItem>
                <Search
                  placeholder="请输入设备名称或序列号"
                  enterButton
                  autoComplete="off"
                  onSearch={this.searchValue.bind(this, 'pattern')}
                />
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Select
                  placeholder="设备属性"
                  // onChange={this.searchValue.bind(this, 'devtyp')}
                >
                  <Option value="all" key="all">
                    全部
                  </Option>
                  {typeValue.map(({ key, value }) => {
                    return (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Select placeholder="数据类型" onChange={this.searchValue.bind(this, 'eventtyp')}>
                  <Option value="all" key="all">
                    全部
                  </Option>
                  {alertTypeValue.map(({ eventcode, desc }) => {
                    return (
                      <Option key={eventcode} value={eventcode}>
                        {desc}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                <Select
                  placeholder="所属网关"
                  // onChange={this.searchValue.bind(this, 'gateway')}
                >
                  <Option value="all" key="all">
                    全部
                  </Option>
                  {gateValue.map(({ did, devname }) => {
                    return (
                      <Option key={did} value={did}>
                        {devname} {did}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            {/* <Col span={3}>
              <FormItem>
                <Select placeholder="子设备序列号">
                  <Option key={1}>aa</Option>
                </Select>
              </FormItem>
            </Col> */}
            <Col span={5}>
              <FormItem>
                <RangePicker format="YYYY-MM-DD 00:00:00" onChange={this.searchTime} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
  searchValue = (key, value) => {
    const { dispatch } = this.props;
    const { formValues, sendValue, projectid } = this.state;
    const values = {
      ...formValues,
      ...sendValue,
    };
    switch (key) {
      case 'pattern': {
        values.pattern = value;
        break;
      }
      case 'devtyp': {
        if (value == 'all') {
          delete values.devtyp;
          break;
        } else {
          values.devtyp = value;
          break;
        }
      }
      case 'eventtyp': {
        if (value == 'all') {
          delete values.eventtyp;
          break;
        } else {
          values.eventtyp = value;
          break;
        }
      }
      case 'gateway': {
        if (value == 'all') {
          delete values.gateway;
          break;
        } else {
          values.gateway = value;
          break;
        }
      }
    }
    this.setState({
      sendValue: { ...values },
    });
    dispatch({
      type: 'manage/fetchAllRunningLog',
      payload: { ...values, projectid: projectid },
    });
  };
  searchTime = (data, dataString) => {
    const { dispatch } = this.props;
    const { formValues, sendValue, projectid } = this.state;
    var values = {};
    if (dataString[0].length < 5) {
      values = {
        ...formValues,
        ...sendValue,
      };
      delete values.starttime;
      delete values.endtime;
    } else {
      values = {
        ...formValues,
        ...sendValue,
        starttime: dataString[0],
        endtime: dataString[1],
      };
    }

    this.setState({
      sendValue: { ...values },
    });
    dispatch({
      type: 'manage/fetchAllRunningLog',
      payload: { ...values, projectid: projectid },
    });
  };

  handlePageChange = (page, pageSize) => {
    const { formValues, projectid, sendValue } = this.state;
    const { dispatch } = this.props;
    var pagenum = 0;
    const values = {
      ...sendValue,
      ...formValues,
      offset: page,
      count: pageSize,
    };
    this.setState({
      formValues: { ...values },
    });
    if (values.offset != 0) {
      pagenum = (values.offset - 1) * 10;
    }
    dispatch({
      type: 'manage/fetchAllRunningLog',
      payload: {
        ...values,
        projectid: projectid,
        offset: pagenum,
      },
    });
  };
  handleModalVisible = (state, rowValue) => {
    this.setState({
      modalVisible: !!state,
      rowValue,
    });
  };

  render() {
    const { formValues, modalVisible, rowValue } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
    };
    const {
      manage: { runningLogValue, runningLogTotal },
    } = this.props;
    return (
      <div>
        <Card>
          {this.renderSimpleForm()}
          <Table
            rowKey={record => record.id}
            columns={this.createColumn()}
            dataSource={runningLogValue}
            pagination={{
              current: formValues.offset,
              total: runningLogTotal,
              pageSize: formValues.count,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handlePageChange.bind(this),
              onShowSizeChange: this.handlePageChange.bind(this),
              showTotal: runningLogTotal => `共 ${runningLogTotal} 页`,
            }}
          />
        </Card>
        {modalVisible && (
          <CreateForm modalVisible={modalVisible} rowValue={rowValue} {...parentMethods} />
        )}
      </div>
    );
  }
}

export default DataStatistics;
