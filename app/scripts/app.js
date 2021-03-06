'use strict';

angular.module('gitSourceApp', ['ngSelect', 'hljs', 'ui.router', 'ngStorage'])

  .constant('gsConst', {
    THEME_MAP: {
      'arta': 'dark',
      'ascetic': 'light',
      'brown_paper': 'dark',
      'default': 'light',
      'docco': 'light',
      'far': 'dark',
      'foundation': 'light',
      'github': 'light',
      'googlecode': 'light',
      'idea': 'light',
      'ir_black': 'dark',
      'magula': 'light',
      'mono-blue': 'light',
      'monokai': 'dark',
      'monokai_sublime': 'dark',
      'obsidian': 'dark',
      'pojoaque': 'dark',
      'railscasts': 'dark',
      'rainbow': 'dark',
      'school_book': 'dark',
      'solarized_dark': 'dark',
      'solarized_light': 'light',
      'sunburst': 'dark',
      'tomorrow-night-blue': 'dark',
      'tomorrow-night-bright': 'dark',
      'tomorrow-night-eighties': 'dark',
      'tomorrow-night': 'dark',
      'tomorrow': 'light',
      'vs': 'light',
      'xcode': 'light',
      'zenburn': 'dark'
    }
  })

  .config([
           '$stateProvider', '$urlRouterProvider',
  function ($stateProvider,   $urlRouterProvider) {


    $urlRouterProvider.otherwise('.example');

    $stateProvider
      .state('main', {
        url: '/*sourcePath?theme&fontsize&file&line&lang&autogrow&edit&fileselect&result&init'
      });

  }]);
