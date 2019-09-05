module.exports = {
    'env': {
      'browser': true,
      'es6': true
    },
    'extends': [
      "plugin:vue/recommended",
      "prettier"
      // "plugin:vue/essential",
      // "@vue/standard",
      // 'eslint:recommended'
    ],
    'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
      'ecmaVersion': 2018,
      'sourceType': 'module',
      "parser": "babel-eslint",
      
    },
    'plugins': [
      'vue'
    ],
    'rules': {
          // 0:off 1:on 2:error
          eqeqeq: 0,
          "no-console": 0,
          // 解决iview x-invalid-end-tag eslint报错问题
          "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
          "vue/no-unused-components": 0,
          "vue/no-unused-vars": 0,
          "no-irregular-whitespace":0,
          "no-unused-vars": 1,
          camelcase: 0,
          semi: ["error", "always"],  //末尾需要分号结束
          "no-extra-semi": 1,   //禁用不必要的分号
          "no-lonely-if": 1,   // 禁止 if 语句作为唯一语句出现在 else 语句块中
          "no-multiple-empty-lines": [1,{"max": 3}],  //不允许多个空行,最大空行为3
          "no-whitespace-before-property": 1,   //禁止属性前有空白
          "arrow-parens": [1,"as-needed"],  // 要求箭头函数在有多个参数情况下使用圆括号
          'space-before-function-paren': 0, // 函数括号前后需要空格
    }
  }
  