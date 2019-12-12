import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Modal, Form, Input, Select, Row, Col, message } from 'antd';
import style from './index.less';
import page from '../../assets/add.png';
import project from '../../assets/project.png';
import { push } from 'react-router-redux';

const { Meta } = Card;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const projectName = {
  三元朱: 'sanyuanzhucun',
  水产养殖: 'shuichanyangzhi',
  种禽场: 'zhongqinchang',
  果蔬加工: 'guoshujiagong',
  菜博会: 'caibohui',
  巨淀湖景区: 'judianhu',
};

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
        handleModalVisible(false);
      });
    });
  };
  render() {
    const { modalVisible, type, form, handleModalVisible, rowValue } = this.props;

    return (
      <Modal
        title="添加项目"
        visible={modalVisible}
        destroyOnClose
        onCancel={() => {
          handleModalVisible(false);
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
              {form.getFieldDecorator('x', {})(<Input addonBefore="X:" placeholder="经度" />)}
            </Col>
            <Col span={10}>
              {form.getFieldDecorator('y', {})(<Input addonBefore="Y:" placeholder="纬度" />)}
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

// 全量项目信息
@connect(({ manage }) => ({ manage }))
class HomePage extends Component {
  state = {
    projectData: [],
    modalVisible: false,
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
  };
  handleClick = id => {
    localStorage.setItem('menuNum', id);
    const { dispatch } = this.props;
    dispatch(push(`/devicemanage`));
  };
  handleSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/fetchAllProject',
      payload: {},
    });
  };
  handleModalVisible = state => {
    this.setState({
      modalVisible: !!state,
    });
  };

  render() {
    const { modalVisible } = this.state;
    const {
      manage: { projectData },
    } = this.props;
    const parentMethods = {
      handleSearch: this.handleSearch,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div className={style.main}>
        {projectData.map(({ name, id }) => {
          return (
            <div key={id} className={style.card} onClick={this.handleClick.bind(this, id)}>
              <Card bordered="true" hoverable="true" cover={<img alt="example" src={project} />}>
                <Meta title={name} />
              </Card>
            </div>
          );
        })}
        <div className={style.add} onClick={() => this.handleModalVisible(true)}>
          <Card hoverable="true" cover={<img alt="example" src={page} />}>
            <Meta title="添加项目" />
          </Card>
        </div>
        {modalVisible && <CreateForm modalVisible={modalVisible} {...parentMethods} />}
      </div>
    );
  }
}

export default HomePage;
