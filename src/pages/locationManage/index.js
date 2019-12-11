import React, { Component, Fragment } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Select,
  Input,
  Table,
  DatePicker,
  Modal,
  Button,
  message,
  Spin,
} from 'antd';
import { connect } from 'dva';
import style from './index.less';

const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TextArea = Input.TextArea;

//删除位置弹窗
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
@Form.create()
class CreateDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  okHandle = () => {
    const { dispatch, rowValue, projectid, handleSearch, handleModalDeleteVisible } = this.props;
    dispatch({
      type: 'manage/deletelocations',
      payload: { projectid: projectid, locationid: rowValue.locationid },
    }).then(res => {
      if (res.code == 1000) {
        message.success('删除位置成功');
      } else {
        message.error('删除位置失败');
      }
      handleSearch();
      handleModalDeleteVisible(false, '');
    });
  };
  render() {
    const { rowValue, modalDeleteVisible, handleDeleteModalVisible } = this.props;
    return (
      <Modal
        title={'删除设备'}
        visible={modalDeleteVisible}
        onCancel={() => {
          handleDeleteModalVisible(false, '');
        }}
        onOk={() => this.okHandle()}
        destroyOnClose
        width={450}
      >
        <div className={style.delete}>
          您确定要删除位置
          <span className={style.deleteValue}>
            {rowValue.location1}
            &nbsp;
            {rowValue.location2}
            &nbsp;
            {rowValue.location3}
            &nbsp;
          </span>
          吗
        </div>
      </Modal>
    );
  }
}
// 创建位置弹窗
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tierValue3: [],
      tierValue4: [],
      locationid: 0,
      inputValue: '',
      show: [false, false, false],
    };
  }
  componentDidMount() {
    const { dispatch, projectid } = this.props;
    dispatch({
      type: 'manage/fetchlocations',
      payload: { projectid: projectid },
    });
  }
  okHandle = e => {
    const { form, handleModalVisible, handleSearch, dispatch, projectid } = this.props;
    const { locationid, inputValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        projectid: projectid,
        parentid: locationid,
        locationname: inputValue,
      };
      delete values.location1;
      delete values.location2;
      delete values.location3;
      dispatch({
        type: 'manage/addlocations',
        payload: { ...values },
      }).then(res => {
        if (res.code == 1000) {
          message.success(`服务调用成功`);
        } else {
          message.error(`服务调用失败，请重试`);
        }
        handleSearch();
        handleModalVisible(false, '');
      });
    });
  };
  onChange = (key, value) => {
    const {
      manage: { fetchLocationData },
    } = this.props;
    const { tierValue3 } = this.state;
    switch (key) {
      case 'location1': {
        if (value == '0') {
          this.setState({
            show: [true, false, false],
            locationid: '0',
          });
          break;
        } else {
          for (let i of fetchLocationData) {
            if (value == i.locationid) {
              this.setState({
                tierValue3: i.locations,
                locationid: value,
              });
              break;
            }
          }
        }
      }
      case 'location2': {
        if (value == '0') {
          this.setState({
            show: [false, true, false],
          });
          break;
        } else {
          for (let i of tierValue3) {
            if (value == i.locationid) {
              this.setState({
                locationid: value,
              });
              if (i.locations != null) {
                this.setState({
                  tierValue4: i.locations,
                });
              }
            }
          }
          break;
        }
      }
      case 'location3': {
        if (value == '0') {
          this.setState({
            show: [false, false, true],
          });
          break;
        } else {
          this.setState({
            locationid: value,
          });
          break;
        }
      }
    }
  };

  changeInput = value => {
    this.setState({
      inputValue: value.target.value,
    });
  };
  render() {
    const {
      modalVisible,
      handleModalVisible,
      form,
      manage: { fetchLocationData },
    } = this.props;
    const { tierValue3, tierValue4, show } = this.state;
    return (
      <Modal
        title="添加位置"
        visible={modalVisible}
        closable={false}
        destroyOnClose
        onCancel={() => handleModalVisible(false, '')}
        onOk={() => this.okHandle()}
      >
        <FormItem label="位置一" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('location1', {})(
            <div>
              <Select
                placeholder="第一层位置 "
                onChange={this.onChange.bind(this, 'location1')}
                className={style.location}
              >
                {fetchLocationData.map(({ locationid, name }) => {
                  return <Option key={locationid}>{name}</Option>;
                })}
                <Option key={'0'}>自定义位置</Option>
              </Select>
              <br />
              {show[0] && (
                <Input
                  placeholder="请输入自定义位置"
                  className={style.location}
                  onChange={this.changeInput}
                />
              )}
            </div>
          )}
        </FormItem>
        <FormItem label="位置二" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('location2', {})(
            <div>
              <Select
                placeholder="第二层位置"
                onChange={this.onChange.bind(this, 'location2')}
                className={style.location}
              >
                {tierValue3.map(({ locationid, name }) => {
                  return <Option key={locationid}>{name}</Option>;
                })}
                <Option key={'0'}>自定义位置</Option>
              </Select>
              <br />
              {show[1] && (
                <Input
                  placeholder="请输入自定义位置"
                  className={style.location}
                  onChange={this.changeInput}
                />
              )}
            </div>
          )}
        </FormItem>
        <FormItem label="位置三" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('location3', {})(
            <div>
              <Select
                placeholder="第三层位置"
                onChange={this.onChange.bind(this, 'location3')}
                className={style.location}
              >
                {tierValue4.map(({ locationid, name }) => {
                  return <Option key={locationid}>{name}</Option>;
                })}
                <Option key={'0'}>自定义位置</Option>
              </Select>
              <br />
              {show[2] && (
                <Input
                  placeholder="请输入自定义位置"
                  className={style.location}
                  onChange={this.changeInput}
                />
              )}
            </div>
          )}
        </FormItem>
      </Modal>
    );
  }
}

