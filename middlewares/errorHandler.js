const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'duplicate':
      return res.status(400).json({
        message: 'duplicate data'
      })
      break;
    case 'empty':
      return res.status(400).json({
        message: 'Quote cannot be empty'
      })
      break;
    case 'invalid':
      return res.status(400).json({
        message: 'Invalid parameter'
      })
      break;
    case 'noData':
      return res.status(400).json({
        message: 'No quote data'
      })
    case 'notFound':
      return res.status(404).json({
        message: 'Quote not found'
      })
      break;
    default:
      return res.status(500).json(err)
      break;
  }
}

module.exports = errorHandler