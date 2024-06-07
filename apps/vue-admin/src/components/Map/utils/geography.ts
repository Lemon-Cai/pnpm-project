/*
 * @Author: CP
 * @Date: 2024-06-05 11:01:39
 * @Description: 
 */
import mapboxgl from "mapbox-gl";
import type { LngLatLike } from '../types'

/**
 * 
 * @param lng 
 * @param lat 
 * @example new mapboxgl.LngLat(-123.9749, 40.7736)
 * @returns 
 */
export const LngLat = (lng: number, lat: number): mapboxgl.LngLat => {
  return new mapboxgl.LngLat(lng, lat)
}

export const LngLatBounds = (southwest: LngLatLike, northeast: LngLatLike): mapboxgl.LngLatBounds => {
  return new mapboxgl.LngLatBounds(southwest, northeast)
}