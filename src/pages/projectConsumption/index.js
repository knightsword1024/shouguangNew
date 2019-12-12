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
  message,
} from 'antd';
import { connect } from 'dva';
import style from './index.less';

const RadioGroup = Radio.Group;
const Search = Input.Search;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

// 删除项目弹窗界面
@connect(({ manage }) => ({ manage }))
@Form.create()
class CreateDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  okHandle = e => {
    const { rowValue, dispatch, handleSearch, handleModalDeleteVisible } = this.props;
    dispatch({
      type: `manage/deleteProject`,
      payload: { projectid: rowValue.id },
    }).then(res => {
      if (res.code == 1000) {
        message.success(`项目删除成功`);
      } else {
        message.error(`项目删除失败，请重试`);
      }
      handleSearch();
      handleModalDeleteVisible(false, '');
    });
  };
  componentDidMount() {}
  render() {
    const { form, rowValue, modalDeleteVisible, handleModalDeleteVisible } = this.props;
    return (
      <Modal
        title={'删除项目'}
        visible={modalDeleteVisible}
        onCancel={() => {
          handleModalDeleteVisible(false, '');
        }}
        onOk={() => this.okHandle()}
        destroyOnClose
        width={300}
      >
        <div className={style.delete}>
          您确定要删除项目&nbsp;
          <span className={style.deleteName}>{rowValue.name}</span>
          &nbsp;吗
        </div>
      </Modal>
    );
  }
}
// 添加项目弹窗
@connect(({ manage }) => ({ manage }))
@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  okHandle = () => {
    const { form, handleModalVisible, dispatch, handleSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      dispatch({
        type: 'manage/addProject',
        payload: values,
      }).then(res => {
        if (res.code == 1000) {
          message.success(`创建项目成功`);
        } else {
          message.error(`创建项目失败`);
        }
        handleSearch();
        handleModalVisible(false, '', 'quit');
      });
    });
  };
  render() {
    const { modalVisible, type, form, handleModalVisible, rowValue } = this.props;

    return (
      <Modal
        title={type === 'add' ? '添加项目' : '修改项目'}
        visible={modalVisible}
        destroyOnClose
        onCancel={() => {
          handleModalVisible(false, '');
        }}
        onOk={this.okHandle}
        closable={false}
      >
        <FormItem label="项目名称" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入项目名称',
              },
            ],
          })(<Input placeholder="请输入项目名称" />)}
        </FormItem>
        <FormItem label="项目编号" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('sn', {
            rules: [
              {
                required: true,
                message: '请输入项目编号',
              },
            ],
          })(<Input placeholder="请输入项目编号" />)}
        </FormItem>
        <FormItem label="逻辑位置" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: '请输入逻辑位置',
              },
            ],
          })(<Input placeholder="请输入逻辑位置" />)}
        </FormItem>

        <FormItem label="地理位置" labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
          <Row gutter={12}>
            <Col span={10}>
              {form.getFieldDecorator('x', {
                initialValue: rowValue.x,
              })(<Input addonBefore="X:" placeholder="经度" />)}
            </Col>
            <Col span={10}>
              {form.getFieldDecorator('y', {
                initialValue: rowValue.y,
              })(<Input addonBefore="Y:" placeholder="纬度" />)}
            </Col>
          </Row>
        </FormItem>

        <FormItem label="项目描述" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('desc', {})(<TextArea placeholder="请输入" row={4} />)}
        </FormItem>
      </Modal>
    );
  }
}

// 项目统计主页面
@connect(({ manage }) => ({ manage }))
class projectConsumption extends Component {
  state = {
    modalVisible: false,
    modalDeleteVisible: false,
    type: '',
    rowValue: {},
  };
  createColumns = () => [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目场景',
      dataIndex: 'did',
    },
    {
      title: '所属企业',
      dataIndex: 'devtypname',
    },
    {
      title: '创建时间',
      dataIndex: 'gatewayname',
    },
    {
      title: '项目位置',
      dataIndex: 'location',
    },
    {
      title: '项目描述',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      render: row => (
        <Fragment>
          {/* <a onClick={() => this.handleModalVisible(true, row, 'edit')}>修改</a>
          <Divider type='vertical' /> */}
          <a onClick={() => this.handleModalDeleteVisible(true, row)}>删除</a>
        </Fragment>
      ),
    },
  ];
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
  };
  handleSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/fetchAllProject',
      payload: {},
    });
  };
  handleModalVisible = (state, rowValue, type) => {
    this.setState({
      modalVisible: !!state,
      type,
      rowValue,
    });
  };
  handleModalDeleteVisible = (state, rowValue) => {
    this.setState({
      modalDeleteVisible: !!state,
      rowValue,
    });
  };

  render() {
    const { modalVisible, modalDeleteVisible, type, rowValue } = this.state;
    const parentMethods = {
      handleModalDeleteVisible: this.handleModalDeleteVisible,
      handleModalVisible: this.handleModalVisible,
      handleSearch: this.handleSearch,
    };
    const {
      manage: { projectData },
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
                      placeholder="请输入项目名称"
                      enterButton
                      // onSearch={(value) => this.handleSearch(value)}
                      autoComplete="off"
                    />
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select
                      placeholder="项目场景"
                      // onSearch={(value) => this.handleSearch(value)}
                    >
                      {/* {devtypname.map(({ key, value }) => {
                        return <Option key={key}>{value}</Option>
                      })} */}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select
                      placeholder="所属企业"
                      // onSearch={(value) => this.handleSearch(value)}
                    >
                      {/* {devtypname.map(({ key, value }) => {
                        return <Option key={key}>{value}</Option>
                      })} */}
                    </Select>
                  </FormItem>
                </Col>
                <div style={{ float: 'right' }}>
                  <Col span={2}>
                    <FormItem>
                      <Button
                        type="primary"
                        onClick={() => this.handleModalVisible(true, '', 'add')}
                      >
                        添加项目
                      </Button>
                    </FormItem>
                  </Col>
                </div>
              </Row>
            </Form>
          </div>
          <div className={style.bottom}>
            <Table
              rowKey={record => record.id}
              dataSource={projectData}
              columns={this.createColumns()}
            />
          </div>
        </Card>
        {modalVisible && (
          <CreateForm
            modalVisible={modalVisible}
            type={type}
            rowValue={rowValue}
            {...parentMethods}
          />
        )}
        {modalDeleteVisible && (
          <CreateDelete
            modalDeleteVisible={modalDeleteVisible}
            rowValue={rowValue}
            {...parentMethods}
          />
        )}
      </div>
    );
  }
}
export default projectConsumption;
