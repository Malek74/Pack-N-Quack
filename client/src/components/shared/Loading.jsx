import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PropTypes from "prop-types";

Loading.propTypes = {
  size: PropTypes.string, // "sm" | "md" | "lg" | "xl"
};
export default function Loading({ size }) {
  return (
    <DotLottieReact
      style={{
        width:
          size == "sm"
            ? 100
            : size == "md"
            ? 200
            : size == "lg"
            ? 300
            : size == "xl"
            ? 400
            : 200,
      }}
      src="/assets/animations/duckloading.json"
      loop
      autoplay
    />
  );
}
