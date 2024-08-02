## Motivation
This is simplification and rewrite of react-hot-toast. Few major things I didn't like and didn't think author would accept my PR.

1. Wanted to have no dependency toaster (removing CSS-in-JS
2. I wanted to simplify pooling with intervals instead of setTimeouts
3. abstracted and Simplified dismiss timeouts
4. abstracted and simplify sync between store and react, that one particullarly looked nice.
5. Other smaller naming improvments.


### TODO:
- Fix missing gap icons
- add variants with data-attr
- write tests


## Resources: 
* Original Component: [react-hot-toast](https://github.com/timolins/react-hot-toast). 

### Why didn't I fork?
I didn't intend to do it at all, I played around with it on stackbliz and before I relized I fullfiled most of my goals.
