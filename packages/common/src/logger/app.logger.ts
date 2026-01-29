import * as winston from 'winston';
const WinstonCloudWatch = require('winston-cloudwatch');

export interface LoggerConfig {
    awsAccessKey?: string;
    awsSecretKey?: string;
    awsRegion?: string;
    logGroupName?: string;
    logStreamName?: string;
    isDevelopment?: boolean;
}

export const createLogger = (config: LoggerConfig) => {
    const transports: any[] = [
        new (winston.transports.Console)({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''
                        }`;
                }),
            ),
        }),
    ];

    if (
        config.awsAccessKey &&
        config.awsSecretKey &&
        config.awsRegion &&
        config.logGroupName
    ) {
        transports.push(
            new WinstonCloudWatch({
                logGroupName: config.logGroupName,
                logStreamName: config.logStreamName || 'app-logs',
                awsRegion: config.awsRegion,
                awsAccessKeyId: config.awsAccessKey,
                awsSecretKey: config.awsSecretKey,
                messageFormatter: ({ level, message, additionalInfo }) => {
                    return `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`;
                }
            }) as any,
        );
    }

    return winston.createLogger({
        level: 'info',
        transports,
    });
};
