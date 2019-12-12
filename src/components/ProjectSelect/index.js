import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';

const { Option } = Select;

@connect(({ project, dynamicmenu }) => ({ project, dynamicmenu }))
export default class projectSelect extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchAllProject',
    });
  };

  changeProject = value => {
    localStorage.setItem('menuNum', value);
    router.push(`/devicemanage/${value}`);
  };
  render() {
    const {
      project: { projectTotal },
    } = this.props;
    console.log(projectTotal);
    return (
      <div className={styles.select}>
        <Select placeholder="选择项目" onChange={this.changeProject.bind(this)}>
          {projectTotal.map(({ id, name }) => {
            return (
              <Option key={id} value={id}>
                {name}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
}
