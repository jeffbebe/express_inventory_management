## Description

This application is designed to manage an inventory of products, leveraging the power of MongoDB, Express.js, and the CQRS pattern. It includes basic CRUD operations and business logic for managing stock levels and creating orders.

## Prerequisites

- Latest Node.js
- Docker
- npm installed globally

## Project setup

```bash
$ npm install
$ docker-compose up -d
```

Create a `.env` file and set `NODE_ENV=test`. For development purposes, all other environment variables will be auto-filled from the test configuration.

## Compile and run the project

```bash
# watch mode with VSC debugger
$ npm run start:dev
```

## Run tests

```bash
$ npm run test
```

## API Endpoints

### Products

- **GET /products**: Retrieve a list of all products.
- **POST /products**: Create a new product.
  - Request body:
    ```json
    {
      "name": "string (max length 50)",
      "description": "string",
      "price": "number (positive)",
      "stock": "number"
    }
    ```

### Stock Management

- **POST /products/:id/restock**: Increase the stock level of a product.
  - Request body:
    ```json
    {
      "amount": "number (positive)"
    }
    ```
- **POST /products/:id/sell**: Decrease the stock level of a product. Ensure the stock cannot go below zero.
  - Request body:
    ```json
    {
      "amount": "number (positive)"
    }
    ```

### Order Management

- **POST /orders**: Create a new order.
  - Request body:
    ```json
    {
      "customerId": "string",
      "products": [
        {
          "productId": "string",
          "quantity": "number"
        }
      ]
    }
    ```
  - Business logic:
    - Update stock levels when an order is placed.
    - Prevent orders from being placed if there is insufficient stock.
    - Calculate the final order value based on applicable discounts and pricing rules.

### Discounts and Pricing Rules

- **Volume-based discount**:
  - 5 or more units: 10% discount.
  - 10 or more units: 20% discount.
  - 50 or more units: 30% discount.
- **Seasonal & promotional discounts**:
  - Black Friday Sale: 25% discount on all products.
  - Holiday Sales: 15% discount on selected product categories.
- **Location-based pricing**:
  - United States (US): Standard pricing.
  - Europe: Prices increased by 15% due to VAT.
  - Asia: Prices reduced by 5% due to lower logistics costs.
- **Discount application rules**:
  - Discounts cannot be combined.
  - Applies only the highest applicable discount from the customer's perspective.

## Validation

- Validation implemented using class-validator and class-transformer.

## Error Handling

- Implement proper error handling for cases such as invalid input, resource not found, and server errors.
- Return appropriate HTTP status codes and error messages.

## License

[MIT licensed]
