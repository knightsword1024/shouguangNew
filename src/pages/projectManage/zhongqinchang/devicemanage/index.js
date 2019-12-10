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
  Upload,
  Icon,
  message,
  Spin,
} from 'antd';
import { connect } from 'dva';
import style from './index.less';
import router from 'umi/router';

const RadioGroup = Radio.Group;
const Search = Input.Search;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

const status = {
  1: '在线',
  0: '离线',
};

// 删除设备信息界面
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
      type: 'manage/deleteDevice',
      payload: { projectid: projectid, did: rowValue.did },
    }).then(res => {
      if (res.code == 1000) {
        message.success('删除设备成功');
      } else {
        message.success('删除设备失败');
      }
      handleSearch();
      handleModalDeleteVisible(false, '');
    });
  };
  render() {
    const { form, rowValue, modalDeleteVisible, handleModalDeleteVisible } = this.props;
    return (
      <Modal
        title={'删除设备'}
        visible={modalDeleteVisible}
        onCancel={() => {
          handleModalDeleteVisible(false, '');
        }}
        onOk={() => this.okHandle()}
        destroyOnClose
        width={450}
      >
        <div className={style.delete}>
          您确定要删除&nbsp;
          <span className={style.deleteName}>
            {rowValue.devname}
            &nbsp;
            {rowValue.did}
          </span>
          &nbsp;吗
        </div>
      </Modal>
    );
  }
}
// 服务调用
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
@Form.create()
class CreateServe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parameter: [],
      parameterData: [],
      parameterUnit: '',
      cmdtyp: '',
      senid: '',
    };
  }
  okHandle = e => {
    const {
      form,
      handleModalServeVisible,
      dispatch,
      projectid,
      rowValue,
      handleSearch,
    } = this.props;
    const { cmdtyp, senid } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        projectid: projectid,
        did: rowValue.did,
        senid: senid,
        cmd: cmdtyp,
      };
      dispatch({
        type: 'manage/serviceCall',
        payload: values,
      }).then(res => {
        if (res) {
          if (res.code == 1000) {
            message.success(`服务调用成功`);
          } else {
            message.error(`服务调用失败，请重试`);
          }
        } else {
          message.error(`服务发送失败，请重试`);
        }
        handleSearch();
        handleModalServeVisible(false, '', 'quit');
      });
    });
  };
  changeMethod = value => {
    const { typeData, rowValue } = this.props;
    var cmdValue = [];
    for (let i of typeData) {
      if (rowValue.devtyp == i.devtyp) {
        cmdValue = i.acts;
      }
    }
    var parameter = [];
    for (let i of cmdValue) {
      if (i.acttyp == value) {
        this.setState({
          parameterData: i.value,
          parameterUnit: i.unit,
          cmdtyp: i.cmd,
        });
        for (let x of i.value) {
          parameter.push({ key: x.val, value: x.valname });
          this.setState({ parameter });
        }
      }
    }
  };

  changeSenid = value => {
    const { parameterData } = this.state;
    for (let i of parameterData) {
      if (value == i.val) {
        this.setState({
          senid: i.senid,
        });
      }
    }
  };

  render() {
    const { form, rowValue, modalServeVisible, typeData, handleModalServeVisible } = this.props;
    const { parameter, parameterUnit } = this.state;
    var cmdcontent = [];
    var cmdValue = [];
    for (let i of typeData) {
      if (rowValue.devtyp == i.devtyp) {
        if (i.acts != null) {
          cmdValue = i.acts;
          for (let x of i.acts) {
            cmdcontent.push({ type: x.acttyp, name: x.actname });
          }
        } else {
          break;
        }
      }
    }
    return (
      <Modal
        title={'服务调用'}
        visible={modalServeVisible}
        onCancel={() => {
          handleModalServeVisible(false, '', 'quit');
        }}
        onOk={() => this.okHandle()}
        destroyOnClose
      >
        <FormItem label="调用方法" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('typ', {
            rules: [
              {
                required: true,
                message: '请选择调用方法',
              },
            ],
          })(
            <Select
              placeholder="请选择调用方法"
              className={style.gateway}
              onChange={this.changeMethod.bind(this)}
            >
              {cmdcontent.map(({ type, name }) => {
                return <Option key={type}>{name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
        {parameter.length > 1 ? (
          <FormItem label="参数" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
            {form.getFieldDecorator('val', {
              rules: [
                {
                  required: true,
                  message: '请选择方式',
                },
              ],
            })(
              <Select
                placeholder="请选择参数"
                className={style.gateway}
                onChange={this.changeSenid.bind(this)}
              >
                {parameter.map(({ key, value }) => {
                  return <Option key={key}>{value}</Option>;
                })}
              </Select>
            )}
          </FormItem>
        ) : (
          <FormItem label="参数" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
            {form.getFieldDecorator('val', {
              rules: [
                {
                  required: true,
                  message: '请输入正确的数据',
                },
              ],
            })(
              <Input
                placeholder="请输入正确参数"
                // {`请输入${parameter[0].valname}范围，例${
                //   parameter[0].val
                // }`}
                autoComplete="off"
                className={style.input}
                addonAfter={parameterUnit}
              />
            )}
          </FormItem>
        )}
      </Modal>
    );
  }
}
// 修改或添加设备
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tierValue3: [],
      tierValue4: [],
      locationid: '',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/fetchSearchValue',
      payload: {},
    });
  }
  okHandle = e => {
    const {
      form,
      handleModalVisible,
      dispatch,
      projectid,
      rowValue,
      handleSearch,
      type,
    } = this.props;
    const { locationid } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      var fieldsValue = fieldsValue;
      if (fieldsValue.x == null) {
        fieldsValue.x = '0.00';
      }
      if (fieldsValue.y == null) {
        fieldsValue.y = '0.00';
      }
      const values = {
        projectid: projectid,
        devs: [
          {
            ...fieldsValue,
            locationid: locationid,
          },
        ],
      };
      dispatch({
        type: `manage/${type === 'add' ? 'addDevice' : 'changeDevice'}`,
        payload: values,
      }).then(res => {
        if (res.code == 1000) {
          message.success(`服务调用成功`);
        } else {
          message.error(`服务调用失败，请重试`);
        }
        handleSearch();
        handleModalVisible(false, '', 'quit');
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
        for (let i of fetchLocationData) {
          if (value == i.locationid) {
            this.setState({
              tierValue3: i.locations,
              locationid: value,
            });
          }
        }
        break;
      }
      case 'location2': {
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
      case 'location3': {
        this.setState({
          locationid: value,
        });

        break;
      }
    }
  };

  render() {
    const {
      modalVisible,
      type,
      form,
      handleModalVisible,
      rowValue,
      manage: { fetchLocationData, typeValue },
    } = this.props;
    const { tierValue3, tierValue4 } = this.state;
    return (
      <Modal
        title={type === 'add' ? '添加设备' : '修改设备'}
        visible={modalVisible}
        closable={false}
        destroyOnClose
        onCancel={() => {
          handleModalVisible(false, '');
        }}
        onOk={this.okHandle}
      >
        <FormItem label="设备类型" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('devtyp', {
            rules: [
              {
                required: true,
                message: '请选择设备类型',
              },
            ],
            initialValue: rowValue.devtyp,
          })(
            <Select placeholder="设备类型" className={style.devtype}>
              {typeValue.map(({ key, value }) => {
                return (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem label="设备名称" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('devname', {
            rules: [
              {
                required: true,
                message: '请输入设备名称',
              },
            ],
            initialValue: rowValue.devname,
          })(<Input placeholder="请输入设备名称" className={style.input} />)}
        </FormItem>
        <FormItem label="设备序列号" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('did', {
            rules: [
              {
                required: true,
                message: '请输入序列号',
              },
            ],
            initialValue: rowValue.did,
          })(
            <Input
              placeholder="请输入序列号"
              autoComplete="off"
              disabled={type != 'add'}
              className={style.input}
            />
          )}
        </FormItem>
        <FormItem label="SIM卡号" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('simsn', {
            initialValue: rowValue.simsn,
          })(
            <Input
              placeholder="请输入序列号"
              autoComplete="off"
              disabled={type != 'add'}
              className={style.input}
            />
          )}
        </FormItem>
        <FormItem label="逻辑位置" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('locationid')(
            <Row gutter={1}>
              <Col span={7}>
                <Select
                  placeholder="位置一 "
                  onChange={this.onChange.bind(this, 'location1')}
                  className={style.location}
                >
                  {fetchLocationData.map(({ locationid, name }) => {
                    return <Option key={locationid}>{name}</Option>;
                  })}
                </Select>
              </Col>
              <Col span={7}>
                <Select
                  placeholder="位置二"
                  onChange={this.onChange.bind(this, 'location2')}
                  className={style.location}
                >
                  {tierValue3.map(({ locationid, name }) => {
                    return <Option key={locationid}>{name}</Option>;
                  })}
                </Select>
              </Col>
              <Col span={7}>
                <Select
                  placeholder="位置三"
                  onChange={this.onChange.bind(this, 'location3')}
                  className={style.location}
                >
                  {tierValue4.map(({ locationid, name }) => {
                    return <Option key={locationid}>{name}</Option>;
                  })}
                </Select>
              </Col>
            </Row>
          )}
        </FormItem>

        <FormItem label="地理位置" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          <Row gutter={16}>
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

        <FormItem label="备注" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
          {form.getFieldDecorator('desc', {
            rules: [
              {
                required: false,
              },
            ],
            initialValue: rowValue.description,
          })(<TextArea placeholder="备注" autoComplete="off" className={style.input} />)}
        </FormItem>
      </Modal>
    );
  }
}

// 设备批量导入弹窗
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
@Form.create()
class CreateImport extends Component {
  state = {
    fileList: [],
    file: '',
  };

  handleFileChange = info => {
    if (info.file.name.split('.')[1] == 'xlsx') {
      let fileList = [...info.fileList];
      fileList.length > 1 && fileList.shift();
      this.setState({
        fileList: fileList,
        file: fileList.length ? info.file : '',
      });
    } else {
      message.error('只能上传.xlsx文件！');
    }
  };
  okHandle = () => {
    const { form, dispatch, handleSearch, handleModalImportVisible } = this.props;
    let { fileList, file } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const formData = new FormData();
      delete fieldsValue.field;
      const values = {
        ...fieldsValue,
        uploadFile: file,
      };
      for (let i in values) {
        formData.append(i, values[i]);
      }
      dispatch({
        type: 'equipment/addImportData',
        payload: formData,
      }).then(res => {
        if (res) {
          form.resetFields();
          handleModalImportVisible(false);
          handleSearch();
        }
      });
    });
  };
  downloadTem = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/fetchDataTemplate',
    });
  };
  render() {
    const { form, modalImportVisible, loading, handleModalImportVisible } = this.props;
    const { list } = this.state;
    let { fileList } = this.state;
    return (
      <Modal
        title="上传数据"
        visible={modalImportVisible}
        closable={false}
        destroyOnClose
        footer={false}
      >
        <div>
          <FormItem label="设备数据文件" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
            {form.getFieldDecorator('dataImport', {
              rules: [
                {
                  required: true,
                  message: '请选择正确的文件格式上传',
                },
              ],
            })(
              <Row gutter={10}>
                <Col span={14}>
                  <Upload
                    onChange={this.handleFileChange}
                    accept={'.xlsx'}
                    beforeUpload={() => false}
                    fileList={fileList}
                  >
                    <Button>
                      <Icon type="upload" /> 选择excel
                    </Button>
                  </Upload>
                </Col>
                <Col span={8}>
                  <a
                    style={{ marginLeft: 10 }}
                    target="_black"
                    // href={encodeURI(`/api/device/collectData/template/download?FW-Client-Info={"clientType":"PCWEB","sessionId":"${Cookies.set('sessionId')}"}`)}
                  >
                    下载模板
                  </a>
                </Col>
              </Row>
            )}
          </FormItem>
          <div className={style.testTip}>
            <Row>
              <Col span={2}>
                <Icon type="question-circle" />
              </Col>
              <Col span={22}>
                <Row>请确保上传的数据满足如下条件：</Row>
                <Row>
                  <Col span={1}>1.</Col>
                  <Col span={20}>一个文件中仅包含一个设备的数据；</Col>
                </Row>
                <Row>
                  <Col span={1}>2.</Col>
                  <Col span={20}>
                    每次上传的数据必须是连续的，如果需要上传不同时间段的数据，请分多个文件上传；
                  </Col>
                </Row>
                <Row>
                  <Col span={1}>3.</Col>
                  <Col span={20}>数据的时间范围不能与现有数据库中该设备的数据时间范围重叠。</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{ marginLeft: '110px' }}>
          <Button onClick={() => handleModalImportVisible(false)} style={{ marginLeft: '45%' }}>
            取消
          </Button>
          <Button type="primary" style={{ marginLeft: '15px' }} onClick={() => this.okHandle()}>
            导入
          </Button>
        </div>
      </Modal>
    );
  }
}

