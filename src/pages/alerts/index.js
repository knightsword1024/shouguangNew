import React, { Component, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Table,
  Divider,
  Modal,
  Radio,
  DatePicker,
  message,
} from 'antd';
import { connect } from 'dva';
import style from './index.less';

const RadioGroup = Radio.Group;
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

const Status = {
  '1': '已处理',
  '0': '未处理',
  '2': '忽略',
};

const Result = [
  { key: '1', value: '已处理' },
  { key: '0', value: '未处理' },
  { key: '2', value: '忽略' },
];
// 处理界面
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
@Form.create()
class CreateResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  okHandle = () => {
    const { dispatch, form, rowValue, handleSearch, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        alarmid: rowValue.id,
        createtime: rowValue.createtime,
      };
      delete values.devicePosition;
      dispatch({
        type: 'manage/changeAlertStatus',
        payload: values,
      }).then(res => {
        if (res.code == 1000) {
          message.success(`告警信息处理成功`);
        } else {
          message.error(`告警信息处理失败，请重试`);
        }
        handleSearch();
        handleModalVisible(false, '');
      });
    });
  };

  render() {
    const { form, rowValue, modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        title={'处理告警'}
        visible={modalVisible}
        onCancel={() => {
          handleModalVisible(false, '');
        }}
        onOk={() => this.okHandle()}
        destroyOnClose
      >
        <FormItem label="设备位置" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          {form.getFieldDecorator('devicePosition', {
            initialValue: rowValue.devicePosition,
          })(<Input autoComplete="off" disabled />)}
        </FormItem>
        <FormItem label="处理方式" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('status', {
            rules: [
              {
                required: true,
                message: '请选择处理方式',
              },
            ],
          })(
            <RadioGroup name="status">
              <Radio defaultChecked value={'1'}>
                已处理
              </Radio>
              <Radio value={'2'}>忽略</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="备注" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          {form.getFieldDecorator('remarks')(<TextArea placeholder="备注" />)}
        </FormItem>
      </Modal>
    );
  }
}
// 查看界面
// @connect(({ equipment, loading, production }) => ({ production, equipment, loading: loading.models.equipment }))
@Form.create()
class CreateLook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form, rowValue, modalLookVisible, handleModalLookVisible } = this.props;
    return (
      <Modal
        title={'告警查看'}
        visible={modalLookVisible}
        onCancel={() => handleModalLookVisible(false, '')}
        onOk={() => this.handleModalLookVisible(false, '')}
        destroyOnClose
      >
        <FormItem label="设备位置" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          {form.getFieldDecorator('devicePosition', {
            initialValue: rowValue.devicePosition,
          })(<Input autoComplete="off" disabled />)}
        </FormItem>
        <FormItem label="处理时间" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          {form.getFieldDecorator('updatetime', {
            initialValue: rowValue.updatetime,
          })(<Input autoComplete="off" disabled />)}
        </FormItem>
        <FormItem label="处理人" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          {form.getFieldDecorator('resultPerson', {
            initialValue: rowValue.resultPerson,
          })(<Input autoComplete="off" disabled />)}
        </FormItem>
        <FormItem label="备注" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          {form.getFieldDecorator('remarks', {
            initialValue: rowValue.remarks,
          })(<TextArea placeholder="备注" disabled="true" autoSize="true" />)}
        </FormItem>
      </Modal>
    );
  }
}
// 告警信息主页面
@connect(({ manage }) => ({ manage }))
class alerts extends Component {
  formValues = {
    offset: 0,
    count: 10,
  };
  state = {
    formValues: this.formValues,
    modalVisible: false,
    modalLookVisible: false,
    rowValue: {},
    sendValue: {},
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicmenu/getDynamicmenu',
      payload: { menutype: 0 },
    });
    dispatch({
      type: 'manage/fetchAllProject',
      payload: {},
    });

    dispatch({
      type: 'manage/fetchAllAlertType',
      payload: { eventtyp: '2' },
    });

    dispatch({
      type: 'manage/fetchAllAlert',
      payload: {},
    });
  };
  createColumns = () => [
    {
      title: '所属项目',
      dataIndex: 'projectname',
    },
    {
      title: '设备序列号',
      dataIndex: 'did',
    },
    {
      title: '告警类型',
      dataIndex: 'alarmtype',
    },
    {
      title: '告警描述',
      dataIndex: 'alarmdesc',
    },

    {
      title: '上报时间',
      dataIndex: 'createtime',
    },
    {
      title: '处理结果',
      render: row => (
        <span
          style={{
            color: row.status === '0' ? 'rgba(252,4,10,0.85)' : 'rgba(126,211,33,0.85)',
          }}
        >
          {Status[row.status]}
        </span>
      ),
    },
    {
      title: '操作',
      render: row => (
        <Fragment>
          {row.status != '0' ? (
            <a onClick={() => this.handleModalLookVisible(true, row)}>查看</a>
          ) : (
            <a onClick={() => this.handleModalVisible(true, row)}>处理</a>
          )}
        </Fragment>
      ),
    },
  ];
  handleSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/fetchAllAlert',
      payload: {},
    });
  };
  handlePageChange = (page, pageSize) => {
    const { formValues, sendValue } = this.state;
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
      type: 'manage/fetchAllAlert',
      payload: {
        ...values,
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
  handleModalLookVisible = (state, rowValue) => {
    this.setState({
      modalLookVisible: !!state,
      rowValue,
    });
  };
  searchValue = (key, value) => {
    const { dispatch } = this.props;
    const { formValues, sendValue } = this.state;
    const values = {
      ...formValues,
      ...sendValue,
    };
    switch (key) {
      case 'pattern': {
        values.pattern = value;
        break;
      }
      case 'projectid': {
        if (value == 'all') {
          delete values.projectid;
          break;
        } else {
          values.projectid = value;
          break;
        }
      }
      case 'alarmtyp': {
        if (value == 'all') {
          delete values.alarmtyp;
          break;
        } else {
          values.alarmtyp = value;
          break;
        }
      }
      case 'devtyp': {
        values.devtyp = value;
      }
      case 'status': {
        if (value == 'all') {
          delete values.status;
          break;
        } else {
          values.status = value;
          break;
        }
      }
    }
    this.setState({
      sendValue: { ...values },
    });
    dispatch({
      type: 'manage/fetchAllAlert',
      payload: { ...values },
    });
  };
  searchTime = (data, dataString) => {
    const { dispatch } = this.props;
    const { formValues, sendValue } = this.state;
    var values = {};
    if (dataString.length < 10) {
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
        starttime: dataString + ' 00:00:00',
        endtime: dataString + ' 23:59:59',
      };
    }

    this.setState({
      sendValue: { ...values },
    });
    dispatch({
      type: 'manage/fetchAllAlert',
      payload: { ...values },
    });
  };

  render() {
    const {
      formValues: { offset, count },
      data,
      modalVisible,
      rowValue,
      modalLookVisible,
    } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleModalLookVisible: this.handleModalLookVisible,
      handleSearch: this.handleSearch,
    };
    const {
      manage: { projectData, aletTotal, alertValue, alertTypeValue },
    } = this.props;
    return (
      <div>
        <Card>
          <div className={style.top}>
            <Form>
              <Row gutter={10}>
                <Col span={5}>
                  <FormItem>
                    <Search
                      placeholder="请输入设备序列号"
                      enterButton
                      onSearch={this.searchValue.bind(this, 'pattern')}
                      autoComplete="off"
                    />
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem>
                    <Select
                      placeholder="选择项目"
                      onChange={this.searchValue.bind(this, 'projectid')}
                    >
                      <Option value="all" key="all">
                        全部
                      </Option>
                      {projectData.map(({ id, name }) => {
                        return (
                          <Option key={id} value={id}>
                            {name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select
                      placeholder="报警类型"
                      onChange={this.searchValue.bind(this, 'alarmtyp')}
                    >
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
                <Col span={3}>
                  <FormItem>
                    <Select placeholder="处理结果" onChange={this.searchValue.bind(this, 'status')}>
                      <Option value="all" key="all">
                        全部
                      </Option>
                      {Result.map(({ key, value }) => {
                        return (
                          <Option key={key} value={key}>
                            {value}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem>
                    <DatePicker format="YYYY-MM-DD" onChange={this.searchTime.bind(this)} />
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={style.bottom}>
            <Table
              rowKey={record => record.id}
              dataSource={alertValue}
              columns={this.createColumns()}
              pagination={{
                current: offset,
                total: aletTotal,
                pageSize: count,
                onChange: this.handlePageChange,
                showQuickJumper: true,
                showSizeChanger: true,
                onShowSizeChange: this.handlePageChange,
                showTotal: aletTotal => `共 ${aletTotal} 条`,
              }}
            />
          </div>
        </Card>
        {modalVisible && (
          <CreateResult modalVisible={modalVisible} rowValue={rowValue} {...parentMethods} />
        )}
        {modalLookVisible && (
          <CreateLook modalLookVisible={modalLookVisible} rowValue={rowValue} {...parentMethods} />
        )}
      </div>
    );
  }
}

export default alerts;
