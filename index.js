const crypto = require('crypto')
const express = require('express')
const Webtask = require('webtask-tools')
const getRawBody = require('raw-body')
const fetch = require('isomorphic-fetch')
const app = express()

const baseUrl =
  'https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/'

app.post('/', async (req, res) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256')

  const body = await getRawBody(req).catch(() => {
    res.sendStatus(403)
  })

  const hash = crypto
    .createHmac('sha256', req.webtaskContext.secrets.SHOPIFY_SECRET)
    .update(body, 'utf8', 'hex')
    .digest('base64')

  if (hash !== hmac) {
    res.sendStatus(403)
  }

  const order = JSON.parse(body.toString())

  const orderKey = order.customer ? 'customer' : 'billing_address'

  const url = `${baseUrl}${order.email}/?hapikey=${req.webtaskContext.secrets
    .HAPI_KEY}`

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: [
        {
          property: 'firstname',
          value: order[orderKey].first_name,
        },
        {
          property: 'lastname',
          value: order[orderKey].last_name,
        },
        {
          property: 'e_commerce_customer',
          value: true,
        },
      ],
    }),
  }

  fetch(url, options)
    .then(async response => {
      if (!response.ok) {
        res.sendStatus(403)
      }
      res.sendStatus(200)
    })
    .catch(() => {
      res.sendStatus(403)
    })
})

module.exports = Webtask.fromExpress(app)
