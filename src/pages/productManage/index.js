import React, { Component, Fragment } from 'react';
import { Card, Form, Input, Button, Row, Col, Select, Table, Divider, Modal, Radio } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import style from './index.less';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

// 删除产品弹窗界面
@Form.create()
class CreateDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  okHandle = e => {};
  componentDidMount() {}
  render() {
    const { form, rowValue, modalDeleteVisible, handleModalDeleteVisible } = this.props;
    return (
      <Modal
        title={'删除产品'}
        visible={modalDeleteVisible}
        onCancel={() => {
          handleModalDeleteVisible(false, '');
        }}
        onOk={() => this.okHandle()}
        destroyOnClose
        width={300}
      >
        <div className={style.delete}>
          您确定要删除产品&nbsp;
          <span className={style.deleteName}>{rowValue.proname}</span>
          &nbsp;吗
        </div>
      </Modal>
    );
  }
}

//添加、修改产品弹窗界面
@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  okHandle = () => {};

  render() {
    const { modalVisible, type, form, handleModalVisible, rowValue } = this.props;
    return (
      <Modal
        title={type === 'add' ? '添加设备' : '修改设备'}
        visible={modalVisible}
        closable={false}
        destroyOnClose
        onCancel={() => {
          handleModalVisible();
        }}
        onOk={this.okHandle}
      >
        <FormItem label="产品名称" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('devname', {
            rules: [
              {
                required: true,
                message: '请输入产品',
              },
            ],
            initialValue: rowValue.devname,
          })(<Input placeholder="请输入产品名称" className={style.input} />)}
        </FormItem>
        <FormItem label="协议类型" colon={false} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('did', {
            rules: [
              {
                required: true,
                message: '请选择协议类型',
              },
            ],
            initialValue: rowValue.did,
          })(<Select placeholder="请选择协议类型" className={style.select} />)}
        </FormItem>
        <FormItem label="节点类型" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('gatewaytype', {
            rules: [
              {
                required: true,
                message: '请选择节点类型',
              },
            ],
            initialValue: rowValue.gatewaytype,
          })(
            <Select placeholder="请选择节点类型" className={style.select}>
              {/* {list.map(itme => <Option key={itme.id} >{itme.name}</Option>)} */}
            </Select>
          )}
        </FormItem>
        <FormItem label="是否接入网关" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('gatewayname', {
            rules: [
              {
                required: true,
                message: '是否接入网关',
              },
            ],
            initialValue: rowValue.gatewayname,
          })(
            <RadioGroup>
              <Radio defaultChecked value={1}>
                是
              </Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="产品描述" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          {form.getFieldDecorator('description', {
            rules: [
              {
                required: false,
              },
            ],
            initialValue: rowValue.description,
          })(<Input placeholder="请输入产品描述" autoComplete="off" className={style.input} />)}
        </FormItem>
      </Modal>
    );
  }
}

// 产品管理主页面
@connect(({ product }) => ({ product }))
class productManage extends Component {
  state = {
    projectid: 1,
    current: 1,
    pageSize: 10,
    total: 100,
    modalVisible: false,
    modalDeleteVisible: false,
    rowValue: {},
    manageData: [],
    type: '',
  };

  skipToInfo = id => {
    router.push(`/productManage/info/${id}`);
  };
  createColumns = () => [
    {
      title: '产品名称',
      // dataIndex: 'proname',
      render: row => (
        <a className="skip" onClick={() => this.skipToInfo(row.id)}>
          {row.proname}
        </a>
      ),
    },
    {
      title: '协议类型',
      dataIndex: 'did',
    },
    {
      title: '节点类型',
      dataIndex: 'devtypname',
    },
    {
      title: '是否接入网关',
      dataIndex: 'gatewayname',
    },
    {
      title: '产品描述',
      dataIndex: 'position',
    },
    {
      title: '操作',
      render: row => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, row, 'edit')}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalDeleteVisible(true, row)}>删除</a>
        </Fragment>
      ),
    },
  ];
  componentDidMount = () => {
    const { dispatch } = this.props;
    localStorage.setItem('menuNum', 0);
    dispatch({
      type: 'dynamicmenu/getDynamicmenu',
      payload: { menutype: 0 },
    });
    dispatch({
      type: 'product/fetchAllProduct',
      payload: {},
    });
  };
  onChange = page => {
    this.setState({
      current: page,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({
      current: current,
      pageSize: pageSize,
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
    const {
      current,
      pageSize,
      total,
      modalVisible,
      modalDeleteVisible,
      type,
      rowValue,
    } = this.state;
    const {
      product: { productData },
    } = this.props;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleModalDeleteVisible: this.handleModalDeleteVisible,
    };
    return (
      <div>
        <Card>
          <div className={style.top}>
            <Form>
              <Row gutter={10}>
                <Col span={5}>
                  <FormItem>
                    <Search
                      placeholder="清输入产品名称"
                      enterButton
                      // onSearch={(value) => this.handleSearch(value)}
                      autoComplete="off"
                    />
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select
                      placeholder="协议类型"
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
                      placeholder="节点类型"
                      // onSearch={(value) => this.handleSearch(value)}
                    >
                      {/* {devtypname.map(({ key, value }) => {
                        return <Option key={key}>{value}</Option>
                      })} */}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem>
                    <Select
                      placeholder="是否接入网关"
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
                        添加产品
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
              dataSource={productData}
              columns={this.createColumns()}
              pagination={{
                current: current,
                total: total,
                pageSize: pageSize,
                onChange: this.onChange.bind(this),
                showQuickJumper: true,
                showSizeChanger: true,
                onShowSizeChange: this.onShowSizeChange.bind(this),
                showTotal: total => `共 ${total} 页`,
              }}
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
export default productManage;
