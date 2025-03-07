const logRequests = (req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`)
  console.log(`Request body: ${JSON.stringify(req.body)}`)
  next()
}

export default logRequests