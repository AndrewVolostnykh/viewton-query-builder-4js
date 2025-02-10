Viewton Parameter Builder
---

This is a Parameter Builder for the [Viewton](https://github.com/AndrewVolostnykh/viewton) library, designed to make constructing client-side queries more declarative and easier. 

It is intended for use in environments where JavaScript is used for implementing client side (for instance classical font-end). 

It is a full analog of the [ViewtonQueryBuilder](https://github.com/AndrewVolostnykh/viewton/blob/main/src/main/java/andrew/volostnykh/viewton/ViewtonQueryBuilder.java).

The builder includes all parameters that can be used when constructing a query to the backend.

### Usage
To use, simply inherit from the ViewtonQueryBuilder class and specify which fields can be used in the query construction.

### Example:

**Base Class:**

```typescript
class SomeClass {
    id: number;
    name: string;
    date:Date

    constructor(id: number, name: string, date:Date) {
        this.id = id;
        this.name = name;
        this.date = date;
    }
}
```

Builder:

```typescript
class SomeClassQueryBuilder extends ViewtonQueryBuilder {
    id():FilterBuilder<SomeClassQueryBuilder> {
        return super.param('id');
    }

    name():FilterBuilder<SomeClassQueryBuilder> {
        return super.param('name');
    }

    date():FilterBuilder<SomeClassQueryBuilder> {
        return super.param('date')
    }
}
```

Using the Builder:

```typescript
    return new SomeClassQueryBuilder()
        .id().or(1).or(2).or(3).next()
        .name().ignoreCase().equalsTo('%name%')
        .date().between('someDate', 'someAnotherDate')
        .page(1)
        .pageSize(10)
        .distinct()
        .count()
        .build();
```

Result:

```
Map(7) {
  'id' => '1',
  'name' => '^%name%',
  'date' => 'someDate..someAnotherDate',
  'page' => '1',
  'page_size' => '10',
  'distinct' => 'true',
  'count' => 'true'
}
```

The result is a Map<string, string>, which can be used for constructing GET requests as query parameters.
