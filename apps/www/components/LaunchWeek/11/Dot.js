export function Dot(x, y, w, h) {
  this.x = x
  this.y = y
  this.w = w
  this.h = h

  this.draw = function (c, clock) {
    c?.fillRect(this.x, this.y, this.w, this.h)
    c?.fill()
    // this.x += clock / 10000
    // c?.fillStyle = '#fff'
  }

  this.update = function (c, clock) {
    this.draw(c, clock)
  }
}
