import { effect, useSignal } from "@preact/signals";
import { useEffect } from "preact/compat";
export interface Props {
  apiKey: string;
}

import { Loader } from "https://esm.sh/@googlemaps/js-api-loader@1.16.6";
import { invoke } from "deco-sites/weather/runtime.ts";

export default function Map({
  apiKey,
}: Props) {
  let map;
  const current = useSignal("");
  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: "weekly",
    });
    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        map = new Map(document.getElementById("map")!, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
        map.addListener(
          "click",
          async (e: { latLng: { lat: () => number; lng: () => number } }) => {
            const data = await invoke["deco-sites/weather"].loaders.weather({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
            current.value = data.current.temperature_2m.toString();
          },
        );
      })
      .catch((e) => {
        // do something
      });
  }, []);
  console.log(current.value);
  return (
    <div>
      <div id="map" class="w-full h-96"></div>
      <div>{current}</div>
    </div>
  );
}
