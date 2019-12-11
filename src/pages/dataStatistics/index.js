import React, { Component, Fragment } from 'react';
import { Card, Form, Col, Row, Select, Input, DatePicker } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';

const { Search } = Input;
const FormItem = Form.Item;
const { Option } = Select;

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = '-';
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

// 数据统计主页面
@connect(({ manage, loading }) => ({ manage, loading: loading.models.manage }))
class DataStatistics extends Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    ...this.props.location.state,
    sendValue: [],
    propertyList: [],
    showValue: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { did, devtyp, projectid } = this.state;
    var today = getNowFormatDate();
    const propertyList = [];
    const values = {
      projectid: projectid,
      did: did,
      starttime: today + ' 00:00:00',
      endtime: today + ' 23:59:59',
    };
    dispatch({
      type: 'manage/fetchSearchValue',
      payload: { projectid: projectid },
    }).then(res => {
      if (res.code == 1000) {
        for (let i of res.data.devtyps) {
          if (devtyp == i.devtyp) {
            for (let x of i.sensors) {
              propertyList.push({
                name: x.name,
                value: x.proptype + x.senid,
              });
            }
          }
        }
      }

      this.setState({
        propertyList: propertyList,
        sendValue: {
          ...values,
          senid: propertyList[0].value.substring(6),
          proptype: propertyList[0].value.substring(0, 6),
        },
        showValue: propertyList[0].name,
      });
      dispatch({
        type: 'manage/fetchSensorData',
        payload: {
          ...values,
          senid: propertyList[0].value.substring(6),
          proptype: propertyList[0].value.substring(0, 6),
        },
      });
    });
  }

  renderSimpleForm() {
    const { propertyList } = this.state;
    return (
      <div style={{ marginLeft: 115 }}>
        <Form>
          <Row gutter={20}>
            <Col span={3}>
              <FormItem>
                <DatePicker onChange={this.searchTime} />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                <Select
                  placeholder="请选择数据类型"
                  onChange={this.searchValue}
                  // defaultValue={propertyList[0].name}
                >
                  {propertyList.map(({ value, name }) => {
                    return (
                      <Option key={value} value={value}>
                        {name}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  searchValue = value => {
    const { dispatch } = this.props;
    const { propertyList, sendValue } = this.state;
    const values = {
      ...sendValue,
      proptype: value.substring(0, 6),
      senid: value.substring(6),
    };
    var name = '';
    for (let i of propertyList) {
      if (value == i.value) {
        name = i.name;
      }
    }
    this.setState({
      sendValue: values,
      showValue: name,
    });
    dispatch({
      type: 'manage/fetchSensorData',
      payload: { ...values },
    });
  };
  searchTime = (data, dataString) => {
    const { dispatch } = this.props;
    const { sendValue } = this.state;
    const values = {
      ...sendValue,
      starttime: dataString + ' 00:00:00',
      endtime: dataString + ' 23:59:59',
    };
    this.setState({
      sendValue: { ...values },
    });
    dispatch({
      type: 'manage/fetchSensorData',
      payload: { ...values },
    });
  };

  getLine = () => {
    const {
      manage: { xValue, yValue, unitValue, dataTotal },
    } = this.props;
    const { showValue } = this.state;
    let option = {
      title: {
        left: 'center',
        text: '实时数据图',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          dataBackgroundColor: '#4FC8FF',
          //             // fillerColor: '',
          textStyle: {
            color: '#fff',
          },
        },
        {
          type: 'inside',
          realtime: true,
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xValue,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          showMinLabel: true,
          showMaxLabel: true,
          formatter: `{value}${unitValue}`,
        },
      },
      series: [
        {
          name: showValue,
          data: yValue,
          type: 'line',
          smooth: true,
          areaStyle: {},
          itemStyle: {
            normal: {
              color: '#4FC8FF',
              lineStyle: {
                width: 2,
                type: 'solid', // 'dotted'虚线 'solid'实线
              },
            },
          },
        },
      ],
    };
    return option;
  };

  render() {
    return (
      <Card>
        {this.renderSimpleForm()}
        <ReactEcharts
          option={this.getLine()}
          theme="light"
          style={{ height: '600px', width: '100%' }}
        />
      </Card>
    );
  }
}
export default DataStatistics;
