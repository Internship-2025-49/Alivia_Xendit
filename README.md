```
npm install
npm run dev
```

```
open http://localhost:3000
```

Endpoints

1. Create Invoice
   Method: POST
   Path: /invoices
   Request Body:
   externalId: string (required)
   userId: string (required)
   amount: number (required)
   currency: string (required)
   customer: object (required)
   items: array (required)
   fees: object (required)
   Response:
   invoiceId: string
   externalId: string
   userId: string
   amount: number
   currency: string
   customer: object
   items: array
   fees: object
2. Get Invoices
   Method: GET
   Path: /invoices
   Response:
   invoices: array
   invoiceId: string
   externalId: string
   userId: string
   amount: number
   currency: string
   customer: object
   items: array
   fees: object
3. Get Invoice By Id
   Method: GET
   Path: /invoices/{id}
   Response:
   invoiceId: string
   externalId: string
   userId: string
   amount: number
   currency: string
   customer: object
   items: array
   fees: object
4. Expire Invoice
   Method: POST
   Path: /invoices/{id}/expire
   Response:
   invoiceId: string
   status: string (EXPIRED)
5. Handle Payment Success
   Method: GET
   Path: /invoices/{id}/success
   Response:
   message: string
6. Handle Payment Failure
   Method: GET
   Path: /invoices/{id}/failure
   Response:
   message: string
   Error Handling
   400: Bad Request
   404: Not Found
   500: Internal Server Error

.ENV
XENDIT_API_KEY= (api key from xendit)

DATABASE_URL = (localhost mysql database)
