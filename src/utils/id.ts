const Generator = (): number => {
	const time = new Date().getTime()
	const date = new Date().getDate()
	const key = time + date * 400
	const id = Math.round(Math.random() * key)
	return id
}

export { Generator }
