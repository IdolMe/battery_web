Promise.retry = function (fn, num, delay) {
  return new Promise((resolve, reject) => {
    let action = function (resolve, reject) {
      fn().then((prod) => {
        resolve(prod);
      }).catch(e => {
        if (num > 0) {
          setTimeout(() => {
            action(resolve, reject);
          }, delay);
        } else {
          reject(e);
        }
        num--;
      })
    }
    // 调用执行函数
    action(resolve, reject);
  })
}
