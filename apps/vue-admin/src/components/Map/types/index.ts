import mapboxgl from 'mapbox-gl'

export type  LngLat =  mapboxgl.LngLat

export type LngLatLike = LngLat | [number, number] | {lng: number, lat: number} | {lon: number, lat: number}