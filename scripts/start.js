
const question = [
  {
    {
      type: "select",
      message: "请选择要启动的项目：",
      name: "projectName",
      options: [

      ]
    },
  }
]

import("inquirer")..then((result) => {
  const inquirer = result.default
  inquirer.prompt(question).then(answer => {
    
  })
}).catch((err) => {
  
});