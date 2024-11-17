import { serve } from "@hono/node-server"
import dotenv from "dotenv"
import { Hono } from "hono"
import { logger } from "hono/logger"
import path from "path"
import connect from "./config/database"
import authenticate from "./middlewares/Auth"
import Login from "./routes/Auth/Login"
import refresh from "./routes/Auth/refresh"
import CreateUser from "./routes/Auth/Register"
import { log } from "./utils/log"
import { User } from "./models/user"
import fs from 'fs/promises';

dotenv.config()
const port = Number(process.env.SERVER__PORT)
const host = process.env.SERVER__HOST
const app = new Hono()
app.use("*", (ctx, next) => {
	connect()
	return next()
})
app.use("*", logger(log))

// USERS
app.post("/api/auth/register", (ctx) => {
	return CreateUser(ctx)
})
app.post("/api/auth/login", (c) => Login(c))
app.post("/api/auth/refresh", authenticate, (c) => refresh(c))
// PROTECTED
app.get("admin", authenticate, async (ctx) => {
	return ctx.json({ success: true })
})

app.get("/avatars/:id", async (c) => {
	try {
		const userUuid = c.req.param("id")
		if (!userUuid) {
			return c.json({ error: "UUID пользователя не указан" }, 400)
		}

		// Проверяем существование пользователя с таким UUID
		const user = await User.findOne({ uuid: userUuid })
		if (!user) {
			return c.json({ error: "Пользователь не найден" }, 404)
		}

		const avatarsDir = path.join(process.cwd(), "static", "avatars")

		try {
			const files = await fs.readdir(avatarsDir)
			// Ищем файл, который начинается с UUID пользователя
			const avatarFile = files.find((file) => file.startsWith(userUuid.toString()))

			if (!avatarFile) {
				return c.json({ error: "Аватар не найден" }, 404)
			}

			const filePath = path.join(avatarsDir, avatarFile)
			const fileContent = await fs.readFile(filePath)

			// Определяем тип файла по расширению
			const fileExtension = path.extname(avatarFile).toLowerCase()
			let contentType = "image/jpeg" // значение по умолчанию

			switch (fileExtension) {
				case ".png":
					contentType = "image/png"
					break
				case ".webp":
					contentType = "image/webp"
					break
				case ".jpg":
				case ".jpeg":
					contentType = "image/jpeg"
					break
			}

			// Устанавливаем заголовки для кэширования
			c.header("Cache-Control", "public, max-age=31536000") // кэшировать на 1 год
			c.header("Content-Type", contentType)

			return c.body(fileContent)
		} catch (error) {
			console.error("Error reading avatar:", error)
			return c.json({ error: "Ошибка при чтении файла" }, 500)
		}
	} catch (error) {
		console.error("Error details:", error)
		return c.json(
			{
				error: "Внутренняя ошибка сервера",
				details: error.message,
			},
			500
		)
	}
})

serve({
	fetch: app.fetch,
	port,
})

log("INFO", `Сервер запущен на  ${host}:${port}`)
