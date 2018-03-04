# Book Recommendations API

## Books

|Field       |Type   |Description                    |
|------------|-------|-------------------------------|
|isbn        |String |Book's unique id              |
|image       |String |Url to the book's image       |
|title       |String |The title of the book         |
|author      |String |The author of the book        |
|genre       |Object |The genre of the book         |
|votes       |Number |Number of votes the book has  |
|description |String |Description about the book    |


#### Default Books:  
` GET localhost:3000/api/books`
* By default limited to `10` books.  
* By default starts at index `0`.
* Returns HTTP status `200` on success.

Results:
```
{
  "noOfBooks": 10,
  "books": [
    {
      "isbn": "761183272",
      "image": "http://ecx.images-amazon.com/images/I/61Y5cOdHJbL.jpg",
      "title": "Mom's Family Wall Calendar 2016",
      "author": "Sandra Boynton",
      "genre": {
        "id": "3",
        "name": "Calendars"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

#### MaxResults

`GET localhost:3000/api/books?maxResults=40`
* Can be combined with other queries.
* No upper limit.
* By default starts at index `0`.
* Returns HTTP status `200` on success.

Results:
```
{
  "noOfBooks": 40,
  "books": [
    {
      "isbn": "761183272",
      "image": "http://ecx.images-amazon.com/images/I/61Y5cOdHJbL.jpg",
      "title": "Mom's Family Wall Calendar 2016",
      "author": "Sandra Boynton",
      "genre": {
        "id": "3",
        "name": "Calendars"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

#### StartIndex

`GET localhost:3000/api/books?startIndex=10`

* Can be combined with other queries.
* No upper limit.
* By default limited to `10` books.
* Returns HTTP status `200` on success.
* May return HTTP status `400` if index is out of bounds.


Results:
```
{
  "noOfBooks": 10,
  "books": [
    {
      "isbn": "761183558",
      "image": "http://ecx.images-amazon.com/images/I/517kcRbFZQL.jpg",
      "title": "Cat Page-A-Day Gallery Calendar 2016",
      "author": "Workman Publishing",
      "genre": {
        "id": "3",
        "name": "Calendars"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

#### All

`GET localhost:3000/api/books?all=true`

* Can be combined with other queries.
* By default set to `false`.
* By default starts at index `0`.
* Returns HTTP status `200` on success.
* Returns HTTP status `400` if value is not identified;

Results:
```
{
  "noOfBooks": 207572,
  "books": [
    {
      "isbn": "761183272",
      "image": "http://ecx.images-amazon.com/images/I/61Y5cOdHJbL.jpg",
      "title": "Mom's Family Wall Calendar 2016",
      "author": "Sandra Boynton",
      "genre": {
        "id": "3",
        "name": "Calendars"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

#### Isbn

`GET localhost:3000/api/books/761183272`

* Should be a parameter after books in the url.
* Can be combined with other queries.
* Returns HTTP status `200` on success.
* May Return HTTP status `404` error if no matching isbn is found.

Results:
```
{
  "book": {
    "isbn": "761183272",
    "image": "http://ecx.images-amazon.com/images/I/61Y5cOdHJbL.jpg",
    "title": "Mom's Family Wall Calendar 2016",
    "author": "Sandra Boynton",
    "genre": {
      "id": "3",
      "name": "Calendars"
    },
    "votes": 0,
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
}
```

`PUT localhost:3000/api/books/761183272`

* Updates the data of the specified book.
* Returns HTTP status `204` if successfully found and modified.
* Returns HTTP status `406` if body data is not valid.
* Returns HTTP status `400` if the respective book is not found.

PUT body: Editing the description in this case
```
{
  "book": {
    "isbn": "761183272",
    "image": "http://ecx.images-amazon.com/images/I/61Y5cOdHJbL.jpg",
    "title": "Mom's Family Wall Calendar 2016",
    "author": "Sandra Boynton",
    "genre": {
      "id": "3",
      "name": "Calendars"
    },
    "votes": 1,
    "description": "edited"
  }
}
```
Results: `HTTP status 204` and updates the specified book.

#### OrderBy

`GET localhost:3000/api/books?orderBy=-votes`

* Accepted values are `votes`, `title`.
* By default orders by ascending order.
* Use `-` in-front of the value to order by descending.
* can be combined with other queries.
* Returns HTTP status `200` on success.
* Returns HTTP status `400` if value is not identified.

Results:

```
{
  "noOfBooks": 10,
  "books": [
    {
      "isbn": "123919274",
      "image": "http://ecx.images-amazon.com/images/I/511lC-TxB8L.jpg",
      "title": "Intermolecular and Surface Forces, Third Edition: Revised Third Edition",
      "author": "Jacob N. Israelachvili",
      "genre": {
        "id": "10",
        "name": "Engineering & Transportation"
      },
      "votes": 1000,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

#### Votes

`PUT localhost:3000/api/books/761183272/votes`

* Updates the votes of the specific book.
* Returns HTTP status `204` if successfully found and modified.
* Returns HTTP status `406` if body data is not valid.
* Returns HTTP status `400` if the respective book is not found.

PUT body: modifying votes in this case

```
{
  "book": {
    "isbn": "761183272",
    "votes": 2,
  }
}
```

Results: `HTTP status 204` and updates the votes of the specified book.

##### Examples

StartIndex and MaxResults:  
`GET localhost:3000/api/books?startIndex=10&maxResults=20`

```
{
  "noOfBooks": 20,
  "books": [
    {
      "isbn": "761183558",
      "image": "http://ecx.images-amazon.com/images/I/517kcRbFZQL.jpg",
      "title": "Cat Page-A-Day Gallery Calendar 2016",
      "author": "Workman Publishing",
      "genre": {
        "id": "3",
        "name": "Calendars"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

StartIndex and All:  
`GET localhost:3000/api/books?startIndex=40&all=true`

```
{
  "noOfBooks": 207532,
  "books": [
    {
      "isbn": "1441317147",
      "image": "http://ecx.images-amazon.com/images/I/61IwcIjSPbL.jpg",
      "title": "2016 Almond Blossoms Weekly Planner (16-Month Engagement Calendar, Diary)",
      "author": "Peter Pauper Press",
      "genre": {
        "id": "3",
        "name": "Calendars"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

## Genres

|Field        |Type   |Description           |
|-------------|-------|----------------------|
|id           |String |Id of the genre       |
|name         |String |Name of the genre     |

#### Default genres

`GET localhost:3000/api/genres`

* By default limited to `10` genres.  
* By default starts at index `0`.
* Returns HTTP status `200` on success.

Results:
```
{
  "noOfGenres": 10,
  "gneres": [
    {
      "id": "0",
      "name": "Arts & Photography"
    },
    .
    .
    .
  ]
}
```

#### MaxResults

`GET localhost:3000/api/genres?maxResults=30`

* Can be combined with other queries.
* No upper limit.
* By default starts at index `0`.
* Returns HTTP status `200` on success.

Results:
```
{
  "noOfGenres": 30,
  "gneres": [
    {
      "id": "0",
      "name": "Arts & Photography"
    },
    {
      "id": "1",
      "name": "Biographies & Memoirs"
    },
    .
    .
    .
  ]
}

```

#### StartIndex

`GET localhost:3000/api/genres?startIndex=10`

* Can be combined with other queries.
* No upper limit.
* By default limited to `10` genres.
* Returns HTTP status `200` on success.
* May return HTTP status `400` if index is out of bounds.

Results:
```
{
  "noOfGenres": 10,
  "gneres": [
    {
      "id": "10",
      "name": "Engineering & Transportation"
    },
    {
      "id": "11",
      "name": "Health Fitness & Dieting"
    },
    .
    .
    .
  ]
}
```

#### All

`GET localhost:3000/api/genres?all=true`

* Can be combined with other queries.
* By default set to `false`.
* By default starts at index `0`.
* Returns HTTP status `200` on success.

Results:
```
{
  "noOfGenres": 32,
  "gneres": [
    {
      "id": "0",
      "name": "Arts & Photography"
    },
    {
      "id": "1",
      "name": "Biographies & Memoirs"
    },
    {
      "id": "2",
      "name": "Business & Money"
    },
    .
    .
    .
  ]
}
```

#### Id

`GET localhost:3000/api/genres/20`

* Should be a parameter after genres in the url.
* Can be combined with other queries.
* Returns HTTP status `200` on success.
* May Return HTTP status `404` error if no matching id is found.

Results:
```
{
  "genre": {
    "id": "20",
    "name": "Reference"
  }
}
```

#### Books within genre

`GET localhost:3000/api/genres/15/books`

* Should contain the id of genres.
* Can be combined with other queries.
* Can use `orderBy` as stated for Books.
* By default limited to `10` books.
* By default starts at index `0`.
* Returns HTTP status `200` on success.
* May Return HTTP status `400` error if no matching id is found.

Results:
```
{
  "noOfBooks": 10,
  "books": [
    {
      "isbn": "1476746583",
      "image": "http://ecx.images-amazon.com/images/I/51MfO0a70ZL.jpg",
      "title": "All the Light We Cannot See",
      "author": "Anthony Doerr",
      "genre": {
        "id": "15",
        "name": "Literature & Fiction"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

##### Examples

StartIndex and MaxResults:  
`GET localhost:3000/api/genres?startIndex=10&maxResults=5`

```
{
  "noOfGenres": 5,
  "gneres": [
    {
      "id": "10",
      "name": "Engineering & Transportation"
    },
    {
      "id": "11",
      "name": "Health Fitness & Dieting"
    },
    .
    .
    .
  ]
}
```

StartIndex and All:  
`GET localhost:3000/api/genres?startIndex=8&all=true`

```
{
  "noOfGenres": 24,
  "gneres": [
    {
      "id": "8",
      "name": "Crafts Hobbies & Home"
    },
    {
      "id": "9",
      "name": "Christian Books & Bibles"
    },
    {
      "id": "10",
      "name": "Engineering & Transportation"
    },
    .
    .
    .
  ]
}
```

Books within genre combined with other queries:

`GET localhost:3000/api/genres/8/books?startIndex=300&maxResults=20`  

```
{
  "noOfBooks": 20,
  "books": [
    {
      "isbn": "1627227253",
      "image": "http://ecx.images-amazon.com/images/I/415gxSwZWOL.jpg",
      "title": "Handbook of Practical Planning for Art Collectors and Their Advisors",
      "author": "Ramsay H. Slugg",
      "genre": {
        "id": "8",
        "name": "Crafts Hobbies & Home"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

`GET localhost:3000/api/genres/8/books?startIndex=900&all=true`

```
{
  "noOfBooks": 9034,
  "books": [
    {
      "isbn": "1582380600",
      "image": "http://ecx.images-amazon.com/images/I/41dLdqHnhNL.jpg",
      "title": "Sacagawea Dollar Folder",
      "author": "Whitman",
      "genre": {
        "id": "8",
        "name": "Crafts Hobbies & Home"
      },
      "votes": 0,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

`GET localhost:3000/api/genres/8/books?orderBy=-votes&startIndex=900&all=true`

```
{
  "noOfBooks": 9034,
  "books": [
    {
      "isbn": "1582380600",
      "image": "http://ecx.images-amazon.com/images/I/41dLdqHnhNL.jpg",
      "title": "Sacagawea Dollar Folder",
      "author": "Whitman",
      "genre": {
        "id": "8",
        "name": "Crafts Hobbies & Home"
      },
      "votes": 827,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      "isbn": "794827845",
      "image": "http://ecx.images-amazon.com/images/I/51y7mYYzeZL.jpg",
      "title": "Statehood Quarters Map",
      "author": "",
      "genre": {
        "id": "8",
        "name": "Crafts Hobbies & Home"
      },
      "votes": 574,
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    .
    .
    .
  ]
}
```

## Users

|Field   |Type    |Description       |
|--------|--------|------------------|
|id      | Number | Unique id of user|

#### Login

`POST localhost:3000/users`

* Used to mimic the login.
* Returns the user object sequentially.

Results:

```
{
  "user": {
    "id": 1
  }
}
```
