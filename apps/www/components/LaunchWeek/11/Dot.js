export function Dot(x, y, w, h) {
  this.x = x
  this.y = y
  this.w = w
  this.h = h

  this.draw = function (c) {
    c?.fillRect(this.x, this.y, this.w, this.h)
    c?.fill()
  }

  this.update = function (c) {
    this.draw(c)
  }
}
