'use strict';

/**
 * @ngdoc function
 * @name crnaConstants
 * @description
 * Multiple services with static content (sectors, positions) 
 */

angular.module('4meCdsConstants', [])
.constant('crnaAtomicSectors', [
    'UR', 'XR', 'KR', 'YR', 'HR',
    'UB', 'UN', 'KN', 'HN',
    'KD',
    'UF', 'KF',
    'E', 'UE', 'XE', 'KE', 'HE',
    'SE', 'UH', 'XH', 'KH', 'HH'
])
.constant('crnaSectors',[ 
    { name: 'UXR',    children: ['UR', 'XR'] },
    { name: 'UXKR',   children: ['UR', 'XR', 'KR'] },
    { name: 'KHR',    children: ['KR', 'YR', 'HR'] },
    { name: 'HYR',    children: ['YR', 'HR'] },
    { name: '5R',     children: ['UXR', 'KHR'] },
    { name: 'UBN',    children: ['UN', 'UB'] },
    { name: 'UBKN',   children: ['UBN', 'KN'] },
    { name: 'KHN',    children: ['KN', 'HN'] },
    { name: '4N',     children: ['UB', 'UN', 'KN', 'HN'] },
    { name: 'URMN',   children: ['5R', '4N'] },
    { name: '2F',     children: ['KF', 'UF'] },
    { name: 'KD2F',   children: ['2F', 'KD'] }
])
.constant('crnaPositions', [
    '30', '31', '32', '33', // 4R
    '34', '35', '36', '37', // 4N
    '20', '21', '22', '23', // KD + 4H + FIR
    '24', '25', '26', '27', // 4E + 2F
    '11', '12', '13', '14'  // FIR + KF + Nuit
])
.constant('xmanStubData', [ // Stub data for xman module
    // http://google-styleguide.googlecode.com/svn/trunk/jsoncstyleguide.xml?showone=Property_Name_Format#Property_Name_Format
  {
    flightId: 1234,
    callsign: 'BAW63G',
    delay: 19,
    speed: '-3',
    applied: {
      position: 12,
      minCleanSpeed: true,
      when: Date.now() - 1000*60*10, // 10 minutes ago
      sectors: ['UR', 'XR'],
      speed: '-2'
    }
  },
  {
    flightId: 1235,
    callsign: 'BAW677',
    delay: 21,
    speed: '-4',
    applied: {}
  },
  { 
    flightId: 1236,
    callsign: 'EZS1023',
    delay: 10,
    speed: '-4',
    applied: {
      position: 14,
      minCleanSpeed: false,
      when: Date.now() - 1000*60*4, // 4 minutes ago
      sectors: ['UF', 'KF', 'KD'],
      speed: '0'
    }
  },
  {
    flightId: 1237,
    callsign: 'UAE77',
    delay: 35,
    speed: '-4',
    applied: {
      position: 14,
      minCleanSpeed: false,
      when: Date.now(),
      sectors: ['UF', 'KF'],
      speed: '-4'
    }
  },
  {
    flightId: 1238,
    callsign: 'EZY8989',
    delay: 4,
    speed: '0',
    applied: {}
  }
])
.constant('xmanDefaultSpeeds', [
  '-4', '-3', '-2', '-1', '0'
].reverse()) // Order with in decreasing order
// Stub arcid flight list
.constant('arcidFlightList', [
  'AFR1018', 'NJE143G', 'BAW633', 'MAJOR', 'HOP542BG', 'BAW555', 'AFR123G', 'MON5434', 'EZY1217', 'AZA212', 'BEL9B',
  'RYR1918', 'BEL511', 'DLH324', 'DLH501', 'DLH506'
])
.constant('arcidHistory', [
  { 
    callsign: 'AFR1018',
    departure: 'EHAM',
    destination: 'LFBD',
    who:  ['UR', 'XR'],
    when: Date.now() - 1000*60*4
  }, {
    callsign: 'DLH324',
    departure: 'EDDM',
    destination: 'KMIA',
    who: ['UF', 'KF'],
    when: Date.now() - 1000*60*2
  }, {
    callsign: 'MAJOR',
    departure: 'LFSB',
    destination: 'EGKK',
    who: ['UE', 'XE', 'KE'],
    when: Date.now() - 1000*60*34
  }
])
// Stub arcid point profile
.constant('arcidPointProfile', [
  {name: 'AVLON', when: Date.now() - 1000*60*6 - 60*1000, level: 360, trend: ''},
  {name: 'BRY', when: Date.now() - 1000*60*4, level: 360, trend: '-'},
  {name: 'CLM', when: Date.now() - 1000*60*4 + 60*1000, level: 346, trend: '-'},
  {name: 'UTELA', when: Date.now() - 1000*60*4 + 180*1000, level: 340, trend: ''},
  {name: 'KOPOR', when: Date.now() - 1000*60*4 + 240*1000, level: 340, trend: ''},
  {name: 'SOMIL', when: Date.now() - 1000*60*4 + 360*1000, level: 340, trend: ''},
  {name: 'BELDI', when: Date.now() - 1000*60*4 + 400*1000, level: 340, trend: ''},
  {name: 'KUTEX', when: Date.now() - 1000*60*4 + 444*1000, level: 340, trend: ''}
])
.constant('eapStubMessages', [
  {
    category: 'stam',
    when: Date.now() - 1000*60*2,
    data: {
      proposedFlights: ['BAW655', 'EZY645'],
      sectorsToAvoid: ['HN', 'KN'],
      numberOfFlights: 1
    }
  },{
    category: 'hotspot',
    when: Date.now() - 1000*60*2 + 1000*25,
    data: {
      sectors: ['UR', 'XR'],
      start: Date.now() - 1000*60*42,
      end: Date.now() + 1000*60*18
    }
  },{
    category: 'regulation',
    when: Date.now() - 1000*60*124,
    data: {
      sectors: ['KR', 'HR'],
      start: Date.now() - 1000*60*35,
      end: Date.now() + 1000*60*55
    }
  }
]);
