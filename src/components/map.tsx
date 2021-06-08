import React from 'react'
import GoogleMapReact from 'google-map-react';
import './map.css'
// import { LocationPin } from './location';
export const Map = ({ location, zoomLevel }) => (
    <div className="google-map">
        <GoogleMapReact
            options={{
                styles: [{ stylers: [{ 'saturation': 0 }, { 'gamma': 0.5 }, { height: '50%' }] }]
            }}
            bootstrapURLKeys={{ key: "AIzaSyAFLmZQQLMqyvCgIkC4wvHTDjacxUT7VHg" }}
            defaultCenter={location}
            defaultZoom={zoomLevel}
        >
            {/* <LocationPin
                    // lat={location.lat}
                    // lng={location.lng}
                    text={location.address}
                /> */}
        </GoogleMapReact>
    </div>
)

