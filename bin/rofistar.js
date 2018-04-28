#! /usr/bin/env node
const exec = require('child_process').exec;
const clipboardy = require('clipboardy');
const _ = require('lodash');
const resolve = require('path').resolve;
const debug = false;

function log(...args) {
  if (debug) {
    for (let arg of args) {
      console.log(args);
    }
  }
}

function copy(input = '') {
  if (typeof input !== 'string') {
    clipboardy.writeSync(JSON.stringify(input));
  } else {
    clipboardy.writeSync(input);
  }
}

function paste() {
  exec('xdotool key ctrl+shift+v');
}

function copyPaste(content) {
  let originalClipboard = clipboardy.readSync()
  if (typeof content === 'object') {
    copy(JSON.stringify(content, false, 2));
  } else {
    copy(content)
  }
  
  paste();
  setTimeout(() => {
    copy(originalClipboard)
  }, 500)
}

function parseCMD(cmd, styled = true) {
  if (styled) {
    return cmd.match(/^(.+)\s<span\slang="(\@[a-z\_0-9\/\s\-]+)/i);
  }
  return cmd.match(/(.+)(\@[a-z\_0-9\/]+)/i);
}

function handlePromise(obj) {
  if (obj && obj.then) {
    obj.then(resp => {
      if (resp && resp.data) {
        return copyPaste(resp.data);
        
      } else {
        if (resp && resp.length) {
          copyPaste(resp);
        }
      }
    }).catch(err => {
      copyPaste(err.message || err);
    });
  }
}

function handleOutput(output) {
  log(output);

  if (output && ~['string', 'number', 'float', 'data', 'boolean'].indexOf(typeof output) || Array.isArray(output)) {
    log('is primitive value');
    if (typeof output === 'object') {
      return copyPaste(JSON.stringify(output, false, 2))
    }
    return copyPaste(output)
  }

  if (output && typeof output === 'object' && !Array.isArray(output)) {
    handlePromise();
  }
}

function run(cmd=null) {
  // No command found to execute, exit....
  if (!cmd || !cmd.length) {
    return null;
  }

  let match = parseCMD(cmd, true);

  if (!match || match.length !== 3) {
    match = parseCMD(cmd, false);
  }

  if (!match || match.length !== 3) {
    return null;
  }

  let func = match[1].trim();
  let file = match[2].trim().replace('@', '');

  exec('xclip -o', (err, clipboard, stderr) => {

    let module;
    let output;

    try {
      module = require(`../scripts/${file}`)[func];
    } catch (err) {
      module = require(file)[func];
    }

    try {
      // if module is not returing a function
      if (_.isFunction(module) === false && !module.then) {
        if (typeof module === 'object') {
          return copyPaste(JSON.stringify(module, false, 2));
        }

        return copyPaste(module);
      }

      // handle promise
      if (module && typeof module === 'object' && module.then) {
        return handlePromise(module);
      }

      // module is a function, should execute and analyse
      let output = module(clipboard, (err, output, config = {}) => {

        if (err) {
          return copyPaste(err);
        }

        // handle promise
        if (output && typeof output === 'object' && output.then) {
          return handlePromise(output);
        }

        if (output && output.length) {
          return handleOutput(output);
        }

      });

      return handleOutput(output);

    } catch (err) {
      copyPaste(err.message || err);
    }

  });
}

let rofiCmd = [
  `cat ${resolve(__filename, '../../.rofistar/functions.rofi')}`,
  'sort',
  'rofi -dmenu -p "" -i -format s -markup-rows -columns 1 -lines 10'
  ].join(' | ')

exec(rofiCmd, (err, clipboard, stderr) => {
  if (err) {
    console.error(err, stderr)
  } else {
    run(clipboard.trim())
  }
});