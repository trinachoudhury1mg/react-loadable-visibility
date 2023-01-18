# `react-loadable-visibility`

> A wrapper around [@loadable/component](https://github.com/smooth-code/loadable-components), only loading imports that are visible in the root of intersection observer.

## Example using `@loadable/component`

```js
import loadable from "react-loadable-visibility/loadable-components";
import Loading from "./my-loading-component";

const LoadableComponent = loadable(() => import("./my-component"), {
  fallback: <Loading />,
  ssr: false,
},
{
  rootMargin: "0px,0px,100%,0px",
},
);

export default function App() {
  return <LoadableComponent />;
}
```

## Options

The API is similar to the original library's API. Please refer to their documentation:

- [@loadable/component documentation](https://github.com/smooth-code/loadable-components#docs)

It accepts an additional paramater that can be used to configure the Intersection Observer.

```js
import loadable from "react-loadable-visibility/loadable-components";
import Loading from "./my-loading-component";

const IntersectionObserverOptions = {
    rootMargin: "0px,0px,100%,0px",
    threshold: 1,
}

const LoadableComponent = loadable(() => import("./my-component"), {
  fallback: <Loading />,
  ssr: false,
},
IntersectionObserverOptions,
);

export default function App() {
  return <LoadableComponent />;
}
```
You can refer the [Intersection Observer Docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#instance_properties).

Note that you'll need to have `@loadable/component` in your `package.json`.

# How does this work?

It's in essence a wrapper around `loadable` libraries with hooks into an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to inform us of when a given element is in the viewport.

Therefore, it will only function in [browsers that have the `IntersectionObserver` API](http://caniuse.com/#feat=intersectionobserver).

[A polyfill for `IntersectionObserver` is available](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) however I am skeptical of its performance but have not tested it fully to offer a recommendation here. If you have any comments about this, feel free to open a PR and adjust this README!

If you choose the use the polyfill, you can load it via a [polyfill.io](https://cdn.polyfill.io/v3/) script - `<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver%2CIntersectionObserverEntry"></script>`

Otherwise if the `IntersectionObserver` API is not available, we will revert back to just using `react-loadable` or `@loadable/component` itself.

# Why do I want this?

`@loadable/component` is a fantastic higher level component to load additional modules once they are mounted on the root of the Intersection Observer. It's great for keeping your bundle size small and pulling in a larger payload when the required components are part of your tree.

However it will not account for the content that's currently visible on your page, and only load what's actually visible to the end user. If you have a long page and are loading the entire content of that page for the user, even though they may only be able to see the content in the viewport, it can be wasteful and especially detrimental in a mobile context.

`react-loadable-visibility` is positioned to solve these issues by leveraging the existing awesome API of `loadable` libraries with an extension to only trigger the loading of additional content once that component comes into view.

## Contributors

We'd like to thank the following people for their contributions:

- [Tasveer Singh](https://twitter.com/tazsingh)
- [Bergé Greg](https://twitter.com/neoziro)

## License

`react-loadable-visibility` may be redistributed according to the [BSD 3-Clause License](LICENSE).
