import React from 'react';
import {LeafletView} from 'react-native-leaflet-view';
import {View} from 'react-native';

interface IProps {
  lat: number;
  ln: number;
  handleMapTap: (event: any) => void;
  pinpoin: string;
  centerMap: {
    latitude: number;
    longitude: number;
  };
}
const TripMap = ({lat, ln, handleMapTap, pinpoin, centerMap}: IProps) => {
  return (
    <View style={{flex: 1 / 1.5}}>
      {(Boolean(lat) ||
        Boolean(ln) ||
        Boolean(centerMap?.latitude) ||
        Boolean(centerMap?.longitude)) && (
        <LeafletView
          mapLayers={[
            {
              baseLayer: true,
              url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
          ]}
          mapMarkers={
            lat && ln
              ? [
                  {
                    id: 'marker-a',
                    icon: pinpoin,
                    position: {
                      lat: lat,
                      lng: ln,
                    },
                  },
                ]
              : []
          }
          mapCenterPosition={{
            lat: lat || centerMap?.latitude,
            lng: ln || centerMap?.longitude,
          }}
          onMessageReceived={(event: any) => handleMapTap(event)}
          zoom={10}
        />
      )}
    </View>
  );
};

export default TripMap;
