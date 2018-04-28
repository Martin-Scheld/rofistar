import scanner from '../lib/scanner';
import chokidar from 'chokidar';
import { resolve } from 'path';

var watcher = chokidar.watch(resolve('./scripts'), {
  ignored: /^\./,
  persistent: true,
  ignoreInitial: false,
});

watcher
  .on('add', path => {
    scanner.find('add', path)
  })
  .on('change', path => {
    scanner.find('change', path)
  })
  .on('unlink', path => {
    scanner.find('remove', path)
  });