// 设备管理主页面
@connect(({ manage }) => ({ manage }))
class devicemanage extends Component {
  formValues = {
    offset: 0,
    count: 10,
  };
  state = {
    projectid: '3',
    formValues: this.formValues,
    modalVisible: false,
    modalServeVisible: false,
    modalDeleteVisible: false,
    modalImportVisible: false,
    type: '',
    rowValue: {},
    sendValue: {},
    tierValue3: [],
    tierValue4: [],
    typeValue: [],
    loading: true,
  };
  createColumns = () => [
    {
      title: '设备名称',
      dataIndex: 'devname',
    },
    {
      title: '设备序列号',
      dataIndex: 'did',
    },
    {
      title: '设备属性',
      dataIndex: 'devtypname',
    },
    {
      title: '所属网关',
      dataIndex: 'gatewayid',
    },
    {
      title: '安装位置',
      render: row => (
        <span>
          逻辑位置:
          {row.locationname}
          <br />
          物理位置:x:
          {row.x}
          &nbsp;y:
          {row.y}
        </span>
      ),
    },
    {
      title: '状态',
      render: row => (
        <span
          style={{
            color: row.status == 1 ? 'rgba(126,211,33,0.85)' : 'rgba(252,4,10,0.85)',
          }}
        >
          {status[row.status]}
        </span>
      ),
    },
    {
      title: '最后通讯时间',
      dataIndex: 'lastcommtime',
    },
    {
      title: '操作',
      render: row => (
        <Fragment>
          <a onClick={() => this.lookData(row)}>查看数据</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, row, 'edit')}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalServeVisible(true, row)}>服务调用</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalDeleteVisible(true, row)}>删除</a>
        </Fragment>
      ),
    },
  ];
  componentDidMount = () => {
    const { dispatch } = this.props;
    const { projectid, formValues } = this.state;
    dispatch({
      type: 'manage/fetchAllDevices',
      payload: {
        ...formValues,
        projectid: projectid,
      },
    }).then(res => {
      if (res) {
        this.setState({
          loading: false,
        });
      }
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
    dispatch({
      type: 'manage/fetchlocations',
      payload: {
        projectid: projectid,
      },
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
      type: 'manage/fetchAllDevices',
      payload: {
        ...values,
        projectid: projectid,
        offset: pagenum,
      },
    });
  };
  lookData = row => {
    const { projectid } = this.state;
    router.push({
      pathname: `/projectManage/sanyuanzhucun/datastatistics/${row.did}`,
      state: { did: row.did, devtyp: row.devtyp, projectid: projectid },
    });
  };
  handleModalVisible = (state, rowValue, type) => {
    this.setState({
      modalVisible: !!state,
      type,
      rowValue,
    });
  };
  handleModalServeVisible = (state, rowValue, type) => {
    const {
      manage: { cmdValue },
    } = this.props;
    if (type == 'quit') {
      this.setState({
        modalServeVisible: !!state,
      });
      return;
    }
    cmdValue.map(({ key, value }) => {
      if (key == rowValue.devtyp) {
        if (value == 1) {
          this.setState({
            modalServeVisible: !!state,
            rowValue,
          });
        } else {
          message.error('该设备类型暂不支持服务调用');
        }
      }
    });
  };

  handleModalDeleteVisible = (state, rowValue) => {
    this.setState({
      modalDeleteVisible: !!state,
      rowValue,
    });
  };

  handleModalImportVisible = state => {
    this.setState({
      modalImportVisible: !!state,
    });
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    const { projectid, formValues } = this.state;
    dispatch({
      type: 'manage/fetchAllDevices',
      payload: {
        ...formValues,
        projectid: projectid,
      },
    }).then(res => {
      if (res) {
        this.setState({
          loading: false,
        });
      }
    });
  };

  onChange = (key, value) => {
    const {
      dispatch,
      manage: { fetchLocationData },
    } = this.props;
    const { formValues, projectid, sendValue, tierValue3 } = this.state;
    const values = {
      ...formValues,
      ...sendValue,
    };
    switch (key) {
      case 'pattern': {
        values.pattern = value;
        break;
      }
      case 'gatewayid': {
        if (value == 'all') {
          delete values.gatewayid;
          break;
        } else {
          values.gatewayid = value;
          break;
        }
      }
      case 'devtyp': {
        var value1 = [];
        if (value == 'all') {
          delete values.devtyps;
          break;
        } else {
          value1.push(value);
          values.devtyps = value1;
          break;
        }
      }
      case 'location1': {
        for (let i of fetchLocationData) {
          if (value == i.locationid) {
            this.setState({
              tierValue3: i.locations,
            });
          }
        }
        values.locationid = value;
        break;
      }
      case 'location2': {
        for (let i of tierValue3) {
          if (value == i.locationid) {
            this.setState({
              tierValue4: i.locations,
            });
          }
        }
        values.locationid = value;
        break;
      }
      case 'location3': {
        values.locationid = value;
        break;
      }
    }
    this.setState({
      sendValue: { ...values },
    });
    dispatch({
      type: 'manage/fetchAllDevices',
      payload: { ...values, projectid: projectid },
    });
  };

  render() {
    const {
      formValues: { offset, count },
      modalVisible,
      type,
      rowValue,
      modalServeVisible,
      modalDeleteVisible,
      modalImportVisible,
      projectid,
      tierValue3,
      tierValue4,
      typeValue,
      loading,
    } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleModalServeVisible: this.handleModalServeVisible,
      handleModalDeleteVisible: this.handleModalDeleteVisible,
      handleModalImportVisible: this.handleModalImportVisible,
      handleSearch: this.handleSearch,
    };
    const {
      manage: { manageData, devTotal, typeData, fetchLocationData, gateValue },
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
                      placeholder="请输入设备名称或序列号"
                      enterButton
                      autoComplete="off"
                      onSearch={this.onChange.bind(this, 'pattern')}
                    />
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem>
                    <Select placeholder="所属网关" onChange={this.onChange.bind(this, 'gatewayid')}>
                      <Option value="all" key="all">
                        全部
                      </Option>
                      {gateValue.map(({ devname, did }) => {
                        return (
                          <Option value={did}>
                            {devname}
                            {did}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem>
                    <Select placeholder="设备属性" onChange={this.onChange.bind(this, 'devtyp')}>
                      <Option key="all">全部</Option>
                      {typeValue.map(({ key, value }) => {
                        return <Option key={key}>{value}</Option>;
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select placeholder="位置一" onChange={this.onChange.bind(this, 'location1')}>
                      {fetchLocationData.map(({ locationid, name }) => {
                        return <Option key={locationid}>{name}</Option>;
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select placeholder="位置二" onChange={this.onChange.bind(this, 'location2')}>
                      {tierValue3.map(({ locationid, name }) => {
                        return <Option key={locationid}>{name}</Option>;
                      })}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={3}>
                  <FormItem>
                    <Select placeholder="位置三" onChange={this.onChange.bind(this, 'location3')}>
                      {tierValue4.map(({ locationid, name }) => {
                        return <Option key={locationid}>{name}</Option>;
                      })}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                  <FormItem>
                    <Button type="primary" onClick={() => this.handleModalVisible(true, '', 'add')}>
                      添加设备
                    </Button>
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem>
                    <Button
                      type="primary"
                      // onClick={() => this.handleModalImportVisible(true)}
                    >
                      批量导入
                    </Button>
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem>
                    <Button
                      type="primary"
                      // onClick={() => this.handleModalVisible(true, '', 'add')}
                    >
                      设备升级
                    </Button>
                  </FormItem>
                </Col>
                <Col span={2}>
                  <FormItem>
                    <Button
                      type="primary"
                      // onClick={() => this.handleModalVisible(true, '', 'add')}
                    >
                      服务调用
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={style.bottom}>
            <Spin spinning={loading}>
              <Table
                loading={loading}
                rowKey={record => record.id}
                dataSource={manageData}
                columns={this.createColumns()}
                pagination={{
                  current: offset,
                  total: devTotal,
                  pageSize: count,
                  onChange: this.handlePageChange,
                  onShowSizeChange: this.handlePageChange,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  showTotal: devTotal => `共 ${devTotal} 条`,
                }}
              />
            </Spin>
          </div>
        </Card>

        {modalVisible && (
          <CreateForm
            modalVisible={modalVisible}
            typeValue={typeValue}
            type={type}
            projectid={projectid}
            manageData={manageData}
            rowValue={rowValue}
            {...parentMethods}
          />
        )}
        {modalServeVisible && (
          <CreateServe
            modalServeVisible={modalServeVisible}
            projectid={projectid}
            typeData={typeData}
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
        {modalImportVisible && (
          <CreateImport modalImportVisible={modalImportVisible} {...parentMethods} />
        )}
      </div>
    );
  }
}

export default devicemanage;
