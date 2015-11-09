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
    { name: 'KD2F',   children: ['2F', 'KD'] },
    { name: '4E',     children: ['UE', 'XE', 'KE', 'HE']},
    { name: '4H',     children: ['UH', 'XH', 'KH', 'HH']},    
])
.constant('crnaPositions', [
    '30', '31', '32', '33', // 4R
    '34', '35', '36', '37', // 4N
    '20', '21', '22', '23', // KD + 4H + FIR
    '24', '25', '26', '27', // 4E + 2F
    '11', '12', '13', '14'  // FIR + KF + Nuit
]);