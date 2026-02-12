CURRENCY CONVERTER API - QUICK REFERENCE

BASE URL: https://2p9nh463r1.execute-api.us-east-1.amazonaws.com/prod/


---

CONVERT CURRENCY

URL: /convert?from=USD&to=EUR&amount=100

Response:
{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "result": 85.00
}

---

LIST CURRENCIES

URL: /currencies

Response:
{
  "base": "USD",
  "currencies": ["EUR", "GBP", "JPY", "USD"]
}

---










EXAMPLES

/convert?from=USD&to=EUR&amount=100
→ {"from":"USD","to":"EUR","amount":100,"result":85.00}

/convert?from=EUR&to=GBP&amount=50
→ {"from":"EUR","to":"GBP","amount":50,"result":42.94}

/convert?from=JPY&to=USD&amount=1000
→ {"from":"JPY","to":"USD","amount":1000,"result":9.09}

/currencies
→ {"base":"USD","currencies":["EUR","GBP","JPY","USD"]}