//位置管理主页面
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
export default class locationManage extends Component {
  formValues = {
    offset: 0,
    count: 10,
  };
  projectid = localStorage.getItem('token');
  state = {
    projectid: this.projectid,
    formValues: this.formValues,
    modalVisible: false,
    modalDeleteVisible: false,
    sendValue: [],
    typeValue: [],
    tierValue3: [],
    tierValue4: [],
    loading: true,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    const { projectid } = this.state;
    dispatch({
      type: 'dynamicmenu/getDynamicmenu',
      payload: { value: 1 },
    });
    dispatch({
      type: 'manage/fetchlocations',
      payload: { projectid: projectid },
    }).then(res => {
      if (res) {
        this.setState({
          loading: false,
        });
      }
    });
  };
  createColumn() {
    return [
      {
        title: '位置id',
        dataIndex: 'locationid',
      },
      {
        title: '位置一',
        dataIndex: 'location1',
      },
      {
        title: '位置二',
        dataIndex: 'location2',
      },
      {
        title: '位置三',
        dataIndex: 'location3',
      },
      {
        title: '操作',
        render: row => (
          <div>
            <a onClick={() => this.handleModalDeleteVisible(true, row)}>删除</a>
          </div>
        ),
      },
    ];
  }

  renderSimpleForm() {
    const { tierValue3, tierValue4 } = this.state;
    const {
      manage: { fetchLocationData },
    } = this.props;
    return (
      <Fragment>
        <Form>
          <Row gutter={10}>
            <Col span={3}>
              <FormItem>
                <Select
                  placeholder="位置一"
                  onChange={this.onLocationChange.bind(this, 'location1')}
                >
                  {fetchLocationData.map(({ locationid, name }) => {
                    return <Option key={locationid}>{name}</Option>;
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Select
                  placeholder="位置二"
                  onChange={this.onLocationChange.bind(this, 'location2')}
                >
                  {tierValue3.map(({ locationid, name }) => {
                    return <Option key={locationid}>{name}</Option>;
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                <Select
                  placeholder="位置三"
                  onChange={this.onLocationChange.bind(this, 'location3')}
                >
                  {tierValue4.map(({ locationid, name }) => {
                    return <Option key={locationid}>{name}</Option>;
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  添加位置
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
  onLocationChange = (key, value) => {
    const {
      dispatch,
      manage: { fetchLocationData },
    } = this.props;
    const { tierValue3, projectid } = this.state;
    var locationid = '';
    switch (key) {
      case 'location1': {
        for (let i of fetchLocationData) {
          if (value == i.locationid) {
            locationid = value;
            this.setState({
              tierValue3: i.locations,
              locationid: locationid,
            });
          }
        }
        break;
      }
      case 'location2': {
        for (let i of tierValue3) {
          if (value == i.locationid) {
            locationid = value;
            this.setState({
              locationid: locationid,
            });
            if (i.locations != null) {
              this.setState({
                tierValue4: i.locations,
              });
            }
          }
        }
        break;
      }
      case 'location3': {
        locationid = locationid;
        this.setState({
          locationid: locationid,
        });

        break;
      }
    }
    dispatch({
      type: 'manage/fetchlocations',
      payload: { projectid: projectid, parentid: locationid },
    });
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    const { projectid } = this.state;
    dispatch({
      type: 'manage/fetchlocations',
      payload: { projectid: projectid },
    }).then(res => {
      if (res) {
        this.setState({
          loading: false,
        });
      }
    });
  };
  handleModalVisible = state => {
    this.setState({
      modalVisible: !!state,
    });
  };
  handleModalDeleteVisible = (state, rowValue) => {
    this.setState({
      modalDeleteVisible: !!state,
      rowValue: rowValue,
    });
  };

  render() {
    const { modalVisible, rowValue, modalDeleteVisible, projectid, loading } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleModalDeleteVisible: this.handleModalDeleteVisible,
      handleSearch: this.handleSearch,
    };
    const {
      manage: { locationList },
    } = this.props;
    return (
      <div>
        <Card>
          {this.renderSimpleForm()}
          <Spin spinning={loading}>
            <Table
              rowKey={record => record.id}
              columns={this.createColumn()}
              dataSource={locationList}
            />
          </Spin>
        </Card>
        {modalVisible && (
          <CreateForm
            modalVisible={modalVisible}
            projectid={projectid}
            rowValue={rowValue}
            {...parentMethods}
          />
        )}
        {modalDeleteVisible && (
          <CreateDelete
            modalDeleteVisible={modalDeleteVisible}
            projectid={projectid}
            rowValue={rowValue}
            {...parentMethods}
          />
        )}
      </div>
    );
  }
}
