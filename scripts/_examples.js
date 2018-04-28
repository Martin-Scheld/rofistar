const { resolve } = require('path')
const { icon, color } = require('../helpers/fa')
const axios = require('axios');

const obj = () => {
  return {
    timestamp: Date.now(),
    isMember: false,
    name: 'Donna Mosciski',
    phone: '246.703.8410 x41339',
    location: {
      country: 'Netherlands',
      city: 'Amsterdam'
    }
  }
}

exports.foo = 'bar'
exports.date = new Date()
exports.number = 5 * 5 / 2.1

// reverse selected text
exports.reverse = x => x.split('').reverse().join('')
exports.trim = x => x.trim('')
exports['lines => Array'] = x => x.split('\n')

exports.array = [2000, false, true, new Date(), Date.now(), 'Hello World', obj(), [1,2,3, 5 * 5]]
exports.obj = obj()

// return axios promise
exports.uzby = axios.get('https://uzby.com/api.php?min=4&max=20')

// http get request example using callback function
exports[`${icon('f1b3')} api.chew.pro/trbmb`] = (x, cb) => {
  axios.get('http://api.chew.pro/trbmb').then(resp => cb(null, resp.data[0]))
}

// http get request example using callback function
exports[`${icon('f074')} Random Chuck Norris Joke`] = (x, cb) => {
  axios.get('http://api.icndb.com/jokes/random').then(resp => cb(null, resp.data.value.joke))
}