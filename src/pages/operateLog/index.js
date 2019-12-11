import React, { PureComponent, Fragment } from 'react';
import { Card, Form, Col, Row, Select, Input, Table, DatePicker } from 'antd';
import { connect } from 'dva';

const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const result = [{ key: '0', value: '失败' }, { key: '1', value: '成功' }];
const Result = {
  true: '成功',
  false: '失败',
};

@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
export default class operateLog extends PureComponent {
  formValues = {
    offset: 0,
    count: 10,
  };

  projectid = localStorage.getItem('token');
  state = {
    projectid: this.projectid,
    formValues: this.formValues,
    sendValue: [],
    typeValue: [],
  };

  createColumn() {
    return [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceNumber',
      },
      {
        title: '功能类型',
        dataIndex: 'actionType',
      },
      {
        title: '功能名称',
        dataIndex: 'actionName',
      },
      {
        title: '结果',
        // dataIndex: 'result',
        render: row => (
          <span
            style={{
              color: row.result == true ? 'rgba(126,211,33,0.85)' : 'rgba(252,4,10,0.85)',
            }}
          >
            {Result[row.result]}
          </span>
        ),
      },
      {
        title: '发生时间',
        dataIndex: 'occurredTime',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
      },
    ];
  }
  componentDidMount = () => {
    const { dispatch } = this.props;
    const { projectid, formValues } = this.state;
    // dispatch({
    //   type: 'manage/fetchAllOperateLog',
    //   payload: {  projectid: projectid },
    // })
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
  renderSimpleForm() {
    const { typeValue } = this.state;
    return (
      <Fragment>
        <Form>
          <Row gutter={10}>
            <Col span={5}>
              <FormItem>
                <Search placeholder="请输入设备名称或序列号" enterButton autoComplete="off" />
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
                <Select
                  placeholder="结果"
                  // onChange={this.searchValue.bind(this, 'devtyp')}
                >
                  <Option value="all" key="all">
                    全部
                  </Option>
                  {result.map(({ key, value }) => {
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
                <Select
                  placeholder="功能类型"
                  // onChange={this.searchValue.bind(this, 'devtyp')}
                >
                  <Option key={1}>aa</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Select
                  placeholder="功能名称"
                  // onChange={this.searchValue.bind(this, 'devtyp')}
                >
                  <Option key={1}>aa</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <DatePicker onChange={this.searchTime} />
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
    // dispatch({
    //   type: 'manage/fetchAllOperateLog',
    //   payload: { ...values,  projectid: projectid },
    // })
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
        starttime: dataString,
        endtime: dataString,
      };
    }

    this.setState({
      sendValue: { ...values },
    });
    // dispatch({
    //   type: 'manage/fetchAllOperateLog',
    //   payload: { ...values,  projectid: projectid },
    // })
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
    // dispatch({
    //   type: 'manage/fetchAllOperateLog',
    //   payload: {
    //     ...values,
    //     projectid: projectid,
    //     offset: pagenum,
    //   },
    // })
  };

  render() {
    const {
      formValues: { offset, count },
    } = this.state;
    const {
      manage: { operateValue, operateTotal },
    } = this.props;
    return (
      <Card>
        {this.renderSimpleForm()}
        <Table
          rowKey={record => record.id}
          columns={this.createColumn()}
          dataSource={operateValue}
          pagination={{
            current: offset,
            total: operateTotal,
            pageSize: count,
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: this.handlePageChange.bind(this),
            onShowSizeChange: this.handlePageChange.bind(this),
            showTotal: operateTotal => `共 ${operateTotal} 页`,
          }}
        />
      </Card>
    );
  }
}
