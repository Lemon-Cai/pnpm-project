export const MapProps = {
  container: {
    type: [typeof HTMLElement !== 'undefined' && HTMLElement, String],
    default: undefined,
  },
  center: {
    type: Array,
    default: () => [0,0]
  }
}