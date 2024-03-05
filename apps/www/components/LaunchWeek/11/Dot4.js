import anime from 'animejs'

export function Dot(id, x, y, w, h, mouse) {
  this.id = id
  this.x = x
  this.y = y
  this.w = w
  this.h = h

  this.draw = function (c, clock) {
    c.fillRect(this.x, this.y, this.w, this.h)
    c.fillStyle = `rgba(255,255,255,1)`
    c.fill()
  }

  this.update = function (c, clock) {
    // interactivity
    // if (!mouse) return
    this.draw(c, clock)
    const INTERACTIVITY_RADIUS = 100
    if (
      mouse.x - INTERACTIVITY_RADIUS / 2 - this.x < INTERACTIVITY_RADIUS &&
      mouse.x - INTERACTIVITY_RADIUS / 2 - this.x > -INTERACTIVITY_RADIUS &&
      mouse.y - INTERACTIVITY_RADIUS / 2 - this.y < INTERACTIVITY_RADIUS &&
      mouse.y - INTERACTIVITY_RADIUS / 2 - this.y > -INTERACTIVITY_RADIUS
    ) {
      // anime({ target: this, w: '+=20', loop: 'true', direction: 'alternate' })
      if (this.w < 10) {
        this.x -= 0.5
        this.y -= 0.5
        this.w += 1
        this.h += 1
        console.log('growing', this.id, this.w)
      }
    } else if (this.w > 2) {
      this.w -= 0.5
      this.h -= 0.5
      this.x += 1
      this.y += 1
    }
  }
}
