import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// 日志级别定义
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// 文件日志传输器配置
const fileTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d', // 保留30天的日志
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  )
});

// 控制台日志传输器（开发环境）
const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
    })
  )
});

// 数据库日志传输器（模拟）
class DatabaseLoggerTransport extends winston.Transport {
  constructor(opts) {
    super(opts);
    this.level = opts.level || 'info';
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // 这里应该实现实际的数据库写入逻辑
    // 例如：插入到 logs 表中
    try {
      // await db.query(
      //   'INSERT INTO logs (level, message, meta, timestamp) VALUES (?, ?, ?, ?)',
      //   [info.level, info.message, JSON.stringify(info.meta || {}), info.timestamp]
      // );
      console.log(`[DB_LOG] ${info.level}: ${info.message}`);
    } catch (error) {
      console.error('Failed to write log to database:', error);
    }

    callback();
  }
}

const dbTransport = new DatabaseLoggerTransport({
  level: 'error' // 只将错误级别日志写入数据库
});

// 创建并导出logger实例
const logger = winston.createLogger({
  levels: LOG_LEVELS,
  transports: [
    fileTransport,
    dbTransport
  ],
  exceptionHandlers: [
    fileTransport,
    new winston.transports.Console()
  ]
});

// 在非生产环境中添加控制台输出
if (process.env.NODE_ENV !== 'production') {
  logger.add(consoleTransport);
}

export default logger;