import React, {useEffect, useState} from 'react';
import {LeafletView, MapShape, MapShapeType} from 'react-native-leaflet-view';
import {StyleSheet, View} from 'react-native';

interface IProps {
  dropoffLat: number;
  dropoffLn: number;
  pickupLat: number;
  pickupLn: number;
}

const PackageMap = ({dropoffLat, dropoffLn, pickupLat, pickupLn}: IProps) => {
  const [mapShape, setMapShape] = useState<MapShape[]>([]);

  const [zoomLevel, setZoomLevel] = useState(8);

  const mapCenterPosition = {
    lat: pickupLat,
    lng: pickupLn,
  };

  useEffect(() => {
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickupLn},${pickupLat};${dropoffLn},${dropoffLat}?overview=full&geometries=geojson`,
    )
      .then(res => res.json())
      .then(data => {
        const coordinates = data.routes[0].geometry.coordinates;
        const formattedCoords = coordinates.map((coord: any[]) => ({
          lat: coord[1],
          lng: coord[0],
        }));
        setZoomLevel(15);

        setMapShape([
          {
            shapeType: MapShapeType.POLYLINE,
            color: 'red',
            id: '1',
            bounds: [
              {
                lat: pickupLat,
                lng: pickupLn,
              },
              {
                lat: dropoffLat,
                lng: dropoffLn,
              },
            ],
            positions: [...formattedCoords],
          },
        ]);
      })
      .catch(err => console.error(err));
  }, [dropoffLat, dropoffLn, pickupLat, pickupLn]);

  return (
    <View style={{flex: 1 / 2}}>
      {pickupLat && pickupLn && dropoffLat && dropoffLn && (
        <LeafletView
          key={`${zoomLevel}-${mapCenterPosition.lat}-${mapCenterPosition.lng}`}
          mapLayers={[
            {
              baseLayer: true,
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
          ]}
          mapMarkers={[
            {
              id: 'marker-a',
              icon: 'https://getandride.s3.ap-southeast-3.amazonaws.com/vehicle/picker/pin-navy.png',
              position: {
                lat: pickupLat,
                lng: pickupLn,
              },
            },
            {
              id: 'marker-b',
              icon: 'https://getandride.s3.ap-southeast-3.amazonaws.com/vehicle/picker/pin-yellow.png',
              position: {lat: dropoffLat, lng: dropoffLn},
            },
          ]}
          mapShapes={mapShape}
          mapCenterPosition={mapCenterPosition}
          zoom={zoomLevel}
        />
      )}
    </View>
  );
};

export default PackageMap;

const styles = StyleSheet.create({});
