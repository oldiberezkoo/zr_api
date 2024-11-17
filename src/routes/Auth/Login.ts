import { Context } from "hono"
import { User } from "../../models/user"

const Login = async (c: Context) => {
	try {
		const { username, password } = await c.req.json()

		if (!username || !password) {
			return c.json({ error: "Нет пользователя или пароля" }, 400)
		}

		const user = await User.findOne({ username })
		if (!user) {
			return c.json({ error: "Пользователь не найден" }, 401)
		}

		if (user.password !== password) {
			return c.json({ error: "Неверный пароль" }, 401)
		}

		return c.json({ success: true, token: user.accessToken })
	} catch (error) {
		console.error("Error details:", {
			name: (error as Error).name,
			message: (error as Error).message,
		})
		return c.json(
			{
				error: "Ошибка авторизации",
				details: error.message,
			},
			500
		)
	}
}

export default Login
