const { exec } = require('child_process');

export const cli = (cmd) => {
  let promise = new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        if (stdout && stdout.length) {
          resolve(stdout.trim());
        } else {
          resolve('');
        }
      }
    });
  });

  return promise;
}