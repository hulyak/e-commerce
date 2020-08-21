## Signup Validation Logic

- Did another user already sign up with this email? --> Yes --> show an error
- Are the password and password confirmation different? --> Yes --> Show an error
- Create an account for this user


## SignIn 

- Did another user already sign up with this email? -> NO -> Show an error
- Does the existing user record have the same password as the one supplied? -> NO -> Show an error
- Sign in user

## Shopping Cart without Logging in the User

- Problem 1 - How do we tie a car to a person who will never be logged in?
    - create a random CART ID and store it inside cookie, so I know which cart is yours
- Problem 2 - Even if we can identify who is trying to add an item to a cart, how do we tie a product to a cart?
    - create a Carts Repository(array of objects) and store the cartID, an array of products with productID and quantity in the cart.