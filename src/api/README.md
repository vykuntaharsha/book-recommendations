# Book Recommendations API

## Books

|Field       |Description                    |
|------------|-------------------------------|
|isbn        | Book's unique id              |
|image       | Url to the book's image       |
|title       | The title of the book         |
|author      | The author of the book        |
|genre       | The genre of the book         |
|votes       | Number of votes the book has  |
|description | Description about the book    |


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
* May return HTTP status `404` if index is out of bounds.


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

|Field        |Description           |
|-------------|----------------------|
|id           |Id of the genre       |
|name         |Name of the genre     |

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
* May return HTTP status `404` if index is out of bounds.

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
* By default limited to `10` books.
* By default starts at index `0`.
* Returns HTTP status `200` on success.
* May Return HTTP status `404` error if no matching id is found.

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
