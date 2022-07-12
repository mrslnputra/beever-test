const QuoteController = require('../controller/QuoteController')
const errorHandler = require('../middlewares/errorHandler')

const router = require('express').Router()

// get api.kanye.rest API then store it to table
router.get('/', QuoteController.insertQuoteFromAPI)
router.get('/quotes', QuoteController.getQuote)
router.post('/quotes/', QuoteController.createQuote)
router.patch('/quotes/:id', QuoteController.updateQuoteStatus)
router.delete('/quotes/:id', QuoteController.deleteQuote)



router.use(errorHandler)
module.exports = router