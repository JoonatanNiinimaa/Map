import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";

export default function Map(props){
  const [marker, setMarker] = useState(null)


/*
useEffect(() => {
  (async () => {
    getUserPosition()
  })()
}, [])
*/

const showMarker = (e) => {
  const coords = e.nativeEvent.coordinate
  setMarker(coords)
}

  return (
    <MapView
      style={styles.map}
      region={props.location}
      mapType={props.mapType}
      onLongPress={showMarker}
    >
    {marker &&
    <Marker
      title="My marker"
      coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
      />
    }
    </MapView>
  )
}
const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%"
  }
});