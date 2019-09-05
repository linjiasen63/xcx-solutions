const logger = {};

const levels = {
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export default function(outLevelStr) {
  const outLevel = levels[outLevelStr] || 0;

  for (let i in console) {
    const level = levels[i];
    if (level >= outLevel) {
      logger[i] = console[i];
    } else {
      logger[i] = function() {};
    }
  }
  
  return logger;
};