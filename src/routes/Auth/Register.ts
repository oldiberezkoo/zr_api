import type { Context } from "hono"
import { User } from "../../models/user"
import { Generator } from "../../utils/id"
import { log } from "../../utils/log"

const CreateUser = async (c: Context) => {
	try {
		const body = await c.req.json()

		if (!body.username || !body.password) {
			console.log("Missing required fields. Received fields:", {
				username: body.username,
				password: body.password,
			})
			return c.json(
				{
					success: false,
					error: "Username и password обязательны",
					receivedBody: body, // Добавляем тело запроса в ответ для дебага
				},
				400
			)
		}

		const username = String(body.username)
		const password = String(body.password)

		const token = () => {
			const date = new Date()
			const time = date.getTime()
			const keys = `${username}${password}${time}`
			const key = Buffer.from(keys).toString("base64")
			return key
		}

		const id = Generator()

		const user = await User.create({
			username,
			password,
			role: "worker",
			uuid: id,
			accessToken: token(),
		})
		log("INFO", `Создан новый пользователь: ${user.username}`)
		return c.json({
			success: true,
			accessToken: user.accessToken,
		})
	} catch (error: unknown) {
		console.error("Error details:", {
			name: (error as Error).name,
			message: (error as Error).message,
			stack: (error as Error).stack,
		})

		if ((error as Error).name === "MongoServerError" && (error as any).code === 11000) {
			return c.json(
				{
					success: false,
					error: "Пользователь с таким UUID уже существует",
				},
				400
			)
		}

		return c.json(
			{
				success: false,
				error: "Ошибка при создании пользователя",
			},
			500
		)
	}
}

export default CreateUser
