import colors from "colors"

type LogLevels = "INFO" | "ERROR" | "WARN" | "DEBUG"

const getLogLevelColor = (logLevel: LogLevels): string => {
	switch (logLevel) {
		case "INFO":
			return colors.blue(logLevel)
		case "ERROR":
			return colors.red(logLevel)
		case "WARN":
			return colors.yellow(logLevel)
		case "DEBUG":
			return colors.magenta(logLevel)
		default:
			return colors.white(logLevel)
	}
}

export const log = (LogLevel: LogLevels, message: string, ...rest: string[]): void => {
	const time = new Date().toLocaleTimeString()
	const coloredLevel = getLogLevelColor(LogLevel)

	const fullMessage = [message, ...rest].join(" ")

	console.log(
		coloredLevel,
		colors.green(`[${time}]`),
		colors.cyan(fullMessage)
	)
}
