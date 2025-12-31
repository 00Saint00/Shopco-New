import React, { Suspense } from "react";
import Spinner from "../../UI/spinner.jsx";

const LatestArrivalSwiper = React.lazy(() => import("./LatestArrivalSwiper"));

function LatestArrival(props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-8">
          <Spinner />
        </div>
      }
    >
      <LatestArrivalSwiper {...props} />
    </Suspense>
  );
}

export default LatestArrival;
