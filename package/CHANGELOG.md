# CHANGELOG

## 3.0.0

-   updated peer dependancies to latest versions

```
    "@types/react-redux": "^7",
    "@testing-library/dom": "^7",
    "@testing-library/react": "^11",
    "react": "^17",
    "redux": "^4",
    "react-redux": "^7"
```

## 3.0.3

-   added pipeline
-   updated README's
-   removed unnessasary peer dependencies

```
"@types/react-redux",
"@testing-library/dom"
```

## 4.0.0

-   removed cleanup from examples since it happens by default

### Breaking Changes

The updateStateWithDispatch method is no longer async. If you need to wait for async code to run after a dispatch consider using `await new Promise(setImmediate);` to flush promises.
