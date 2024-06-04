/*
 * @Author: CP
 * @Date: 2024-05-24 10:19:25
 * @Description: 
 */
import inquirer from 'inquirer';

const question = [
  {
    type: 'confirm',
    name: 'isDeploy',
    message: '是否发布到线上环境?',
    default: false,
  }
  
]

inquirer
  .prompt(question).then(function (answers) {
    console.log(answers);

  }).catch(function (error) {
    console.log('error: ', error);
  })