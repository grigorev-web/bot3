module.exports = {
  // Настройки для автоматической перезагрузки
  autoReload: {
    enabled: true,
    watchPaths: ['src/'],
    extensions: ['js', 'json'],
    ignorePatterns: [
      '**/*.test.js',
      '**/*.spec.js',
      '**/node_modules/**'
    ]
  },
  
  // Настройки логирования в режиме разработки
  logging: {
    level: 'debug',
    showTimestamp: true,
    showFileInfo: true
  },
  
  // Настройки для hot reload
  hotReload: {
    enabled: true,
    checkInterval: 1000,
    gracefulShutdown: true
  }
};
