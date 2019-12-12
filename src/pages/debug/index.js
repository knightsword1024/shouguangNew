import React, { Component, Fragment } from 'react';
import { Input, Card, Form, Row, Col, Button } from 'antd';
import style from './index.less';
import { connect } from 'dva';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

@connect(({ manage }) => ({ manage }))
class debugPage extends Component {
  state = {
    value1: '',
    value2: '',
  };
  componentDidMount = () => {
    const { dispatch } = this.props;
    localStorage.setItem('menuNum', 0);
    dispatch({
      type: 'dynamicmenu/getDynamicmenu',
      payload: { menutype: 0 },
    });
  };
  handleTopic = () => {
    if (event && event.target && event.target.value) {
      let value = event.target.value;
      this.setState(() => ({ value1: value }));
    }
  };
  handleParams = () => {
    if (event && event.target && event.target.value) {
      let value = event.target.value;
      this.setState(() => ({ value2: value }));
    }
  };
  sendValue = () => {
    const { value1, value2 } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'manage/debugDevice',
      payload: {
        topic: value1,
        param: value2,
      },
    });
  };
  render() {
    const {
      manage: { debugValue },
    } = this.props;
    return (
      <Card>
        <Row gutter={10}>
          <Col span={20}>
            <Form>
              <FormItem label="topic" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
                <Input placeholder="请输入topic" onChange={event => this.handleTopic(event)} />
              </FormItem>

              <FormItem label="发送内容" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
                <TextArea
                  placeholder="请输入发送内容"
                  onChange={event => this.handleParams(event)}
                  autoSize
                />
              </FormItem>
              <FormItem label="返回内容" labelCol={{ span: 7 }} wrapperCol={{ span: 15 }}>
                <TextArea value={debugValue} autoSize disabled />
              </FormItem>
            </Form>
          </Col>
          <Col span={3}>
            <Button type="primary" onClick={() => this.sendValue()}>
              发送
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default debugPage;
