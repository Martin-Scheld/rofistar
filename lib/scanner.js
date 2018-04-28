import fs from 'fs-extra';
import { exec } from 'child_process';
import { resolve } from 'path'
import randomColor from 'randomcolor'

export default {
  find(cb) {

    let pluginFolder = '';

    Object.keys(require.cache).forEach(function (key) {
      if (key.indexOf('/plugins') !== -1) {
        delete require.cache[key]
      }
    });

    exec(`find ${resolve('./scripts/')} | egrep -i .js$ | sort`, (err, stdout, stderr) => {

      let scripts = stdout
        .split('\n')
        .filter(i => i.length);

      let modules = [];

      scripts.forEach(script => {

        try {
          let cont = require(script);
          let name = script.slice(0);

          name = name.replace(resolve('./scripts/'), '').replace('.js', '');

          Object.keys(cont).forEach(i => {
            modules.push(`${i} <span lang="@${name}" foreground="grey">@${name}</span>`);
          });

        } catch (err) {
          console.error(script);
          console.error(err.message);
        }
      });

      let file = '.rofistar/functions.rofi';

      fs.writeFile(resolve(file), modules.join('\n'), err => {
        if(err){
          console.error(err);
        }
      });

    });
  }
}