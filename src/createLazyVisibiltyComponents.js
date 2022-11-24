import React, { Suspense, useEffect, useState, useRef } from "react";
import { IntersectionObserver } from "./capacities";

const trackedElements = new Map();

let options = {
  threshold: 0,
  rootMargin: "0px 0px 100% 0px",
};

function createIntersectionObserver(intersectionObserverOptions) {
  if (IntersectionObserver) {
    return new window.IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const visibilityHandler = trackedElements.get(entry.target);

        if (
          visibilityHandler &&
          (entry.isIntersecting || entry.intersectionRatio > 0)
        ) {
          visibilityHandler();
        }
      });
    }, intersectionObserverOptions);
  }
}

// create an intersection observer with the default options
let intersectionObserver = createIntersectionObserver(options);

function createLazyVisibiltyComponents(
  args,
  { Lazy, LoadingComponent, intersectionObserverOptions }
) {
  // if options have been passed to the intersection observer a new instance of intersection observer is created using these passed options else the same instance of intersectin observer will observe all the target elements.
  if (typeof intersectionObserverOptions === "object") {
    intersectionObserver = createIntersectionObserver(
      intersectionObserverOptions
    );
  }
  let preloaded = false,
    loaded = false;
  const visibilityHandlers = [];

  const LazyComponent = Lazy(args.load);

  function LazyVisibilityComponent(props) {
    const visibilityElementRef = useRef();
    const [isVisible, setVisible] = useState(preloaded);

    function visibilityHandler() {
      if (visibilityElementRef.current) {
        intersectionObserver.unobserve(visibilityElementRef.current);
        trackedElements.delete(visibilityElementRef.current);
      }

      setVisible(true);
    }

    useEffect(() => {
      const element = visibilityElementRef.current;

      if (!isVisible && element) {
        visibilityHandlers.push(visibilityHandler);

        trackedElements.set(element, visibilityHandler);
        intersectionObserver.observe(element);

        return () => {
          const handlerIndex = visibilityHandlers.indexOf(visibilityHandler);

          if (handlerIndex >= 0) {
            visibilityHandlers.splice(handlerIndex, 1);
          }

          intersectionObserver.unobserve(element);
          trackedElements.delete(element);
        };
      }
    }, [isVisible, visibilityElementRef.current]);

    if (isVisible) {
      return <Suspense fallback={LoadingComponent}><LazyComponent {...props} /></Suspense>
    }

    if (LoadingComponent || props.fallback) {
      return (
        <div
        style={{
          display: "inline-block",
          minHeight: "1px",
          minWidth: "1px"
        }}
        {...props}
        ref={visibilityElementRef}
      >
        {LoadingComponent
          ? React.createElement(LoadingComponent, {
              isLoading: true,
              ...props
            })
          : props.fallback}
      </div>
      );
    }

    return (
      <div
        style={{ display: "inline-block", minHeight: "1px", minWidth: "1px" }}
        {...props}
        ref={visibilityElementRef}
      />
    );
  }

  

  return LazyVisibilityComponent;
}

export default LazyVisibilityComponent;
