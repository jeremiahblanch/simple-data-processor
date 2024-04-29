# Simple Data Processor

[Find on NPM](https://www.npmjs.com/package/simple-data-processor)

Tool for converting data between two formats: *mine* and *theirs*. Define the field names on each side and how the value for that field will be calculated:
1. a string means just get the value of the field named with that string, or
1. a function means run the function, passing the whole object, with the returned result being the value. 

Supports preprocessing and postprocessing the data to allow you to do common calculations first rather than run them multiple times and create aggregate fields based on your newly calculated values.

## Installation
```
npm install simple-data-processor
```

## Usage

Create a new instance of the `SimpleDataProcessor` class and pass it a configuration object of the form:

```javascript
{
  mine: {
    fields: {
      // key, value dictionary of all the field names to exist within "mine" objects and what they correspond to on "their" objects
      // this can be either a string for a field name, or a function
    },
  },
  theirs: {
    fields: {
      // same thing as above, but reversed
     },
  }
}
```
The instance will then expose 2 conversion functions `convertToMine()` and `convertToTheirs()`.

## Processing
You can also define `preProcess` and `postProcess` functions, like
```javascript
{
  mine: {
    // optional processing done before fields are individually processd
    preProcess: (theirObject) => augmentedTheirObject,
    fields: { },
    postProcess (myObject) => enhancedMyObject,
  }
}
```
The functions in fields will receive their values from the output of the `preProcess` function. 
The `postProcess` function will recieve its data from the output of the field mappings.
Note, for a field to be available within `postProcess`, it must be defined within `fields`. (You can always remove it from the returned object if you don't want it in the final object).

## Example

```javascript
import SimpleDataProcessor from 'simple-data-processor'

// Setup with configuration
const sdp = new SimpleDataProcessor({
  mine: {
    fields: {
      // this is every field that will exist on "mine" objects

      // create the value of fullName by using firstName and lastName from the original (theirs) object 
      fullName: ({ firstName, lastName }) => [firstName, lastName].join(' '),

      // create the value of age by subtracting dateOfBirth from now
      age: ({dateOfBirth}) => (Number(new Date()) - Number(new Date(dateOfBirth))) / (365 * 24 * 60 * 60 * 1000),

      // dateOfBirth is just mapped straight to their dataOfBirth field
      dateOfBirth: 'dateOfBirth',

      //favouriteFood is spelt with an underscore on theirs
      favoriteFood: 'favorite_food'
    }
  },
  theirs: {
    // set up a preprocessor to work out the firstName and lastName so we don't run the array split twice

    preProcess: ({ fullName, ...fields } => {
      const [firstName, lastName] = fullName.split(' ');

      return {
        firstName,
        lastName,
        ...fields
      }
    }),
    fields {
      // refers to the firstName field on the **preprocessed data**, not the original data, which doesn't have that field
      firstName: 'firstName',
      // refers to the lastName field on the **preprocessed data**, not the original data, which doesn't have that field
      lastName: 'lastName',

      //these field names are the same
      dateOfBirth: 'dateOfBirth',

      //handle spelling change
      favorite_food: 'favoriteFood',
    },
  },
});

// ...

// Now use!

// Theirs -> Mine
const theirData = await fetch('/get/from/some/api');
// use your sdp to convert to your local data structure
const myData = sdp.convertToMine(theirData);

// Mine -> Theirs
// use sdp to convert to a suitable format for saving
const theirData = sdp.convertToMine(myData);
const result = await post('/save/my/changes', theirData);
```