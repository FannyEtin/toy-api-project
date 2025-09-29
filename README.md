# Toys API Documentation

Some routes require an API token. Send it in the request headers: x-api-key: **your_token_here**
**Pagination returns 10 toys per page**

Method       Route                                  Description                                         Parameters
GET         `/toys`                                 Get all toys with optional filters: cat, skip.      cat -> filter by category (cat=creative)     
            `/toys/search?s=robot&skip=0`           Search toys by keyword.                             skip -> pagination (skip=1 means page 2)
                                                                                                        s -> search by name or info
            `/toys/prices?min=10&max=40&skip=0`     Get toys by price range.                            min/ max -> price range filter
            `/toys/single/:id`                      Get a single toy by ID.
            `/toys/count`                           Get total number of toys.
POST        `/toys`                                 Create a new toy.   **Token is required!**
                                                        ```{
                                                            name: String,
                                                            info: String,
                                                            category: String,
                                                            price: Number, // 1-999999
                                                            img_url: String // optional
                                                        }
PUT         `/toys/:id`                             Update a toy (only if owned by user).   **Token is required!**
DELETE      `/toys/:id`                             Delete a toy (only if owned by user).   **Token is required!**


# Users API Documentation

Method      Route           Description                     Request body
POST        /users          Register a new user.            ```{
                                                                name: String,
                                                                email: String, //must be unique
                                                                password: String //at least 6 characters
                                                                role: String //defaults to "user" unless set manually
                                                            }
            /users/login    Log in and recieve JWT token.   ```{
                                                                email: String,
                                                                password: String
                                                            }