/*
 * @Author: CP
 * @Date: 2024-01-04 14:05:58
 * @Description: 
 */
const crypto = require('crypto');

const password = 'CP'; // 替换成你的密码
const salt = crypto.randomBytes(16); // 生成一个随机的盐值

// 使用 scrypt 算法派生密钥
crypto.scrypt(password, salt, 32, (err, derivedKey) => {
  if (err) throw err;

  const yourDerivedKey = derivedKey.toString('hex');
  console.log('Your derived key:', yourDerivedKey);
});
