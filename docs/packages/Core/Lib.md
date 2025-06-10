# Core Lib

The Core package ships with a Redux provider, reducers, and hooks.

## Provider

The provider is used to wrap your application and provide the Redux store to all components:

```tsx
import { ThStoreProvider } from "@edrlab/thorium-web/core/lib";

const App = () => {
  return (
    <ThStoreProvider>
      {/* Your application */}
    </ThStoreProvider>
  );
};
```

> [!IMPORTANT]
> When using stateful components from `@edrlab/thorium-web/epub`, you must use the `<ThStoreProvider>` from that package, not from `@edrlab/thorium-web/core`. Otherwise, your app and components will use a different store.

It accepts two optional props:

- `storageKey`: the key to use to store the states in local storage. Defaults to `thorium-web-state`.
- `store`: your own Redux store if you need to modify or extend the default one.

## Reducers

The Core package comes with a list of slices offering multiple reducers:

- `actionsReducer`: manages the actions of the application (opening a menu, opening a modal, etc.);
- `publicationReducer`: manages data related to the publication (direction, title, etc.);
- `readerReducer`: manages state of the reader (loading, immersive mode, etc.);
- `settingsReducer`: manages settings of the application (typography, spacing, etc.);
- `themeReducer`: manages the theme and accessibility of the application.

These are used to build the default store if no one is provided through `store` prop.

They are exposed so that you can use them in your own store, and extend it with your own reducers.

## Hooks

Hooks are provided to access the Redux store. They are especially important in the context of NextJS.

The following hooks are available:

- `useAppDispatch`: returns the dispatch function from the Redux store.
- `useAppSelector`: returns the selected state from the Redux store.
- `useAppStore`: returns the Redux store.

Your components will mainly use the two first hooks like this:

```tsx
import { 
  useAppDispatch, 
  useAppSelector, 
  myReducerAction
} from "@edrlab/thorium-web/core/lib";

const MyStatefulComponent = () => {
  const dispatch = useAppDispatch();
  const someValue = useAppSelector(state => state.myReducer.someValue);
  
  return (
    <div>
      <p>Value from Redux: { someValue }</p>
      <button onClick={() => dispatch(myReducerAction())}>Dispatch Action</button>
    </div>
  );
};
```

`useAppStore` is used to access the store directly, which can be useful for non-TSX components:

```tsx
import { useAppStore } from "@edrlab/thorium-web/core/lib";

const MyHelper = () => {
  const store = useAppStore();
  const someValue = store.getState().myReducer.someValue;

  // Do something with someValue
}

> [!IMPORTANT]
> When using stateful components from `@edrlab/thorium-web/epub`, you must use the hooks from that package, not from `@edrlab/thorium-web/core`. Otherwise, your app and components will use a different store.