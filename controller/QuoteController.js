const { Pool } = require('pg')
const pool = new Pool();
const axios = require('axios')

class QuoteController {
  static async insertQuoteFromAPI(req, res, next) {
    try {
      const queryGet = {
        text: `SELECT * FROM "Quotes"`,
        values: []
      }
      const { rows: quoteData } = await pool.query(queryGet)
      const { data } = await axios({
        method: 'GET',
        url: 'https://api.kanye.rest/'
      })

      // data.quote = 'Manga all day'

      // DUPLICATE CHECK
      quoteData.forEach(el => {
        if (el.quote === data.quote) {
          throw ({ name: 'duplicate' })
        }
      })

      const queryInsert = {
        text: `
          INSERT INTO "Quotes"(quote, favorites)
          VALUES ($1, false)
          `,
        values: [data.quote]
      }

      const { rows: dataInsert } = await pool.query(queryInsert)

      res.status(200).json({
        message: 'Success insert data',
        data: data.quote
      })
    } catch (err) {
      next(err)
    }
  }

  static async getQuote(req, res, next) {
    try {
      const query = {
        text: `
          SELECT * FROM "Quotes"
        `,
        values: []
      }
      const { rows } = await pool.query(query)

      if (!rows.length) {
        throw ({ name: 'noData' })
      }

      const quotes = []
      const favorites = []

      rows.forEach((el) => {
        if (el.favorites) {
          favorites.push(el.quote)
        } else {
          quotes.push(el.quote)
        }
      })

      res.status(200).json({
        message: 'Success get data',
        data: {
          quotes,
          totalQuotes: quotes.length,
          favorites,
          totalFavorites: favorites.length,
        },
      })
    } catch (err) {
      next(err)
    }

  }

  static async createQuote(req, res, next) {
    const { quote, favorites } = req.body
    try {

      if (!quote) {
        throw ({ name: 'empty' })
      }

      if (!favorites) {
        favorites = false
      }

      const queryGet = {
        text: `SELECT * FROM "Quotes"`,
        values: []
      }
      const { rows: quoteData } = await pool.query(queryGet)
      quoteData.forEach(el => {
        if (el.quote === quote) {
          throw ({ name: 'duplicate' })
        }
      })

      const query = {
        text: `
          INSERT INTO "Quotes"(quote, favorites)
          VALUES ($1, $2)
        `,
        values: [quote, favorites]
      }
      const { rows } = await pool.query(query)

      if (rows) {
        res.status(201).json({
          message: "Success insert data",
          data: quote
        })
      }
    } catch (err) {
      next(err)
    }
  }

  static async updateQuoteStatus(req, res, next) {
    const { id } = req.params
    try {
      if (!Number(id)) {
        throw ({ name: 'invalid' })
      }
      const queryGet = {
        text: `
          SELECT * FROM "Quotes"
          WHERE id = $1
          `,
        values: [id]
      }
      const { rows: quoteData } = await pool.query(queryGet)

      if (!quoteData.length) {
        throw ({ name: 'notFound' })
      }

      const favorites = quoteData[0].favorites

      const query = {
        text: `
          UPDATE "Quotes"
          SET favorites = $1
          WHERE id = $2
        `,
        values: [!favorites, id]
      }

      await pool.query(query)

      res.status(200).json({
        message: `Success update favorite status from ${favorites} to ${!favorites}`,
        data: quoteData[0].quote
      })
    } catch (err) {
      next(err)
    }
  }

  static async deleteQuote(req, res, next) {
    const { id } = req.params
    try {
      const queryGet = {
        text: `
          SELECT * FROM "Quotes"
          WHERE id = $1
          `,
        values: [id]
      }
      const { rows: quoteData } = await pool.query(queryGet)

      if (!quoteData.length) {
        throw ({ name: 'notFound' })
      }

      const query = {
        text: `
          DELETE FROM "Quotes"
          WHERE id = $1
        `,
        values: [id]
      }

      await pool.query(query)

      res.status(200).json({
        message: `Success delete quote`,
        data: quoteData[0].quote
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = QuoteController