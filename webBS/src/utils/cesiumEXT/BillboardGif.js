import SuperGif from './libgif'

export default class BillboardGif {
  constructor(viewer, position, gifUrl, data, name) {
    this.viewer = viewer
    this.position = position
    this.attrdata = data
    this.id = data.pid
    this.name = name
    this.billboardEntity = null

    let img = document.createElement('img')
    img.src = gifUrl
    img.onload = () => {
      this.loadGif(img)
    }
  }

  loadGif(img) {
    this.superGif = new SuperGif({
      gif: img,
    })

    this.superGif.load(() => {
      this.remove()
      this.billboardEntity = this.viewer.entities.add({
        position: this.position,
        id: this.id,
        name: this.name,
        billboard: {
          image: new Cesium.CallbackProperty(() => {
            return this.superGif.get_canvas().toDataURL('image/png')
          }, false),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.1),
        },
        properties: this.attrdata,
      })
    })
  }

  remove() {
    this.viewer.entities.remove(this.billboardEntity)
  }
}
