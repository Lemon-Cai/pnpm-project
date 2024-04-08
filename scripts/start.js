/*
 * @Author: CP
 * @Date: 2024-01-09 14:54:09
 * @Description: 
 */
import inquirer from 'inquirer';

const question = [
  {
    type: 'input',
    message: '请输入项目名称：',
    name: 'name',
  },
  {
    type: "list",
    message: "请选择要启动的项目：",
    name: "projectName",
    choices: [
      'A', 'B', 'C', new inquirer.Separator(), 'D', 'E', 'F', 'G',
    ],
    default: 1, //
  },
  {
    type: 'checkbox',
    message: '请选择想要的主题：',
    name: 'checkbox',
    choices () {
      return ['light', 'dark', 'ocean']
    },
    default: ['light'], // default is expected to be an Array of the checked choices value.
  },
  {

  },
  {
    type: 'password',
    message: '请输入密码：',
    name: 'password',
  },
  
]

inquirer
  .prompt(question).then(function (answers) {
    console.log(answers);

  }).catch(function (error) {
    console.log('error: ', error);
  })